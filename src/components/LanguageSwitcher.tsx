import Link from 'next/link';
import { languages, type Lang } from '@/lib/i18n';

export function LanguageSwitcher({ currentLang }: { currentLang: Lang }) {
  return (
    <nav className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 h-10">
      {languages.map((lang) => (
        <Link
          key={lang}
          href={`/${lang}`}
          className={`flex items-center justify-center rounded-md px-3 h-8 text-xs font-medium transition-all duration-200 ${
            currentLang === lang
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {lang.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
