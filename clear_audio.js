const { createClient } = require('@libsql/client/web');
require('dotenv').config({ path: 'server/.env' });

async function clearAudio() {
  if (!process.env.TURSO_DATABASE_URL) {
    console.log("No Turso credentials");
    return;
  }
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  try {
    await client.execute(`UPDATE FrontendSetting SET siteAudioUrl = NULL;`);
    console.log("Cleared siteAudioUrl successfully!");
  } catch (error) {
    console.error("Failed:", error.message);
  }
}

clearAudio();
