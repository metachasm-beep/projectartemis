import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(imageUrl) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
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
    return data.secure_url;
  } catch (e) {
    console.error(`Cloudinary error:`, e.message);
    return null;
  }
}

async function repairGoogleAvatars() {
  console.log("🚀 STARTING REGISTRY AVATAR REPAIR (SOVEREIGN INGESTION)...");
  
  // Scans for raw Google, Twitter, or FB URLs that haven't been stored in our Cloudinary Sanctuary yet.
  const result = await turso.execute("SELECT user_id, full_name, photos FROM profiles WHERE (photos LIKE '%googleusercontent.com%' OR photos LIKE '%fbcdn.net%' OR photos LIKE '%twimg.com%') AND photos NOT LIKE '%res.cloudinary.com%'");
  const victims = result.rows;
  
  console.log(`Found ${victims.length} profiles requiring immediate ingestion.`);
  
  for (const victim of victims) {
    console.log(` - Processing ${victim.full_name} (${victim.user_id})...`);
    try {
      const photos = JSON.parse(victim.photos || '[]');
      const newPhotos = [];
      let updated = false;

      for (const url of photos) {
        if ((url.includes('googleusercontent.com') || url.includes('fbcdn.net') || url.includes('twimg.com')) && !url.includes('res.cloudinary.com')) {
          const proxiedUrl = await uploadToCloudinary(url);
          if (proxiedUrl) {
            newPhotos.push(proxiedUrl);
            updated = true;
          } else {
            newPhotos.push(url);
          }
        } else {
          newPhotos.push(url);
        }
      }

      if (updated) {
        await turso.execute({
          sql: "UPDATE profiles SET photos = ? WHERE user_id = ?",
          args: [JSON.stringify(newPhotos), victim.user_id]
        });
        console.log(` ✅ SUCCESS: Identity asset for ${victim.full_name} is now secured in the Sanctuary.`);
      }
    } catch (e) {
      console.error(` ❌ FAILURE: Could not secure assets for ${victim.full_name}:`, e.message);
    }
  }

  console.log("\n✅ REGISTRY AVATAR REPAIR COMPLETE.");
}

repairGoogleAvatars();
