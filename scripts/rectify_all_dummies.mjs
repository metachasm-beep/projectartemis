import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
  url: process.env.VITE_TURSO_DATABASE_URL,
  authToken: process.env.VITE_TURSO_AUTH_TOKEN,
});

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// 🍛 AUTHENTIC UNPROFESSIONAL MALE URLs (Direct)
const MALE_URLS = [
  'https://images.unsplash.com/photo-1717010882378-7bccc5b8fa17?w=600',
  'https://images.unsplash.com/photo-1564638764498-03e232b71def?w=600',
  'https://images.unsplash.com/photo-1632820324313-ee2704746bfd?w=600',
  'https://images.unsplash.com/photo-1682827818521-f630ab2de84b?w=600',
  'https://images.unsplash.com/photo-1699741503291-e2957cca5c37?w=600',
  'https://images.unsplash.com/photo-1746193689655-1d7137bdd952?w=600',
  'https://images.unsplash.com/photo-1645036915593-b4ed7e016b65?w=600',
  'https://images.unsplash.com/photo-1674906284947-bbdb4af89e32?w=600',
  'https://images.unsplash.com/photo-1621960883434-e910537c8052?w=600',
  'https://images.unsplash.com/photo-1638368349569-e49499196d9f?w=600',
  'https://images.unsplash.com/photo-1630480403121-a008d6f1e638?w=600',
  'https://images.unsplash.com/photo-1558292198-f977c389f8d3?w=600',
  'https://images.unsplash.com/photo-1761980958548-7babac83ef3d?w=600',
  'https://images.unsplash.com/photo-1680759112554-82830fa5a4c3?w=600',
  'https://images.unsplash.com/photo-1635152486512-548b3893d6e4?w=600',
  'https://images.unsplash.com/photo-1635144763700-722bacf189d9?w=600',
  'https://images.unsplash.com/photo-1663575126982-8431f5eebf46?w=600',
  'https://images.unsplash.com/photo-1761126280224-dfd112ca7d87?w=600',
  'https://images.unsplash.com/photo-1633894874359-5c64534b170c?w=600',
  'https://images.unsplash.com/photo-1610767541061-cc2cf8121199?w=600',
  'https://images.unsplash.com/photo-1739242572316-c6a4d7199087?w=600',
  'https://images.unsplash.com/photo-1609785193644-30272d4617fe?w=600',
  'https://images.unsplash.com/photo-1683521109003-e748af8e66ea?w=600',
  'https://images.unsplash.com/photo-1593135467441-a7bbbc51c835?w=600',
  'https://images.unsplash.com/photo-1737966240353-bbe6c3801486?w=600',
  'https://images.unsplash.com/photo-1682019230856-0fc01babaeb5?w=600',
  'https://images.unsplash.com/photo-1667569219405-9934a10594e0?w=600',
  'https://images.unsplash.com/photo-1556157382-9791f8d52f0d?w=600',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600',
  'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=600',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600',
  'https://images.unsplash.com/photo-1542178243-bc20204b1444?w=600',
  'https://images.unsplash.com/photo-1504199367060-e4554b73fd1d?w=600',
  'https://images.unsplash.com/photo-1605405748313-a416a1b84491?w=600',
  'https://images.unsplash.com/photo-1563122441-43282665b169?w=600',
  'https://images.unsplash.com/photo-1582233479366-6d38bc390a08?w=600',
  'https://images.unsplash.com/photo-1701181392095-88846c4f87fe?w=600',
  'https://images.unsplash.com/photo-1623591668430-b47452b66dd6?w=600',
  'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=600',
  'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600',
  'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=600',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?w=600',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
  'https://images.unsplash.com/photo-1615501140994-b52786a5127b?w=600',
  'https://images.unsplash.com/photo-1627393140510-14e36509f6e5?w=600',
  'https://images.unsplash.com/photo-1618698242045-8c7c913501f8?w=600',
  'https://images.unsplash.com/photo-1605405748281-9b16ea917578?w=600',
  'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=600',
  'https://images.unsplash.com/photo-1603415526955-6b6fd998f7e2?w=600'
];

