import { createServerSupabaseClient } from '@/lib/supabase/server';
import { type Lang } from '@/lib/i18n';
import { BranchEditor } from '@/components/BranchEditor';
import { notFound } from 'next/navigation';

export default async function EditBranchPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const branchId = resolvedParams.id;
  const supabase = await createServerSupabaseClient();

  const { data: branch, error } = await supabase
    .from('branches')
    .select(
      `
      *,
      translations:branch_translations(*)
    `,
    )
    .eq('id', branchId)
    .single();

  if (error || !branch) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'fr' ? 'Éditer la branche' : 'تعديل الفرع'}
        </h1>
      </div>
      <BranchEditor branch={branch} lang={lang} />
    </div>
  );
}
