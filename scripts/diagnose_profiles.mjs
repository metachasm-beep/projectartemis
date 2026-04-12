import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

// Check real women profiles (non gaze-* and non-dummy)
const women = await turso.execute(`
  SELECT user_id, full_name, photos, onboarding_status, is_verified, created_at 
  FROM profiles 
  WHERE role = 'woman'
  AND user_id NOT LIKE 'gaze-%'
  ORDER BY created_at DESC
`);

console.log('\n=== REAL WOMAN PROFILES ===');
women.rows.forEach(r => console.log(JSON.stringify({ id: r.user_id, name: r.full_name, onboarding: r.onboarding_status, verified: r.is_verified, photos: r.photos })));

// Check real men profiles
const men = await turso.execute(`
  SELECT user_id, full_name, photos, onboarding_status, is_verified, created_at 
  FROM profiles 
  WHERE role = 'man'
  AND user_id NOT LIKE 'asp-%'
  ORDER BY created_at DESC
`);

console.log('\n=== REAL MAN PROFILES ===');
men.rows.forEach(r => console.log(JSON.stringify({ id: r.user_id, name: r.full_name, onboarding: r.onboarding_status, verified: r.is_verified, photos: r.photos })));
