import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.VITE_TURSO_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const sql = `INSERT INTO profiles (user_id, full_name, age, bio, city, religion, photos, rank_boost_count, role, onboarding_status) VALUES 
('dummy_1', 'Arjun Sharma', 28, 'Seeking a resonance that transcends the digital expanse.', 'Mumbai', 'Hinduism', '["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"]', 85, 'man', 'COMPLETED'),
('dummy_2', 'Ishan Verma', 32, 'Architect of code, dreamer of ancient sanctuaries.', 'Bangalore', 'Sikhism', '["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800"]', 42, 'man', 'COMPLETED'),
('dummy_3', 'Kabir Gupta', 25, 'A soulful seeker of truth and intentional connection.', 'Delhi', 'Islam', '["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800"]', 12, 'man', 'COMPLETED'),
('dummy_4', 'Rohan Iyer', 30, 'Guided by integrity, fueled by curiosity.', 'Chennai', 'Hinduism', '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"]', 67, 'man', 'COMPLETED'),
('dummy_5', 'Arav Reddy', 27, 'Wandering through the archive, looking for my counterpart.', 'Hyderabad', 'Hinduism', '["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"]', 93, 'man', 'COMPLETED'),
('dummy_6', 'Vihaan Patel', 34, 'Believer in the power of shared silence.', 'Ahmedabad', 'Jainism', '["https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800"]', 5, 'man', 'COMPLETED'),
('dummy_7', 'Aditya Malhotra', 29, 'Looking for a partner to build something eternal.', 'Mumbai', 'Sikhism', '["https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800"]', 38, 'man', 'COMPLETED'),
('dummy_8', 'Reyansh Kapoor', 31, 'A seeker of clarity, resonance, and profound depth.', 'Pune', 'Hinduism', '["https://images.unsplash.com/photo-1463453091185-61582044d556?w=800"]', 55, 'man', 'COMPLETED'),
('dummy_9', 'Aryan Mehta', 26, 'In search of the Matriarch to lead my journey.', 'Jaipur', 'Hinduism', '["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800"]', 21, 'man', 'COMPLETED'),
('dummy_10', 'Krish Singhania', 35, 'Rooted in tradition, reaching for the stars.', 'Kolkata', 'Hinduism', '["https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800"]', 78, 'man', 'COMPLETED'),
('dummy_11', 'Zayan Chopra', 33, 'Finding beauty in the unwritten chapters.', 'Mumbai', 'Islam', '["https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800"]', 44, 'man', 'COMPLETED'),
('dummy_12', 'Ayan Bajaj', 24, 'A narrative in progress, seeking its missing melody.', 'Bangalore', 'Jainism', '["https://images.unsplash.com/photo-1520155707862-5b32817388d6?w=800"]', 10, 'man', 'COMPLETED'),
('dummy_13', 'Dev Thakur', 36, 'Intentional, authentic, and ready for resonance.', 'Delhi', 'Hinduism', '["https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=800"]', 88, 'man', 'COMPLETED'),
('dummy_14', 'Shaurya Deshmukh', 30, 'The archive is vast, but my direction is clear.', 'Pune', 'Hinduism', '["https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800"]', 61, 'man', 'COMPLETED'),
('dummy_15', 'Aarush Kulkarni', 27, 'A student of life, a seeker of the sovereign.', 'Hyderabad', 'Hinduism', '["https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800"]', 33, 'man', 'COMPLETED'),
('dummy_16', 'Vivaan Joshi', 31, 'Your presence is the frequency I’ve been waiting for.', 'Chennai', 'Hinduism', '["https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800"]', 15, 'man', 'COMPLETED'),
('dummy_17', 'Ansh Nair', 28, 'Building legacies, one intentional word at a time.', 'Kochi', 'Christianity', '["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"]', 72, 'man', 'COMPLETED'),
('dummy_18', 'Kian Menon', 29, 'The sanctuary is open; my soul is ready.', 'Kochi', 'Hinduism', '["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800"]', 49, 'man', 'COMPLETED'),
('dummy_19', 'Atharv Gill', 32, 'Deeply rooted, fiercely aspirational.', 'Chandigarh', 'Sikhism', '["https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800"]', 81, 'man', 'COMPLETED'),
('dummy_20', 'Siddharth Sandhu', 30, 'A collector of stories and seeker of profound truth.', 'Amritsar', 'Sikhism', '["https://images.unsplash.com/photo-1463453091185-61582044d556?w=800"]', 25, 'man', 'COMPLETED');`;

async function run() {
  try {
    await client.execute(sql);
    console.log("Sanctuary populated successfully.");
  } catch (e) {
    console.error("Population Ritual Failed:", e);
  }
}

run();
