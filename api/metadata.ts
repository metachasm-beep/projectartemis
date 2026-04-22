import { createClient } from '@libsql/client';
import { VercelRequest, VercelResponse } from '@vercel/node';

let turso: any = null;

function getTurso() {
  if (!turso) {
    turso = createClient({
      url: process.env.TURSO_DATABASE_URL || 'libsql://dummy-url-to-prevent-crash.turso.io',
      authToken: process.env.TURSO_AUTH_TOKEN || '',
    });
  }
  return turso;
}

/**
 * 🕵️ METADATA SERVICE:
 * This Node.js route acts as a pre-renderer for search bots.
 * It fetches the content from Turso and returns the HTML with injected meta tags.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug, type } = req.query;

  try {
    let metadata = {
      title: "MATRIARCH | Elite Selection Protocol",
      description: "Delhi's most exclusive verification-based dating protocol.",
      image: "https://www.matriarchindia.com/og-image.jpg",
      keywords: "elite dating, selection protocol, delhi dating, mumbai dating, bangalore dating"
    };

    if (type === 'journal' && slug) {
      // Fetch post from Turso
      const client = getTurso();
      const result = await client.execute({
        sql: "SELECT title, content, image_url FROM blog_submissions WHERE id = ? AND status = 'approved'",
        args: [slug as string]
      });

      if (result.rows.length > 0) {
        const post = result.rows[0];
        metadata.title = `${post.title} | Matriarch Journal`;
        metadata.description = (post.content as string).substring(0, 160) + "...";
        metadata.image = post.image_url as string;
      }
    }

    // Return the pre-rendered meta tags as a partial HTML or full page
    // For a real pre-renderer, you'd load index.html and replace placeholders
    const htmlSnippet = `
      <title>${metadata.title}</title>
      <meta name="description" content="${metadata.description}" />
      <meta name="keywords" content="${metadata.keywords}" />
      <meta property="og:title" content="${metadata.title}" />
      <meta property="og:description" content="${metadata.description}" />
      <meta property="og:image" content="${metadata.image}" />
      <meta name="twitter:card" content="summary_large_image" />
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(htmlSnippet);
  } catch (error) {
    console.error("METADATA_ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
