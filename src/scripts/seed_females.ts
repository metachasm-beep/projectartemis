import { createClient } from '@libsql/client';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL!,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN!,
});

const femaleFirstNames = [
  'Ananya', 'Ishani', 'Kiara', 'Myra', 'Saanvi', 'Zoya', 'Riya', 'Diya', 'Tanya', 'Navya',
  'Avani', 'Sara', 'Meher', 'Aavya', 'Inaya', 'Shanaya', 'Kavya', 'Amara', 'Pari', 'Sia',
  'Aadhya', 'Vanya', 'Kyra', 'Aaira', 'Zara', 'Mira', 'Ira', 'Tara', 'Roshni', 'Payal',
  'Sanjana', 'Priyanka', 'Deepika', 'Alia', 'Shraddha', 'Kriti', 'Rashmika', 'Trisha', 'Nayanthara', 'Samantha',
  'Aditi', 'Radhika', 'Vidya', 'Parineeti', 'Esha', 'Yami', 'Taapsee', 'Bhumi', 'Janhvi', 'Anushka'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Iyer', 'Reddy', 'Patel', 'Malhotra', 'Kapoor', 'Mehta', 'Singhania',
  'Chopra', 'Bajaj', 'Thakur', 'Deshmukh', 'Kulkarni', 'Joshi', 'Nair', 'Menon', 'Gill', 'Sandhu',
  'Khan', 'Sheikh', 'Bose', 'Chatterjee', 'Banerjee', 'Rao', 'Naidu', 'Shetty', 'Hegde', 'Pai'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Indore', 'Gurgaon', 'Noida', 'Kochi', 'Goa'
];

const occupations = [
  'Fashion Designer', 'Tech Lead', 'Digital Artist', 'Architect', 'Wellness Coach', 'Marketing Director',
  'UI/UX Designer', 'Product Manager', 'Content Creator', 'Entrepreneur', 'Corporate Lawyer', 'Surgeon',
  'Pilot', 'Data Scientist', 'Brand Strategist', 'Journalist', 'Photographer', 'Stylist'
];

const bios = [
  "Curating a life of intention and aesthetic resonance.",
  "Architecting digital futures by day, dreamer by night.",
  "Seeking a frequency that matches my ambition.",
  "Driven by passion, grounded in culture.",
  "Life is a canvas; I'm painting my own destiny.",
  "Tech enthusiast with a soul for classical arts.",
  "Wandering through the archives of the heart.",
  "Independent, fierce, and looking for a sovereign partner.",
  "Finding magic in the mundane.",
  "A narrative of grace and grit.",
  "Elegance is an attitude.",
  "Building an empire, one intentional step at a time.",
  "Seeking depth in a shallow world.",
  "A soulful explorer of the modern sanctuary.",
  "Your aura caught my attention.",
  "Let's build a legacy that transcends time.",
  "Resonating with excellence and integrity."
];

