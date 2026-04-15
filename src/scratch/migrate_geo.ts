import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

const turso = createClient({
  url: url || "",
  authToken: authToken || "",
});

async function migrate() {
  console.log("Starting Geolocation Migration...");
  
  try {
    await turso.execute("ALTER TABLE profiles ADD COLUMN latitude REAL");
    console.log("Added latitude column.");
  } catch (e: any) {
    if (e.message.includes("duplicate column name")) {
      console.log("latitude column already exists.");
    } else {
      console.error("Error adding latitude:", e);
    }
  }

  try {
    await turso.execute("ALTER TABLE profiles ADD COLUMN longitude REAL");
    console.log("Added longitude column.");
  } catch (e: any) {
    if (e.message.includes("duplicate column name")) {
      console.log("longitude column already exists.");
    } else {
      console.error("Error adding longitude:", e);
    }
  }

  try {
    await turso.execute("ALTER TABLE profiles ADD COLUMN measurement_unit TEXT DEFAULT 'km'");
    console.log("Added measurement_unit column.");
  } catch (e: any) {
    if (e.message.includes("duplicate column name")) {
      console.log("measurement_unit column already exists.");
    } else {
      console.error("Error adding measurement_unit:", e);
    }
  }

  console.log("Migration Complete.");
}

migrate();
