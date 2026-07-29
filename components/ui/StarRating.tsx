import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  reviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export default function StarRating({ rating, reviews, size = 'sm', showCount = true, className }: StarRatingProps) {
  const sizes = { sm: 12, md: 16, lg: 20 };
  const px = sizes[size];
  const filled = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={px}
            className={cn(
              'transition-colors',
              i < filled
                ? 'fill-accent text-accent'
                : i === filled && hasHalf
                ? 'fill-accent/50 text-accent'
                : 'fill-slate-200 text-slate-300'
            )}
          />
        ))}
      </div>
      {showCount && reviews !== undefined && (
        <span className={cn('text-slate-500', size === 'sm' ? 'text-[11px]' : 'text-sm')}>
          ({reviews})
        </span>
      )}
    </div>
  );
}
