'use client';

import { useState } from 'react';
import { StarRating } from '@/components/ProductCard';

interface ReviewFormProps {
  productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment }),
      });
      if (res.ok) {
        setStatus('success');
        setRating(0);
        setComment('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
        Write a Review
      </h3>

      {status === 'success' && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>
          ✅ Review submitted successfully!
        </div>
      )}

      {status === 'error' && (
        <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>
          ❌ Please log in to submit a review.
        </div>
      )}

      <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
        <label className="form-label">Rating</label>
        <div className="star-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={star <= (hoverRating || rating) ? 'active' : ''}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
        <label className="form-label" htmlFor="review-comment">
          Your Review
        </label>
        <textarea
          id="review-comment"
          className="form-input form-textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={rating === 0 || !comment.trim() || status === 'loading'}
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export function ReviewList({
  reviews,
}: {
  reviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: { name: string };
  }[];
}) {
  if (reviews.length === 0) {
    return (
      <p style={{ color: 'var(--color-text-muted)', padding: 'var(--space-6) 0' }}>
        No reviews yet. Be the first to share your thoughts!
      </p>
    );
  }

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-header">
            <div className="review-author">
              <div className="review-avatar">
                {review.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="review-author-name">{review.user.name}</div>
                <StarRating rating={review.rating} />
              </div>
            </div>
            <span className="review-date">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <p className="review-comment">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
