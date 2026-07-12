import { type Lang } from '@/lib/i18n';
import Link from 'next/link';
import { BookOpen, Users, Star, PlusCircle } from 'lucide-react';

export default async function TeacherDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const isFr = lang === 'fr';

  return (
    <div className="max-w-6xl">
      <div className="space-y-6 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {isFr ? 'Tableau de bord Professeur' : 'لوحة تحكم المعلم'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          {isFr
            ? "Bienvenue dans votre espace d'enseignement."
            : 'مرحبًا بك في مساحة التدريس الخاصة بك.'}
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <Link
          href={`/${lang}/teacher/programs`}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isFr ? 'Mes Programmes' : 'برامجي'}
          </h3>
          <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            3
          </p>
        </Link>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-shadow group">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isFr ? 'Étudiants Inscrits' : 'الطلاب المسجلين'}
          </h3>
          <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            124
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-shadow group">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isFr ? 'Note Moyenne' : 'متوسط التقييم'}
          </h3>
          <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            4.8
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          href={`/${lang}/teacher/programs/new`}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800/50 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {isFr ? 'Nouveau Programme' : 'برنامج جديد'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {isFr
                ? 'Créer et publier un nouveau cours'
                : 'إنشاء ونشر دورة جديدة'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
