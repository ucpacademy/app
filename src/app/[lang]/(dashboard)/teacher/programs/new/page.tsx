import { type Lang } from '@/lib/i18n';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProgramForm } from './ProgramForm';
import { BookOpen } from 'lucide-react';

export default async function NewProgramPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const supabase = await createServerSupabaseClient();

  // Fetch branches so the teacher can link their new program to an academic branch
  const { data: branches } = await supabase
    .from('branches')
    .select('id, title_fr, title_ar')
    .order('title_fr');

  const isFr = lang === 'fr';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {isFr ? 'Créer un Nouveau Programme' : 'إنشاء برنامج جديد'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">
            {isFr
              ? "Remplissez les détails ci-dessous pour lancer votre nouveau programme d'enseignement."
              : 'املأ التفاصيل أدناه لبدء برنامجك التعليمي الجديد.'}
          </p>
        </div>
      </div>

      <ProgramForm lang={lang} branches={branches || []} />
    </div>
  );
}
