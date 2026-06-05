import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['fr', 'ar'];
const defaultLocale = 'fr';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already starts with a locale (e.g., /fr or /ar/dashboard)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // If no locale is found, redirect to the default locale
  const cleanPathname = pathname === '/' ? '' : pathname;
  return NextResponse.redirect(
    new URL(`/${defaultLocale}${cleanPathname}`, request.url),
  );
}

export const config = {
  matcher: [
    // Skip Next.js internal paths and public files (like favicon.ico)
    '/((?!_next|api|.*\\.).*)',
  ],
};
