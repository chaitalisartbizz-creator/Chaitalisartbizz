require('dotenv').config({ path: 'server/.env' });
const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function main() {
  try {
    await db.execute('ALTER TABLE InstagramFeed ADD COLUMN pinned BOOLEAN DEFAULT 0;');
    console.log('Successfully added pinned column to remote DB.');
  } catch (error) {
    console.error('Error updating remote DB:', error.message);
  }
}
main();
