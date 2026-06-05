'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import type { Dictionary } from '@/utils/dictionary';

export function Navigation({
  dictionary,
}: {
  dictionary?: Dictionary['navbar'];
}) {
  const pathname = usePathname();
  const pathnameParts = pathname.split('/').filter(Boolean);
  const currentLang = pathnameParts[0] as 'fr' | 'ar' | undefined;

  // Cleanly hide the Navbar on authentication pages
  if (pathname.endsWith('/login') || pathname.endsWith('/signup')) {
    return null;
  }

  return <Navbar dictionary={dictionary} currentLang={currentLang} />;
}
