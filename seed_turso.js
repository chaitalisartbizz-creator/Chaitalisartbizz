require('dotenv').config({ path: './server/.env' });
const prisma = require('./server/db');

const categories = [
  { label: 'Hand Embroidery', emoji: '🪡', img: 'https://images.unsplash.com/photo-1621644788329-8a3138b70e06?w=500&h=500&fit=crop', bg: 'bg-[#C9A84C]', sub: 'Shirt, T-shirt, Scarf, Hoop' },
  { label: 'Fabric Painting', emoji: '🎨', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&h=500&fit=crop', bg: 'bg-[#C0737A]', sub: 'Shirt, T-shirt, Scarf, Hoop' },
  { label: 'Baby Welcome Frame', emoji: '🧸', img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&h=500&fit=crop', bg: 'bg-[#6B7FA3]', sub: 'Different sizes available' },
  { label: 'Canvas Painting', emoji: '🖼️', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop', bg: 'bg-[#2C2C2C]', sub: 'Custom handpainted canvas art' },
  { label: 'Candles', emoji: '🕯️', img: 'https://images.unsplash.com/photo-1602874801007-bd458cb6c501?w=500&h=500&fit=crop', bg: 'bg-[#8B5E7A]', sub: 'Photo candle jar, Scented, Mithai, Flower, Decorative, 12 Scents, Uurli (Diwali)' },
  { label: 'Resin Art', emoji: '✨', img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&h=500&fit=crop', bg: 'bg-[#C9A84C]', sub: 'Clock, Tray, Table, Frame, Varmala Preservation, Baby Kit Set, 3D Photo Frame, Religious Frames, Haldi/Mehendi Platter, Rakhi, Jewellery' },
  { label: '3D Photo Creation', emoji: '📷', img: 'https://images.unsplash.com/photo-1547756536-cde3673fa2e5?w=500&h=500&fit=crop', bg: 'bg-[#F2EDE4]', sub: 'Custom 3D photo creations' },
  { label: 'Packing (Trousseau)', emoji: '🎁', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop', bg: 'bg-[#C0737A]', sub: 'Engagement, Baby Shower, Shadi, Hampers, Bouquets' },
  { label: 'Activity Zone', emoji: '🎯', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop', bg: 'bg-[#6B7FA3]', sub: 'Thumb Print Tree, String Art, Reveal Photo Frame' },
  { label: 'Diwali Spl', emoji: '🪔', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', bg: 'bg-[#C9A84C]', sub: 'Toran, Bandhanwar, Shubh Labh, Tea Light Holder, Decorated Panti' }
];

async function main() {
  await prisma.category.deleteMany({});
  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }
  console.log('Categories seeded to Turso!');
}

main().catch(console.error);
