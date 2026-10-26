import { type Lang } from '@/lib/i18n';
import Link from 'next/link';
import { BookOpen, Users, Star, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function TeacherDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const isFr = lang === 'fr';

  const translations = {
    title: isFr ? 'Tableau de bord Professeur' : 'لوحة تحكم المعلم',
    subtitle: isFr
      ? "Bienvenue dans votre espace d'enseignement."
      : 'مرحبًا بك في مساحة التدريس الخاصة بك.',
    quick: isFr ? 'Actions Rapides' : 'إجراءات سريعة',
  };

  // Placeholder metrics — replace with server queries if desired
  const metrics = {
    programs: 3,
    students: 124,
    rating: 4.8,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {translations.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {translations.subtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mb-8">
          <Card className="p-6 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {isFr ? 'Programmes' : 'البرامج'}
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metrics.programs}
                </div>
              </div>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {isFr ? 'Étudiants' : 'الطلاب'}
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metrics.students}
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {isFr ? 'Note Moyenne' : 'متوسط التقييم'}
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metrics.rating}
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="p-6 bg-white dark:bg-slate-900 border border-dashed border-indigo-200 dark:border-indigo-800/50 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {isFr ? 'Nouveau Programme' : 'برنامج جديد'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isFr
                    ? 'Créer et publier un nouveau cours'
                    : 'إنشاء ونشر دورة جديدة'}
                </p>
                <div className="mt-4">
                  <Link href={`/${lang}/teacher/programs/new`}>
                    <Button>{isFr ? 'Créer' : 'إنشاء'}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {isFr ? 'Mes Programmes' : 'برامجي'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {isFr
                ? "Gérer et éditer vos programmes d'enseignement"
                : 'إدارة برامجك وتحريرها'}
            </p>
            <div className="mt-4">
              <Link href={`/${lang}/teacher/programs`}>
                <Button variant="outline">
                  {isFr ? 'Voir mes programmes' : 'عرض برامجي'}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
