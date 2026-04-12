export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Brief summary for SEO/Grid
  markdownUrl: string; // Path to long-form .md file
  category: 'Love' | 'Relationships' | 'Sex' | 'Dating';
  date: string;
  readTime: string;
  image: string;
  authorId: string; // Reference to DUMMY_ASPIRANTS
}

export const BLOG_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Architecture of Modern Intimacy',
    excerpt: 'Detailed analysis of how digital verification layers are redefining human connection.',
    content: `In the age of the Matriarch Protocol, intimacy is no longer just an emotion; it is an architecture. We explore the transition from chaotic dating markets to a structured sanctuary where trust is verified and desire is deliberate.`,
    markdownUrl: '/content/blogs/modern_intimacy.md',
    category: 'Relationships',
    date: 'April 10, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?q=80&w=1287&auto=format&fit=crop',
    authorId: 'm1' // Vikram Singh
  },
  {
    id: '2',
    title: 'The Paradox of Choice in Selective Dating',
    excerpt: 'Analyzing the systemic failure of the open market and the power of Radical Selectivity.',
    content: `The modern dating market presents a peculiar tragedy: the more choices we have, the less satisfied we become. We analyze why high-value individuals find peace in narrowed fields.`,
    markdownUrl: '/content/blogs/choice_paradox.md',
    category: 'Dating',
    date: 'April 08, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1287&auto=format&fit=crop',
    authorId: 'm2' // Arjun Mehra
  },
  {
    id: '3',
    title: 'Beyond the Physical: Semantic Seduction',
    excerpt: 'A 300-word long-form poem exploring the intellectual spark beneath the skin.',
    content: `The skin is but a threshold, a gilded gate; a silent sentry standing at the wall. A poetic exploration of the syntax of desire and the language of the mind.`,
    markdownUrl: '/content/blogs/semantic_seduction.md',
    category: 'Love',
    date: 'April 05, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?q=80&w=1287&auto=format&fit=crop',
    authorId: 'm3' // Kabir Varma
  },
  {
    id: '4',
    title: 'The Ethics of Desire: A Post-Modern Perspective',
    excerpt: 'Investigating the moral landscape of active consent and sovereign boundaries.',
    content: `Desire is never neutral. It is informed by power, history, and social structure. We propose a new moral ground for intimacy built on parity of excellence.`,
    markdownUrl: '/content/blogs/ethics_desire.md',
    category: 'Sex',
    date: 'April 02, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=1287&auto=format&fit=crop',
    authorId: 'm5' // Dev Advani
  },
  {
    id: '5',
    title: 'The Silent Language of Long-Term Bonds',
    excerpt: 'A deep-dive into the microscopic interactions that predict relationship longevity.',
    content: `Longevity is built on the accumulation of small, seemingly insignificant moments. We explore the architecture of attunement and the heartbeat of resilience.`,
    markdownUrl: '/content/blogs/long_term_bonds.md',
    category: 'Relationships',
    date: 'March 28, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1287&auto=format&fit=crop',
    authorId: 'm13' // Aditya Rao
  },
  {
    id: '6',
    title: 'Dating in Delhi: The Protocol of Excellence',
    excerpt: 'A localized guide to navigating the elite social gates of South Delhi and Gurgaon.',
    content: `Delhi is a city of gates. We transform the social landscape of the capital into a refined protocol of sovereign recognition and verified lineage.`,
    markdownUrl: '/content/blogs/delhi_protocol.md',
    category: 'Dating',
    date: 'March 25, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1287&auto=format&fit=crop',
    authorId: 'm7' // Aryan Goel
  },
  {
    id: '7',
    title: 'The Luxury of No: Selectivity as Sovereign Power',
    excerpt: 'On the power of deliberate refusal and the architecture of the feminine sanctuary.',
    content: `To say 'No' is not an act of rejection, but an act of self-architecture. We explore why selectivity is the defining line of the Matriarch.`,
    markdownUrl: '/content/blogs/the-luxury-of-no.md',
    category: 'Dating',
    date: 'April 11, 2026',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop',
    authorId: 'w1' // Ananya Iyer
  },
  {
    id: '8',
    title: 'Architecting Emotional Safety: Beyond the Shield',
    excerpt: 'Deep-dive into the psychological infrastructure required for genuine resonance.',
    content: `Safety is not just the absence of threat; it is the presence of structure. We examine how the Matriarch Protocol protects intellectual vulnerability.`,
    markdownUrl: '/content/blogs/architecting-emotional-safety.md',
    category: 'Relationships',
    date: 'April 11, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1287&auto=format&fit=crop',
    authorId: 'w2' // Meera Kapoor
  },
  {
    id: '9',
    title: 'The Digital Gaze: Intimacy in the Matrix',
    excerpt: 'Reclaiming the power of perception through the Infinite Gaze protocol.',
    content: `In the sanctuary, the way we 'see' each other is fundamentally different. We explore the transition from predatory looking to sovereign recognition.`,
    markdownUrl: '/content/blogs/the-digital-gaze.md',
    category: 'Love',
    date: 'April 10, 2026',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=1287&auto=format&fit=crop',
    authorId: 'w3' // Sanya Malhotra
  },
  {
    id: '10',
    title: 'Currency of Time: The Asset of Patience',
    excerpt: 'Why slowing down the connection process is the ultimate high-value signifier.',
    content: `Speed is the enemy of quality. We analyze why high-value individuals trade time for resonance in a culture of instant disposable intimacy.`,
    markdownUrl: '/content/blogs/currency-of-time.md',
    category: 'Relationships',
    date: 'April 09, 2026',
    readTime: '11 min read',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1287&auto=format&fit=crop',
    authorId: 'w4' // Isha Verma
  },
  {
    id: '11',
    title: 'Sanctuary Ethics: The Code of the Matriarch',
    excerpt: 'The moral and social framework that protects the dignity of our members.',
    content: `The Matriarch Protocol is more than a platform; it is a philosophy. We outline the ethics of discretion, transparency, and intent.`,
    markdownUrl: '/content/blogs/sanctuary-ethics.md',
    category: 'Sex',
    date: 'April 07, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1287&auto=format&fit=crop',
    authorId: 'w5' // Riya Sen
  },
  {
    id: '12',
    title: 'Beyond the Swipe: The Art of Intellectual Seduction',
    excerpt: 'Relearning the patient art of mind-to-mind connection in a post-swipe world.',
    content: `The swipe is a reflex; seduction is an art. We explore why the mind is the most powerful sovereign organ in the sanctuary.`,
    markdownUrl: '/content/blogs/beyond-the-swipe.md',
    category: 'Love',
    date: 'April 05, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?q=80&w=1287&auto=format&fit=crop',
    authorId: 'w6' // Tara Khanna
  }
];
