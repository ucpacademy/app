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
import {
  getAdminDashboardNavItems,
  getDashboardTitle,
} from '@/lib/domains/dashboard';

export function AdminDashboardLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const navItems = getAdminDashboardNavItems(lang as any);

  return (
    <AuthGuard requiredRole="admin" lang={lang}>
      <DashboardLayout
        navItems={navItems}
        lang={lang}
        title={getDashboardTitle(lang as any, 'admin')}
      >
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
