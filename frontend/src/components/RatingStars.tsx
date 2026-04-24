import React from 'react';
import { Star } from '@phosphor-icons/react';

interface RatingStarsProps {
  rating: number | null;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, interactive = false, onRate }) => {
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          weight={rating && rating >= star ? "fill" : "regular"}
          color={rating && rating >= star ? "#fbbf24" : "var(--text-secondary)"}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
          onClick={() => interactive && onRate && onRate(star)}
        />
      ))}
    </div>
  );
};

export default RatingStars;
