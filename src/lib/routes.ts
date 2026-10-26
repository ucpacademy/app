import { languages, type Lang } from './i18n';

export type DashboardRole = 'student' | 'teacher' | 'institution' | 'admin';

export type PublicRouteKey =
  | 'home'
  | 'majors'
  | 'institutions'
  | 'programs'
  | 'forStudents'
  | 'forTeachers'
  | 'forInstitutions'
  | 'platform'
  | 'login'
  | 'signup'
  | 'blog'
  | 'events'
  | 'faq';

export const publicRoutes: Record<PublicRouteKey, string> = {
  home: '/',
  majors: '/majors',
  institutions: '/institutions',
  programs: '/programs',
  forStudents: '/for-students',
  forTeachers: '/for-teachers',
  forInstitutions: '/for-institutions',
  platform: '/platform',
  login: '/login',
  signup: '/signup',
  blog: '/blog',
  events: '/events',
  faq: '/faq',
};

export const dashboardRoutes: Record<DashboardRole, string> = {
  student: '/student',
  teacher: '/teacher',
  institution: '/institution',
  admin: '/admin',
};

export function normalizeLocale(lang: Lang | string): Lang {
  return languages.includes(lang as Lang) ? (lang as Lang) : 'fr';
}

export function buildLocalizedPath(lang: Lang | string, path: string): string {
  const normalizedLang = normalizeLocale(lang);
  const safePath =
    path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;
  const segments = safePath.split('/').filter(Boolean);

  if (!segments.length) {
    return `/${normalizedLang}`;
  }

  if (segments[0] && languages.includes(segments[0] as Lang)) {
    segments[0] = normalizedLang;
    return `/${segments.join('/')}`;
  }

  return `/${normalizedLang}${safePath}`;
}

export function getPublicRoute(lang: Lang | string, routeKey: PublicRouteKey) {
  return buildLocalizedPath(lang, publicRoutes[routeKey]);
}

export function getDashboardRoute(lang: Lang | string, role: DashboardRole) {
  return buildLocalizedPath(lang, dashboardRoutes[role]);
}
