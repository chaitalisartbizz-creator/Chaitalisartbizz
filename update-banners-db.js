const { PrismaClient } = require('./server/node_modules/@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: 'file:./dev.db' } }
});

async function main() {
  await prisma.banner.deleteMany({});
  await prisma.banner.createMany({
    data: [
      {
        id: 1,
        mediaUrl: 'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?auto=format&fit=crop&q=80&w=1200',
        link: '/category',
        title: 'Custom Pet & Family Portraits',
        subtitle: 'Bring your memories to life with handcrafted custom watercolor portraits',
        badge: '🎨 CUSTOM CREATIONS'
      },
      {
        id: 2,
        mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200',
        link: '/category',
        title: 'Luxury Resin Art Decor',
        subtitle: 'Elevate your interior with high-gloss premium resin masterpieces',
        badge: '✨ PREMIUM COLLECTION'
      }
    ]
  });
  console.log('Banners updated');
}

main().catch(console.error).finally(() => prisma.$disconnect());
