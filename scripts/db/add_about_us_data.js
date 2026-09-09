const { createClient } = require('@libsql/client');
const db = createClient({
  url: 'file:./server/dev.db'
});
async function main() {
  try {
    await db.execute('ALTER TABLE FrontendSetting ADD COLUMN aboutUsData TEXT;');
    console.log("Successfully added aboutUsData to FrontendSetting table");
  } catch(e) {
    console.error("Error:", e.message);
  }
}
main();
