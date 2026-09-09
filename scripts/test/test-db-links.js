const { PrismaClient } = require('./server/node_modules/@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});
async function main() {
  const products = await prisma.product.findMany();
  for (const p of products) {
    if (p.img) {
      try {
        const res = await fetch(p.img, { method: 'HEAD' });
        if (!res.ok) console.log('BROKEN:', p.img);
      } catch (e) {
        console.log('ERROR:', p.img);
      }
    }
  }
  const slides = await prisma.slide.findMany();
  for (const s of slides) {
    if (s.heroImage) {
      try {
        const res = await fetch(s.heroImage, { method: 'HEAD' });
        if (!res.ok) console.log('BROKEN SLIDE:', s.heroImage);
      } catch (e) {
        console.log('ERROR SLIDE:', s.heroImage);
      }
    }
  }
  const categories = await prisma.category.findMany();
  for (const c of categories) {
    if (c.img) {
      try {
        const res = await fetch(c.img, { method: 'HEAD' });
        if (!res.ok) console.log('BROKEN CAT:', c.img);
      } catch (e) {
        console.log('ERROR CAT:', c.img);
      }
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
