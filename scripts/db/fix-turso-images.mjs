import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://chaitali-db-chaitalisartbizz-creator.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODgyOTQ4MTgsImlkIjoiMDFhMDVlYTktZjAwMS03MDAxLThkMmMtNTZkYzAzZWRjZWY1Iiwia2lkIjoiWGxHdkdwaXc3aHR3VFE3NVJOVG1NSU9CcFBtekNPcFUxRmQtOGJBNnlPVSIsInJpZCI6IjlmMGY2Y2MyLTllMWYtNGVmMC05N2YyLTdjOTYzYmQwZWYyYyJ9.NwwXKVkBE8aSV9jZiHLyiNKP5LJwSDyhjD2ORFkEMXHtvPCHWZ6SlWTwnFIK4fJHGy61i-xB1n581CqJzibhCw'
});

// High quality art product images from Unsplash
const productImages = {
  'Custom Pet Portrait (A4 size)': [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop'
  ],
  'Family Portrait Illustration': [
    'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop'
  ],
  'Luxury Resin Tray (Gold Flakes)': [
    'https://images.unsplash.com/photo-1631125915902-d3a0e5d69e56?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&h=600&fit=crop'
  ],
  'Resin Ocean Coasters (Set of 4)': [
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559181567-c3190bba3f73?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?w=600&h=600&fit=crop'
  ],
  'Minimalist Digital Logo Design': [
    'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=600&fit=crop'
  ],
  'Personalised Wooden Name Plate': [
    'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?w=600&h=600&fit=crop'
  ],
  'Mandala Wall Art Frame': [
    'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=600&fit=crop'
  ],
  'Diwali Festive Hamper': [
    'https://images.unsplash.com/photo-1605292356183-a78d9d9f4b0a?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574621100236-d25b64527b21?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574176397786-7f6d2a7c9f0c?w=600&h=600&fit=crop'
  ]
};

// Default fallback for any product we don't have specific images for
const defaultImages = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop'
];

async function run() {
  console.log('Fetching products from Turso...');
  const result = await client.execute('SELECT id, name, images FROM Product');
  console.log(`Found ${result.rows.length} products`);

  for (const row of result.rows) {
    const id = row[0];
    const name = row[1];
    const currentImages = row[2];

    let needsUpdate = false;
    if (!currentImages || currentImages === 'null' || currentImages === '[]' || currentImages === '') {
      needsUpdate = true;
    } else {
      try {
        const parsed = JSON.parse(currentImages);
        if (!Array.isArray(parsed) || parsed.length === 0) needsUpdate = true;
      } catch(e) {
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      const images = productImages[name] || defaultImages;
      const imagesJson = JSON.stringify(images);
      await client.execute({
        sql: 'UPDATE Product SET images = ? WHERE id = ?',
        args: [imagesJson, id]
      });
      console.log(`✅ Updated "${name}" with ${images.length} images`);
    } else {
      console.log(`⏭️  Skipped "${name}" (already has images)`);
    }
  }

  console.log('\nDone! All products updated in Turso.');
}

run().catch(console.error);
