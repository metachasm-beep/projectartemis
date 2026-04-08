import { createClient } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid';

const turso = createClient({
  url: "libsql://matriarch-metachasm-beep.aws-ap-south-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzUzMjAzMzIsImlkIjoiMDE5ZDU5NTMtYzAwMS03YjhkLTkzZDYtZDM3YzMzN2EzMDVkIiwicmlkIjoiN2IyY2ExMzctZmU4NC00YTQ5LWJiZjctYWYyODQzZWIxNDlmIn0.7PIfrrat-NpZDA7p3Ewsku2DtNuMwvKsGpHhQTp43i06mh44NLj4a5uaL69lPwocH-VyXBc6cqw7ccO0AduQAg"
});

const cities = [
  'Mumbai', 'New Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 
  'Chandigarh', 'Indore', 'Coimbatore', 'Kochi', 'Surat'
];

const firstNames = [
  'Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Sai', 'Aryan', 'Ishaan', 'Kabir', 'Rohan', 'Siddharth',
  'Dev', 'Karan', 'Abhishek', 'Pranav', 'Varun', 'Yash', 'Zayaan', 'Rishi', 'Ojas', 'Neil',
  'Advait', 'Anay', 'Reyansh', 'Ayaan', 'Vedant', 'Atharv', 'Shreyas', 'Hrithik', 'Armaan', 'Zaid',
  'Mehul', 'Tushar', 'Rupam', 'Aniruddh', 'Bhavin', 'Chinmay', 'Darshan', 'Eshan', 'Farhan', 'Gautam'
];

const lastNames = [
  'Singh', 'Mehra', 'Varma', 'Malhotra', 'Advani', 'Kanth', 'Goel', 'Kapoor', 'Reddy', 'Jain',
  'Gupta', 'Das', 'Rao', 'Roy', 'Joshi', 'Chopra', 'Khan', 'Khanna', 'Vats', 'Patel',
  'Mishra', 'Sharma', 'Iyer', 'Menon', 'Bose', 'Chatterjee', 'Agarwal', 'Shah', 'Pandey', 'Desai'
];

const occupations = [
  'AI Logistics Founder', 'Investment Banker', 'Architectural Designer', 'Data Scientist',
  'Corporate Lawyer', 'Software Engineer', 'Real Estate Developer', 'Policy Researcher',
  'Automotive Engineer', 'Art Gallery Owner', 'Neurosurgeon', 'Marine Biologist',
  'Hedge Fund Manager', 'Journalist', 'Philosopher', 'Diamond Merchant', 'Digital Nomad',
  'Classical Poet', 'Private Equity Principal', 'Textile Industrialist', 'Commercial Pilot',
  'Chef de Cuisine', 'Fashion Designer', 'Product Lead', 'Venture Capitalist', 'Luxury Interior Designer'
];

const educations = [
  'IIT Delhi', 'IIM Ahmedabad', 'Stanford University', 'Oxford', 'ISB Hyderabad',
  'BITS Pilani', 'London School of Economics', 'Harvard Business School', 'MIT', 'National Law School',
  'Doon School Alumnus', 'St. Stephens College'
];

const bios = [
  "Driven by excellence and architectural symmetry. Seeking a partner who values strength and intellect.",
  "Founder and visionary. I believe in high-stakes living and deep-rooted traditions.",
  "Exploring the intersection of technology and humanity. Seeking a resonance of the mind.",
  "Guided by the principles of the Sovereign. Legacy is built through action.",
  "A life of strategy and precision. Looking for my ultimate counterpart.",
  "Art, equity, and the pursuit of the sublime. Seeking a soul with aesthetic depth.",
  "World traveler with a local heart. Building bridges between cultures and ideas.",
  "Dedicated to the craft of surgery and the art of living well.",
  "Precision engineering in life and career. Seeking harmony in the chaos.",
  "Refined taste and unmatched ambition. The future belongs to those who dare.",
  "Collector of moments and vintage horology. Looking for an authentic connection.",
  "Building the next generation of logistics. High intensity, high rewards."
];

// Curated list of Desi/South Asian male portraits from Unsplash
const photoPool = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", // Man portrait
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d", // Male model
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbbce", // Smiling man
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6", // Man in sweater
  "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126", // Man portrait
  "https://images.unsplash.com/photo-1531384441138-2736e62e0919", // Corporate man
  "https://images.unsplash.com/photo-1560250097-0b93528c311a", // Businessman
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", // Casual man
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7", // Office man
  "https://images.unsplash.com/photo-1522556189639-b150ed9c4330", // Young man
  "https://images.unsplash.com/photo-1504257432389-52343af06ae3", // Man with glasses
  "https://images.unsplash.com/photo-1512484776495-a09d92e87c3b", // Artistic man
  "https://images.unsplash.com/photo-1531123414780-f74242c2b052", // Desi looking man
  "https://images.unsplash.com/photo-1501196351401-2021c2e5988b", // Man in sun
  "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee", // Man thinking
  "https://images.unsplash.com/photo-1490312278390-ab6414fd3de2", // Man in nature
  "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9", // Stylish man
  "https://images.unsplash.com/photo-1528892952291-009c663ce843", // Portrait
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c", // Close up
  "https://images.unsplash.com/photo-1618077360395-f3068be8e001"  // Desi man in shirt
];

async function seed() {
  console.log("Beginning the Ritual of 200 Aspirants...");
  
  const profiles = [];
  for (let i = 0; i < 200; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const occupation = occupations[Math.floor(Math.random() * occupations.length)];
    const education = educations[Math.floor(Math.random() * educations.length)];
    const bio = bios[Math.floor(Math.random() * bios.length)];
    const age = Math.floor(Math.random() * 19) + 21; // 21 to 39
    const dob = new Date(new Date().getFullYear() - age, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0];
    
    // Select 1-3 random photos from pool
    const numPhotos = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...photoPool].sort(() => 0.5 - Math.random());
    const photos = shuffled.slice(0, numPhotos).map(url => `${url}?q=80&w=1287&auto=format&fit=crop`);

    profiles.push({
      user_id: `asp-${uuidv4()}`,
      full_name: `${firstName} ${lastName}`,
      role: 'man',
      date_of_birth: dob,
      bio,
      city,
      occupation,
      education,
      height: Math.floor(Math.random() * 30) + 165, // 165 to 195 cm
      photos: JSON.stringify(photos),
      is_verified: Math.random() < 0.2 ? 1 : 0,
      rank_score: Math.floor(Math.random() * 10000), // Random competitive score
      tokens: Math.floor(Math.random() * 5000),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      onboarding_status: 'COMPLETED'
    });
  }

  // Batch insert to avoid 200 round trips
  const batchSize = 50;
  for (let i = 0; i < profiles.length; i += batchSize) {
    const chunk = profiles.slice(i, i + batchSize);
    const query = `
      INSERT INTO profiles (
        user_id, full_name, role, date_of_birth, bio, city, occupation, education, 
        height, photos, is_verified, rank_score, tokens, created_at, onboarding_status
      ) VALUES ${chunk.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ')}
    `;
    const params = chunk.flatMap(p => [
      p.user_id, p.full_name, p.role, p.date_of_birth, p.bio, p.city, p.occupation, p.education,
      p.height, p.photos, p.is_verified, p.rank_score, p.tokens, p.created_at, p.onboarding_status
    ]);
    
    console.log(`Summoning batch ${i / batchSize + 1}...`);
    await turso.execute(query, params);
  }

  console.log("The 200 Aspirants have been manifested.");
}

seed().catch(err => {
  console.error("Ritual failed:", err);
  process.exit(1);
});
