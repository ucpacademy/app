'use client';

import { DashboardLayout } from '../ui/DashboardLayout';
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Users,
  Settings,
  BookOpen,
  Calendar,
  Star,
  HelpCircle,
  Building2,
} from 'lucide-react';
import { AuthGuard } from '../auth/AuthGuard';

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
      name: lang === 'fr' ? 'Majeurs & Branches' : 'التخصصات والفروع',
      href: `/${lang}/admin/majors`,
      icon: GraduationCap,
    },
    {
      name: lang === 'fr' ? 'Institutions' : 'المؤسسات',
      href: `/${lang}/admin/institutions`,
      icon: Building2,
    },
    {
      name: lang === 'fr' ? 'Programmes' : 'البرامج',
      href: `/${lang}/admin/programs`,
      icon: BookOpen,
    },
    {
      name: lang === 'fr' ? 'Événements' : 'الأحداث',
      href: `/${lang}/admin/events/list`,
      icon: Calendar,
    },
    {
      name: lang === 'fr' ? 'Blog' : 'المدونة',
      href: `/${lang}/admin/blog/list`,
      icon: MessageSquare,
    },
    {
      name: lang === 'fr' ? 'Avis' : 'التقييمات',
      href: `/${lang}/admin/reviews/list`,
      icon: Star,
    },
    {
      name: lang === 'fr' ? 'FAQ' : 'الأسئلة المتكررة',
      href: `/${lang}/admin/faqs/list`,
      icon: HelpCircle,
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
    <AuthGuard requiredRole="admin" lang={lang}>
      <DashboardLayout
        navItems={navItems}
        lang={lang}
        title={lang === 'fr' ? 'Admin Account' : 'مسؤول'}
      >
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
