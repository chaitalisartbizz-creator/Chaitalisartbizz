process.env.USE_TURSO = 'true';
const prisma = require('./server/db');
prisma.frontendSetting.findFirst().then(console.log).finally(() => prisma.$disconnect());
