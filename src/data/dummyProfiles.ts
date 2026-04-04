export interface AspirantProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  rank: string;
  status: 'Imperial' | 'Vanguard' | 'Sealed' | 'Rising';
  bio: string;
  img: string;
  height?: number; // Used for masonry layout calculation
}

export const DUMMY_ASPIRANTS: AspirantProfile[] = [
  {
    id: 'm1',
    name: 'Vikram Singh',
    age: 28,
    city: 'New Delhi',
    rank: 'Percentile 0.1%',
    status: 'Imperial',
    bio: 'Founder of an AI logistics startup. Alumnus of IIT Delhi. Loves trekking in Ladakh.',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop',
    height: 1600
  },
  {
    id: 'm2',
    name: 'Arjun Mehra',
    age: 31,
    city: 'Mumbai',
    rank: 'Percentile 1.2%',
    status: 'Vanguard',
    bio: 'Investment banker with a passion for classical piano. Architect of his own life.',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1287&auto=format&fit=crop',
    height: 1400
  },
  {
    id: 'm3',
    name: 'Kabir Varma',
    age: 29,
    city: 'Bangalore',
    rank: 'Percentile 4.5%',
    status: 'Sealed',
    bio: 'Architectural designer. Believes in minimal living and maximal thinking.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1287&auto=format&fit=crop',
    height: 1800
  },
  {
    id: 'm4',
    name: 'Rohan Malhotra',
    age: 27,
    city: 'Pune',
    rank: 'Percentile 10.2%',
    status: 'Rising',
    bio: 'Data scientist and competitive chess player. Seeking a resonance of the mind.',
    img: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1287&auto=format&fit=crop',
    height: 1500
  },
  {
    id: 'm5',
    name: 'Dev Advani',
    age: 30,
    city: 'Dubai',
    rank: 'Percentile 2.3%',
    status: 'Imperial',
    bio: 'International corporate lawyer. World traveler. Seeking a sovereign partner.',
    img: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1287&auto=format&fit=crop',
    height: 1700
  },
  {
    id: 'm6',
    name: 'Neel Kanth',
    age: 26,
    city: 'Hyderabad',
    rank: 'Percentile 45.0%',
    status: 'Rising',
    bio: 'Software engineer at a FAANG company. Weekend baker and cyclist.',
    img: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?q=80&w=1287&auto=format&fit=crop',
    height: 1450
  },
  {
    id: 'm7',
    name: 'Aryan Goel',
    age: 32,
    city: 'Delhi',
    rank: 'Percentile 8.9%',
    status: 'Vanguard',
    bio: 'Real estate developer. Collector of vintage watches. Guided by tradition.',
    img: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1287&auto=format&fit=crop',
    height: 1650
  },
  {
    id: 'm8',
    name: 'Dhruv Kapoor',
    age: 29,
    city: 'Chandigarh',
    rank: 'Entry (1,204)',
    status: 'Rising',
    bio: 'Public policy researcher. Believes in the power of conversation.',
    img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1287&auto=format&fit=crop',
    height: 1550
  },
  {
    id: 'm9',
    name: 'Ishaan Reddy',
    age: 28,
    city: 'Bangalore',
    rank: 'Percentile 1.5%',
    status: 'Imperial',
    bio: 'Automotive engineer. Raced in Formula 3. Precision is my lifestyle.',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1287&auto=format&fit=crop',
    height: 1600
  },
  {
    id: 'm10',
    name: 'Siddharth Jain',
    age: 33,
    city: 'Mumbai',
    rank: 'Percentile 3.2%',
    status: 'Vanguard',
    bio: 'Art gallery owner. Searching for the ultimate aesthetic resonance.',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1287&auto=format&fit=crop',
    height: 1750
  },
  {
    id: 'm11',
    name: 'Samir Gupta',
    age: 30,
    city: 'Kolkata',
    rank: 'Percentile 7.8%',
    status: 'Sealed',
    bio: 'Neurosurgeon. Life is a delicate balance of surgery and poetry.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop',
    height: 1500
  },
  {
    id: 'm12',
    name: 'Varun Das',
    age: 27,
    city: 'Chennai',
    rank: 'Percentile 12.1%',
    status: 'Rising',
    bio: 'Marine biologist. The ocean holds the secrets I strive to learn.',
    img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1287&auto=format&fit=crop',
    height: 1400
  },
  {
    id: 'm13',
    name: 'Aditya Rao',
    age: 31,
    city: 'London',
    rank: 'Percentile 0.5%',
    status: 'Imperial',
    bio: 'Hedge fund manager. Strategy is the core of every success.',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop',
    height: 1650
  },
  {
    id: 'm14',
    name: 'Abhishek Roy',
    age: 29,
    city: 'Delhi',
    rank: 'Percentile 2.9%',
    status: 'Vanguard',
    bio: 'Journalist. Uncovering truths is my life mission.',
    img: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=1287&auto=format&fit=crop',
    height: 1580
  },
  {
    id: 'm15',
    name: 'Pranav Joshi',
    age: 34,
    city: 'Pune',
    rank: 'Percentile 5.4%',
    status: 'Sealed',
    bio: 'Philosopher and author. Every soul is a complex architecture.',
    img: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=1287&auto=format&fit=crop',
    height: 1720
  },
  {
    id: 'm16',
    name: 'Karan Mehra',
    age: 25,
    city: 'Surat',
    rank: 'Percentile 15.0%',
    status: 'Rising',
    bio: 'Diamond merchant. Refined taste, unmatched ambition.',
    img: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1287&auto=format&fit=crop',
    height: 1480
  },
  {
    id: 'm17',
    name: 'Yash Chopra',
    age: 30,
    city: 'Singapore',
    rank: 'Percentile 1.1%',
    status: 'Imperial',
    bio: 'Digital nomad. Founding the future of work.',
    img: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?q=80&w=1287&auto=format&fit=crop',
    height: 1680
  },
  {
    id: 'm18',
    name: 'Zayaan Khan',
    age: 28,
    city: 'Lucknow',
    rank: 'Percentile 6.3%',
    status: 'Vanguard',
    bio: 'Classical poet. Modern heart. Seeking resonance.',
    img: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?q=80&w=1287&auto=format&fit=crop',
    height: 1540
  },
  {
    id: 'm19',
    name: 'Rishi Khanna',
    age: 32,
    city: 'New York',
    rank: 'Percentile 0.8%',
    status: 'Imperial',
    bio: 'Avenue of the stars. Guided by excellence.',
    img: 'https://images.unsplash.com/photo-1605664041952-4a285090173e?q=80&w=1287&auto=format&fit=crop',
    height: 1780
  },
  {
    id: 'm20',
    name: 'Ojas Vats',
    age: 29,
    city: 'Ahmedabad',
    rank: 'Percentile 9.2%',
    status: 'Rising',
    bio: 'Textile industrialist. Heritage is the loom of life.',
    img: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?q=80&w=1287&auto=format&fit=crop',
    height: 1510
  }
];
