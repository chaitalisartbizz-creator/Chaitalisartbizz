const { createClient } = require('@libsql/client/web');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const url = process.env.TURSO_DATABASE_URL;
if (!url) throw new Error("TURSO_DATABASE_URL is missing!");

const libsql = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  try {
    console.log("Adding aboutUsData column to FrontendSetting table...");
    await libsql.execute("ALTER TABLE FrontendSetting ADD COLUMN aboutUsData TEXT;");
    console.log("✅ Successfully added aboutUsData column!");
  } catch (error) {
    if (error.message && error.message.includes('duplicate column')) {
      console.log("ℹ️  Column already exists — no action needed.");
    } else {
      console.error("❌ Failed:", error.message);
    }
  }
}

main();
