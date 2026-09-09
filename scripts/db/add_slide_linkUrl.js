const { createClient } = require('@libsql/client');
const db = createClient({
  url: 'file:./server/dev.db'
});
async function main() {
  try {
    await db.execute('ALTER TABLE Slide ADD COLUMN linkUrl TEXT;');
    console.log("Successfully added linkUrl to Slide table");
  } catch(e) {
    console.error("Error (might already exist):", e.message);
  }
}
main();
