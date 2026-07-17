'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { totalItems, toggleDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" aria-label="FreshMart Home">
          <span className="navbar-logo-icon">🛒</span>
          <span>FreshMart</span>
        </Link>

        <div className="navbar-search">
          <span className="navbar-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            id="search-input"
          />
        </div>

        <div className="navbar-actions">
          <Link href="/products" className="navbar-user" aria-label="Browse products">
            <span>Shop</span>
          </Link>

          <button
            className="navbar-cart"
            onClick={() => toggleDrawer(true)}
            aria-label={`Shopping cart with ${totalItems} items`}
            id="cart-toggle"
          >
            🛒
            {totalItems > 0 && (
              <span className="cart-count" aria-live="polite">
                {totalItems}
              </span>
            )}
          </button>

          <Link href="/orders" className="navbar-user" aria-label="My orders">
            <span>📦</span>
            <span>Orders</span>
          </Link>

          <Link href="/login" className="navbar-user" aria-label="Account">
            <span>👤</span>
            <span>Login</span>
          </Link>

          <button
            className="navbar-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}
