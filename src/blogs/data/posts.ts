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
    image: '/assets/blogs/modern_intimacy.png',
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
    image: '/assets/blogs/choice_paradox.png',
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
    image: '/assets/blogs/semantic_seduction.png',
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
    image: '/assets/blogs/ethics_desire.png',
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
    image: '/assets/blogs/long_term_bonds.png',
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
    image: '/assets/blogs/delhi_excellence.png',
    authorId: 'm7' // Aryan Goel
  }
];
