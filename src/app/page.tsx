import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 8,
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    }),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">🌟 New — Same-day delivery available</div>
            <h1>
              Fresh From Your{' '}
              <span className="highlight">Local Store</span>
              , Delivered to You
            </h1>
            <p>
              Discover farm-fresh produce, artisan bakery goods, and everyday
              essentials from FreshMart — your trusted neighborhood grocery store,
              now just a click away.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn btn-accent btn-lg">
                Shop Now →
              </Link>
              <Link href="/support" className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
                Learn More
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">500+</div>
                <div className="hero-stat-label">Products</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">2K+</div>
                <div className="hero-stat-label">Happy Customers</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">4.9</div>
                <div className="hero-stat-label">Store Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Shop by Category</h2>
              <p>Browse our curated selection of fresh, quality products</p>
            </div>
            <Link href="/products" className="btn btn-secondary btn-sm">
              View All →
            </Link>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                href={`/products?category=${cat.slug}`}
                key={cat.id}
                className="category-card"
              >
                <div className="category-card-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat._count.products} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Featured Products</h2>
              <p>Hand-picked favorites from our store</p>
            </div>
            <Link href="/products" className="btn btn-secondary btn-sm">
              See All Products →
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                image={product.image}
                rating={product.rating}
                reviewCount={product.reviewCount}
                category={product.category.name}
                featured={product.featured}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="section">
        <div className="container">
          <div className="promo-banner">
            <div>
              <h2>Free Delivery on Orders Over $50</h2>
              <p>
                Enjoy free same-day delivery on qualifying orders. Fresh from our
                store to your doorstep.
              </p>
            </div>
            <Link href="/products" className="btn btn-accent btn-lg" style={{ position: 'relative', zIndex: 1 }}>
              Start Shopping →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
