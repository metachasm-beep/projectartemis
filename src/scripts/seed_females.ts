import { createClient } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL!,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN!,
});

const femaleFirstNames = [
  'Ananya', 'Ishani', 'Kiara', 'Myra', 'Saanvi', 'Zoya', 'Riya', 'Diya', 'Tanya', 'Navya',
  'Avani', 'Sara', 'Meher', 'Aavya', 'Inaya', 'Shanaya', 'Kavya', 'Amara', 'Pari', 'Sia',
  'Aadhya', 'Vanya', 'Kyra', 'Aaira', 'Zara', 'Mira', 'Ira', 'Tara', 'Roshni', 'Payal',
  'Sanjana', 'Priyanka', 'Deepika', 'Alia', 'Shraddha', 'Kriti', 'Rashmika', 'Trisha', 'Nayanthara', 'Samantha',
  'Aditi', 'Radhika', 'Vidya', 'Parineeti', 'Esha', 'Yami', 'Taapsee', 'Bhumi', 'Janhvi', 'Anushka'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Iyer', 'Reddy', 'Patel', 'Malhotra', 'Kapoor', 'Mehta', 'Singhania',
  'Chopra', 'Bajaj', 'Thakur', 'Deshmukh', 'Kulkarni', 'Joshi', 'Nair', 'Menon', 'Gill', 'Sandhu',
  'Khan', 'Sheikh', 'Bose', 'Chatterjee', 'Banerjee', 'Rao', 'Naidu', 'Shetty', 'Hegde', 'Pai'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Indore', 'Gurgaon', 'Noida', 'Kochi', 'Goa'
];

const occupations = [
  'Fashion Designer', 'Tech Lead', 'Digital Artist', 'Architect', 'Wellness Coach', 'Marketing Director',
  'UI/UX Designer', 'Product Manager', 'Content Creator', 'Entrepreneur', 'Corporate Lawyer', 'Surgeon',
  'Pilot', 'Data Scientist', 'Brand Strategist', 'Journalist', 'Photographer', 'Stylist'
];

const bios = [
  "Curating a life of intention and aesthetic resonance.",
  "Architecting digital futures by day, dreamer by night.",
  "Seeking a frequency that matches my ambition.",
  "Driven by passion, grounded in culture.",
  "Life is a canvas; I'm painting my own destiny.",
  "Tech enthusiast with a soul for classical arts.",
  "Wandering through the archives of the heart.",
  "Independent, fierce, and looking for a sovereign partner.",
  "Finding magic in the mundane.",
  "A narrative of grace and grit.",
  "Elegance is an attitude.",
  "Building an empire, one intentional step at a time.",
  "Seeking depth in a shallow world.",
  "A soulful explorer of the modern sanctuary.",
  "Your aura caught my attention.",
  "Let's build a legacy that transcends time.",
  "Resonating with excellence and integrity."
];

const unsplashKeywords = [
  'indian-woman-fashion',
  'indian-model-portrait',
  'desi-girl-aesthetic',
  'indian-luxury-lifestyle',
  'bollywood-glamour',
  'indian-bridal-couture',
  'urban-indian-girl',
  'indian-traditional-beauty'
];

async function seedFemales() {
  console.log("Expanding the Sanctuary with 200 female seeker identities...");
  const batched = [];

  for (let i = 0; i < 200; i++) {
    const id = uuidv4();
    const firstName = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    // Calculate DOB from age range 18-34
    const age = Math.floor(Math.random() * (34 - 18 + 1)) + 18;
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - age);
    const dobString = dob.toISOString().split('T')[0];

    const city = cities[Math.floor(Math.random() * cities.length)];
    const bio = bios[Math.floor(Math.random() * bios.length)];
    const occupation = occupations[Math.floor(Math.random() * occupations.length)];
    
    const keyword = unsplashKeywords[i % unsplashKeywords.length];
    // Using high-res fashion photography keywords
    const photoUrl = `https://images.unsplash.com/photo-${1500000000000 + (i * 123456) % 1000000000}?auto=format&fit=crop&q=80&w=800&keyword=${keyword}`;
    const photos = JSON.stringify([photoUrl]);

    const rankScore = Math.floor(Math.random() * 5000) + 1000;

    batched.push({
      sql: `INSERT INTO profiles (
        user_id, full_name, role, date_of_birth, bio, city, photos, 
        occupation, is_verified, tokens, rank_score, onboarding_status,
        created_at, updated_at
      ) VALUES (?, ?, 'woman', ?, ?, ?, ?, ?, 1, 1000, ?, 'COMPLETED', ?, ?)`,
      args: [
        id, 
        fullName, 
        dobString, 
        bio, 
        city, 
        photos, 
        occupation, 
        rankScore, 
        new Date().toISOString(), 
        new Date().toISOString()
      ]
    });

    if (batched.length === 50 || i === 199) {
      try {
        await client.batch(batched, "write");
        console.log(`Successfully synced batch of ${batched.length} identities.`);
        batched.length = 0;
      } catch (err: any) {
        console.error("Batch Sync Failed:", err.message);
      }
    }
  }

  console.log("Sanctuary expansion complete. 200 female profiles synthesized.");
  process.exit(0);
}

seedFemales();
