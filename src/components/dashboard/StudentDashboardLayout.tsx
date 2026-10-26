'use client';

import { DashboardLayout } from '../ui/DashboardLayout';
import {
  LayoutDashboard,
  User,
  BookOpen,
  GitBranch,
  GraduationCap,
} from 'lucide-react';
import { AuthGuard } from '../auth/AuthGuard';
import {
  getStudentDashboardNavItems,
  getDashboardTitle,
} from '@/lib/domains/dashboard';

export function StudentDashboardLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const navItems = getStudentDashboardNavItems(lang as any);

  return (
    <AuthGuard requiredRole="student" lang={lang}>
      <DashboardLayout
        navItems={navItems}
        lang={lang}
        title={getDashboardTitle(lang as any, 'student')}
      >
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
