export default async function handler(req: any, res: any) {
   if (req.method !== 'POST') return res.status(405).json({error: 'Method Not Allowed'});
   const { content } = req.body;
   
   if (!content) return res.status(400).json({error: 'Empty body'});

   // Primary AI fallback: Leveraging Gemini API directly via HTTP if token present.
   const geminiKey = process.env.GEMINI_API_KEY;
   
   if (!geminiKey) {
      // Fast heuristic fallback to gracefully handle local-dev API missing states
      const profaneWords = ['bitch', 'whore', 'die', 'kill', 'dox', 'slut', 'fuck'];
      const flagged = profaneWords.some(w => content.toLowerCase().includes(w));
      return res.status(200).json({ flagged, reason: flagged ? 'Contains heuristically prohibited hate speech.' : 'Clean' });
   }

   try {
     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         contents: [{ parts: [{ text: `You are an automated safety moderator for an exclusive female community. Is the following text violating community rules regarding bullying, explicit adult content, misogyny, hate speech, or sharing personal contact info (doxxing)? Analyze strictly and return exactly "TRUE" if flagged, or "FALSE" if absolutely clean. Text to analyze: "${content}"` }] }]
       })
     });

     const data = await response.json();
     const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase();
     const isFlagged = text === 'TRUE';
     
     return res.status(200).json({ flagged: isFlagged, reason: isFlagged ? 'AI Flagged for community policy violation' : 'Clean', model: 'gemini-1.5-flash' });
   } catch(e) {
     return res.status(500).json({ error: 'Moderation engine failed gracefully' });
   }
}
