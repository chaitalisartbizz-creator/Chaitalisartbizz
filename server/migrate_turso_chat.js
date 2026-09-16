const { createClient } = require('@libsql/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  const createChatSession = `CREATE TABLE IF NOT EXISTS "ChatSession" (
    id TEXT PRIMARY KEY,
    visitorId TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`;

  const createChatMessage = `CREATE TABLE IF NOT EXISTS "ChatMessage" (
    id TEXT PRIMARY KEY,
    sessionId TEXT NOT NULL,
    sender TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`;

  try {
    await libsql.execute(createChatSession);
    console.log('OK: CREATE TABLE ChatSession');
  } catch(e) {
    console.error('ERROR creating ChatSession table:', e.message);
  }

  try {
    await libsql.execute(createChatMessage);
    console.log('OK: CREATE TABLE ChatMessage');
  } catch(e) {
    console.error('ERROR creating ChatMessage table:', e.message);
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
