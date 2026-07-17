'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { productEmojis } from '@/components/ProductCard';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    tax,
    total,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven&apos;t added any items yet. Start browsing our products!</p>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Shopping Cart</h1>
        <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {productEmojis[item.slug] || item.image}
              </div>
              <div className="cart-item-info">
                <h3>
                  <Link href={`/products/${item.slug}`}>{item.name}</Link>
                </h3>
                <p>${item.price.toFixed(2)} each</p>
              </div>
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div className="cart-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="btn btn-secondary btn-sm"
            style={{ alignSelf: 'flex-start', marginTop: 'var(--space-2)' }}
          >
            🗑️ Clear Cart
          </button>
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="cart-summary-row">
            <span>Subtotal ({totalItems} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
              {subtotal >= 50 ? 'Free' : '$4.99'}
            </span>
          </div>
          <div className="cart-summary-row total">
            <span>Total</span>
            <span>${(total + (subtotal >= 50 ? 0 : 4.99)).toFixed(2)}</span>
          </div>
          {subtotal < 50 && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
              Add ${(50 - subtotal).toFixed(2)} more for free shipping!
            </p>
          )}
          <Link href="/checkout" className="btn btn-primary btn-lg">
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: 'var(--space-3)', textAlign: 'center' }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
