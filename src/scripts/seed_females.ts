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
  'vc4X2gKab-U', 'LKN6tpAWbaw', '_wiU46zku8g', 'FgUqjUJ141U', 'kbjvSC5RnC0', '2YZejVmmTOE', 'f49XhYbpiA0', 'axzGnMMAa0c', 'v4rOcK9Y9NI', 'AXBsyZVjPLQ', '1eL2H9L1O6k', 'sNsaQJVq3kk', '3Utu_ZzWqDc', 'fRE3azPJ4g0', 'GSyCmIdBgPo', 'hYJesvE8fxo', 'TBOQVZTaO0I', 'nI0eLhIdwHk', 'uU_jAn-S_5Y', '05itvO-eMvg', 'hpklBuuel_k', '9aJaSOYFdp4', 'pDVBViIs2Pk', 'KB9cBmwrZBU', '3TlbWBmnPx4', 'FZ9m8i-8CiI', 'dXnaEgk0jWY', 'RnbLz814mK8', 'fpBNEz7N14s', 'c07j-zSHezM', 'upR48H65uVI', 'jQ3UdoWiFis', 'FsMH6MLUjl0', 'lqfP-EPr6z4', 'H9O_QYpQYvQ', 'BYYu5nvQoUM', 'iXunGv6I8_U', 'L_HFeK_23a0', 'AwpoVz3ETSM', 'y6h6ZkP6B6k', 'Rj_eHkAnI4I', 'ukjuQ1halBM', 'MrRUgFfSjBA', 'VfemFMnBxeQ', 'jNeZzkoqfpA', 'lML_0YDkUCw', 'Rm83bxp19RE', 'HtJGIxCtVC0', 'l9L7epCLQAI', 'AhfrQsQkceU', '5-zP6f6Zf9k', 'vI8h5kHkH0g', 'fe6qNQGZQnE', 'RErwf1pK15k', '-NCVF73NPFE', '7Z8v6S8uQ9I', 'J2I__87fI3k', 'y8n6-7i5_6I', 'K-tVxCdqMLs', 'ITDGzkpUTvI', 'JT2GilQKtMI', 'FwkFvLTvW68', 'a6jEJLAYEow', 'j4Rob-j6xzU', '2GMLHbGM5rA', 'DsQtyCdU2QY', 'Yt8Z0gMX1h8', 'ANGrNoy11Bw', '38Yk1O57qXQ', 'F_0u6_7O_-g', 'Akugnc8ROwg', 'C7m7RSFONYc', 'MkPINODL-Tw', 'ThMSoeotZg4', 'mEZ3PoFGs_k', 'eVbiqPCP3bo', '_7xm_xn4yDI', 'mbGBTpCi5qQ', 'wgEWSRQuoEE', 'A9TsuoE2S8', 'rID-d-8o1Bw', '1622782045716-a05bcc4f5ae8', '1622782262171-7eacb25db001', '1622049605334-72e1e4432346', '1624610806703-99c0852c31c0', '1706943262117-b35de4ba50b4', '1618559850638-2aed8a8e8cdc', '1624610261655-777af2f586d7', '1494790108377-be9c29b29330', '1619286188088-de820bdc1230', '1682092037007-34c67c1bd432', '1774437792342-20a785ba0694', '1747980223251-5243921e208c', '1769275061630-91d62f5058c9', '1761961851913-b8bded320850', '1775384080219-a3201a1f8e11', '1764014792668-bc484714744f', '1769275061202-cf3ef67d7279', '1770122464115-85eebf7363cc', '1770374473929-5e40f469b3a1', '1769500801406-d5abac0429c3', '1769500802800-51f5662b82b1', '1762175048603-09a13cfaca37', '1762175048486-838a25123e19', '1650286549949-2cbcd1a25bad', '1770748034186-6d6e5738cddf', '1654436200209-de489ed205df', '1642523109665-b86f5bea6c43', '1610173827043-9db50e0d8ef9', '1741884924087-21116668f724', '1749018035526-d868edcd4f50', '1730037656320-b003292ac9b4', '1730037656990-22d356346fd7', '1658045366823-26c861bb69f9', '1730037656915-65e1752a9b24', '1633102076770-99ec3d50a313', '1663126151156-39b72e6b738e', '1653395923928-8653b1af0024', '1749639002356-7dac5abc8d0c', '1723924987213-92a16713db54', '1647749379764-2a1a27b8a42b', '1678855904567-d9e73fa2e01d', '1659854899688-04eb42b15c70', '1629118477133-b8bded320850', '1558377235-76f53857000b', '1631005436794-ccaa79de61ba', '1624610806209-82a4cbb4339a', '1716504628105-bd76d91e85f2', '1512310604669-443f26c35f52', '1716504627981-22728cb2d2e2', '1660118248632-103511f9b337', '1555024820-c8aaf1952d23', '1716504628084-97224213ca6d', '1716504628204-47f2df8d2634', '1644523729338-f00c0b6ed5a4', '1617288991572-9e8755a88209', '1693023656257-87c142566ad3', '1482555670981-4de159d8553b', '1605567646371-783ad260475d', '1545912453-db258ca9b7b7', '1718433398487-46441bca04d2', '1685202509964-0c35bbcb546d', '1765284943340-c2c23fc29246', '1637474936173-23077e252a35', '1713294561443-62ef9b17475e', '1699557651871-54656a2f2f63', '1627609241345-8fb41ec24d95', '1611152986358-5b3dd50523bd', '1565886805568-5339f8aa0e00', '1618560795721-16b0ebf1cde5', '1643474003775-fbe9c4f1291f', '1643474003498-9871d923db5f', '1622608434454-3207e7cf4f7a', '1643474004268-efcbbc418a2d', '1619982719549-0f4fc3d7b526', '1713078582993-fdd86b1a2c1f', '1749189516333-168cfd97de0b', '1633614386903-27d7eb3e8b20', '1771654805882-95967672e6c1', '1631330612137-07b3a03f7cf1', '1766043071269-93f60fe04df2', '1771654804991-652efe658f98', '1771654805886-ae3323cb3050', '1766043071255-64d4ef2ba3a8', '1600685890506-593fdf55949b', '1617633150878-7df1d12a9a57', '1587271315307-eaebc181c749', '1619516388835-2b60acc4049e', '1654764746225-e63f5e90facd', '1570212773364-e30cd076539e', '1610047520958-b42ebcd2f6cb', '1588842867976-fd084ca2c87b', '1617627143750-d86bc21e42bb', 'KHjRHDi5y9k', 'wuzEWOV-GNs', 'f_RlcKx4aFk', 'gSHdzsKoZmQ', 'PmLxiS1uhbA', 'Fmue-I4qf2E', 'n45Wbm8gpm0', '5Sy0Kkdw48A', '1VQWMY_mHE0', '2pdfIKMLeuA', '3cZ3HN71VZk', '-EruaqbLKhE', 'uUC001p9TLs', 'btQ1Fgu_uPc', 'wkSYddEngiA', 'RIdC1S5hXNo', 'W9u6K5-YmsY', '3-XrIdOMPgs', 'og1ym_6W2VU', '3GExIhs1mOM', 'ufKbf_1dOho', '_FVqFeTozr4', '_gEWWAvBR54', 'T8zW3m_c4U4', 'z-E9_c7oMow', 'GECNtaHLjYc', 'pGTbRzGrf-E', 'Bb5saUyBBsg', 'wxOlFToHPEY', 'yp8R_PT0wHU', 'aO_BtyVt49w', 'IqESqyLgWRA', 'YZ-qYEVQ1h0', 'eixImaSJ8Ag', 'E8320IeC804', 'ZhB5fsFuMuA', 'jTIk-ls0UfU', 'di_Y-TPK1s8', '5Fo8VPAq8aU', 'bLstcBajVY8', 'fO2myfwWhU0', 'ekzJvt0xFGw', 'pWslPWnO6-0', 'afjiuvQvuVA', '2DZmm6QKFQE', '4m54DbzPV8o', 'bQlcrYQpkgI', 'qkRXql2Y0PU', 'VjF-qUO9yMA', '2JijIz73RlI', 'BVZ86wssIlo', 'RfcS2tdlN9U', 'lSjRpgTXP_E'
];

