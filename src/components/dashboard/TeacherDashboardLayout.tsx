'use client';

import { AuthGuard } from '../auth/AuthGuard';
import { DashboardLayout } from '../ui/DashboardLayout';
import {
  getTeacherDashboardNavItems,
  getDashboardTitle,
} from '@/lib/domains/dashboard';

export function TeacherDashboardLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const navItems = getTeacherDashboardNavItems(lang as any);

  return (
    <AuthGuard requiredRole="teacher" lang={lang}>
      <DashboardLayout
        navItems={navItems}
        lang={lang}
        title={getDashboardTitle(lang as any, 'teacher')}
      >
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
