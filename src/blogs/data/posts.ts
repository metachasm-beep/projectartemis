export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown/HTML content
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
    excerpt: 'How digital walls and verification layers are redefining how we connect in the 21st century.',
    content: `In the evolving landscape of the Matriarch Protocol, intimacy is no longer just an emotion; it is an architecture.\n\nWe have transitioned from the chaotic, unregulated dating markets of the past into a structured sanctuary where trust is verified, and desire is deliberate. The "walls" we build—identity verification, financial transparency, and social rank—are not meant to exclude, but to create a secure perimeter where true vulnerability can finally flourish.\n\nWhen we know who stands before us, we no longer need the armor of skepticism. Modern intimacy is the luxury of safety, provided by the very protocols that define our social stratum. It is the realization that a soul-deep connection requires more than just chemistry; it requires a shared context of excellence and mutual recognition.`,
    category: 'Relationships',
    date: 'April 10, 2026',
    readTime: '6 min read',
    image: '/assets/blogs/modern_intimacy.png',
    authorId: 'm1' // Vikram Singh
  },
  {
    id: '2',
    title: 'The Paradox of Choice in Selective Dating',
    excerpt: 'Why high-value individuals often find it harder to commit in an era of infinite potential.',
    content: `The modern dating market presents a peculiar tragedy: the more choices we have, the less satisfied we become. For the high-value individual, this paradox is amplified by a digital landscape that constantly whispers of "someone better" just one swipe away.\n\nAt Matriarch, we resolve this paradox through the principle of Radical Selectivity. By narrowing the field to only those who have already cleared the thresholds of excellence, we move from the exhaustion of quantity to the focus of quality. Commitment becomes easier when the choice is not between a thousand shadows, but between a few distinct monuments of character.\n\nTrue freedom is not the ability to choose anything; it is the wisdom to choose correctly once.`,
    category: 'Dating',
    date: 'April 08, 2026',
    readTime: '8 min read',
    image: '/assets/blogs/choice_paradox.png',
    authorId: 'm2' // Arjun Mehra
  },
  {
    id: '3',
    title: 'Beyond the Physical: Semantic Seduction',
    excerpt: 'Exploring the intellectual chemistry that separates a casual connection from a soul-deep bond.',
    content: `While the physical remains the gateway, it is the semantic—the language of the mind—that secures the fortress of a relationship. Semantic seduction is the art of resonance; it is finding the person whose internal dictionary matches your own.\n\nIn our high-fidelity circles, attraction is increasingly driven by intellectual curiosity. A shared understanding of philosophy, a mutual appreciation for architecture, or a synchronized vision of the future provides a longer-lasting spark than any superficial trait. We are seeking partners who can navigate the complexities of our worlds, not just admire the facades we present to the public.\n\nTo be truly known is the ultimate aphrodisiac.`,
    category: 'Love',
    date: 'April 05, 2026',
    readTime: '5 min read',
    image: '/assets/blogs/semantic_seduction.png',
    authorId: 'm3' // Kabir Varma
  },
  {
    id: '4',
    title: 'The Ethics of Desire: A Post-Modern Perspective',
    excerpt: 'Navigating the complex landscape of consent, power, and pleasure in contemporary relationships.',
    content: `Desire is never neutral. It is informed by power, history, and the structures of society. In a post-modern context, the ethics of desire require us to be hyper-aware of the dynamics we bring into the bedroom and the boardroom alike.\n\nConsent within the Matriarch Protocol is not just a legal checkbox; it is a continuous, enthusiastic dialogue of equals. We believe that true pleasure is only possible within a framework of absolute respect and sovereign boundaries. By elevating the discourse around desire, we transform it from a primitive impulse into a sophisticated exchange of value and energy.`,
    category: 'Sex',
    date: 'April 02, 2026',
    readTime: '10 min read',
    image: '/assets/blogs/ethics_desire.png',
    authorId: 'm5' // Dev Advani
  },
  {
    id: '5',
    title: 'The Silent Language of Long-Term Bonds',
    excerpt: 'Decoding the microscopic interactions that predict relationship longevity and emotional safety.',
    content: `The strength of a bond is not tested during the grand gestures, but in the silence between them. It is in the "bids for connection" that occur over breakfast, the subtle shift in tone during a phone call, and the shared glance across a crowded room.\n\nResilient relationships are built on a foundation of emotional safety—the knowledge that your partner is not only present but attuned. This silent language is the heartbeat of longevity. It is the ability to communicate without speaking, to support without being asked, and to maintain a shared sanctuary even when the world outside is in chaos.`,
    category: 'Relationships',
    date: 'March 28, 2026',
    readTime: '7 min read',
    image: '/assets/blogs/long_term_bonds.png',
    authorId: 'm13' // Aditya Rao
  },
  {
    id: '6',
    title: 'Dating in Delhi: The Protocol of Excellence',
    excerpt: 'A guide to navigating the elite social circles of South Delhi and Gurgaon.',
    content: `Delhi is a city of gates, and the dating market here is no different. To navigate the elite circles of South Delhi and the burgeoning tech-royalty of Gurgaon, one must understand the Protocol of Excellence. It is a world where lineage meets leverage, and where social currency is the only true legal tender.\n\nWithin the sanctuary of Matriarch, we simplify this navigation. We provide the map to these hidden social landscapes, ensuring that our aspirants are not just seen, but recognized for the value they bring. Excellence is the only prerequisite; the rest is a matter of correct positioning and refined conduct.`,
    category: 'Dating',
    date: 'March 25, 2026',
    readTime: '5 min read',
    image: '/assets/blogs/delhi_excellence.png',
    authorId: 'm7' // Aryan Goel
  }
];
