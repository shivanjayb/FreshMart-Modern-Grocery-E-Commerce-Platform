import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StarRating, productEmojis } from '@/components/ProductCard';
import ProductCard from '@/components/ProductCard';
import AddToCartButton from '@/components/AddToCartButton';
import ReviewForm, { ReviewList } from '@/components/ReviewForm';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} — FreshMart`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) notFound();

  const emoji = productEmojis[product.slug] || '📦';

  // Get related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true },
    take: 4,
  });

  const serializedReviews = product.reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">›</span>
        <Link href="/products">Products</Link>
        <span className="separator">›</span>
        <Link href={`/products?category=${product.category.slug}`}>
          {product.category.name}
        </Link>
        <span className="separator">›</span>
        <span>{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="product-detail">
        <div className="product-detail-image">{emoji}</div>

        <div className="product-detail-info">
          <div>
            <span
              className="badge badge-primary"
              style={{ marginBottom: 'var(--space-3)', display: 'inline-block' }}
            >
              {product.category.name}
            </span>
            <h1>{product.name}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <StarRating rating={product.rating} />
            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="product-detail-price">
            ${product.price.toFixed(2)}
          </div>

          <p className="product-detail-description">{product.description}</p>

          <div className="stock-status">
            <span
              className={`stock-dot ${product.stock < 10 ? 'low' : product.stock === 0 ? 'out' : ''}`}
            />
            {product.stock === 0
              ? 'Out of stock'
              : product.stock < 10
              ? `Only ${product.stock} left in stock`
              : 'In stock'}
          </div>

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              slug: product.slug,
              image: product.image,
              stock: product.stock,
            }}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="section-header">
          <div>
            <h2>Customer Reviews</h2>
            <p>{product.reviewCount} reviews</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
          <div>
            <ReviewList reviews={serializedReviews} />
          </div>
          <div>
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section">
          <div className="section-header">
            <div>
              <h2>You Might Also Like</h2>
              <p>More from {product.category.name}</p>
            </div>
          </div>
          <div className="products-grid">
            {relatedProducts.map((rp) => (
              <ProductCard
                key={rp.id}
                id={rp.id}
                name={rp.name}
                slug={rp.slug}
                price={rp.price}
                image={rp.image}
                rating={rp.rating}
                reviewCount={rp.reviewCount}
                category={rp.category.name}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
