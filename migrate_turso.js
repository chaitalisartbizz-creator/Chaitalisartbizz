process.env.USE_TURSO = 'true';
const prisma = require('./server/db');
async function migrate() {
  await prisma.$queryRawUnsafe('CREATE TABLE IF NOT EXISTS "InstagramFeed" ( "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "url" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP )');
  console.log("Migration done");
}
migrate().finally(() => prisma.$disconnect());