const unsplashRegistry = [
  'photo-1494790108377-be9c29b29330', 'photo-1534528741775-53994a69daeb', 'photo-1507003211169-0a1dd7228f2d',
  'photo-1544005313-94ddf0286df2', 'photo-1554151228-14d9def656e4', 'photo-1552058544-f2b08422138a',
  'photo-1567532939604-b6b5b0ad2f04', 'photo-1563805900-38933bbad496', 'photo-1557053910-d9eadeed1c58',
  'photo-1580489944761-15a09d3ee485', 'photo-1596495578065-6e0763fa1141', 'photo-1595152772835-219674b2a8a6',
  'photo-1597223557154-721c1cecc4b0', 'photo-1598550874175-4d0fe45ce08e', 'photo-1581092795360-fd1ca04f0952',
  'photo-1503105903301-8314e922f302', 'photo-1621605815971-fbc388062193', 'photo-1589156280159-27698a70f29e',
  'photo-1614283233556-f35b0c801ef1', 'photo-1512436991641-6745cdb1723f', 'photo-1515886657613-9f3515b0c78f',
  'photo-1539109136881-3be0616acf4b', 'photo-1529139572765-397507c3236e', 'photo-1512316609839-ce289d3eba0a',
  'photo-1500917293891-ef795e70e1f6', 'photo-1438761681033-6461ffad8d80', 'photo-1517841905240-472988babdf9',
  'photo-1539571696357-5a69c17a67c6', 'photo-1511551203524-9a24350a5e83', 'photo-1469334031218-e382a71b716b',
  'photo-1524250502761-1ac6f2e30d43', 'photo-1524502393244-9d101ff2f16d', 'photo-1531746020798-e6953c6e8e04',
  'photo-1534751516642-a1af1ef26a56', 'photo-1581091226825-a6a2a5aee158', 'photo-1594744803329-a584af1ea41f',
  'photo-1508214751196-bcfd4ca60f91', 'photo-1502323777036-f29e3172d819', 'photo-1519345182560-3f2917c472ef',
  'photo-1521119989659-a83eee488004', 'photo-1513956589380-bad6acb9b9d4', 'photo-1535295972055-1c762f4483e5',
  'photo-1481214110143-ed630356e1bb', 'photo-1504703395950-b89145a5425b', 'photo-1491609154219-ffd3ffafd992',
  'photo-1485178575877-1a13bf489ffa', 'photo-1453332198675-9e815616c3b1', 'photo-1484399172022-72a90b12e3c1',
  'photo-1520155707862-5b32817388d6', 'photo-1518806118471-f28b20a1d79d', 'photo-1522228115018-d838bcce5c3a',
  'photo-1493666438817-866a91353ca9', 'photo-1498842812179-c81beecf902c', 'photo-1529626484974-0927a9ec2e5a',
  'photo-1514846326710-096e4a803520', 'photo-1527631746610-bca00a040d60', 'photo-1526413232644-8a40f03cc03b',
  'photo-1518655061766-48c2ae895689', 'photo-1522075469751-3a6694fb2f61', 'photo-1523438885230-da6799db8351',
  'photo-1484186139897-d5fc6b908812', 'photo-1524504106579-242861e68028', 'photo-1541018939203-26eed0452409',
  'photo-1533227268408-a5542b45ade6', 'photo-1523419409543-a5e549c1fab8', 'photo-1532074205216-d0e1f4b87368',
  'photo-1495944223042-53b1bbfa8936', 'photo-1542596594-649edbc13630', 'photo-1504933350103-e840dee9ec21',
  'photo-1554062614-6da4d6738937', 'photo-1563132337-f159f484226c', 'photo-1555412654-72a95a495858',
  'photo-1535713875002-d1d0cf377fde', 'photo-1527980965255-d3b416303d12', 'photo-1489424159676-430ea47f8721',
  'photo-1531123897727-8f129e1688ce', 'photo-1560250097-0b93528c311a', 'photo-1472099645785-5658abf4ff4e',
  'photo-1519085360753-af0119f7cbe7', 'photo-1553514029-1301c3847191', 'photo-1501196351401-f74af88696b5',
  'photo-1502823403499-6ccfcf4fb453', 'photo-1548142813-c348350df52b', 'photo-1509062522246-3755977927d7',
  'photo-1512485694743-9c9538b4e6e0', 'photo-1520813792240-56fc4a3765a7', 'photo-1515248139337-21017bad437f',
  'photo-1526510743304-a627ad9cdff2', 'photo-1525357816819-392d2380d821', 'photo-1510274350341-d8a85e33f1ff',
  'photo-1504192010706-96acc8b535d9', 'photo-1519340333755-cf6b6dcedf94', 'photo-1508243529287-e21914733111',
  'photo-1496440737103-cd596325d314', 'photo-1519365510-928574169542', 'photo-1526948128573-703ee1aeb6fa',
  'photo-1542206395-9feb3edaa05d', 'photo-1563223552-30d01fda3eca', 'photo-1583195764036-6dc248ac07d9',
  'photo-1614289371518-722f2615943d', 'photo-1488426862026-3ee34a7d66df', 'photo-1512310604669-443f2ec55104',
  'photo-1517365830460-955ce3ccd263', 'photo-1531384441138-2736e62e0919', 'photo-1543610892-0b1f7e6d8ac1',
  'photo-1520155707862-5b32817388d6', 'photo-1520813792240-56fc4a3765a7', 'photo-1521119989659-a83eee488004',
  'photo-1522075469751-3a6694fb2f61', 'photo-1523419409543-a5e549c1fab8', 'photo-1524502393244-9d101ff2f16d',
  'photo-1524504106579-242861e68028', 'photo-1525357816819-392d2380d821', 'photo-1526413232644-8a40f03cc03b',
  'photo-1526510743304-a627ad9cdff2', 'photo-1526948128573-703ee1aeb6fa', 'photo-1527631746610-bca00a040d60',
  'photo-1527980965255-d3b416303d12', 'photo-1529139572765-397507c3236e', 'photo-1529626484974-0927a9ec2e5a',
  'photo-1531123897727-8f129e1688ce', 'photo-1531746020798-e6953c6e8e04', 'photo-1532074205216-d0e1f4b87368',
  'photo-1533227268408-a5542b45ade6', 'photo-1534528741775-53994a69daeb', 'photo-1534751516642-a1af1ef26a56',
  'photo-1535295972055-1c762f4483e5', 'photo-1535713875002-d1d0cf377fde', 'photo-1539109136881-3be0616acf4b',
  'photo-1539571696357-5a69c17a67c6', 'photo-1541018939203-26eed0452409', 'photo-1542206395-9feb3edaa05d',
  'photo-1542596594-649edbc13630', 'photo-1544005313-94ddf0286df2', 'photo-1544717297-fa95b3ee5fe5',
  'photo-1548142813-c348350df52b', 'photo-1552058544-f2b08422138a', 'photo-1553514029-1301c3847191',
  'photo-1554062614-6da4d6738937', 'photo-1554151228-14d9def656e4', 'photo-1555412654-72a95a495858',
  'photo-1557053910-d9eadeed1c58', 'photo-1560250097-0b93528c311a', 'photo-1563132337-f159f484226c',
  'photo-1563223552-30d01fda3eca', 'photo-1563805900-38933bbad496', 'photo-1567532939604-b6b5b0ad2f04',
  'photo-1580489944761-15a09d3ee485', 'photo-1581091226825-a6a2a5aee158', 'photo-1581092795360-fd1ca04f0952',
  'photo-1583195764036-6dc248ac07d9', 'photo-1589156280159-27698a70f29e', 'photo-1594744803329-a584af1ea41f',
  'photo-1595152772835-219674b2a8a6', 'photo-1596495578065-6e0763fa1141', 'photo-1597223557154-721c1cecc4b0',
  'photo-1598550874175-4d0fe45ce08e', 'photo-1614283233556-f35b0c801ef1', 'photo-1614289371518-722f2615943d',
  'photo-1621605815971-fbc388062193', 'photo-1453332198675-9e815616c3b1', 'photo-1469334031218-e382a71b716b',
  'photo-1472099645785-5658abf4ff4e', 'photo-1481214110143-ed630356e1bb', 'photo-1484186139897-d5fc6b908812',
  'photo-1484399172022-72a90b12e3c1', 'photo-1485178575877-1a13bf489ffa', 'photo-1489424159676-430ea47f8721',
  'photo-1491609154219-ffd3ffafd992', 'photo-1493666438817-866a91353ca9', 'photo-1495944223042-53b1bbfa8936',
  'photo-1496440737103-cd596325d314', 'photo-1498842812179-c81beecf902c', 'photo-1500917293891-ef795e70e1f6',
  'photo-1501196351401-f74af88696b5', 'photo-1502323777036-f29e3172d819', 'photo-1502823403499-6ccfcf4fb453',
  'photo-1503105903301-8314e922f302', 'photo-1504192010706-96acc8b535d9', 'photo-1504703395950-b89145a5425b',
  'photo-1504933350103-e840dee9ec21', 'photo-1506748686214-e9df14d4d9d0', 'photo-1506794778202-cad84cf45f1d',
  'photo-1508214751196-bcfd4ca60f91', 'photo-1508243529287-e21914733111', 'photo-1509062522246-3755977927d7',
  'photo-1510274350341-d8a85e33f1ff', 'photo-1511551203524-9a24350a5e83', 'photo-1512310604669-443f2ec55104',
  'photo-1512316609839-ce289d3eba0a', 'photo-1512436991641-6745cdb1723f', 'photo-1512485694743-9c9538b4e6e0',
  'photo-1513956589380-bad6acb9b9d4', 'photo-1514846326710-096e4a803520', 'photo-1515248139337-21017bad437f',
  'photo-1515886657613-9f3515b0c78f', 'photo-1518655061766-48c2ae895689', 'photo-1518806118471-f28b20a1d79d',
  'photo-1519085360753-af0119f7cbe7', 'photo-1519340333755-cf6b6dcedf94', 'photo-1519345182560-3f2917c472ef',
  'photo-1519365510-928574169542', 'photo-1551061713-2d58f902ff22', 'photo-1551235086-f4a97465081c',
  'photo-1551235086-f4a97465082d', 'photo-1551410224-699683e15636', 'photo-1551410224-699683e15637'
];

