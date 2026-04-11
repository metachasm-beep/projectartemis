export interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: 'Love' | 'Relationships' | 'Sex' | 'Dating';
  date: string;
  readTime: string;
  image: string;
}

export const BLOG_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Architecture of Modern Intimacy',
    excerpt: 'How digital walls and verification layers are redefining how we connect in the 21st century.',
    category: 'Relationships',
    date: 'April 10, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'The Paradox of Choice in Selective Dating',
    excerpt: 'Why high-value individuals often find it harder to commit in an era of infinite potential.',
    category: 'Dating',
    date: 'April 08, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1523247530039-446401646274?q=80&w=2670&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Beyond the Physical: Semantic Seduction',
    excerpt: 'Exploring the intellectual chemistry that separates a casual connection from a soul-deep bond.',
    category: 'Love',
    date: 'April 05, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?q=80&w=2671&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'The Ethics of Desire: A Post-Modern Perspective',
    excerpt: 'Navigating the complex landscape of consent, power, and pleasure in contemporary relationships.',
    category: 'Sex',
    date: 'April 02, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1516589174184-c6852661448c?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'The Silent Language of Long-Term Bonds',
    excerpt: 'Decoding the microscopic interactions that predict relationship longevity and emotional safety.',
    category: 'Relationships',
    date: 'March 28, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1516589091380-5d8183de2744?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: '6',
    title: 'Dating in Delhi: The Protocol of Excellence',
    excerpt: 'A guide to navigating the elite social circles of South Delhi and Gurgaon.',
    category: 'Dating',
    date: 'March 25, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2669&auto=format&fit=crop'
  }
];
