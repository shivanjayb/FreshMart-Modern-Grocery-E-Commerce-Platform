import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = {
  title: 'My Orders — FreshMart',
  description: 'View and track your order history.',
};

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Once you place an order, it will appear here.</p>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list" style={{ padding: 'var(--space-6) 0' }}>
          {orders.map((order) => {
            const statusColors: Record<string, string> = {
              placed: 'badge-warning',
              processing: 'badge-primary',
              shipped: 'badge-primary',
              delivered: 'badge-success',
            };

            return (
              <Link
                href={`/orders/${order.id}`}
                key={order.id}
                className="order-card"
              >
                <div className="order-card-header">
                  <div>
                    <div className="order-id">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <span className={`badge ${statusColors[order.status] || 'badge-primary'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-items-preview">
                  {order.items.slice(0, 5).map((item) => (
                    <div key={item.id} className="order-item-thumb">
                      📦
                    </div>
                  ))}
                  {order.items.length > 5 && (
                    <div
                      className="order-item-thumb"
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      +{order.items.length - 5}
                    </div>
                  )}
                </div>
                <div className="order-card-footer">
                  <div>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="order-total">${order.total.toFixed(2)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
