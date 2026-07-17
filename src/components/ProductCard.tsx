'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  featured?: boolean;
}

const productEmojis: Record<string, string> = {
  'organic-red-apples': '🍎',
  'fresh-avocados': '🥑',
  'baby-spinach-pack': '🥬',
  'sweet-strawberries': '🍓',
  'farm-fresh-whole-milk': '🥛',
  'free-range-eggs': '🥚',
  'artisan-cheddar-cheese': '🧀',
  'greek-yogurt-plain': '🥣',
  'sourdough-bread-loaf': '🍞',
  'butter-croissants': '🥐',
  'chocolate-chip-cookies': '🍪',
  'multigrain-bagels': '🥯',
  'cold-brew-coffee': '☕',
  'fresh-orange-juice': '🍊',
  'herbal-tea-collection': '🍵',
  'sparkling-water-6pack': '💧',
  'trail-mix-premium': '🥜',
  'organic-hummus': '🫘',
  'sea-salt-potato-chips': '🍟',
  'dark-chocolate-bar': '🍫',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= Math.round(rating) ? '' : 'star-empty'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

export { StarRating, productEmojis };

export default function ProductCard({
  id,
  name,
  slug,
  price,
  rating,
  reviewCount,
  category,
  featured,
}: ProductCardProps) {
  const { addItem } = useCart();
  const emoji = productEmojis[slug] || '📦';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price, image: emoji, slug });
  };

  return (
    <article className="product-card" id={`product-${slug}`}>
      <div className="product-card-image">
        <span className="product-emoji" aria-hidden="true">
          {emoji}
        </span>
        {featured && (
          <div className="product-card-badge">
            <span className="badge badge-primary">Featured</span>
          </div>
        )}
      </div>
      <div className="product-card-body">
        <span className="product-card-category">{category}</span>
        <h3 className="product-card-name">
          <Link href={`/products/${slug}`}>{name}</Link>
        </h3>
        <div className="product-card-rating">
          <StarRating rating={rating} />
          <span>({reviewCount})</span>
        </div>
        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="currency">$</span>
            {price.toFixed(2)}
          </div>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
            title="Add to cart"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
