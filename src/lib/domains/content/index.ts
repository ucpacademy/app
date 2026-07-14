import { type Lang } from '@/lib/i18n';
import { getPublicRoute } from '@/lib/routes';

export interface ContentNavigationItem {
  name: string;
  href: string;
}

export function getContentNavigation(lang: Lang): ContentNavigationItem[] {
  const isFr = lang === 'fr';

  return [
    {
      name: isFr ? 'Blog' : 'المدونة',
      href: getPublicRoute(lang, 'blog'),
    },
    {
      name: isFr ? 'Événements' : 'الأحداث',
      href: getPublicRoute(lang, 'events'),
    },
    {
      name: isFr ? 'FAQ' : 'الأسئلة الشائعة',
      href: getPublicRoute(lang, 'faq'),
    },
  ];
}
