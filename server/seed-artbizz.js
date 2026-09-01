const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Chaitali Artbizz data...');

  // 1. Clear old data
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.slide.deleteMany({});
  await prisma.frontendSetting.deleteMany({});
  await prisma.banner.deleteMany({});

  // 2. Categories
  const categories = await prisma.category.createMany({
    data: [
      { label: 'Custom Portraits', emoji: '🖼️', img: 'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?w=500&h=500&fit=crop', bg: 'bg-[#2C2C2C]' },
      { label: 'Resin Art', emoji: '✨', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop', bg: 'bg-[#8B5E7A]' },
      { label: 'Digital Designs', emoji: '💻', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop', bg: 'bg-[#6B7FA3]' },
      { label: 'Personalised Gifts', emoji: '🎁', img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&h=500&fit=crop', bg: 'bg-[#C0737A]' },
      { label: 'Decor Art', emoji: '🏺', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop', bg: 'bg-[#F2EDE4]' },
      { label: 'Festive Packages', emoji: '🎊', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', bg: 'bg-[#C9A84C]' }
    ]
  });
  console.log('Categories seeded.');

  // 3. Products
  await prisma.product.createMany({
    data: [
      { name: 'Custom Pet Portrait (A4 size)', brand: "Chaitali's Artbizz", price: 799, mrp: 999, rating: 4.9, reviews: 145, img: 'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?w=500&h=500&fit=crop', category: 'Custom Portraits', petType: 'Dog', description: 'Handcrafted watercolor portrait of your furry friend.' },
      { name: 'Family Portrait Illustration', brand: "Chaitali's Artbizz", price: 1499, mrp: 1999, rating: 4.8, reviews: 89, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop', category: 'Custom Portraits', petType: 'Family', description: 'Beautifully detailed portrait perfect for living room walls.' },
      { name: 'Luxury Resin Tray (Gold Flakes)', brand: "Chaitali's Artbizz", price: 899, mrp: 1299, rating: 5.0, reviews: 230, img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop', category: 'Resin Art', petType: 'Home', badge: 'Bestseller', description: 'Elegant resin tray embedded with real gold flakes and dried flowers.' },
      { name: 'Resin Ocean Coasters (Set of 4)', brand: "Chaitali's Artbizz", price: 549, mrp: 799, rating: 4.7, reviews: 112, img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop', category: 'Resin Art', petType: 'Home', tag: 'New', description: 'Hand-poured resin coasters mimicking ocean waves.' },
      { name: 'Minimalist Digital Logo Design', brand: "Chaitali's Artbizz", price: 499, mrp: 799, rating: 4.9, reviews: 340, img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop', category: 'Digital Designs', petType: 'Business', badge: 'Top Rated', description: 'Professional minimalist logo for your brand.' },
      { name: 'Personalised Wooden Name Plate', brand: "Chaitali's Artbizz", price: 1199, mrp: 1599, rating: 4.8, reviews: 67, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', category: 'Personalised Gifts', petType: 'Home', description: 'Custom engraved wooden name plate for your entrance.' },
      { name: 'Mandala Wall Art Frame', brand: "Chaitali's Artbizz", price: 649, mrp: 899, rating: 4.6, reviews: 54, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop', category: 'Decor Art', petType: 'Home', tag: 'Trending', description: 'Intricate hand-drawn mandala art framed in premium wood.' },
      { name: 'Diwali Festive Hamper', brand: "Chaitali's Artbizz", price: 1999, mrp: 2499, rating: 5.0, reviews: 41, img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&h=500&fit=crop', category: 'Festive Packages', petType: 'Gifting', badge: 'Limited', description: 'Curated box containing resin diyas, art prints, and sweets.' }
    ]
  });
  console.log('Products seeded.');

  // 4. Deals
  await prisma.deal.createMany({
    data: [
      { title: 'PORTRAIT LOVE', sub: '20% OFF', badge: 'Coupon: PORTRAIT20', tag: 'Art Deals', img: 'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?w=500&h=500&fit=crop', grad: 'from-[#2C2C2C] to-[#1A1A1A]', bg: 'bg-[#2C2C2C]', border: 'border-[#C9A84C]', save: 'Save up to ₹500' },
      { title: 'RESIN MAGIC', sub: 'Flat ₹200 OFF', badge: 'Coupon: RESIN15', tag: 'Limited', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop', grad: 'from-[#8B5E7A] to-[#6B7FA3]', bg: 'bg-[#8B5E7A]', border: 'border-[#C0737A]', save: 'On all Resin trays' }
    ]
  });
  console.log('Deals seeded.');

  // 5. Slides
  await prisma.slide.createMany({
    data: [
      { gradient: 'from-[#2C2C2C] to-[#1A1A1A]', tag: 'Custom Creations', badge: '100% Handcrafted', title: 'Bring Your Ideas To Life', subtitle: 'Bespoke Portraits & Illustrations', cta: 'Order Now', heroImage: 'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?w=800&h=800&fit=crop' },
      { gradient: 'from-[#8B5E7A] to-[#4A5D8A]', tag: 'New Arrivals', badge: 'Premium Finish', title: 'Luxury Resin Art', subtitle: 'Timeless decor for your home', cta: 'Shop Collection', heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=800&fit=crop' }
    ]
  });
  console.log('Slides seeded.');

  // 5.5 Banners
  await prisma.banner.createMany({ data: [{ mediaUrl: 'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?auto=format&fit=crop&q=80&w=1200', link: '/category', title: 'Custom Pet & Family Portraits', subtitle: 'Bring your memories to life with handcrafted custom watercolor portraits', badge: '🎨 CUSTOM CREATIONS' }, { mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200', link: '/category', title: 'Luxury Resin Art Decor', subtitle: 'Elevate your interior with high-gloss premium resin masterpieces', badge: '✨ PREMIUM COLLECTION' }] });
  console.log('Banners seeded.');

  // 6. Frontend Settings
  await prisma.frontendSetting.create({
    data: {
      storeName: "Chaitali's Artbizz",
      tagline: 'Imagine. We Will Create.',
      logoChar: 'CA',
      footerDescription: 'Creating beautiful, handcrafted art pieces, custom portraits, and unique resin gifts that add a touch of magic to your everyday life.',
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      youtubeUrl: 'https://youtube.com',
      whatsappNumber: '919876543210',
      contactEmail: 'hello@chaitaliartbizz.com',
      contactPhone: '+91 98765 43210'
    }
  });
  console.log('Frontend settings seeded.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