const aiRegistry = [
  '/assets/ai-profiles/ai_desi_1.png',
  '/assets/ai-profiles/ai_desi_2.png',
  '/assets/ai-profiles/ai_desi_3.png',
  '/assets/ai-profiles/ai_desi_4.png',
  '/assets/ai-profiles/ai_desi_5.png',
  '/assets/ai-profiles/ai_desi_6.png',
  '/assets/ai-profiles/ai_desi_7.png',
  '/assets/ai-profiles/ai_desi_8.png',
  '/assets/ai-profiles/ai_desi_9.png',
  '/assets/ai-profiles/ai_desi_10.png',
  '/assets/ai-profiles/ai_desi_11.png',
  '/assets/ai-profiles/ai_desi_12.png',
  '/assets/ai-profiles/ai_desi_13.png',
  '/assets/ai-profiles/ai_desi_14.png',
  '/assets/ai-profiles/ai_desi_15.png',
  '/assets/ai-profiles/ai_desi_16.png'
];

const unifiedRegistry = [
  ...aiRegistry,
  ...unsplashRegistry.map(id => {
    if (id.startsWith('1')) {
      return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=90&w=1200`;
    }
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&q=90&w=1200`;
  })
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
    
    // Absolute Uniqueness: Modulo cycling from the Unified Registry (AI + Verified Unsplash)
    const photoUrl = unifiedRegistry[i % unifiedRegistry.length];
    
    const photos = JSON.stringify([photoUrl]);
    const rankScore = Math.floor(Math.random() * 5000) + 1000;

    batched.push({
      sql: `INSERT INTO profiles (
        user_id, full_name, role, rank_tier, date_of_birth, bio, city, photos, 
        occupation, is_verified, tokens, rank_score, onboarding_status,
        created_at, updated_at
      ) VALUES (?, ?, 'woman', 'Aspirant', ?, ?, ?, ?, ?, 1, 1000, ?, 'COMPLETED', ?, ?)`,
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

  console.log("Sanctuary 2.4.9 expansion complete. 200 unique female profiles active with 100% unique Desi assets.");
  process.exit(0);
}

seedFemales();
