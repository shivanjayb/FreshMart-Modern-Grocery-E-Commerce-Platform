import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { hashSync } from 'bcryptjs';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@localstore.com',
      password: hashSync('password123', 10),
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Fruits & Vegetables', slug: 'fruits-vegetables', icon: '🥬' },
    }),
    prisma.category.create({
      data: { name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: '🥛' },
    }),
    prisma.category.create({
      data: { name: 'Bakery', slug: 'bakery', icon: '🍞' },
    }),
    prisma.category.create({
      data: { name: 'Beverages', slug: 'beverages', icon: '🧃' },
    }),
    prisma.category.create({
      data: { name: 'Snacks', slug: 'snacks', icon: '🍿' },
    }),
  ]);

  const [fruitsVeg, dairy, bakery, beverages, snacks] = categories;

  // Create products
  const products = [
    // Fruits & Vegetables
    {
      name: 'Organic Red Apples',
      slug: 'organic-red-apples',
      description: 'Crisp and sweet organic red apples from local orchards. Perfect for snacking, baking, or making fresh juice. Grown without pesticides.',
      price: 4.99,
      image: '/products/apples.svg',
      stock: 150,
      rating: 4.8,
      reviewCount: 24,
      featured: true,
      categoryId: fruitsVeg.id,
    },
    {
      name: 'Fresh Avocados',
      slug: 'fresh-avocados',
      description: 'Perfectly ripe Hass avocados. Creamy texture and rich flavor, ideal for guacamole, toast, or salads.',
      price: 6.49,
      image: '/products/avocados.svg',
      stock: 80,
      rating: 4.6,
      reviewCount: 18,
      featured: true,
      categoryId: fruitsVeg.id,
    },
    {
      name: 'Baby Spinach Pack',
      slug: 'baby-spinach-pack',
      description: 'Tender baby spinach leaves, pre-washed and ready to eat. Great for salads, smoothies, and cooking.',
      price: 3.99,
      image: '/products/spinach.svg',
      stock: 60,
      rating: 4.5,
      reviewCount: 12,
      categoryId: fruitsVeg.id,
    },
    {
      name: 'Sweet Strawberries',
      slug: 'sweet-strawberries',
      description: 'Plump, juicy strawberries picked at peak ripeness. Bursting with natural sweetness and vibrant flavor.',
      price: 5.99,
      image: '/products/strawberries.svg',
      stock: 45,
      rating: 4.9,
      reviewCount: 31,
      featured: true,
      categoryId: fruitsVeg.id,
    },
    // Dairy & Eggs
    {
      name: 'Farm Fresh Whole Milk',
      slug: 'farm-fresh-whole-milk',
      description: 'Creamy whole milk from local grass-fed cows. Rich in calcium and protein, with no added hormones.',
      price: 4.29,
      image: '/products/milk.svg',
      stock: 200,
      rating: 4.7,
      reviewCount: 42,
      featured: true,
      categoryId: dairy.id,
    },
    {
      name: 'Free-Range Eggs (Dozen)',
      slug: 'free-range-eggs',
      description: 'Large free-range eggs from happy hens raised in open pastures. Rich golden yolks with superior taste.',
      price: 5.49,
      image: '/products/eggs.svg',
      stock: 120,
      rating: 4.8,
      reviewCount: 36,
      categoryId: dairy.id,
    },
    {
      name: 'Artisan Cheddar Cheese',
      slug: 'artisan-cheddar-cheese',
      description: 'Aged sharp cheddar crafted by local artisan cheesemakers. Bold, tangy flavor perfect for any occasion.',
      price: 7.99,
      image: '/products/cheese.svg',
      stock: 55,
      rating: 4.6,
      reviewCount: 15,
      categoryId: dairy.id,
    },
    {
      name: 'Greek Yogurt (Plain)',
      slug: 'greek-yogurt-plain',
      description: 'Thick and creamy Greek yogurt with live active cultures. High protein, low sugar, incredibly versatile.',
      price: 3.79,
      image: '/products/yogurt.svg',
      stock: 90,
      rating: 4.4,
      reviewCount: 20,
      categoryId: dairy.id,
    },
    // Bakery
    {
      name: 'Sourdough Bread Loaf',
      slug: 'sourdough-bread-loaf',
      description: 'Traditional slow-fermented sourdough with a crispy crust and soft, tangy interior. Baked fresh daily.',
      price: 5.99,
      image: '/products/sourdough.svg',
      stock: 30,
      rating: 4.9,
      reviewCount: 28,
      featured: true,
      categoryId: bakery.id,
    },
    {
      name: 'Butter Croissants (4-pack)',
      slug: 'butter-croissants',
      description: 'Flaky, golden croissants made with real French butter. Light and airy with delicate layers.',
      price: 6.99,
      image: '/products/croissants.svg',
      stock: 40,
      rating: 4.7,
      reviewCount: 22,
      categoryId: bakery.id,
    },
    {
      name: 'Chocolate Chip Cookies',
      slug: 'chocolate-chip-cookies',
      description: 'Freshly baked cookies with Belgian chocolate chips. Chewy center with crispy edges — a classic favorite.',
      price: 4.49,
      image: '/products/cookies.svg',
      stock: 75,
      rating: 4.8,
      reviewCount: 45,
      featured: true,
      categoryId: bakery.id,
    },
    {
      name: 'Multigrain Bagels (6-pack)',
      slug: 'multigrain-bagels',
      description: 'Hearty multigrain bagels with seeds and whole grains. Perfect for breakfast or sandwiches.',
      price: 5.29,
      image: '/products/bagels.svg',
      stock: 50,
      rating: 4.3,
      reviewCount: 10,
      categoryId: bakery.id,
    },
    // Beverages
    {
      name: 'Cold Brew Coffee',
      slug: 'cold-brew-coffee',
      description: 'Smooth, bold cold-brewed coffee made from single-origin Arabica beans. Naturally lower in acidity.',
      price: 4.99,
      image: '/products/coldbrew.svg',
      stock: 100,
      rating: 4.7,
      reviewCount: 33,
      featured: true,
      categoryId: beverages.id,
    },
    {
      name: 'Fresh Orange Juice',
      slug: 'fresh-orange-juice',
      description: 'Freshly squeezed orange juice, never from concentrate. Bursting with vitamin C and natural sweetness.',
      price: 5.49,
      image: '/products/orangejuice.svg',
      stock: 65,
      rating: 4.6,
      reviewCount: 19,
      categoryId: beverages.id,
    },
    {
      name: 'Herbal Tea Collection',
      slug: 'herbal-tea-collection',
      description: 'Curated box of 20 herbal tea bags including chamomile, peppermint, and hibiscus. Caffeine-free relaxation.',
      price: 8.99,
      image: '/products/tea.svg',
      stock: 85,
      rating: 4.5,
      reviewCount: 16,
      categoryId: beverages.id,
    },
    {
      name: 'Sparkling Water (6-pack)',
      slug: 'sparkling-water-6pack',
      description: 'Refreshing naturally carbonated mineral water with a hint of lemon. Zero calories, zero sugar.',
      price: 6.49,
      image: '/products/sparklingwater.svg',
      stock: 110,
      rating: 4.3,
      reviewCount: 14,
      categoryId: beverages.id,
    },
    // Snacks
    {
      name: 'Trail Mix Premium',
      slug: 'trail-mix-premium',
      description: 'Premium blend of almonds, cashews, dried cranberries, dark chocolate chips, and pumpkin seeds.',
      price: 7.49,
      image: '/products/trailmix.svg',
      stock: 70,
      rating: 4.6,
      reviewCount: 21,
      categoryId: snacks.id,
    },
    {
      name: 'Organic Hummus',
      slug: 'organic-hummus',
      description: 'Smooth, creamy organic hummus made with tahini, lemon, and garlic. Perfect with pita or vegetables.',
      price: 4.99,
      image: '/products/hummus.svg',
      stock: 55,
      rating: 4.5,
      reviewCount: 17,
      categoryId: snacks.id,
    },
    {
      name: 'Sea Salt Potato Chips',
      slug: 'sea-salt-potato-chips',
      description: 'Kettle-cooked potato chips with just the right amount of sea salt. Extra crispy and perfectly crunchy.',
      price: 3.49,
      image: '/products/chips.svg',
      stock: 130,
      rating: 4.4,
      reviewCount: 26,
      categoryId: snacks.id,
    },
    {
      name: 'Dark Chocolate Bar',
      slug: 'dark-chocolate-bar',
      description: '72% cacao dark chocolate made with ethically sourced cocoa beans. Rich, smooth, and slightly bittersweet.',
      price: 4.99,
      image: '/products/chocolate.svg',
      stock: 95,
      rating: 4.8,
      reviewCount: 38,
      featured: true,
      categoryId: snacks.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // Create some sample reviews
  const allProducts = await prisma.product.findMany();
  const reviewComments = [
    'Absolutely love this! Will definitely buy again.',
    'Great quality for the price. Highly recommend.',
    'Fresh and delicious. My family loves it.',
    'Good product but wish the packaging was more eco-friendly.',
    'Best I\'ve ever tried! The flavor is amazing.',
  ];

  for (let i = 0; i < 5; i++) {
    await prisma.review.create({
      data: {
        rating: 4 + Math.floor(Math.random() * 2),
        comment: reviewComments[i],
        userId: user.id,
        productId: allProducts[i * 4].id,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📦 Created ${allProducts.length} products in ${categories.length} categories`);
  console.log(`👤 Demo user: demo@localstore.com / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
