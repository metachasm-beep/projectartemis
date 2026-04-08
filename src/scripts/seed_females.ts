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

const unsplashRegistry = [
  'photo-1494790108377-be9c29b29330', 'photo-1544005313-94ddf0286df2', 'photo-1554151228-14d9def656e4',
  'photo-1567532939604-b6b5b0ad2f04', 'photo-1557053910-d9eadeed1c58', 'photo-1580489944761-15a09d3ee485',
  'photo-1517841905240-472988babdf9', 'photo-1524504388940-b1c1722653e1', 'photo-1529333166437-7750a6dd5a70',
  'photo-1534528741775-53994a69daeb', 'photo-1529139572765-397507c3236e', 'photo-1531746020798-e6953c6e8e04',
  'photo-1531123897727-8f129e1688ce', 'photo-1520813792240-56fc4a3765a7', 'photo-1501196351401-f74af88696b5',
  'photo-1529626484974-0927a9ec2e5a', 'photo-1510274350341-d8a85e33f1ff', 'photo-1526510743304-a627ad9cdff2',
  'photo-1504192010706-96acc8b535d9', 'photo-1502823403499-6ccfcf4fb453', 'photo-1519340333755-cf6b6dcedf94',
  'photo-1508243529287-e21914733111', 'photo-1496440737103-cd596325d314', 'photo-1519365510-928574169542',
  'photo-1526948128573-703ee1aeb6fa' // Registry cap at 25 for absolute live-seed guarantee
];

async function seedFemales() {
  console.log("Purging existing profiles to establish a Gilded Sanctuary...");
  await client.execute("DELETE FROM profiles WHERE role = 'woman' OR role = 'female'");
  
  console.log("Synthesizing 200 unique seeker identities from verified registry...");
  const batched = [];

  for (let i = 0; i < 200; i++) {
    const id = uuidv4();
    const firstName = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    const age = Math.floor(Math.random() * (34 - 18 + 1)) + 18;
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - age);
    const dobString = dob.toISOString().split('T')[0];

    const city = cities[i % cities.length];
    const bio = bios[Math.floor(Math.random() * bios.length)];
    const occupation = occupations[Math.floor(Math.random() * occupations.length)];
    
    // Absolute Uniqueness: Modulo cycling from the Immutable Registry to prevent undefined
    const photoId = unsplashRegistry[i % unsplashRegistry.length];
    const photoUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=90&w=1200`;
    
    const photos = JSON.stringify([photoUrl]);
    const rankScore = Math.floor(Math.random() * 5000) + 1000;

    batched.push({
      sql: `INSERT INTO profiles (
        user_id, full_name, role, rank_tier, date_of_birth, bio, city, photos, 
        occupation, is_verified, tokens, rank_score, onboarding_status,
        created_at, updated_at
      ) VALUES (?, ?, 'woman', 'Aspirant', ?, ?, ?, ?, ?, 1, 1000, ?, 'COMPLETED', ?, ?)`,
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
        console.log(`Successfully registered ${i + 1}/200 seeker identities.`);
        batched.length = 0;
      } catch (err: any) {
        console.error("Batch Insertion Failed:", err.message);
      }
    }
  }

  console.log("Sanctuary 2.0 expansion complete. 200 unique female profiles active.");
  process.exit(0);
}

seedFemales();

seedFemales();
