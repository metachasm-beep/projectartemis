import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// 🍛 Casual Desi Identity Curation
const CITIES = [
  'Pune', 'Chandigarh', 'Gurgaon', 'Noida', 'Lucknow', 
  'Jaipur', 'Indore', 'Bhopal', 'Surat', 'Nagpur'
];

const MALE_NAMES = [
  'Raghav Varma', 'Manish Bansal', 'Sameer Kulkarni', 'Utkarsh Mishra', 'Nikhil Agarwal'
];

const FEMALE_NAMES = [
  'Ritu Sharma', 'Sneha Patel', 'Palak Gupta', 'Aditi Rao', 'Megha Singh'
];

const MALE_BIOS = [
  "Just a techie from Pune looking to explore new horizons. Chai over Coffee.",
  "Living life one day at a time. Big fan of indie music and long drives.",
  "Foodie, traveler, and occasional poet. Let's see where this goes.",
  "Working hard, playing harder. Gamer by night, coder by day.",
  "Always up for a hike or a spontaneous trip to the hills."
];

const FEMALE_BIOS = [
  "Digital nomad currently exploring the vibes of north India. ✨",
  "Design student who loves sketching people in cafes.",
  "Avid reader and plant mom. Minimalist at heart.",
  "Searching for conversations that last longer than my charging cable.",
  "Yoga enthusiast and weekend volunteer at the local shelter."
];

// 📸 CASUAL/UNPROFESSIONAL DESI PHOTO IDs
const CASUAL_MALE_IDS = [
  '1500648767791-00dcc994a43e', '1520975954732-35dd22299614', '1539571696357-5a69c17a67c6', 
  '1522075469751-3a6694fb2f61', '1540569014015-19a7ee500818'
].map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=500`);

const CASUAL_FEMALE_IDS = [
  '1511413340570-072054fb453e', '1567532939803-f1d244967352', '1519345182560-3f2917c472ef', 
  '1524504388940-b1c1722653e1', '1494790108377-be9c29b29330'
].map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=500`);

// ☁️ Hardened Cloudinary Linker
async function uploadToCloudinary(imageUrl, name) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Source fetch failed: ${res.status}`);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'profiles');
    
    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });
    
    const data = await cloudRes.json();
    if (!data.secure_url) throw new Error("Cloudinary missing secure_url");
    return data.secure_url;
  } catch (e) {
    console.error(`Upload failure for ${name}:`, e.message);
    return imageUrl; 
  }
}

const randomDOB = (minAge, maxAge) => {
  const currentYear = new Date().getFullYear();
  const year = currentYear - (minAge + Math.floor(Math.random() * (maxAge - minAge)));
  const month = 1 + Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

async function seedCasualDummies() {
  console.log("🚀 INITIALIZING CASUAL DESI REGISTRY EXPANSION...");
  
  const allProfiles = [];

  // Generate Men
  for (let i = 0; i < 5; i++) {
    const name = MALE_NAMES[i];
    console.log(` - Processing ${name}...`);
    const cloudinaryUrl = await uploadToCloudinary(CASUAL_MALE_IDS[i], name);
    
    allProfiles.push({
      user_id: `dummy-m-30${i}`,
      full_name: name,
      role: 'man',
      city: CITIES[i % CITIES.length],
      date_of_birth: randomDOB(20, 32),
      bio: MALE_BIOS[i],
      photos: JSON.stringify([cloudinaryUrl]),
      tokens: 900 + Math.floor(Math.random() * 2100),
      is_verified: 1,
      payment_status: 'APPROVED',
      onboarding_status: 'COMPLETED'
    });
  }

  // Generate Women
  for (let i = 0; i < 5; i++) {
    const name = FEMALE_NAMES[i];
    console.log(` - Processing ${name}...`);
    const cloudinaryUrl = await uploadToCloudinary(CASUAL_FEMALE_IDS[i], name);
    
    allProfiles.push({
      user_id: `dummy-w-30${i}`,
      full_name: name,
      role: 'woman',
      city: CITIES[(i + 5) % CITIES.length],
      date_of_birth: randomDOB(19, 29),
      bio: FEMALE_BIOS[i],
      photos: JSON.stringify([cloudinaryUrl]),
      tokens: 0,
      is_verified: 1,
      payment_status: 'APPROVED',
      onboarding_status: 'COMPLETED'
    });
  }

  console.log("💾 COMMITTING TO TURSO...");

  for (const p of allProfiles) {
    try {
      await turso.execute({
        sql: `INSERT INTO profiles (user_id, full_name, role, city, date_of_birth, bio, photos, tokens, is_verified, payment_status, onboarding_status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          p.user_id, p.full_name, p.role, p.city, p.date_of_birth, p.bio, 
          p.photos, p.tokens, p.is_verified, p.payment_status, p.onboarding_status
        ]
      });
    } catch (e) {
      console.warn(`Failed to insert ${p.full_name}:`, e.message);
    }
  }

  console.log("\n✅ CASUAL DESI REGISTRY EXPANSION COMPLETE.");
}

seedCasualDummies();
