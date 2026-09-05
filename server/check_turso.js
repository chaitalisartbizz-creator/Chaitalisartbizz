require('dotenv').config();
const { createClient } = require('@libsql/client');
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
client.execute('SELECT id, category, img FROM Product WHERE category = \'Canvas Painting\'').then(res => { console.log(res.rows); process.exit(0); }).catch(console.error);
