import { type Lang } from '@/lib/i18n';
import { InstitutionDashboardLayout } from '@/components/dashboard/InstitutionDashboardLayout';

export default async function InstitutionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <InstitutionDashboardLayout lang={lang}>
      {children}
    </InstitutionDashboardLayout>
  );
}
