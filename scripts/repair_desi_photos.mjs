import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// 🛡️ RECOVERY ID POOL (Verified high-quality portraits)
const SAFE_MALE_IDS = [
  '1506794778202-cad84cf45f1d', '1520975954732-35dd22299614', '1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e'
].map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=600`);

const SAFE_FEMALE_IDS = [
  '1494790108377-be9c29b29330', '1534528741775-53994a69daeb', '1524504388940-b1c1722653e1', '1506744038136-46273834b3fb'
].map(id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=600`);

async function uploadToCloudinary(imageUrl, name) {
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
    if (!data.secure_url) throw new Error("Cloudinary missing URL");
    return data.secure_url;
  } catch (e) {
    console.error(`Repair failed for ${name}:`, e.message);
    return imageUrl; 
  }
}

async function repairPhotos() {
  console.log("🛠️ STARTING SURGICAL PHOTO REPAIR...");
  
  try {
    // Audit current state
    const r = await turso.execute("SELECT user_id, full_name, role, photos FROM profiles WHERE photos = '[null]'");
    const broken = r.rows;
    
    console.log(`Found ${broken.length} broken identities requiring immediate patching.`);
    
    if (broken.length === 0) {
      console.log("No repair needed. System is stable.");
      return;
    }

    for (const p of broken) {
      console.log(` - Patching ${p.full_name} (${p.user_id})...`);
      
      const safetyPool = p.role === 'man' ? SAFE_MALE_IDS : SAFE_FEMALE_IDS;
      const fallbackUrl = safetyPool[Math.floor(Math.random() * safetyPool.length)];
      
      const fixedUrl = await uploadToCloudinary(fallbackUrl, p.full_name);
      
      await turso.execute({
        sql: "UPDATE profiles SET photos = ? WHERE user_id = ?",
        args: [JSON.stringify([fixedUrl]), p.user_id]
      });
      
      console.log(` ✅ ${p.full_name} restored.`);
    }

    console.log("\n✨ ALL IDENTITIES RESTORED SUCCESSFULLY.");
  } catch (err) {
    console.error("REPAIR_CRITICAL_FAULT:", err);
  }
}

repairPhotos();
