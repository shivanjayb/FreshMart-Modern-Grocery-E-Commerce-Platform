'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { productEmojis } from './ProductCard';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    toggleDrawer,
    removeItem,
    updateQuantity,
    totalItems,
    subtotal,
    tax,
    total,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <>
      <div
        className="cart-drawer-overlay"
        onClick={() => toggleDrawer(false)}
        aria-hidden="true"
      />
      <aside
        className="cart-drawer"
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        <div className="cart-drawer-header">
          <h2>Cart ({totalItems})</h2>
          <button
            className="cart-drawer-close"
            onClick={() => toggleDrawer(false)}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <div className="empty-state-icon">🛒</div>
              <h2 style={{ fontSize: 'var(--text-lg)' }}>Your cart is empty</h2>
              <p>Add some products to get started!</p>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item" style={{ gridTemplateColumns: '50px 1fr auto' }}>
                  <div className="cart-item-image" style={{ width: 50, height: 50, fontSize: '1.5rem' }}>
                    {productEmojis[item.slug] || item.image}
                  </div>
                  <div className="cart-item-info">
                    <h3 style={{ fontSize: 'var(--text-sm)' }}>{item.name}</h3>
                    <p>${item.price.toFixed(2)} each</p>
                    <div className="quantity-selector" style={{ marginTop: 'var(--space-2)' }}>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        style={{ width: 28, height: 28, fontSize: '0.9rem' }}
                      >
                        −
                      </button>
                      <span className="quantity-value" style={{ width: 32, fontSize: 'var(--text-sm)' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        style={{ width: 28, height: 28, fontSize: '0.9rem' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      style={{ marginTop: 'var(--space-2)' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link
              href="/cart"
              className="btn btn-primary btn-lg"
              onClick={() => toggleDrawer(false)}
              style={{ width: '100%', marginTop: 'var(--space-4)', textAlign: 'center' }}
            >
              View Cart & Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
