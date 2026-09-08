const { createClient } = require('@libsql/client');
const db = createClient({
  url: 'file:./server/dev.db'
});
async function main() {
  try {
    await db.execute('ALTER TABLE Product ADD COLUMN variants TEXT;');
    console.log("Successfully added variants to Product table");
  } catch(e) {
    console.error("Error (might already exist):", e.message);
  }
}
main();
