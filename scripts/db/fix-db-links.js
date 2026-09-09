const { PrismaClient } = require('./server/node_modules/@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});
async function main() {
  const oldId = '1604076913837-52ab5629fde0';
  const newId = '1579783902614-a3fb3927b6a5';

  const products = await prisma.product.findMany();
  for (const p of products) {
    if (p.img && p.img.includes(oldId)) {
      await prisma.product.update({
        where: { id: p.id },
        data: { img: p.img.replace(oldId, newId) }
      });
      console.log('Updated product', p.id);
    }
  }

  const slides = await prisma.slide.findMany();
  for (const s of slides) {
    if (s.heroImage && s.heroImage.includes(oldId)) {
      await prisma.slide.update({
        where: { id: s.id },
        data: { heroImage: s.heroImage.replace(oldId, newId) }
      });
      console.log('Updated slide', s.id);
    }
  }

  const categories = await prisma.category.findMany();
  for (const c of categories) {
    if (c.img && c.img.includes(oldId)) {
      await prisma.category.update({
        where: { id: c.id },
        data: { img: c.img.replace(oldId, newId) }
      });
      console.log('Updated category', c.id);
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
