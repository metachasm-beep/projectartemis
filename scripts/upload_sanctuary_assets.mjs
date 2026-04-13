import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dsmbhnjg5';
const UPLOAD_PRESET = process.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'matriarch_profiles';
const LOCAL_IMAGE_PATH = join(__dirname, '../nick-brunner-k4xDXNskVsQ-unsplash.jpg');

async function uploadAsset() {
  console.log('🚀 MATRIARCH_ASSET_SYNC: Manifesting User Asset in Cloudinary...');
  
  try {
    // 1. Read local file
    if (!fs.existsSync(LOCAL_IMAGE_PATH)) {
      throw new Error(`Local file not found at ${LOCAL_IMAGE_PATH}`);
    }
    const buffer = fs.readFileSync(LOCAL_IMAGE_PATH);
    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    console.log('🚀 MATRIARCH_ASSET_SYNC: Transmitting to Cloudinary Vault via FormData...');
    
    // 2. Use FormData (matching seed_cloudinary.mjs protocol)
    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('public_id', 'sanctuary_rose_v1');

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );

    console.log('✅ MATRIARCH_ASSET_SYNC: Manifestation complete.');
    console.log('🔗 CLOUDINARY_URL:', response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error('❌ MATRIARCH_ASSET_SYNC_FAILURE:', error.response?.data || error.message);
    process.exit(1);
  }
}

uploadAsset();
