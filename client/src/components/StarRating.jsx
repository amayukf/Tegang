import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export default function StarRating({ rating = 0, size = 14, showValue = false, count = null }) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.floor(r);
  const hasHalf = r - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} size={size} className="fill-amber-400 text-amber-400" strokeWidth={2} />
      ))}
      {hasHalf && <StarHalf key="h" size={size} className="fill-amber-400 text-amber-400" strokeWidth={2} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} size={size} className="text-neutral-200" strokeWidth={2} />
      ))}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-neutral-800 tabular-nums">
          {r.toFixed(1)}
        </span>
      )}
      {typeof count === 'number' && (
        <span className="ml-1 text-sm text-neutral-500 tabular-nums">
          ({count})
        </span>
      )}
    </span>
  );
}
