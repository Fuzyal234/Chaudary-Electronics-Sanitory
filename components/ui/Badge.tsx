import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold' | 'green' | 'red' | 'gray' | 'new' | 'sale';
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export default function Badge({ children, variant = 'primary', size = 'sm', pulse, className }: BadgeProps) {
  // Badges: soft pill, strong border, always legible.
  const base = "inline-flex items-center rounded-full font-display font-bold uppercase tracking-[0.1em] leading-none";

  const variants = {
    primary: 'bg-secondary/10 text-secondary border border-secondary/25 dark:text-blue-200 dark:border-white/25',
    secondary: 'bg-primary/8 text-primary border border-primary/20 dark:bg-white/8 dark:text-white dark:border-white/25',
    gold: 'bg-accent/12 text-accent-dark border border-accent/35 dark:text-accent-light',
    green: 'bg-stock/10 text-stock border border-stock/30',
    red: 'bg-red-500/10 text-red-600 border border-red-500/25',
    gray: 'bg-steel/10 text-steel border border-steel/25',
    new: 'bg-primary text-white dark:bg-white dark:text-primary',
    sale: 'bg-accent text-white',
  };

  const sizes = {
    sm: "text-[10px] px-2.5 py-1.5",
    md: "text-[11.5px] px-3 py-2",
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
