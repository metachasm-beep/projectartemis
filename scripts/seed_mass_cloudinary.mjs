/**
 * MATRIARCH SANCTUARY — Cloudinary Mass Seeder
 * ─────────────────────────────────────────────
 * 1. Collects all Unsplash URLs from existing dummy profiles (asp-*)
 * 2. Uploads unique images to Cloudinary (deduplicates by photo ID)
 * 3. Updates every dummy profile in Turso with CORS-safe Cloudinary URLs
 * 4. Inserts 20+ NEW richly detailed dummy woman profiles for the Gaze scroll
 *    with high-quality South Asian female portrait seeds
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.error("❌  Missing VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET in .env");
  process.exit(1);
}

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

// ─── High-quality female portrait Unsplash photo IDs for the Infinite Gaze ───
const WOMAN_PORTRAIT_IDS = [
  'photo-1494790108377-be9c29b29330', // Anjali-style portrait, warm tones
  'photo-1531746020798-e6953c6e8e04', // Studio quality, direct gaze
  'photo-1544005313-94ddf0286df2',     // Feminine, city backdrop
  'photo-1580489944761-15a19d654956', // Natural light portrait
  'photo-1438761681033-6461ffad8d80', // Outdoor urban editorial
  'photo-1517841905240-472988babdf9', // Sunlit window portrait
  'photo-1524504388940-b1c1722653e1', // Classic editorial
  'photo-1517365830460-955ce3ccd263', // Ethereal moody portrait
  'photo-1614680376408-81e91ffe3db7', // South Asian beauty close-up
  'photo-1654709579769-2a3f42b5e8f3', // Dark hair, dramatic lighting
  'photo-1598550880863-4e8aa3d0edb4', // Sophisticated, minimalist
  'photo-1523264653568-d3d4032d1476', // Vibrant palette
  'photo-1496360166961-10a51d5f367a', // Moody editorial dark tones
  'photo-1521577352947-9bb58764b69a', // Editorial fashion
  'photo-1507003211169-0a1dd7228f2d', // Candid natural
  'photo-1488426862026-3ee34a7d66df', // Portrait sunny bokeh
  'photo-1625469524786-fa5e5f4ab9e8', // Elegant traditional
  'photo-1603400521630-9f2de124b33b', // Cinematic composition
  'photo-1567532939604-b6b5b0db2604', // Bold and artistic
  'photo-1553514029-1318c9127859', // Pastel mood portrait
];

// ─── Rich male portrait IDs for existing asp-* man profiles ───
const MAN_PORTRAIT_IDS = [
  'photo-1506794778202-cad84cf45f1d', // Classic strong male portrait
  'photo-1560250097-0b93528c311a',    // Professional business
  'photo-1552374196-c4e7ffc6e126',    // Casual editorial
  'photo-1519085360753-af0119f7cbe7', // Corporate sophisticated
  'photo-1507003211169-0a1dd7228f2d', // Candid warm light
  'photo-1542909168-82c3e7fdca5c',    // Strong jaw editorial
  'photo-1522556189639-b150ed9c4330', // Dark tones, moody
  'photo-1501196351401-2021c2e5988b', // Urban lifestyle
  'photo-1528892952291-009c663ce843', // Smiling candid
  'photo-1512484776495-a09d92e87c3b', // Athletic look
  'photo-1539571696357-5a69c17a67c6', // Young professional
  'photo-1490312278390-ab6414fd3de2', // Sporty editorial
  'photo-1618077360395-f3068be8e001', // Modern young pro
  'photo-1520341280432-4749d4d7bcf9', // Casual intelligent
  'photo-1504257432389-52343af06ae3', // Street style editorial
  'photo-1508341591423-4347099e1f19', // Expressive portrait
  'photo-1472099645785-5658abf4ff4e', // Classic editorial  
  'photo-1492562080023-ab3db95bfbbce', // Brooding attractive
  'photo-1506803682981-6e718a9dd3ee',  // Lifestyle casual
  'photo-1504593811423-6dd665756598',  // Black and white drama
];

// ─── New dummy woman profiles to INSERT if not already in DB ───
const NEW_WOMAN_PROFILES = [
  { id: 'gaze-f01', name: 'Anika Sharma', city: 'South Delhi', age: 26, bio: 'Art curator by day, midnight poet by conviction.' },
  { id: 'gaze-f02', name: 'Zara Kapoor', city: 'Gurgaon', age: 24, bio: 'High-frequency trader. Collects Basquiat prints and solitude.' },
  { id: 'gaze-f03', name: 'Isha Malhotra', city: 'Bandra, Mumbai', age: 28, bio: 'Documentary filmmaker. Fluent in three languages and silence.' },
  { id: 'gaze-f04', name: 'Kavya Nair', city: 'Indiranagar, Bangalore', age: 27, bio: 'Neuroscientist. Believes chemistry is both science and seduction.' },
  { id: 'gaze-f05', name: 'Priya Verma', city: 'South Delhi', age: 25, bio: 'Startup founder. Runs on black coffee and strategic clarity.' },
  { id: 'gaze-f06', name: 'Alara Joshi', city: 'Connaught Place', age: 29, bio: 'Architectural photographer. Lives in symmetry and raw edges.' },
  { id: 'gaze-f07', name: 'Diya Rao', city: 'Gurgaon', age: 23, bio: 'Jazz pianist. Reads Rumi at 3am.' },
  { id: 'gaze-f08', name: 'Simran Bedi', city: 'Chandigarh', age: 26, bio: 'Sports psychologist. Broke two national records at 21.' },
  { id: 'gaze-f09', name: 'Rhea Menon', city: 'Kochi', age: 27, bio: 'Marine biologist who believes depth is always relative.' },
  { id: 'gaze-f10', name: 'Tara Singh', city: 'North Delhi', age: 28, bio: 'Policy researcher. Argues for sport. Loves unconditionally.' },
  { id: 'gaze-f11', name: 'Meera Iyer', city: 'Chennai', age: 24, bio: 'Classical Bharatanatyam dancer. Modern in every other dimension.' },
  { id: 'gaze-f12', name: 'Aditi Chatterjee', city: 'Kolkata', age: 26, bio: 'Graphic novelist. Hand-letters her own captions.' },
  { id: 'gaze-f13', name: 'Nora Ahmed', city: 'Gurgaon', age: 25, bio: 'Investment banker. Weekend mountaineer. Zero tolerance for small talk.' },
  { id: 'gaze-f14', name: 'Piya Rangarajan', city: 'South Delhi', age: 29, bio: 'Surgeon. Quiet authority.' },
  { id: 'gaze-f15', name: 'Leila Baig', city: 'Bandra, Mumbai', age: 27, bio: 'Fashion designer who refuses to compromise the cut.' },
];

// ─── Helpers ───
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function uploadToCloudinary(unsplashId) {
  const sourceUrl = `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&q=85&w=900`;
  
  const formData = new FormData();
  formData.append('file', sourceUrl);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'matriarch_profiles');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${unsplashId}: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.secure_url;
}

async function run() {
  console.log('\n🌹 MATRIARCH SANCTUARY — Cloudinary Mass Seeder\n');
  
  // ─── STEP 1: Fetch existing profiles from DB ───
  console.log('📡 Fetching profiles from Turso...');
  const result = await turso.execute("SELECT user_id, full_name, role, photos FROM profiles ORDER BY created_at DESC");
  const profiles = result.rows;

  const womanProfiles = profiles.filter(p => p.role === 'woman');
  const manProfiles = profiles.filter(p => p.role === 'man' && String(p.user_id).startsWith('asp-'));
  
  console.log(`Found ${womanProfiles.length} woman profiles, ${manProfiles.length} dummy man profiles\n`);

  // ─── STEP 2: Upload all unique WOMAN portrait IDs to Cloudinary ───
  console.log('💫 Uploading WOMAN portraits to Cloudinary...');
  const womanCloudUrls = [];
  for (const id of WOMAN_PORTRAIT_IDS) {
    try {
      const url = await uploadToCloudinary(id);
      womanCloudUrls.push(url);
      console.log(`  ✅ ${id.slice(6, 26)}... → ${url.split('/').pop()}`);
      await sleep(300); // Rate limit safety
    } catch (e) {
      console.warn(`  ⚠️  Skipping ${id}: ${e.message}`);
    }
  }

  // ─── STEP 3: Upload MAN portrait IDs to Cloudinary ───
  console.log('\n👤 Uploading MAN portraits to Cloudinary...');
  const manCloudUrls = [];
  for (const id of MAN_PORTRAIT_IDS) {
    try {
      const url = await uploadToCloudinary(id);
      manCloudUrls.push(url);
      console.log(`  ✅ ${id.slice(6, 26)}... → ${url.split('/').pop()}`);
      await sleep(300);
    } catch (e) {
      console.warn(`  ⚠️  Skipping ${id}: ${e.message}`);
    }
  }

  if (womanCloudUrls.length === 0 && manCloudUrls.length === 0) {
    console.error('❌  No images uploaded. Aborting.');
    process.exit(1);
  }

  console.log(`\n🎯 Uploaded ${womanCloudUrls.length} woman portraits, ${manCloudUrls.length} man portraits to Cloudinary.`);

  // ─── STEP 4: Update existing woman profiles ───
  console.log('\n🪞 Updating existing woman profiles with Cloudinary URLs...');
  let wi = 0;
  for (const profile of womanProfiles) {
    const url = womanCloudUrls[wi % womanCloudUrls.length];
    await turso.execute({
      sql: "UPDATE profiles SET photos = ? WHERE user_id = ?",
      args: [JSON.stringify([url]), profile.user_id]
    });
    console.log(`  ✅ ${profile.full_name} → ${url.split('/').pop()}`);
    wi++;
  }

  // ─── STEP 5: Update existing man dummy profiles ───
  console.log('\n🔱 Updating dummy man profiles with Cloudinary URLs...');
  let mi = 0;
  for (const profile of manProfiles) {
    // Give each 2-3 photos but all from Cloudinary  
    const url1 = manCloudUrls[mi % manCloudUrls.length];
    const url2 = manCloudUrls[(mi + 1) % manCloudUrls.length];
    await turso.execute({
      sql: "UPDATE profiles SET photos = ? WHERE user_id = ?",
      args: [JSON.stringify([url1, url2]), profile.user_id]
    });
    console.log(`  ✅ ${profile.full_name} → updated with 2 Cloudinary images`);
    mi++;
  }

  // ─── STEP 6: Insert NEW rich woman profiles for the Gaze scroll ───
  console.log('\n✨ Inserting new Gaze profiles (woman)...');
  const now = new Date().toISOString();
  let inserted = 0;

  for (let i = 0; i < NEW_WOMAN_PROFILES.length; i++) {
    const p = NEW_WOMAN_PROFILES[i];
    
    // Check if already exists
    const check = await turso.execute({
      sql: "SELECT user_id FROM profiles WHERE user_id = ?",
      args: [p.id]
    });
    if (check.rows.length > 0) {
      console.log(`  ⏭️  ${p.name} already exists, updating photos...`);
      const url = womanCloudUrls[i % womanCloudUrls.length];
      await turso.execute({
        sql: "UPDATE profiles SET photos = ? WHERE user_id = ?",
        args: [JSON.stringify([url]), p.id]
      });
      continue;
    }

    const photoUrl = womanCloudUrls[i % womanCloudUrls.length];
    const photoUrl2 = womanCloudUrls[(i + 3) % womanCloudUrls.length];

    await turso.execute({
      sql: `INSERT INTO profiles (
        user_id, full_name, role, age, city, bio, 
        photos, hobbies, is_verified, is_active,
        tokens, rank_score, absolute_rank,
        created_at, updated_at
      ) VALUES (?, ?, 'woman', ?, ?, ?, ?, '[]', 1, 1, 0, 0, 0, ?, ?)`,
      args: [
        p.id, p.name, p.age, p.city, p.bio,
        JSON.stringify([photoUrl, photoUrl2]),
        now, now
      ]
    });
    console.log(`  ✅ Inserted: ${p.name} (${p.city})`);
    inserted++;
  }

  // ─── STEP 7: Final summary ───
  const finalCount = await turso.execute("SELECT COUNT(*) as count FROM profiles WHERE role = 'woman'");
  const finalMenCount = await turso.execute("SELECT COUNT(*) as count FROM profiles WHERE role = 'man'");
  
  console.log('\n═══════════════════════════════════════════');
  console.log('🌹 SANCTUARY SEEDING COMPLETE');
  console.log(`   Woman profiles: ${finalCount.rows[0].count}`);
  console.log(`   Man profiles:   ${finalMenCount.rows[0].count}`);
  console.log(`   New inserted:   ${inserted}`);
  console.log(`   All photos on Cloudinary CDN`);
  console.log('═══════════════════════════════════════════\n');
}

run().catch(e => {
  console.error('❌ Seeder crashed:', e);
  process.exit(1);
});
