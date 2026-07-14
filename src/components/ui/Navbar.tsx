'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  UserCircle,
  LogOut,
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import type { Dictionary } from '@/utils/dictionary';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { type Lang } from '@/lib/i18n';
import {
  buildLocalizedPath,
  getDashboardRoute,
  getPublicRoute,
} from '@/lib/routes';
import { getAudienceNavLinks, getCatalogNavLinks } from '@/lib/domains/catalog';
import { getDashboardQuickLinks } from '@/lib/domains/dashboard';

export function Navbar({
  dictionary,
  currentLang,
}: {
  dictionary?: Dictionary['navbar'];
  currentLang?: string;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [openMegaMenu, setOpenMegaMenu] = useState<'discover' | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoadingAuth(false);
    };
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMegaMenu &&
        !(event.target as HTMLElement).closest('[data-nav-menu]')
      ) {
        setOpenMegaMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMegaMenu]);

  // Hide Navbar in all dashboard layouts
  if (
    pathname?.match(
      /^\/[a-zA-Z0-9-]+\/(admin|student|institution|teacher)(\/.*)?$/,
    )
  ) {
    return null;
  }

  const activeLang = (currentLang === 'ar' ? 'ar' : 'fr') as Lang;

  const isFr = activeLang === 'fr';

  // Fallback to localized strings when dictionary is missing
  const dict = dictionary || {
    home: isFr ? 'Accueil' : 'الرئيسية',
    dashboard: isFr ? 'Tableau de bord' : 'لوحة التحكم',
    logout: isFr ? 'Se déconnecter' : 'تسجيل الخروج',
    explore_majors: isFr ? 'Explorer les filières' : 'استكشف التخصصات',
    login: isFr ? 'Connexion' : 'تسجيل الدخول',
    signup: isFr ? 'Créer un compte' : 'إنشاء حساب',
  };
  const navLinks = getCatalogNavLinks(activeLang);
  const audienceLinks = getAudienceNavLinks(activeLang);
  const dashboardLinks = getDashboardQuickLinks(activeLang);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60 transition-colors duration-300 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center">
          <Link
            href={buildLocalizedPath(activeLang, '/') as any}
            className="group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-opacity hover:opacity-80"
            aria-label="Excel Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Excel
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div
          className="hidden md:flex items-center gap-2 lg:gap-3"
          data-nav-menu
        >
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenMegaMenu((prev) =>
                  prev === 'discover' ? null : 'discover',
                )
              }
              className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
            >
              {isFr ? 'Découvrir' : 'استكشف'}
            </button>

            {openMegaMenu === 'discover' && (
              <div className="absolute left-0 top-full mt-3 w-[560px] rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-950">
                <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                      {isFr ? 'Navigation principale' : 'التنقل الرئيسي'}
                    </p>
                    <div className="mt-3 space-y-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href as any}
                          onClick={() => setOpenMegaMenu(null)}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <span>{link.name}</span>
                          <span className="text-slate-400">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                      {isFr ? 'Par public' : 'حسب الجمهور'}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {audienceLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href as any}
                          onClick={() => setOpenMegaMenu(null)}
                          className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href={getPublicRoute(activeLang, 'programs') as any}
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isFr ? 'Programmes' : 'البرامج'}
          </Link>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLang={activeLang} />
          <ThemeSwitcher />

          {isLoadingAuth ? (
            <div className="w-20 h-8 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-full hidden sm:block" />
          ) : user ? (
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <UserCircle className="w-6 h-6" />
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 mr-1 transition-transform group-hover:rotate-180" />
              </button>

              <div className="absolute top-full right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {user.email}
                  </p>
                </div>
                <div className="px-2 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {isFr ? 'Mes Espaces' : 'مساحاتي'}
                  </p>
                  {dashboardLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href as any}
                      className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="px-2">
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {dict.logout || (isFr ? 'Se déconnecter' : 'تسجيل الخروج')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                href={getPublicRoute(activeLang, 'login') as any}
                className="hidden sm:inline-flex text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-full px-4 py-2"
              >
                {dict.login}
              </Link>
              <Link
                href={getPublicRoute(activeLang, 'signup') as any}
                className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 px-6 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              >
                {dict.signup}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-start">
            <LanguageSwitcher currentLang={activeLang} />
          </div>

          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href as any}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {isFr ? 'Par public' : 'حسب الجمهور'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {audienceLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href as any}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-indigo-900/20"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Dynamic Auth Experience */}
          {!isLoadingAuth && user ? (
            <>
              <div className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-800">
                <div className="px-4 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {user.email}
                  </p>
                </div>
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {isFr ? 'Mes Espaces' : 'مساحاتي'}
                </p>
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href as any}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col space-y-3 pt-2 pb-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    supabase.auth.signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  {dict.logout || (isFr ? 'Se déconnecter' : 'تسجيل الخروج')}
                </button>
              </div>
            </>
          ) : !isLoadingAuth && !user ? (
            <div className="flex flex-col space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href={getPublicRoute(activeLang, 'login') as any}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center text-base font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-4 py-3 rounded-xl transition-colors bg-slate-50 dark:bg-slate-900"
              >
                {dict.login}
              </Link>
              <Link
                href={getPublicRoute(activeLang, 'signup') as any}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center flex h-12 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-base font-semibold text-white shadow-sm transition-all"
              >
                {dict.signup}
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </header>
  );
}
