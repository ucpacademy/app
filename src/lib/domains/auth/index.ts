import { type Lang } from '@/lib/i18n';
import { getDashboardRoute, getPublicRoute } from '@/lib/routes';

export type AuthUserType =
  'student' | 'institution_admin' | 'admin' | 'teacher';

export function getPostLoginRoute(lang: Lang, userType: AuthUserType) {
  switch (userType) {
    case 'institution_admin':
      return getDashboardRoute(lang, 'institution');
    case 'teacher':
      return getDashboardRoute(lang, 'teacher');
    case 'admin':
      return getDashboardRoute(lang, 'admin');
    default:
      return getDashboardRoute(lang, 'student');
  }
}

export function getAuthRoute(lang: Lang, mode: 'login' | 'signup') {
  return mode === 'signup'
    ? getPublicRoute(lang, 'signup')
    : getPublicRoute(lang, 'login');
}
