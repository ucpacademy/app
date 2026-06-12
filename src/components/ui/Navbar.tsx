'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import type { Dictionary } from '@/utils/dictionary';

export function Navbar({
  dictionary,
  currentLang,
}: {
  dictionary?: Dictionary['navbar'];
  currentLang?: string;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide Navbar in admin and student dashboard layouts
  if (pathname?.match(/^\/[a-zA-Z0-9-]+\/(admin|student)(\/.*)?$/)) {
    return null;
  }

  const prefix = currentLang ? `/${currentLang}` : '';

  // Fallback to English strings if dictionary is missing during migration
  const dict = dictionary || {
    home: 'Home',
    dashboard: 'Dashboard',
    logout: 'Logout',
    explore_majors: 'Explore Majors',
    login: 'Log in',
    signup: 'Sign Up',
  };

  const isFr = currentLang === 'fr' || !currentLang;

  const navLinks = [
    { name: isFr ? 'Filières' : 'التخصصات', href: `${prefix}/majors` },
    {
      name: isFr ? 'Institutions' : 'المؤسسات',
      href: `${prefix}/institutions`,
    },
    { name: isFr ? 'Admissions' : 'القبول', href: `#` },
    { name: isFr ? 'Campus' : 'الحرم الجامعي', href: `#` },
    {
      name: isFr ? 'Espace Étudiant' : 'مساحة الطالب',
      href: `${prefix}/student`,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60 transition-colors duration-300 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center">
          <Link
            href={(prefix || '/') as any}
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
        <nav
          aria-label="Main"
          className="hidden md:flex items-center space-x-1 lg:space-x-2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href as any}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Link
            href={`${prefix}/login` as any}
            className="hidden sm:inline-flex text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-full px-4 py-2"
          >
            {dict.login}
          </Link>
          <Link
            href={`${prefix}/signup` as any}
            className="inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 px-6 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            {dict.signup}
          </Link>
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
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href as any}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href={`${prefix}/login` as any}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center text-base font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-4 py-3 rounded-xl transition-colors bg-slate-50 dark:bg-slate-900"
            >
              {dict.login}
            </Link>
            <Link
              href={`${prefix}/signup` as any}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center flex h-12 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-base font-semibold text-white shadow-sm transition-all"
            >
              {dict.signup}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
