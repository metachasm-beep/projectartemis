/**
 * MATRIARCH — Insert New Gaze Woman Profiles
 * Uses correct schema: date_of_birth, occupation, etc.
 * Cloudinary images already uploaded; this just seeds DB rows.
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

// Already uploaded Cloudinary woman portrait URLs — copy from seeder output
const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;

// Retrieve all uploaded woman images from Cloudinary by querying DB for existing URLs
// then rotate across them for new profiles
const existingWomen = await turso.execute("SELECT photos FROM profiles WHERE role = 'woman' AND photos LIKE '%cloudinary%'");
const cloudinaryUrls = [];
for (const row of existingWomen.rows) {
  try {
    const parsed = JSON.parse(row.photos);
    if (Array.isArray(parsed)) cloudinaryUrls.push(...parsed.filter(u => u.includes('cloudinary')));
  } catch {}
}

// Also add directly known uploaded URLs (from the seeder run)
// Fallback Cloudinary URLs if the DB query returns nothing
const FALLBACK_WOMAN_URLS = [
  "https://res.cloudinary.com/dsmbhnjg5/image/upload/v1776022950/matriarch_profiles/fzejcdp16tsszoqvz7xq.jpg",
  "https://res.cloudinary.com/dsmbhnjg5/image/upload/v1776022951/matriarch_profiles/qcg6eyjz7lquygxareva.jpg",
  "https://res.cloudinary.com/dsmbhnjg5/image/upload/v1776022952/matriarch_profiles/kcbyrutxyijvjijou37w.jpg",
  "https://res.cloudinary.com/dsmbhnjg5/image/upload/v1776022953/matriarch_profiles/hejcujlhil2aukl8filj.jpg",
  "https://res.cloudinary.com/dsmbhnjg5/image/upload/v1776022954/matriarch_profiles/b9diveydkf6omiiltvyi.jpg",
  "https://res.cloudinary.com/dsmbhnjg5/image/upload/v1776022955/matriarch_profiles/c9a1wrwjcahii3wge49o.jpg",
  "https://res.cloudinary.com/dsmbhnjg5/image/upload/v1776022956/matriarch_profiles/nrrk1hgm7kdatux2rhmw.jpg"
];

const ALL_WOMAN_CLOUD_URLS = [...new Set([
  ...cloudinaryUrls,
  ...FALLBACK_WOMAN_URLS
])];

console.log(`Found ${ALL_WOMAN_CLOUD_URLS.length} Cloudinary woman portrait URLs to rotate from.`);

const NEW_WOMAN_PROFILES = [
  { id: 'gaze-f01', name: 'Anika Sharma',      city: 'South Delhi',       dob: '1999-03-14', bio: 'Art curator by day, midnight poet by conviction.', occupation: 'Curator', education: "Master's" },
  { id: 'gaze-f02', name: 'Zara Kapoor',       city: 'Gurgaon',           dob: '2001-07-22', bio: 'High-frequency trader. Collects Basquiat prints and solitude.', occupation: 'Finance', education: 'MBA' },
  { id: 'gaze-f03', name: 'Isha Malhotra',     city: 'Bandra, Mumbai',    dob: '1997-11-05', bio: 'Documentary filmmaker. Fluent in three languages and silence.', occupation: 'Filmmaker', education: 'MFA' },
  { id: 'gaze-f04', name: 'Kavya Nair',        city: 'Indiranagar, Bangalore', dob: '1998-09-18', bio: 'Neuroscientist. Believes chemistry is both science and seduction.', occupation: 'Researcher', education: 'PhD' },
  { id: 'gaze-f05', name: 'Priya Verma',       city: 'South Delhi',       dob: '2000-04-02', bio: 'Startup founder. Runs on black coffee and strategic clarity.', occupation: 'Entrepreneur', education: 'BTech' },
  { id: 'gaze-f06', name: 'Alara Joshi',       city: 'Connaught Place',   dob: '1996-12-30', bio: 'Architectural photographer. Lives in symmetry and raw edges.', occupation: 'Photographer', education: "Bachelor's" },
  { id: 'gaze-f07', name: 'Diya Rao',          city: 'Gurgaon',           dob: '2002-01-17', bio: 'Jazz pianist. Reads Rumi at 3am.', occupation: 'Musician', education: "Bachelor's" },
  { id: 'gaze-f08', name: 'Simran Bedi',       city: 'Chandigarh',        dob: '1999-06-08', bio: 'Sports psychologist. Broke two national records at 21.', occupation: 'Psychologist', education: "Master's" },
  { id: 'gaze-f09', name: 'Rhea Menon',        city: 'Kochi',             dob: '1998-02-25', bio: 'Marine biologist who believes depth is always relative.', occupation: 'Scientist', education: 'PhD' },
  { id: 'gaze-f10', name: 'Tara Singh',        city: 'North Delhi',       dob: '1997-08-11', bio: 'Policy researcher. Argues for sport. Loves unconditionally.', occupation: 'Researcher', education: "Master's" },
  { id: 'gaze-f11', name: 'Meera Iyer',        city: 'Chennai',           dob: '2001-05-20', bio: 'Classical Bharatanatyam dancer. Modern in every other dimension.', occupation: 'Dancer', education: "Bachelor's" },
  { id: 'gaze-f12', name: 'Aditi Chatterjee',  city: 'Kolkata',           dob: '1999-10-03', bio: 'Graphic novelist. Hand-letters her own captions.', occupation: 'Artist', education: 'BFA' },
  { id: 'gaze-f13', name: 'Nora Ahmed',        city: 'Gurgaon',           dob: '2000-07-15', bio: 'Investment banker. Weekend mountaineer. Zero tolerance for small talk.', occupation: 'Banker', education: 'MBA' },
  { id: 'gaze-f14', name: 'Piya Rangarajan',   city: 'South Delhi',       dob: '1996-04-27', bio: 'Surgeon. Quiet authority.', occupation: 'Doctor', education: 'MBBS MD' },
  { id: 'gaze-f15', name: 'Leila Baig',        city: 'Bandra, Mumbai',    dob: '1998-09-09', bio: 'Fashion designer who refuses to compromise the cut.', occupation: 'Designer', education: "Bachelor's" },
  { id: 'gaze-f16', name: 'Ananya Pillai',     city: 'South Delhi',       dob: '1999-02-14', bio: 'Investment associate. Speaks five languages. Reads seven.', occupation: 'Finance', education: 'CFA' },
  { id: 'gaze-f17', name: 'Shruti Bose',       city: 'Gurgaon',           dob: '2001-11-30', bio: 'Clinical psychologist. Holds silence as a first language.', occupation: 'Psychologist', education: "Master's" },
  { id: 'gaze-f18', name: 'Keya Malhotra',     city: 'Vasant Kunj',       dob: '1997-06-19', bio: 'Architect. Builds in concrete, thinks in light.', occupation: 'Architect', education: 'B.Arch' },
  { id: 'gaze-f19', name: 'Nandita Arora',     city: 'Pune',              dob: '2000-03-08', bio: 'Data scientist. Turns noise into signal.', occupation: 'Tech', education: 'BTech' },
  { id: 'gaze-f20', name: 'Riya Sinha',        city: 'Defence Colony',    dob: '1998-12-01', bio: 'Lawyer. Makes iron-clad arguments in silk.', occupation: 'Lawyer', education: 'LLB' },
];

const now = new Date().toISOString();
let inserted = 0;
let updated = 0;

for (let i = 0; i < NEW_WOMAN_PROFILES.length; i++) {
  const p = NEW_WOMAN_PROFILES[i];

  const check = await turso.execute({
    sql: "SELECT user_id FROM profiles WHERE user_id = ?",
    args: [p.id]
  });

  const photo1 = ALL_WOMAN_CLOUD_URLS[i % ALL_WOMAN_CLOUD_URLS.length];
  const photo2 = ALL_WOMAN_CLOUD_URLS[(i + 4) % ALL_WOMAN_CLOUD_URLS.length];
  const photosJson = JSON.stringify([photo1, photo2].filter(Boolean));

  if (check.rows.length > 0) {
    await turso.execute({
      sql: "UPDATE profiles SET photos = ?, full_name = ?, city = ?, bio = ?, occupation = ?, onboarding_status = 'COMPLETED', is_verified = 1, updated_at = ? WHERE user_id = ?",
      args: [photosJson, p.name, p.city, p.bio, p.occupation, now, p.id]
    });
    console.log(`  ↺  Updated: ${p.name}`);
    updated++;
    continue;
  }

  await turso.execute({
    sql: `INSERT INTO profiles (
      user_id, full_name, role, date_of_birth, bio,
      city, occupation, education, photos, hobbies,
      is_verified, tokens, rank_score, absolute_rank,
      profile_strength, onboarding_status,
      created_at, updated_at
    ) VALUES (?, ?, 'woman', ?, ?, ?, ?, ?, ?, '[]', 1, 0, 0, 0, 100, 'COMPLETED', ?, ?)`,
    args: [
      p.id, p.name, p.dob, p.bio,
      p.city, p.occupation, p.education,
      photosJson, now, now
    ]
  });
  console.log(`  ✅ Inserted: ${p.name} (${p.city})`);
  inserted++;
}

const finalCount = await turso.execute("SELECT COUNT(*) as count FROM profiles WHERE role = 'woman'");
console.log(`\n✅ Done. Inserted ${inserted}, Updated ${updated}. Total woman profiles: ${finalCount.rows[0].count}`);
