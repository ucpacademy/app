import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Building2,
  Calendar,
  GitBranch,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Star,
  User,
  Users,
} from 'lucide-react';
import { type Lang } from '@/lib/i18n';
import { getDashboardRoute } from '@/lib/routes';
import type { DashboardRole } from '@/lib/routes';

export interface DashboardNavItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  subItems?: { name: string; href: string }[];
}

export function getAdminDashboardNavItems(lang: Lang): DashboardNavItem[] {
  const isFr = lang === 'fr';

  return [
    {
      name: isFr ? 'Tableau de bord' : 'لوحة القيادة',
      href: getDashboardRoute(lang, 'admin'),
      icon: LayoutDashboard,
    },
    {
      name: isFr ? 'Majeurs & Branches' : 'التخصصات والفروع',
      href: getDashboardRoute(lang, 'admin') + '/majors',
      icon: GraduationCap,
    },
    {
      name: isFr ? 'Institutions' : 'المؤسسات',
      href: getDashboardRoute(lang, 'admin') + '/institutions',
      icon: Building2,
    },
    {
      name: isFr ? 'Programmes' : 'البرامج',
      href: getDashboardRoute(lang, 'admin') + '/programs',
      icon: BookOpen,
    },
    {
      name: isFr ? 'Événements' : 'الأحداث',
      href: getDashboardRoute(lang, 'admin') + '/events/list',
      icon: Calendar,
    },
    {
      name: isFr ? 'Blog' : 'المدونة',
      href: getDashboardRoute(lang, 'admin') + '/blog/list',
      icon: MessageSquare,
    },
    {
      name: isFr ? 'Avis' : 'التقييمات',
      href: getDashboardRoute(lang, 'admin') + '/reviews/list',
      icon: Star,
    },
    {
      name: isFr ? 'FAQ' : 'الأسئلة المتكررة',
      href: getDashboardRoute(lang, 'admin') + '/faqs/list',
      icon: HelpCircle,
    },
    {
      name: isFr ? 'Demandes' : 'الاستفسارات',
      href: getDashboardRoute(lang, 'admin') + '/inquiries',
      icon: MessageSquare,
    },
    {
      name: isFr ? 'Étudiants (Bientôt)' : 'الطلاب (قريباً)',
      href: getDashboardRoute(lang, 'admin') + '/students',
      icon: Users,
    },
    {
      name: isFr ? 'Paramètres (Bientôt)' : 'الإعدادات (قريباً)',
      href: getDashboardRoute(lang, 'admin') + '/settings',
      icon: Settings,
    },
  ];
}

export function getStudentDashboardNavItems(lang: Lang): DashboardNavItem[] {
  const isFr = lang === 'fr';

  return [
    {
      name: isFr ? 'Tableau de bord' : 'لوحة القيادة',
      href: getDashboardRoute(lang, 'student'),
      icon: LayoutDashboard,
    },
    {
      name: isFr ? 'Mon Profil (Bientôt)' : 'ملفي الشخصي (قريباً)',
      href: getDashboardRoute(lang, 'student') + '/profile',
      icon: User,
    },
    {
      name: isFr ? 'Cours Favoris (Bientôt)' : 'الدورات المفضلة (قريباً)',
      href: getDashboardRoute(lang, 'student') + '/courses',
      icon: BookOpen,
    },
    {
      name: isFr ? 'Branches Favorites (Bientôt)' : 'الفروع المفضلة (قريباً)',
      href: getDashboardRoute(lang, 'student') + '/branches',
      icon: GitBranch,
    },
    {
      name: isFr ? 'Filières Favorites (Bientôt)' : 'التخصصات المفضلة (قريباً)',
      href: getDashboardRoute(lang, 'student') + '/majors',
      icon: GraduationCap,
    },
  ];
}

export function getInstitutionDashboardNavItems(
  lang: Lang,
): DashboardNavItem[] {
  const isFr = lang === 'fr';

  return [
    {
      name: isFr ? 'Tableau de bord' : 'لوحة القيادة',
      href: getDashboardRoute(lang, 'institution'),
      icon: LayoutDashboard,
    },
    {
      name: isFr ? 'Programmes' : 'البرامج',
      href: getDashboardRoute(lang, 'institution') + '/programs',
      icon: BookOpen,
    },
    {
      name: isFr ? 'Invitations' : 'الدعوات',
      href: getDashboardRoute(lang, 'institution') + '/invitations',
      icon: Users,
    },
  ];
}

export function getTeacherDashboardNavItems(lang: Lang): DashboardNavItem[] {
  const isFr = lang === 'fr';

  return [
    {
      name: isFr ? 'Tableau de bord' : 'لوحة القيادة',
      href: getDashboardRoute(lang, 'teacher'),
      icon: LayoutDashboard,
    },
    {
      name: isFr ? 'Programmes' : 'البرامج',
      icon: BookOpen,
      subItems: [
        {
          name: isFr ? 'Mes Programmes' : 'برامجي',
          href: getDashboardRoute(lang, 'teacher') + '/programs',
        },
        {
          name: isFr ? 'Nouveau Programme' : 'برنامج جديد',
          href: getDashboardRoute(lang, 'teacher') + '/programs/new',
        },
      ],
    },
  ];
}

export function getDashboardQuickLinks(lang: Lang) {
  const isFr = lang === 'fr';

  return [
    {
      name: isFr ? 'Espace Étudiant' : 'مساحة الطالب',
      href: getDashboardRoute(lang, 'student'),
    },
    {
      name: isFr ? 'Espace Professeur' : 'مساحة المعلم',
      href: getDashboardRoute(lang, 'teacher'),
    },
    {
      name: isFr ? 'Espace Institution' : 'مساحة المؤسسة',
      href: getDashboardRoute(lang, 'institution'),
    },
    {
      name: isFr ? 'Administration' : 'الإدارة',
      href: getDashboardRoute(lang, 'admin'),
    },
  ];
}

export function getDashboardTitle(lang: Lang, role: DashboardRole) {
  switch (role) {
    case 'admin':
      return lang === 'fr' ? 'Espace Admin' : 'مسؤول';
    case 'student':
      return lang === 'fr' ? 'Espace Étudiant' : 'مساحة الطالب';
    case 'teacher':
      return lang === 'fr' ? 'Espace Professeur' : 'مساحة المعلم';
    case 'institution':
      return lang === 'fr' ? 'Espace Institution' : 'مساحة المؤسسة';
    default:
      return lang === 'fr' ? 'Tableau de bord' : 'لوحة القيادة';
  }
}
