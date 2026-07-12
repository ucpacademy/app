import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { type Lang } from '@/lib/i18n';

export function Shell({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: Lang;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-md shadow-sm dark:shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link
            href={`/${lang}`}
            className="group flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Excel - Groupe Des Instituts"
                width={48}
                height={48}
                priority
                className="object-contain"
              />
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher currentLang={lang} />
            <Link
              href={`/${lang}/login`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold text-sm transition-colors shadow-sm hover:shadow-md"
              title={lang === 'fr' ? 'Se connecter' : 'تسجيل الدخول'}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">
                {lang === 'fr' ? 'Connexion' : 'تسجيل'}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-12 md:py-16">{children}</main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">
                {lang === 'fr' ? 'À propos' : 'حول'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {lang === 'fr'
                  ? 'Excel - Groupe Des Instituts, plateforme moderne pour explorer les filières académiques'
                  : 'اكسل - مجموعة المعاهد، منصة حديثة لاستكشاف المسارات الأكاديمية'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">
                {lang === 'fr' ? 'Ressources' : 'موارد'}
              </h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li>
                  <Link
                    href={`/${lang}/majors`}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {lang === 'fr' ? 'Filières' : 'التخصصات'}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${lang}/student`}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {lang === 'fr' ? 'Espace étudiant' : 'مساحة الطالب'}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white mb-3">
                {lang === 'fr' ? 'Légal' : 'قانوني'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {lang === 'fr'
                  ? 'Tous droits réservés © 2026'
                  : 'جميع الحقوق محفوظة © 2026'}
              </p>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            <p>
              {lang === 'fr'
                ? 'Excel - Groupe Des Instituts | Construit avec ❤️ pour les étudiants'
                : 'اكسل - مجموعة المعاهد | بني بـ ❤️ للطلاب'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
