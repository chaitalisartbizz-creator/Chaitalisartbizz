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
    console.log("Adding subcategories column to Product table...");
    await libsql.execute("ALTER TABLE Product ADD COLUMN subcategories TEXT DEFAULT '[]';");
    console.log("✅ Successfully added subcategories column!");
  } catch (error) {
    if (error.message && error.message.includes('duplicate column')) {
      console.log("ℹ️  Column already exists — no action needed.");
    } else {
      console.error("❌ Failed:", error.message);
    }
  }

  // Verify
  try {
    const result = await libsql.execute("SELECT COUNT(*) as count FROM Product;");
    console.log("✅ Product table accessible. Row count:", result.rows[0].count);
  } catch (e) {
    console.error("❌ Could not verify table:", e.message);
  }
}

main();
