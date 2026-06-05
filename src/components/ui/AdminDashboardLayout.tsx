'use client';

import { DashboardLayout } from './DashboardLayout';
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Users,
  Settings,
} from 'lucide-react';

export function AdminDashboardLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const navItems = [
    {
      name: lang === 'fr' ? 'Tableau de bord' : 'لوحة القيادة',
      href: `/${lang}/admin`,
      icon: LayoutDashboard,
    },
    {
      name: lang === 'fr' ? 'Filières & Branches' : 'التخصصات والفروع',
      href: `/${lang}/admin/majors`,
      icon: GraduationCap,
    },
    {
      name: lang === 'fr' ? 'Demandes' : 'الاستفسارات',
      href: `/${lang}/admin/inquiries`,
      icon: MessageSquare,
    },
    {
      name: lang === 'fr' ? 'Étudiants (Bientôt)' : 'الطلاب (قريباً)',
      href: `/${lang}/admin/students`,
      icon: Users,
    },
    {
      name: lang === 'fr' ? 'Paramètres (Bientôt)' : 'الإعدادات (قريباً)',
      href: `/${lang}/admin/settings`,
      icon: Settings,
    },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      lang={lang}
      title={lang === 'fr' ? 'Admin Excel' : 'مسؤول إكسل'}
    >
      {children}
    </DashboardLayout>
  );
}
