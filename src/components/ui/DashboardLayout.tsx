'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  Users,
} from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import {
  buildLocalizedPath,
  getDashboardRoute,
  getPublicRoute,
  normalizeLocale,
} from '@/lib/routes';

export interface NavItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  subItems?: { name: string; href: string }[];
}

export function DashboardLayout({
  children,
  navItems,
  lang,
  title,
}: {
  children: React.ReactNode;
  navItems: NavItem[];
  lang: string;
  title: string;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const currentLang = normalizeLocale(lang);

  // Close mobile sidebar on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  const toggleMenu = (name: string, defaultState: boolean) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: prev[name] !== undefined ? !prev[name] : !defaultState,
    }));
    if (!isSidebarOpen) setSidebarOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(getPublicRoute(currentLang, 'login'));
  };

  // Account switcher: detect available roles from user metadata and allow navigation
  const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [isAccountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!mounted || !user) return;

        const meta = (user.user_metadata as any) || {};

        // Support multiple possible shapes for roles in metadata
        let roles: string[] = [];
        if (Array.isArray(meta.roles)) roles = meta.roles;
        else if (typeof meta.role === 'string') roles = [meta.role];
        else if (meta.account && typeof meta.account === 'string')
          roles = [meta.account];

        // Normalize and filter known dashboard roles
        const known = ['student', 'teacher', 'institution', 'admin'];
        const filtered = Array.from(
          new Set(roles.map((r) => String(r).toLowerCase())),
        ).filter((r) => known.includes(r));

        if (filtered.length > 0) {
          setAvailableAccounts(filtered);
          setCurrentAccount((prev) => prev || filtered[0]);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const accountToPath = (account: string) => {
    switch (account) {
      case 'student':
        return getDashboardRoute(currentLang, 'student');
      case 'teacher':
        return getDashboardRoute(currentLang, 'teacher');
      case 'institution':
        return getDashboardRoute(currentLang, 'institution');
      case 'admin':
        return getDashboardRoute(currentLang, 'admin');
      default:
        return buildLocalizedPath(currentLang, '/');
    }
  };

  const handleSwitchAccount = (acc: string) => {
    setCurrentAccount(acc);
    setAccountOpen(false);
    router.push(accountToPath(acc));
  };

  const accountDisplayName = (acc: string) => {
    const map: Record<string, { fr: string; ar: string }> = {
      student: { fr: 'Étudiant', ar: 'طالب' },
      teacher: { fr: 'Professeur', ar: 'معلم' },
      institution: { fr: 'Institution', ar: 'مؤسسة' },
      admin: { fr: 'Admin', ar: 'مسؤول' },
    };
    const key = map[acc];
    if (!key) return acc;
    return lang === 'fr' ? key.fr : key.ar;
  };

  return (
    <div className="fixed inset-0 z-40 flex bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } absolute md:relative inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            {isSidebarOpen ? (
              <span className="font-bold text-lg text-slate-900 dark:text-white truncate">
                {title}
              </span>
            ) : (
              <span className="font-bold text-xl text-indigo-600 ml-2">
                {title.charAt(0)}
              </span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="hidden md:block p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href
              ? pathname === item.href
              : item.subItems?.some((sub) => pathname === sub.href);
            const isMenuOpen = openMenus[item.name] ?? isActive;

            if (item.subItems) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.name, isActive || false)}
                    className={`flex w-full items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    title={!isSidebarOpen ? item.name : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
                      />
                      {(isSidebarOpen || isMobileOpen) && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </div>
                    {(isSidebarOpen || isMobileOpen) && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                  {(isSidebarOpen || isMobileOpen) && isMenuOpen && (
                    <div className="pl-11 pr-3 space-y-1 py-1">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href as any}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                            pathname === sub.href
                              ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-medium'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={(item.href || '#') as any}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={!isSidebarOpen ? item.name : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
                />
                {(isSidebarOpen || isMobileOpen) && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
              !isSidebarOpen && !isMobileOpen ? 'justify-center' : ''
            }`}
            title={!isSidebarOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(isSidebarOpen || isMobileOpen) && (
              <span>{lang === 'fr' ? 'Déconnexion' : 'تسجيل الخروج'}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative h-full">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white truncate">
              {navItems
                .flatMap((item) =>
                  item.subItems ? [item, ...item.subItems] : [item],
                )
                .find((item) => item.href === pathname)?.name || title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Account switcher */}
            {availableAccounts.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((s) => !s)}
                  title={currentAccount || undefined}
                  className="flex items-center gap-3 px-3 py-2 rounded-md bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 hover:shadow-md transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-700/30 flex items-center justify-center text-indigo-600 dark:text-indigo-200">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'fr' ? 'Compte' : 'الحساب'}
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {currentAccount
                        ? accountDisplayName(currentAccount)
                        : lang === 'fr'
                          ? 'Compte'
                          : 'الحساب'}
                    </span>
                  </div>
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-xl z-20">
                    <div className="py-2">
                      {availableAccounts.map((acc) => (
                        <button
                          key={acc}
                          onClick={() => handleSwitchAccount(acc)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 ${currentAccount === acc ? 'font-medium text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}
                        >
                          <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                            <Users className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="truncate">
                              {accountDisplayName(acc)}
                            </div>
                            <div className="text-xs text-slate-400">{acc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Link
              href={buildLocalizedPath(currentLang, '/') as any}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block"
            >
              {lang === 'fr' ? 'Retourner au site' : 'العودة للموقع'}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
