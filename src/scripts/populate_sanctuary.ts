import { createClient } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.VITE_TURSO_URL!,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN!,
});

const firstNames = ['Arjun', 'Ishan', 'Kabir', 'Rohan', 'Arav', 'Vihaan', 'Aditya', 'Reyansh', 'Aryan', 'Krish', 'Zayan', 'Ayan', 'Dev', 'Shaurya', 'Aarush', 'Vivaan', 'Ansh', 'Kian', 'Atharv', 'Siddharth'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Iyer', 'Reddy', 'Patel', 'Malhotra', 'Kapoor', 'Mehta', 'Singhania', 'Chopra', 'Bajaj', 'Thakur', 'Deshmukh', 'Kulkarni', 'Joshi', 'Nair', 'Menon', 'Gill', 'Sandhu'];
const bios = [
  "Seeking a resonance that transcends the digital expanse.",
  "Architect of code, dreamer of ancient sanctuaries.",
  "A soulful seeker of truth and intentional connection.",
  "Guided by integrity, fueled by curiosity.",
  "Wandering through the archive, looking for my counterpart.",
  "Believer in the power of shared silence.",
  "Looking for a partner to build something eternal.",
  "A seeker of clarity, resonance, and profound depth.",
  "In search of the Matriarch to lead my journey.",
  "Rooted in tradition, reaching for the stars.",
  "Finding beauty in the unwritten chapters.",
  "A narrative in progress, seeking its missing melody.",
  "Intentional, authentic, and ready for resonance.",
  "The archive is vast, but my direction is clear.",
  "A student of life, a seeker of the sovereign.",
  "Your presence is the frequency I've been waiting for.",
  "Building legacies, one intentional word at a time.",
  "The sanctuary is open; my soul is ready.",
  "Deeply rooted, fiercely aspirational.",
  "A collector of stories and seeker of profound truth."
];
const cities = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Kochi', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur'];
const religions = ['Hinduism', 'Sikhism', 'Islam', 'Christianity', 'Jainism'];

async function populate() {
  console.log("Generating 20 seeker identities...");
  const batched = [];

  for (let i = 0; i < 20; i++) {
    const id = uuidv4();
    const fullName = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
    const age = Math.floor(Math.random() * 20) + 24;
    const bio = bios[i % bios.length];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const religion = religions[Math.floor(Math.random() * religions.length)];
    const rank = Math.floor(Math.random() * 100);
    const photos = JSON.stringify([`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=800`]);

    batched.push({
      sql: `INSERT INTO profiles (
        user_id, full_name, age, bio, city, religion, photos, rank_boost_count, 
        role, onboarding_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'man', 'COMPLETED')`,
      args: [id, fullName, age, bio, city, religion, photos, rank]
    });
  }

  try {
    await client.batch(batched, "write");
    console.log("Sanctuary populated successfullly.");
  } catch (e) {
    console.error("Migration Failed:", e);
  }
}

populate();
