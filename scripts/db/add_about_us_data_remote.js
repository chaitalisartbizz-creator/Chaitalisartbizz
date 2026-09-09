const { createClient } = require('@libsql/client');
const db = createClient({
  url: 'libsql://chaitali-db-chaitalisartbizz-creator.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODgyOTQ4MTgsImlkIjoiMDFhMDVlYTktZjAwMS03MDAxLThkMmMtNTZkYzAzZWRjZWY1Iiwia2lkIjoiWGxHdkdwaXc3aHR3VFE3NVJOVG1NSU9CcFBtekNPcFUxRmQtOGJBNnlPVSIsInJpZCI6IjlmMGY2Y2MyLTllMWYtNGVmMC05N2YyLTdjOTYzYmQwZWYyYyJ9.NwwXKVkBE8aSV9jZiHLyiNKP5LJwSDyhjD2ORFkEMXHtvPCHWZ6SlWTwnFIK4fJHGy61i-xB1n581CqJzibhCw'
});
async function main() {
  try {
    await db.execute('ALTER TABLE FrontendSetting ADD COLUMN aboutUsData TEXT;');
    console.log("Successfully added aboutUsData to remote FrontendSetting table");
  } catch(e) {
    console.error("Error:", e.message);
  }
}
main();
