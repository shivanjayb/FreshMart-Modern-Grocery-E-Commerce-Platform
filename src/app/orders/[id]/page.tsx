import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { productEmojis } from '@/components/ProductCard';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const { id } = await params;
  const { success } = await searchParams;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) notFound();

  const trackingSteps = [
    { key: 'placed', label: 'Order Placed', description: 'Your order has been received', icon: '📋' },
    { key: 'processing', label: 'Processing', description: 'We are preparing your items', icon: '⚙️' },
    { key: 'shipped', label: 'Shipped', description: 'Your order is on its way', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', description: 'Your order has been delivered', icon: '✅' },
  ];

  const statusIndex = trackingSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="container">
      {success === 'true' && (
        <div className="success-page" style={{ paddingBottom: 'var(--space-8)' }}>
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p>
            Thank you for your purchase. Your order #{order.id.slice(0, 8).toUpperCase()} has
            been confirmed and is being prepared.
          </p>
        </div>
      )}

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">›</span>
        <Link href="/orders">Orders</Link>
        <span className="separator">›</span>
        <span>#{order.id.slice(0, 8).toUpperCase()}</span>
      </nav>

      <div className="page-header">
        <h1>Order #{order.id.slice(0, 8).toUpperCase()}</h1>
        <p>
          Placed on{' '}
          {new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-8)', padding: 'var(--space-6) 0' }}>
        <div>
          {/* Order Tracking */}
          <div className="checkout-section" style={{ marginBottom: 'var(--space-6)' }}>
            <h2>📍 Order Tracking</h2>
            <div className="order-tracking">
              {trackingSteps.map((step, index) => {
                const isCompleted = index <= statusIndex;
                const isActive = index === statusIndex;
                return (
                  <div
                    key={step.key}
                    className={`tracking-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    <div className="tracking-dot">
                      {isCompleted ? '✓' : step.icon}
                    </div>
                    <div className="tracking-info">
                      <h4>{step.label}</h4>
                      <p>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="checkout-section">
            <h2>📦 Items</h2>
            <div className="cart-items">
              {order.items.map((item) => (
                <div key={item.id} className="cart-item" style={{ gridTemplateColumns: '60px 1fr auto' }}>
                  <div className="cart-item-image" style={{ width: 60, height: 60, fontSize: '1.8rem' }}>
                    {productEmojis[item.product.slug] || '📦'}
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.product.name}</h3>
                    <p>
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="cart-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="cart-summary">
            <h2>Summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="checkout-section" style={{ marginTop: 'var(--space-4)' }}>
            <h2>🏠 Shipping To</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              <strong>{order.shippingName}</strong><br />
              {order.shippingAddress}<br />
              {order.shippingCity}, {order.shippingZip}<br />
              📞 {order.shippingPhone}<br />
              ✉️ {order.shippingEmail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