// 🍛 AUTHENTIC UNPROFESSIONAL FEMALE URLs (Direct)
const FEMALE_URLS = [
  'https://images.unsplash.com/photo-1631008622409-49549f02b992?w=600',
  'https://images.unsplash.com/photo-1640183295767-d237218daafd?w=600',
  'https://images.unsplash.com/photo-1761364753904-bbc1d8219f57?w=600',
  'https://images.unsplash.com/photo-1593360023538-3b002771ac97?w=600',
  'https://images.unsplash.com/photo-1746265329418-0a063de8cc7d?w=600',
  'https://images.unsplash.com/photo-1722507370680-37a66d242326?w=600',
  'https://images.unsplash.com/photo-1671823469756-1e64ab077acb?w=600',
  'https://images.unsplash.com/photo-1701181392121-6982d097ae2b?w=600',
  'https://images.unsplash.com/photo-1704088030734-96769c4593a2?w=600',
  'https://images.unsplash.com/photo-1600430665436-d4ff685937eb?w=600',
  'https://images.unsplash.com/photo-1659463034333-b9f5bad5b78d?w=600',
  'https://images.unsplash.com/photo-1615501141174-66c9543a7bce?w=600',
  'https://images.unsplash.com/photo-1763709897268-af06bedbf8bf?w=600',
  'https://images.unsplash.com/photo-1544264796-acfb69e05b37?w=600',
  'https://images.unsplash.com/photo-1581861674869-20ddbba2e598?w=600',
  'https://images.unsplash.com/photo-1651471240014-11208a1212cc?w=600',
  'https://images.unsplash.com/photo-1672686385376-479ab22342f5?w=600',
  'https://images.unsplash.com/photo-1771654104693-c1c0cc7c7940?w=600',
  'https://images.unsplash.com/photo-1518131296958-df44106fd0ae?w=600',
  'https://images.unsplash.com/photo-1734937404197-bdaa7ea0fb0c?w=600',
  'https://images.unsplash.com/photo-1650443215213-728560ddc1a2?w=600',
  'https://images.unsplash.com/photo-1728915612031-1580c1f420fd?w=600',
  'https://images.unsplash.com/photo-1622207691293-5cd80466dab3?w=600',
  'https://images.unsplash.com/photo-1649928091452-c40806f77c9d?w=600',
  'https://images.unsplash.com/photo-1692075042334-4fec26691eb7?w=600',
  'https://images.unsplash.com/photo-1663575127057-0aca6409626a?w=600',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600',
  'https://images.unsplash.com/photo-1573496799652-c28c6d66ccfb?w=600',
  'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=600',
  'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=600',
  'https://images.unsplash.com/photo-1649972906311-542e557cc51b?w=600',
  'https://images.unsplash.com/photo-1574701148212-8518049c7b2c?w=600',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
  'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?w=600',
  'https://images.unsplash.com/photo-1520626337972-ebf863448db6?w=600',
  'https://images.unsplash.com/photo-1621012430307-b4774b78d3cb?w=600',
  'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600',
  'https://images.unsplash.com/photo-1627083072895-3df5b4481005?w=600',
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=600',
  'https://images.unsplash.com/photo-1614289371518-722f2615943d?w=600',
  'https://images.unsplash.com/photo-1623091423323-5e9270ddcf49?w=600',
  'https://images.unsplash.com/photo-1614436163996-25cee5f54290?w=600',
  'https://images.unsplash.com/photo-1614204424926-196a80bf0be8?w=600',
  'https://images.unsplash.com/photo-1534603038234-729094065600?w=600',
  'https://images.unsplash.com/photo-1606774882282-3cc084e3d64c?w=600',
  'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=600',
  'https://images.unsplash.com/photo-1605405748281-9b16ea917578?w=600',
  'https://images.unsplash.com/photo-1658045366823-26c861bb69f9?w=600',
  'https://images.unsplash.com/photo-1727396880650-0e394797c5d3?w=600',
  'https://images.unsplash.com/photo-1764426381345-f33736598e42?w=600',
  'https://images.unsplash.com/photo-1672215567309-4d4db8475c21?w=600',
  'https://images.unsplash.com/photo-1738524586088-c6ae118531e9?w=600',
  'https://images.unsplash.com/photo-1658724683859-7f366527255d?w=600'
];

async function uploadToCloudinary(imageUrl, name) {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Source fetch failed: ${res.status}`);
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
    return data.secure_url || imageUrl;
  } catch (e) {
    console.warn(`Unsplash fallback for ${name}:`, e.message);
    return imageUrl;
  }
}

async function rectifyAllDummies() {
  console.log("🔥 INITIALIZING REGISTRY RECTIFICATION & AESTHETIC DOWNGRADE (DIRECT URLS)...");
  
  const dummies = await turso.execute("SELECT user_id, full_name, role FROM profiles WHERE user_id LIKE 'dummy-%'");
  console.log(`Found ${dummies.rows.length} dummy identities to rectify.`);

  let maleCount = 0;
  let femaleCount = 0;

  for (const r of dummies.rows) {
    const isMale = r.role === 'man';
    const sourceArr = isMale ? MALE_URLS : FEMALE_URLS;
    const index = isMale ? maleCount % sourceArr.length : femaleCount % sourceArr.length;
    
    console.log(` - [${r.role.toUpperCase()}] Rectifying ${r.full_name}...`);
    const newPhotoUrl = await uploadToCloudinary(sourceArr[index], r.full_name);
    
    await turso.execute({
      sql: "UPDATE profiles SET photos = ? WHERE user_id = ?",
      args: [JSON.stringify([newPhotoUrl]), r.user_id]
    });

    if (isMale) maleCount++;
    else femaleCount++;
  }

  console.log(`\n✅ RECTIFICATION COMPLETE.`);
  console.log(`Rectified ${maleCount} male identities and ${femaleCount} female identities.`);
}

rectifyAllDummies();
