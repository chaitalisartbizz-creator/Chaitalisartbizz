require('dotenv').config({ path: 'server/.env' });
const { createClient } = require('@libsql/client');

const subs = 'Clock, Tray, Table, Frame, Varmala Preservation, Baby Kit Set, 3D Photo Frame, Religious Frames, Haldi/Mehendi Platter, Rakhi, Jewellery';

async function updateDb(url, token) {
  const db = createClient({ url, authToken: token });
  try {
    const res = await db.execute({
      sql: 'UPDATE Category SET sub = ? WHERE label = ?',
      args: [subs, 'Resin Art']
    });
    console.log('Updated ' + url + ' - Rows affected: ' + res.rowsAffected);
  } catch (error) {
    console.error('Error updating ' + url, error.message);
  }
}

async function main() {
  await updateDb('file:server/dev.db', undefined);
  await updateDb(process.env.TURSO_DATABASE_URL, process.env.TURSO_AUTH_TOKEN);
}

main();
