// src/components/Rating.tsx
import React, { useState } from 'react';
import './Rating.css';

interface RatingProps {
  initialRating: number;
  maxRating?: number; // defaults to 5
  interactive?: boolean;
  onRatingChange?: (newRating: number) => void;
}

const Rating: React.FC<RatingProps> = ({
  initialRating,
  maxRating = 5,
  interactive = false,
  onRatingChange,
}) => {
  const [rating, setRating] = useState(initialRating);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRating = parseFloat(e.target.value);
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="rating-container">
      {interactive ? (
        <>
          <input
            type="range"
            min="0"
            max={maxRating}
            step="0.1"
            value={rating}
            onChange={handleChange}
            className="rating-slider"
          />
          <span className="rating-value">{rating.toFixed(1)} / {maxRating}</span>
        </>
      ) : (
        <span className="rating-value">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
};

export default Rating;
