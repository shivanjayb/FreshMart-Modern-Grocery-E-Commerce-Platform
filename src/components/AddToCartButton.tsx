'use client';

import { useCart } from '@/context/CartContext';
import { productEmojis } from '@/components/ProductCard';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    slug: string;
    image: string;
    stock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const emoji = productEmojis[product.slug] || '📦';

  return (
    <div>
      <div className="quantity-selector" style={{ marginBottom: 'var(--space-4)' }}>
        <button
          className="quantity-btn"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="quantity-value">{quantity}</span>
        <button
          className="quantity-btn"
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        className="btn btn-primary btn-lg"
        onClick={() =>
          addItem(
            { id: product.id, name: product.name, price: product.price, image: emoji, slug: product.slug },
            quantity
          )
        }
        disabled={product.stock === 0}
        style={{ width: '100%' }}
      >
        {product.stock === 0 ? 'Out of Stock' : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
      </button>
    </div>
  );
}
