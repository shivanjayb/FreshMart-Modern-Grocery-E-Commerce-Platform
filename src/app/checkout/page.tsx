'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, subtotal, tax, total, clearCart, totalItems } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shipping = subtotal >= 50 ? 0 : 4.99;
  const grandTotal = total + shipping;

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shipping: form,
          subtotal,
          tax,
          total: grandTotal,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        router.push(`/orders/${data.orderId}?success=true`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to place order');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some items before checking out.</p>
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
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="checkout-layout">
          <div className="checkout-form">
            {error && (
              <div className="alert alert-error">❌ {error}</div>
            )}

            <div className="checkout-section">
              <h2>📦 Shipping Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
                <div className="form-group form-full">
                  <label className="form-label" htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="form-input"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="123 Market Street"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="city">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className="form-input"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="San Francisco"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="zip">ZIP Code</label>
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    className="form-input"
                    value={form.zip}
                    onChange={handleChange}
                    required
                    placeholder="94102"
                  />
                </div>
                <div className="form-group form-full">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h2>💳 Payment</h2>
              <div
                style={{
                  padding: 'var(--space-6)',
                  background: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                }}
              >
                <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>
                  🔒 Secure Payment
                </p>
                <p style={{ fontSize: 'var(--text-sm)' }}>
                  This is a demo store — no real payment required. Click &quot;Place Order&quot; to simulate a purchase.
                </p>
              </div>
            </div>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="cart-summary-row">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--color-success)' : undefined, fontWeight: 600 }}>
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: 'var(--space-4)' }}
            >
              {loading ? 'Placing Order...' : `Place Order — $${grandTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
