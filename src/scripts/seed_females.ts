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

const unsplashIds = [
  'photo-1524504388940-b1c1722653e1', 'photo-1581091226825-a6a2a5aee158', 'photo-1594744803329-a584af1ea41f',
  'photo-1503105903301-8314e922f302', 'photo-1621605815971-fbc388062193', 'photo-1589156280159-27698a70f29e',
  'photo-1614283233556-f35b0c801ef1', 'photo-1512436991641-6745cdb1723f', 'photo-1515886657613-9f3515b0c78f',
  'photo-1539109136881-3be0616acf4b', 'photo-1529139572765-397507c3236e', 'photo-1512316609839-ce289d3eba0a',
  'photo-1500917293891-ef795e70e1f6', 'photo-1494790108377-be9c29b29330', 'photo-1488426862026-3ee34a7d66df',
  'photo-1506794778202-cad84cf45f1d', 'photo-1534528741775-53994a69daeb', 'photo-1507003211169-0a1dd7228f2d',
  'photo-1517841905240-472988babdf9', 'photo-1539571696357-5a69c17a67c6', 'photo-1512316609839-ce289d3eba0a',
  'photo-1511551203524-9a24350a5e83', 'photo-1469334031218-e382a71b716b', 'photo-1524250502761-1ac6f2e30d43',
  'photo-1524502393244-9d101ff2f16d', 'photo-1531746020798-e6953c6e8e04', 'photo-1534751516642-a1af1ef26a56',
  'photo-1544005313-94ddf0286df2', 'photo-1544717297-fa95b3ee5fe5', 'photo-1543132220-4bf3de6e10ae',
  'photo-1554151228-14d9def656e4', 'photo-1552058544-f2b08422138a', 'photo-1552374196-c4e7ffc6e126',
  'photo-1557053910-d9eadeed1c58', 'photo-1562572230-c29a2fe21df5', 'photo-1563805900-38933bbad496',
  'photo-1567532939604-b6b5b0ad2f04', 'photo-1570158268183-d296b2892211', 'photo-1573496359142-b8d87734a5a2',
  'photo-1580489944761-15a09d3ee485', 'photo-1580489944761-15a09d3ee485', 'photo-1581092795360-fd1ca04f0952',
  'photo-1586717791821-3f44a563eb4c', 'photo-1593134257782-e89567b7718a', 'photo-1595152772835-219674b2a8a6',
  'photo-1595959183082-a877303a529a', 'photo-1596495578065-6e0763fa1141', 'photo-1596728321064-323ec285af40',
  'photo-1597223557154-721c1cecc4b0', 'photo-1598550874175-4d0fe45ce08e', 'photo-1598550880863-452654594788'
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
    
    const photoId = unsplashIds[i % unsplashIds.length];
    // Using direct high-res image IDs from Unsplash
    const photoUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800`;
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
