import { type Lang } from '@/lib/i18n';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { CurriculumBuilder } from '@/components/curriculum/CurriculumBuilder';
import { ListTree } from 'lucide-react';

export default async function TeacherCurriculumPage({
  params,
}: {
  params: Promise<{ lang: string; programId: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const programId = resolvedParams?.programId;
  const isFr = lang === 'fr';

  const supabase = await createServerSupabaseClient();

  // Fetch program details to confirm it exists and show the title
  const { data: program, error } = await supabase
    .from('programs')
    .select('title_fr, title_ar')
    .eq('id', programId)
    .single();

  if (error || !program) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <ListTree className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {isFr ? program.title_fr : program.title_ar} -{' '}
            {isFr ? 'Curriculum' : 'المنهج'}
          </h1>
        </div>
      </div>

      <CurriculumBuilder programId={programId} lang={lang} />
    </div>
  );
}
