'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { languages, type Lang } from '@/lib/i18n';
import { buildLocalizedPath } from '@/lib/routes';

export function LanguageSwitcher({ currentLang }: { currentLang: Lang }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
      >
        <span className="uppercase">{currentLang}</span>
        <ChevronDown
          className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {languages.map((lang) => {
            const href = buildLocalizedPath(lang, pathname ?? '/');
            const isActive = currentLang === lang;

            return (
              <Link
                key={lang}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span>{lang === 'fr' ? 'Français' : 'العربية'}</span>
                <span className="text-xs uppercase">{lang}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
