import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name">🛒 FreshMart</div>
            <p>
              Your neighborhood grocery store, now online. Fresh produce, artisan goods,
              and everyday essentials delivered to your door.
            </p>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link href="/products?category=fruits-vegetables">Fruits & Vegetables</Link></li>
              <li><Link href="/products?category=dairy-eggs">Dairy & Eggs</Link></li>
              <li><Link href="/products?category=bakery">Bakery</Link></li>
              <li><Link href="/products?category=beverages">Beverages</Link></li>
              <li><Link href="/products?category=snacks">Snacks</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><Link href="/support">Customer Support</Link></li>
              <li><Link href="/orders">Track Order</Link></li>
              <li><Link href="/support">FAQs</Link></li>
              <li><Link href="/support">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Store Info</h4>
            <ul>
              <li>📍 123 Market Street</li>
              <li>🕐 Mon-Sat: 8AM - 9PM</li>
              <li>📞 (555) 123-4567</li>
              <li>✉️ hello@freshmart.com</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FreshMart. All rights reserved.</p>
          <p>Made with ❤️ for our local community</p>
        </div>
      </div>
    </footer>
  );
}
