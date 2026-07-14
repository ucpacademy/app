import { type Lang } from '@/lib/i18n';
import { TeacherDashboardLayout } from '@/components/dashboard/TeacherDashboardLayout';

export default async function TeacherLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';

  return (
    <TeacherDashboardLayout lang={lang}>{children}</TeacherDashboardLayout>
  );
}
