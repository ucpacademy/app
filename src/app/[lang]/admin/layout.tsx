import { type Lang } from '@/lib/i18n';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';

  return <AdminDashboardLayout lang={lang}>{children}</AdminDashboardLayout>;
}
