import { type Lang } from '@/lib/i18n';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  BookOpen,
  MessageSquare,
  ListTree,
  Plus,
  LayoutDashboard,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export default async function TeacherProgramsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const isFr = lang === 'fr';

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let programs: any[] = [];
  if (user) {
    const { data, error } = await supabase
      .from('programs')
      .select('*, branches(title_fr, title_ar)')
      .eq('instructor_id', user.id)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching teacher programs:', error);
    if (data) programs = data;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {isFr ? 'Mes Programmes' : 'برامجي'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {isFr
              ? 'Gérez vos cours, vos étudiants et vos communautés.'
              : 'قم بإدارة دوراتك وطلابك ومجتمعاتك.'}
          </p>
        </div>
        <Link href={`/${lang}/teacher/programs/new`}>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-5 h-5" />
            {isFr ? 'Nouveau Programme' : 'برنامج جديد'}
          </Button>
        </Link>
      </div>
      {/* Empty State vs Grid */}
      {programs.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-none">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {isFr
              ? "Vous n'avez pas encore de programme"
              : 'ليس لديك أي برامج بعد'}
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            {isFr
              ? 'Commencez par créer votre premier programme pour accueillir vos étudiants.'
              : 'ابدأ بإنشاء برنامجك الأول للترحيب بطلابك.'}
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card
              key={program.id}
              className="flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6 flex-1 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {program.status === 'published'
                      ? isFr
                        ? 'Publié'
                        : 'منشور'
                      : isFr
                        ? 'Brouillon'
                        : 'مسودة'}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {isFr ? program.title_fr : program.title_ar}
                </h3>
                {program.branches && (
                  <p className="text-sm text-slate-500 line-clamp-1 mb-4 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    {isFr
                      ? program.branches.title_fr
                      : program.branches.title_ar}
                  </p>
                )}
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2">
                <Link
                  href={`/${lang}/teacher/programs/${program.id}/curriculum`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    <ListTree className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    {isFr ? 'Curriculum' : 'المنهج'}
                  </Button>
                </Link>
                <Link
                  href={`/${lang}/teacher/programs/${program.id}/community`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                    {isFr ? 'Communauté' : 'المجتمع'}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
