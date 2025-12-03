'use client';

import { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

type RatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
};

export default function Rating({ 
  value, 
  onChange, 
  readOnly = false,
  size = 20 
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (newValue: number) => {
    if (!readOnly && onChange) {
      onChange(newValue);
    }
  };

  const handleMouseEnter = (newValue: number) => {
    if (!readOnly) {
      setHoverValue(newValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(null);
    }
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= Math.floor(displayValue);
        const isHalfFilled = !isFilled && star - 0.5 <= displayValue;
        
        return (
          <span
            key={star}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={`${
              readOnly ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            {isFilled ? (
              <Star size={size} fill="currentColor" className="text-yellow-400" />
            ) : isHalfFilled ? (
              <StarHalf size={size} fill="currentColor" className="text-yellow-400" />
            ) : (
              <Star size={size} className="text-gray-300" />
            )}
          </span>
        );
      })}
    </div>
  );
}
