import { type Lang } from '@/lib/i18n';
import { StudentDashboardLayout } from '@/components/dashboard/StudentDashboardLayout';

export default async function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';

  return (
    <StudentDashboardLayout lang={lang}>{children}</StudentDashboardLayout>
  );
}
