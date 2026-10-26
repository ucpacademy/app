import { type Lang } from '@/lib/i18n';
import { Announcements } from '@/components/community/Announcements';
import { DiscussionBoard } from '@/components/community/DiscussionBoard';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function ProgramCommunityPage({
  params,
}: {
  params: Promise<{ lang: string; programId: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const programId = resolvedParams?.programId;
  const isFr = lang === 'fr';

  const supabase = await createServerSupabaseClient();

  // Fetch program details so we can display its title
  const { data: program, error } = await supabase
    .from('programs')
    .select('title_fr, title_ar')
    .eq('id', programId)
    .single();

  if (error || !program) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {isFr ? program.title_fr : program.title_ar} -{' '}
          {isFr ? 'Communauté' : 'المجتمع'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {isFr
            ? 'Échangez avec vos pairs et restez à jour avec les annonces du programme.'
            : 'تفاعل مع زملائك وابق على اطلاع بإعلانات البرنامج.'}
        </p>
      </div>

      {/* Community Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed: Discussions (Takes up 2/3 of the screen) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <DiscussionBoard programId={programId} lang={lang} />
          </div>
        </div>

        {/* Sidebar: Announcements (Takes up 1/3 of the screen) */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-amber-50/50 dark:bg-amber-900/10 p-6 sm:p-8 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 sticky top-24">
            {/* isInstructor is false because this is the student view */}
            <Announcements
              programId={programId}
              lang={lang}
              isInstructor={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
