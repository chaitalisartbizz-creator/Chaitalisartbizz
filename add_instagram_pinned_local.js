const { createClient } = require('@libsql/client');

const db = createClient({
  url: 'file:server/dev.db'
});

async function main() {
  try {
    await db.execute('ALTER TABLE InstagramFeed ADD COLUMN pinned BOOLEAN DEFAULT 0;');
    console.log('Successfully added pinned column to local DB.');
  } catch (error) {
    console.error('Error updating local DB:', error.message);
  }
}
main();
