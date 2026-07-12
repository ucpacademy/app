import { type Lang } from '@/lib/i18n';
import { StudentDashboardLayout } from '@/components/dashboard/StudentDashboardLayout';

export default async function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  return (
    <StudentDashboardLayout lang={lang}>{children}</StudentDashboardLayout>
  );
}
