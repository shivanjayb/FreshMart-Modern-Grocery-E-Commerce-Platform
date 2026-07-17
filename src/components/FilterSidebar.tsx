'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface FilterSidebarProps {
  categories: { id: string; name: string; slug: string; icon: string }[];
  selectedCategory: string;
  sortBy: string;
  minPrice: string;
  maxPrice: string;
}

export default function FilterSidebar({
  categories,
  selectedCategory,
  sortBy,
  minPrice,
  maxPrice,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset page on filter change
    router.push(`/products?${params.toString()}`);
  };

  return (
    <aside className="filter-sidebar" aria-label="Product filters">
      {/* Sort */}
      <div className="filter-section">
        <h3>Sort By</h3>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => updateFilter('sort', e.target.value)}
          id="sort-select"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="newest">Newest</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Categories */}
      <div className="filter-section">
        <h3>Categories</h3>
        <label className="filter-option">
          <input
            type="checkbox"
            checked={!selectedCategory}
            onChange={() => updateFilter('category', '')}
          />
          All Products
        </label>
        {categories.map((cat) => (
          <label key={cat.id} className="filter-option">
            <input
              type="checkbox"
              checked={selectedCategory === cat.slug}
              onChange={() =>
                updateFilter(
                  'category',
                  selectedCategory === cat.slug ? '' : cat.slug
                )
              }
            />
            {cat.icon} {cat.name}
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h3>Price Range</h3>
        <div className="price-range">
          <input
            type="number"
            className="price-input"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            min="0"
            step="0.01"
            aria-label="Minimum price"
          />
          <span>—</span>
          <input
            type="number"
            className="price-input"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            min="0"
            step="0.01"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategory || sortBy || minPrice || maxPrice) && (
        <button
          className="btn btn-secondary"
          onClick={() => router.push('/products')}
          style={{ width: '100%' }}
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
