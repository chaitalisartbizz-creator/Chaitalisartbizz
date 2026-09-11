const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const COUPONS = [
  { id: 1, title: 'FESTIVE ART BUNDLE', sub: 'Flat 25% Off Custom Gift Combos', expiry: '3 Days Left', color1: '#2C2C2C', color2: '#C9A84C', emoji: '🎉', code: 'ARTFEST25' },
  { id: 2, title: 'CREATE SPECIAL', sub: '10% Extra Off Sitewide on All Orders', expiry: 'Ongoing', color1: '#8B5E7A', color2: '#C0737A', emoji: '✨', code: 'ART10' },
  { id: 3, title: 'PORTRAIT LOVE', sub: '20% Off Custom Portrait Orders', expiry: '5 Days Left', color1: '#A8873A', color2: '#C9A84C', emoji: '🎨', code: 'PORTRAIT20' },
  { id: 4, title: 'RESIN MAGIC', sub: '15% Off All Resin Art Pieces', expiry: '4 Days Left', color1: '#6B7FA3', color2: '#4A5D8A', emoji: '🌟', code: 'RESIN15' },
];

async function seed() {
  const count = await prisma.promoCode.count();
  if (count === 0) {
    for (const c of COUPONS) {
      delete c.id;
      await prisma.promoCode.create({ data: c });
    }
    console.log('Seeded promo codes!');
  } else {
    console.log('Promo codes already exist.');
  }
}
seed().catch(console.error).finally(() => prisma.\());

