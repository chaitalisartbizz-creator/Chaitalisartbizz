const fs=require('fs');
let p='server/seed-artbizz.js';
let c=fs.readFileSync(p, 'utf8');

c = c.replace(/await prisma\.frontendSetting\.deleteMany\(\{\}\);/g, "await prisma.frontendSetting.deleteMany({});\n  await prisma.banner.deleteMany({});");
c = c.replace(/console\.log\('Slides seeded\.'\);/g, "console.log('Slides seeded.');\n\n  // 5.5 Banners\n  await prisma.banner.createMany({ data: [{ mediaUrl: 'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?auto=format&fit=crop&q=80&w=1200', link: '/category', title: 'Custom Pet & Family Portraits', subtitle: 'Bring your memories to life with handcrafted custom watercolor portraits', badge: '🎨 CUSTOM CREATIONS' }, { mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200', link: '/category', title: 'Luxury Resin Art Decor', subtitle: 'Elevate your interior with high-gloss premium resin masterpieces', badge: '✨ PREMIUM COLLECTION' }] });\n  console.log('Banners seeded.');");
fs.writeFileSync(p, c);