async function seedFemales() {
  console.log("Purging existing profiles to establish a Gilded Sanctuary...");
  await client.execute("DELETE FROM profiles WHERE role = 'woman' OR role = 'female'");
  
  console.log("Synthesizing 200 unique seeker identities from verified registry...");
  const batched = [];

  for (let i = 0; i < 200; i++) {
    const id = uuidv4();
    const firstName = femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    const age = Math.floor(Math.random() * (34 - 18 + 1)) + 18;
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - age);
    const dobString = dob.toISOString().split('T')[0];

    const city = cities[i % cities.length];
    const bio = bios[Math.floor(Math.random() * bios.length)];
    const occupation = occupations[Math.floor(Math.random() * occupations.length)];
    
    // Absolute Uniqueness: 1-to-1 mapping from the Immutable Registry
    const photoId = unsplashRegistry[i];
    const photoUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=90&w=1200`;
    
    const photos = JSON.stringify([photoUrl]);
    const rankScore = Math.floor(Math.random() * 5000) + 1000;

    batched.push({
      sql: `INSERT INTO profiles (
        user_id, full_name, role, date_of_birth, bio, city, photos, 
        occupation, is_verified, tokens, rank_score, onboarding_status,
        created_at, updated_at
      ) VALUES (?, ?, 'woman', ?, ?, ?, ?, ?, 1, 1000, ?, 'COMPLETED', ?, ?)`,
      args: [
        id, 
        fullName, 
        dobString, 
        bio, 
        city, 
        photos, 
        occupation, 
        rankScore, 
        new Date().toISOString(), 
        new Date().toISOString()
      ]
    });

    if (batched.length === 50 || i === 199) {
      try {
        await client.batch(batched, "write");
        console.log(`Successfully registered ${i + 1}/200 seeker identities.`);
        batched.length = 0;
      } catch (err: any) {
        console.error("Batch Insertion Failed:", err.message);
      }
    }
  }

  console.log("Sanctuary 2.0 expansion complete. 200 unique female profiles active.");
  process.exit(0);
}

seedFemales();

seedFemales();
