'use client';

import { DashboardLayout } from '../ui/DashboardLayout';
import {
  LayoutDashboard,
  User,
  BookOpen,
  GitBranch,
  GraduationCap,
} from 'lucide-react';

export function StudentDashboardLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const navItems = [
    {
      name: lang === 'fr' ? 'Tableau de bord' : 'لوحة القيادة',
      href: `/${lang}/student`,
      icon: LayoutDashboard,
    },
    {
      name: lang === 'fr' ? 'Mon Profil (Bientôt)' : 'ملفي الشخصي (قريباً)',
      href: `/${lang}/student/profile`,
      icon: User,
    },
    {
      name:
        lang === 'fr' ? 'Cours Favoris (Bientôt)' : 'الدورات المفضلة (قريباً)',
      href: `/${lang}/student/courses`,
      icon: BookOpen,
    },
    {
      name:
        lang === 'fr'
          ? 'Branches Favorites (Bientôt)'
          : 'الفروع المفضلة (قريباً)',
      href: `/${lang}/student/branches`,
      icon: GitBranch,
    },
    {
      name:
        lang === 'fr'
          ? 'Filières Favorites (Bientôt)'
          : 'التخصصات المفضلة (قريباً)',
      href: `/${lang}/student/majors`,
      icon: GraduationCap,
    },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      lang={lang}
      title={lang === 'fr' ? 'Espace Étudiant' : 'مساحة الطالب'}
    >
      {children}
    </DashboardLayout>
  );
}
