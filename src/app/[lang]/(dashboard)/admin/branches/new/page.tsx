import { NewBranchForm } from './NewBranchForm';
import { type Lang } from '@/lib/i18n';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function NewBranchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const resolvedSearchParams = await searchParams;
  const initialMajorId = (resolvedSearchParams?.major_id as string) || '';

  const supabase = await createServerSupabaseClient();
  const { data: majors } = await supabase
    .from('majors')
    .select('id, name_fr, name_ar')
    .order('name_fr');

  return (
    <NewBranchForm
      lang={lang}
      initialMajorId={initialMajorId}
      majors={majors || []}
    />
  );
}
