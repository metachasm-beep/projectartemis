import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// 🍛 Mass Casual Identity Matrix
const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 
  'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur', 
  'Lucknow', 'Indore', 'Bhopal', 'Vadodara', 'Kochi',
  'Patna', 'Gurgaon', 'Noida', 'Chandigarh', 'Guwahati'
];

const MALE_NAMES = [
  'Arjun Malhotra', 'Vikram Singh', 'Rohan Mehra', 'Sanjay Gupta', 'Amitabh Dixit',
  'Rahul Kapoor', 'Karan Oberoi', 'Varun Dhawan', 'Siddharth Roy', 'Aditya Verma',
  'Vivek Sharma', 'Aakash Singhal', 'Sameer Iyer', 'Manish Pandey', 'Pranav Kulkarni',
  'Gautam Nair', 'Ishaan Batra', 'Kabir Sethi', 'Rishabh Goel', 'Abhishek Jain',
  'Mayank Saxena', 'Anuj Bhardwaj', 'Deepak Rana', 'Yash Mittal', 'Tushar Aggarwal'
];

const FEMALE_NAMES = [
  'Priya Sharma', 'Sneha Kapoor', 'Anjali Gupta', 'Rashmi Singh', 'Kavita Iyer',
  'Pooja Malhotra', 'Divya Mehra', 'Swati Verma', 'Neha Dixit', 'Shweta Roy',
  'Ritu Oberoi', 'Monika Singhal', 'Preeti Pandey', 'Kanika Batra', 'Tanuja Nair',
  'Shikha Sethi', 'Barkha Goel', 'Isha Mittal', 'Megha Aggarwal', 'Deepika Bhardwaj',
  'Aparna Saxena', 'Kriti Jain', 'Richa Rana', 'Sonal Singhal', 'Upasana Batra'
];

const BIOS = [
  "Casual explorer of life and logic. Just here for the vibes. ✨",
  "Techie by heart, foodie by soul. Let's find some authentic spots.",
  "Digital nomad currently based in India. Looking for real conversations.",
  "Avid reader, plant enthusiast, and minimal lifestyle advocate.",
  "Passionate about trekking and photography. Sunday sunsets are my favorite.",
  "Chasing coffee and dreams. Minimalist at heart.",
  "Design student looking for creative inspiration in every corner.",
  "Chef in training exploring the fusion of spices and modern aesthetics.",
  "Always down for a spontaneous trip to the hills. 🏔️",
  "Looking for the balance between screen time and green time.",
  "Writer and observer of urban shifts. Coffee is my fuel.",
  "Semi-pro chess player and full-time dreamer.",
  "Fitness enthusiast and health advocate. Wellness first.",
  "Searching for conversations that don't need a Wi-Fi connection.",
  "Art gallery curator with a soft spot for emerging talents."
];

// 📸 50+ FRESH UNIQUE UNPLASH IDs (Extracted via Browser)
const FRESH_IDS = [
  '1615501141174-66c9543a7bce', '1600430665436-d4ff685937eb', '1746193689655-1d7137bdd952', '1564638764498-03e232b71def',
  '1763709897268-af06bedbf8bf', '1717010882378-7bccc5b8fa17', '1770748034186-6d6e5738cddf', '1593135467441-a7bbbc51c835',
  '1761980958548-7babac83ef3d', '1772544797306-42ffcda5c63b', '1608101735268-d3e51740c771', '1739945118043-9c5cadb6b3ef',
  '1609961747042-2c1314179433', '1756573674821-a8f7f47ce6d9', '1746193690262-74fc471aa616', '1682827818521-f630ab2de84b',
  '1575474829493-c15d85db3a4d', '1603578011446-4e8969bcbe71', '1577878317861-2a54eb46ed42', '1565751303176-28a5b3cebc76',
  '1723820496824-a8ae9c19f404', '1725033489648-a819750348eb', '1639325722373-deb657d37510', '1709976613164-ce55b279c87b',
  '1696792989068-f75664a620dc', '1568096165578-ae344b476573', '1621130668430-e7794ba3d9dd', '1621960883434-e910537c8052',
  '1602675940931-78adda818a8a', '1558412023-9810e0c3f28b', '1741714297225-75e832afc951', '1560790465-817c5c01cb3a',
  '1749017923375-ade9c392cd2f', '1704088030734-96769c4593a2', '1663352633034-c3e2d612f22a', '1733737272150-84472c1fbf3a',
  '1607710577388-2b72a3788eb1', '1754972377187-53facfa2eb45', '1570676372087-468f8806f717', '1723820496377-922f36221b65',
  '1658045366823-26c861bb69f9', '1726310724280-0a4aa087032d', '1620149007761-66b41a9095eb', '1626376602887-abe90fc0985c',
  '1623591668430-b47452b66dd6', '1635152486512-548b3893d6e4', '1607081692245-419edffb5462', '1568096165457-c27365b37c3a',
  '1581665949850-74c776641311', '1648844495307-aa5b4b591822', '1650286549949-2cbcd1a25bad', '1645036915593-b4ed7e016b65',
  '1610767540785-96b4c65de306', '1629263824130-ff51977880a8', '1671823469756-1e64ab077acb', '1659463034333-b9f5bad5b78d'
];

async function uploadToCloudinary(id, name) {
  const imageUrl = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=600`;
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error("Source fetch failed");
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
    if (!data.secure_url) throw new Error("Cloudinary error");
    return data.secure_url;
  } catch (e) {
    console.error(`Incomplete for ${name}:`, e.message);
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

async function seedMassCasual() {
  console.log("🚀 STARTING MASSIVE CASUAL DESI REGISTRY EXPANSION (50 RECORDS)...");
  
  const allProfiles = [];

  // Generate Men (25)
  for (let i = 0; i < 25; i++) {
    const name = MALE_NAMES[i];
    console.log(`[MEN] ${i+1}/25 - Processing ${name}...`);
    const cloudinaryUrl = await uploadToCloudinary(FRESH_IDS[i], name);
    
    allProfiles.push({
      user_id: `dummy-m-40${i}`,
      full_name: name,
      role: 'man',
      city: CITIES[i % CITIES.length],
      date_of_birth: randomDOB(21, 35),
      bio: BIOS[i % BIOS.length],
      photos: JSON.stringify([cloudinaryUrl]),
      tokens: 600 + Math.floor(Math.random() * 3200),
      is_verified: 1,
      payment_status: 'APPROVED',
      onboarding_status: 'COMPLETED'
    });
  }

  // Generate Women (25)
  for (let i = 0; i < 25; i++) {
    const name = FEMALE_NAMES[i];
    console.log(`[WOMEN] ${i+1}/25 - Processing ${name}...`);
    const cloudinaryUrl = await uploadToCloudinary(FRESH_IDS[i + 25], name); // Offset by 25
    
    allProfiles.push({
      user_id: `dummy-w-40${i}`,
      full_name: name,
      role: 'woman',
      city: CITIES[(i + 7) % CITIES.length],
      date_of_birth: randomDOB(20, 31),
      bio: BIOS[(i + 5) % BIOS.length],
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

  console.log("\n✅ MASSIVE REGISTRY EXPANSION COMPLETE. 50 NEW LIVES CREATED.");
}

seedMassCasual();
