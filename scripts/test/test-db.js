const { PrismaClient } = require('./server/node_modules/@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});
async function main() {
  const products = await prisma.product.findMany({ take: 5 });
  console.log(products.map(p => p.img));
}
main().catch(console.error).finally(() => prisma.$disconnect());
