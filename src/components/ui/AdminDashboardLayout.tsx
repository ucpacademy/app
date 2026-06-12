'use client';

import { DashboardLayout } from './DashboardLayout';
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Users,
  BookOpen,
  Calendar,
  Star,
  HelpCircle,
  Building2,
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
      href: `/${lang}/(dashboard)/admin/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: lang === 'fr' ? 'Majeurs' : 'التخصصات',
      href: `/${lang}/(dashboard)/admin/majors`,
      icon: GraduationCap,
    },
    {
      name: lang === 'fr' ? 'Institutions' : 'المؤسسات',
      href: `/${lang}/(dashboard)/admin/institutions`,
      icon: Building2,
    },
    {
      name: lang === 'fr' ? 'Programmes' : 'البرامج',
      href: `/${lang}/(dashboard)/admin/programs`,
      icon: BookOpen,
    },
    {
      name: lang === 'fr' ? 'Événements' : 'الأحداث',
      href: `/${lang}/(dashboard)/admin/events/list`,
      icon: Calendar,
    },
    {
      name: lang === 'fr' ? 'Blog' : 'المدونة',
      href: `/${lang}/(dashboard)/admin/blog/list`,
      icon: MessageSquare,
    },
    {
      name: lang === 'fr' ? 'Avis' : 'التقييمات',
      href: `/${lang}/(dashboard)/admin/reviews/list`,
      icon: Star,
    },
    {
      name: lang === 'fr' ? 'FAQ' : 'الأسئلة المتكررة',
      href: `/${lang}/(dashboard)/admin/faqs/list`,
      icon: HelpCircle,
    },
    {
      name: lang === 'fr' ? 'Demandes' : 'الاستفسارات',
      href: `/${lang}/(dashboard)/admin/inquiries/advanced`,
      icon: MessageSquare,
    },
    {
      name: lang === 'fr' ? 'Utilisateurs' : 'المستخدمون',
      href: `/${lang}/(dashboard)/admin/users`,
      icon: Users,
    },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      lang={lang}
      title={lang === 'fr' ? 'Admin Panel' : 'لوحة التحكم'}
    >
      {children}
    </DashboardLayout>
  );
}
