import { cn } from '@/lib/utils/cn';

export function Card({
  className,
  children,
  variant = 'default',
}: {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient';
}) {
  const variants = {
    default:
      'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm',
    elevated:
      'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-shadow',
    gradient:
      'rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white dark:from-slate-900 to-slate-50 dark:to-slate-800 p-6 shadow-sm',
  };
  return <div className={cn(variants[variant], className)}>{children}</div>;
}
