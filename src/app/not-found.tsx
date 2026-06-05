import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-semibold tracking-tighter text-slate-900 dark:text-white mb-4">
        404
      </h1>
      <h2 className="text-2xl font-medium text-slate-700 dark:text-slate-300 mb-8">
        Page not found.
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href={'/' as any}>
        <Button
          size="lg"
          className="rounded-full px-8 bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
        >
          Return Home
        </Button>
      </Link>
    </div>
  );
}
