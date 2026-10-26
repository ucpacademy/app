'use client';

import { AuthGuard } from '../auth/AuthGuard';
import { DashboardLayout } from '../ui/DashboardLayout';
import {
  getInstitutionDashboardNavItems,
  getDashboardTitle,
} from '@/lib/domains/dashboard';

export function InstitutionDashboardLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const navItems = getInstitutionDashboardNavItems(lang as any);

  return (
    <AuthGuard requiredRole="institution_admin" lang={lang}>
      <DashboardLayout
        navItems={navItems}
        lang={lang}
        title={getDashboardTitle(lang as any, 'institution')}
      >
        {children}
      </DashboardLayout>
    </AuthGuard>
  );
}
