'use client';

import { AuthGuard } from '../auth/AuthGuard';
import { DashboardLayout } from '../ui/DashboardLayout';
import { LayoutDashboard, BookOpen, PlusCircle } from 'lucide-react';

export function TeacherDashboardLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const navItems = [
    {
      name: lang === 'fr' ? 'Tableau de bord' : 'لوحة القيادة',
      href: `/${lang}/teacher`,
      icon: LayoutDashboard,
    },
    {
      name: lang === 'fr' ? 'Mes Programmes' : 'برامجي',
      href: `/${lang}/teacher/programs`,
      icon: BookOpen,
    },
    {
      name: lang === 'fr' ? 'Nouveau Programme' : 'برنامج جديد',
      href: `/${lang}/teacher/programs/new`,
      icon: PlusCircle,
    },
  ];

  return (
    <AuthGuard requiredRole="teacher" lang={lang}>
      <DashboardLayout
        navItems={navItems}
        lang={lang}
        title={lang === 'fr' ? 'Espace Professeur' : 'مساحة المعلم'}
      >
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
