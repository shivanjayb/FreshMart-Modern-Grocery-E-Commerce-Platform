import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Link from 'next/link';
import { Suspense } from 'react';
import type { Prisma } from '@prisma/client';

export const metadata = {
  title: 'Products — FreshMart',
  description: 'Browse our full selection of fresh produce, dairy, bakery, beverages, and snacks.',
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    search?: string;
  }>;
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category || '';
  const sortBy = params.sort || '';
  const minPrice = params.minPrice || '';
  const maxPrice = params.maxPrice || '';
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const perPage = 12;

  // Build where clause
  const where: Prisma.ProductWhereInput = {};
  if (category) {
    where.category = { slug: category };
  }
  if (minPrice) {
    where.price = { ...(where.price as object || {}), gte: parseFloat(minPrice) };
  }
  if (maxPrice) {
    where.price = { ...(where.price as object || {}), lte: parseFloat(maxPrice) };
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  // Build orderBy
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  switch (sortBy) {
    case 'price-asc':
      orderBy = { price: 'asc' };
      break;
    case 'price-desc':
      orderBy = { price: 'desc' };
      break;
    case 'rating':
      orderBy = { rating: 'desc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'name':
      orderBy = { name: 'asc' };
      break;
  }

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany(),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className="container">
      <div className="page-header">
        <h1>All Products</h1>
        <p>
          Showing {products.length} of {totalCount} products
          {category && ` in ${categories.find((c) => c.slug === category)?.name || category}`}
        </p>
      </div>

      <div className="catalog-layout">
        <FilterSidebar
          categories={categories}
          selectedCategory={category}
          sortBy={sortBy}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        <div>
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h2>No products found</h2>
              <p>Try adjusting your filters or search terms</p>
              <Link href="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Product pagination">
              <Link
                href={`/products?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                className={`pagination-btn ${page <= 1 ? '' : ''}`}
                aria-disabled={page <= 1}
                style={page <= 1 ? { pointerEvents: 'none', opacity: 0.4 } : {}}
              >
                ← Prev
              </Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/products?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                  className={`pagination-btn ${p === page ? 'active' : ''}`}
                >
                  {p}
                </Link>
              ))}
              <Link
                href={`/products?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                className="pagination-btn"
                aria-disabled={page >= totalPages}
                style={page >= totalPages ? { pointerEvents: 'none', opacity: 0.4 } : {}}
              >
                Next →
              </Link>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage(props: ProductsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner" />
          </div>
        </div>
      }
    >
      <ProductsContent {...props} />
    </Suspense>
  );
}
