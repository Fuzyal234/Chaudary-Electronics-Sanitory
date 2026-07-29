import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold' | 'green' | 'red' | 'gray' | 'new' | 'sale';
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export default function Badge({ children, variant = 'primary', size = 'sm', pulse, className }: BadgeProps) {
  const base = 'inline-flex items-center font-semibold rounded-full tracking-wide';

  const variants = {
    primary: 'bg-secondary/10 text-secondary border border-secondary/20',
    secondary: 'bg-primary/10 text-primary border border-primary/20',
    gold: 'bg-accent/20 text-amber-700 border border-accent/30',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    red: 'bg-red-50 text-red-600 border border-red-200',
    gray: 'bg-slate-100 text-slate-600 border border-slate-200',
    new: 'bg-accent text-white font-bold',
    sale: 'bg-red-500 text-white font-bold',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span
      className={cn(
        base,
        variants[variant],
        sizes[size],
        pulse && 'badge-new',
        className
      )}
    >
      {children}
    </span>
  );
}
