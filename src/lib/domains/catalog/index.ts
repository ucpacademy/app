import { type Lang } from '@/lib/i18n';
import { getPublicRoute } from '@/lib/routes';

export interface CatalogNavItem {
  name: string;
  href: string;
}

export function getCatalogNavLinks(lang: Lang): CatalogNavItem[] {
  const isFr = lang === 'fr';

  return [
    {
      name: isFr ? 'Filières' : 'التخصصات',
      href: getPublicRoute(lang, 'majors'),
    },
    {
      name: isFr ? 'Institutions' : 'المؤسسات',
      href: getPublicRoute(lang, 'institutions'),
    },
    {
      name: isFr ? 'Programmes' : 'البرامج',
      href: getPublicRoute(lang, 'programs'),
    },
  ];
}

export function getAudienceNavLinks(lang: Lang): CatalogNavItem[] {
  const isFr = lang === 'fr';

  return [
    {
      name: isFr ? 'Étudiants' : 'الطلاب',
      href: getPublicRoute(lang, 'forStudents'),
    },
    {
      name: isFr ? 'Enseignants' : 'المعلمون',
      href: getPublicRoute(lang, 'forTeachers'),
    },
    {
      name: isFr ? 'Institutions' : 'المؤسسات',
      href: getPublicRoute(lang, 'forInstitutions'),
    },
    {
      name: isFr ? 'Plateforme' : 'المنصة',
      href: getPublicRoute(lang, 'platform'),
    },
  ];
}
