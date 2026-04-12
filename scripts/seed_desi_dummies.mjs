import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// 🍛 Desi Identity Curation
const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 
  'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 
  'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad'
];

const MALE_NAMES = [
  'Arnav Sharma', 'Kabir Malhotra', 'Ishaan Iyer', 'Vivaan Mehra', 'Advait Singh',
  'Aryan Gupta', 'Dhruv Kapur', 'Kian Reddy', 'Reyansh Varma', 'Vihaan Joshi',
  'Shaurya Patel', 'Atharv Rao', 'Arav Saxena', 'Rudra Das', 'Ayaan Khan',
  'Darsh Banerjee', 'Vedant Kulkarni', 'Siddharth Nair', 'Yuvan Chopra', 'Zayan Sheikh'
];

const FEMALE_NAMES = [
  'Ananya Kapoor', 'Diya Singhania', 'Myra Bhatia', 'Saanvi Sharma', 'Pari Deshmukh',
  'Shanaya Oberoi', 'Navya Mittal', 'Kiara Sen', 'Ira Mukherjee', 'Aavya Krishnan',
  'Zara Siddiqui', 'Siya Choudhary', 'Rhea Malhotra', 'Amara Goel', 'Mishka Taneja',
  'Advika Pandey', 'Anya Chauhan', 'Sara Ali', 'Vanya Rastogi', 'Ishani Grewal'
];

const MALE_BIOS = [
  "Software Architect passionated about Cloud & Matriarch logic.",
  "Entrepreneur in the Gurgaon tech-scene. Fitness enthusiast.",
  "Chef exploring the fusion of traditional spices and modern aesthetics.",
  "Architect with a vision for sustainable urban sanctuaries.",
  "Data Scientist and semi-professional chess player.",
  "Cinematographer capturing the soul of old Delhi.",
  "Financial analyst by day, stargazer by night.",
  "Travel blogger exploring the hidden gems of Hampi.",
  "Product Designer focusing on minimalist user experiences.",
  "Former athlete now mentoring the next generation."
];

const FEMALE_BIOS = [
  "Classical dancer and contemporary artist based in Jaipur.",
  "Healthcare professional dedicated to holistic wellness.",
  "Digital marketing strategist with a love for classical literature.",
  "Fashion designer blending ethnic textiles with futuristic cuts.",
  "Journalist covering social shifts in modern India.",
  "Pediatrician and amateur mountain climber.",
  "Software engineer building the future of decentralized finance.",
  "Art gallery curator with a passion for emerging talents.",
  "Environmental lawyer and weekend organic gardener.",
  "Psychologist advocating for mental health awareness."
];

// 📸 CURATED DESI PHOTO SOURCE IDS (Unsplash)
const DESI_IDS_MALE = [
  '1506794778202-cad84cf45f1d', '1520975954732-35dd22299614', '1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e',
  '1492562080023-ab3db95bfbce', '1463453091185-61582044d556', '1531384441138-203d9ef0bcb0', '1472099645785-5658abf4ff4e',
  '1531123897727-8f129e1688ce', '1496345875659-11f7dd282d1d', '1540569014015-19a7ee500818', '1534030347209-467a5b0ad3e6',
  '1480455624313-219b4c3938d3', '1501196356614-6c8a3a698607', '1504257432379-7355524cd283', '1508214751196-bcfd4ca60f91',
  '1527980965255-d3b416303d12', '1522075469751-3a6694fb2f61', '1539571696357-5a69c17a67c6', '1542909168-82c3e7fdca5c'
].map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=600`);

const DESI_IDS_FEMALE = [
  '1494790108377-be9c29b29330', '1534528741775-53994a69daeb', '1524504388940-b1c1722653e1', '1506744038136-46273834b3fb',
  '1438761681033-6461ffad8d80', '1544005313-94ddf0286df2', '1529626484987-6e92162b638f', '1507101105822-7470b4805c0d',
  '1488426862026-3ee34a7d66df', '1517841905240-472988bad157', '1531746020798-e6953c6e8e04', '1567532939803-f1d244967352',
  '1554151228-14d9def656e4', '1546961329-78bef0414d7c', '1520333789090-1afc82db536a', '1519345182560-3f2917c472ef',
  '1509305717900-84f40e7b642a', '1502823403499-6ccfcf4fb453', '1521119956141-10f91e9c1f75', '1491349174775-aaafedd8c942'
].map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=600`);

// ☁️ Cloudinary Linker
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
    if (!data.secure_url) {
       console.warn(`Cloudinary upload failed for ${name}:`, data);
       throw new Error("Missing secure_url");
    }
    return data.secure_url;
  } catch (e) {
    console.error(`Upload error for ${name}:`, e.message);
    // Return original Unsplash URL as fallback instead of null
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

async function seedDummies() {
  console.log("🚀 INITIALIZING RECTIFIED DESI REGISTRY EXPANSION...");
  
  const allProfiles = [];

  // Generate Men
  for (let i = 0; i < 20; i++) {
    const name = MALE_NAMES[i];
    console.log(` - Processing ${name}...`);
    const cloudinaryUrl = await uploadToCloudinary(DESI_IDS_MALE[i], name);
    
    allProfiles.push({
      user_id: `dummy-m-${200 + i}`, // Using 200 range to avoid collision with failed run ids
      full_name: name,
      role: 'man',
      city: CITIES[i % CITIES.length],
      date_of_birth: randomDOB(22, 38),
      bio: MALE_BIOS[i % MALE_BIOS.length],
      photos: JSON.stringify([cloudinaryUrl]),
      tokens: 800 + Math.floor(Math.random() * 2500),
      is_verified: 1,
      payment_status: 'APPROVED',
      onboarding_status: 'COMPLETED'
    });
  }

  // Generate Women
  for (let i = 0; i < 20; i++) {
    const name = FEMALE_NAMES[i];
    console.log(` - Processing ${name}...`);
    const cloudinaryUrl = await uploadToCloudinary(DESI_IDS_FEMALE[i], name);
    
    allProfiles.push({
      user_id: `dummy-w-${200 + i}`,
      full_name: name,
      role: 'woman',
      city: CITIES[(i + 5) % CITIES.length],
      date_of_birth: randomDOB(21, 33),
      bio: FEMALE_BIOS[i % FEMALE_BIOS.length],
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

  console.log("\n✅ RECTIFIED DESI REGISTRY EXPANSION COMPLETE.");
}

seedDummies();
