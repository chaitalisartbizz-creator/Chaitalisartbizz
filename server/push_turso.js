const fs = require('fs');
const { createClient } = require('@libsql/client');
require('dotenv').config();

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  try {
    const sql = fs.readFileSync('all.sql', 'utf8');
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (let s of statements) {
      console.log('Running:', s.substring(0, 50) + '...');
      await libsql.execute(s);
    }
    console.log('Successfully pushed schema to Turso!');
  } catch (err) {
    console.error('Error:', err);
  }
}
run();
