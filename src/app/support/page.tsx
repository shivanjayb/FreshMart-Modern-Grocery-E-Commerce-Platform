'use client';

import { useState } from 'react';



const faqs = [
  {
    question: 'How long does delivery take?',
    answer:
      'We offer same-day delivery for orders placed before 2 PM. Standard delivery takes 1-2 business days. You can track your order in real-time from your orders page.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We accept returns within 7 days of purchase for non-perishable items. Perishable items can be returned within 24 hours if they don\'t meet our quality standards. Please contact us for a quick refund.',
  },
  {
    question: 'Do you offer free delivery?',
    answer:
      'Yes! Orders over $50 qualify for free delivery. For orders under $50, a flat delivery fee of $4.99 applies.',
  },
  {
    question: 'Are your products locally sourced?',
    answer:
      'We partner with local farms and artisan producers to bring you the freshest products. Over 70% of our produce comes from farms within 50 miles of our store.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'After placing your order, visit the "My Orders" page to see real-time tracking updates. You\'ll see your order progress through Placed → Processing → Shipped → Delivered.',
  },
  {
    question: 'Can I modify or cancel my order?',
    answer:
      'You can modify or cancel your order within 30 minutes of placing it. After that, please contact our support team for assistance.',
  },
];

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Customer Support</h1>
        <p>We&apos;re here to help! Find answers or get in touch.</p>
      </div>

      <div className="support-layout">
        {/* FAQs */}
        <div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
            Frequently Asked Questions
          </h2>
          <div className="faq-section">
            {faqs.map((faq, index) => (
              <details key={index}>
                <summary>{faq.question}</summary>
                <div className="faq-answer">{faq.answer}</div>
              </details>
            ))}
          </div>

          {/* Store Info */}
          <div
            className="checkout-section"
            style={{ marginTop: 'var(--space-8)' }}
          >
            <h2>📍 Visit Our Store</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              <p>📍 123 Market Street, Downtown</p>
              <p>🕐 Monday - Saturday: 8:00 AM - 9:00 PM</p>
              <p>🕐 Sunday: 9:00 AM - 7:00 PM</p>
              <p>📞 (555) 123-4567</p>
              <p>✉️ hello@freshmart.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
            Contact Us
          </h2>

          {status === 'success' ? (
            <div className="checkout-section" style={{ textAlign: 'center' }}>
              <div className="success-icon" style={{ margin: '0 auto var(--space-4)' }}>✓</div>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                Message Sent!
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                We&apos;ll get back to you within 24 hours.
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => setStatus('idle')}
                style={{ marginTop: 'var(--space-4)' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="checkout-section">
              {status === 'error' && (
                <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
                  ❌ Failed to send message. Please try again.
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label" htmlFor="support-name">Name</label>
                <input
                  id="support-name"
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label" htmlFor="support-email">Email</label>
                <input
                  id="support-email"
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label" htmlFor="support-subject">Subject</label>
                <input
                  id="support-subject"
                  type="text"
                  className="form-input"
                  value={formData.subject}
                  onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                  required
                  placeholder="How can we help?"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                <label className="form-label" htmlFor="support-message">Message</label>
                <textarea
                  id="support-message"
                  className="form-input form-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  required
                  placeholder="Tell us more about your issue..."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={status === 'loading'}
                style={{ width: '100%' }}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
