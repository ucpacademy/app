import { redirect } from 'next/navigation';

export default async function BranchesRedirect({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'fr';
  redirect(`/${lang}/admin/majors`);
}
