'use client';

import { AuthGuard } from '../auth/AuthGuard';
import { DashboardLayout } from '../ui/DashboardLayout';
import { LayoutDashboard, BookOpen, Users } from 'lucide-react';

export function InstitutionDashboardLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const navItems = [
    {
      name: lang === 'fr' ? 'Tableau de bord' : 'لوحة القيادة',
      href: `/${lang}/institution`,
      icon: LayoutDashboard,
    },
    {
      name: lang === 'fr' ? 'Programmes' : 'البرامج',
      href: `/${lang}/institution/programs`,
      icon: BookOpen,
    },
    {
      name: lang === 'fr' ? 'Invitations' : 'الدعوات',
      href: `/${lang}/institution/invitations`,
      icon: Users,
    },
  ];

  return (
    <AuthGuard requiredRole="institution_admin" lang={lang}>
      <DashboardLayout
        navItems={navItems}
        lang={lang}
        title={lang === 'fr' ? 'Espace Institution' : 'مساحة المؤسسة'}
      >
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
