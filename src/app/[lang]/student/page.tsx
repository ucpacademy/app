import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { type Lang } from '@/lib/i18n';

export default async function StudentDashboard({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/${lang}/login`);
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'fr' ? 'Bienvenue, ' : 'مرحباً، '}
          <span className="text-indigo-600 dark:text-indigo-400">
            {user.user_metadata?.full_name || user.email}
          </span>
          !
        </h1>
        <p className="text-slate-500 mt-2">
          {lang === 'fr'
            ? 'Voici un aperçu de votre espace étudiant.'
            : 'هذه نظرة عامة على مساحتك الطلابية.'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            {lang === 'fr' ? 'Mon Profil' : 'ملفي الشخصي'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {lang === 'fr'
              ? 'Gérez vos informations et préférences.'
              : 'إدارة معلوماتك الشخصية وتفضيلاتك.'}
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            {lang === 'fr' ? 'Mes Filières' : 'تخصصاتي'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {lang === 'fr'
              ? 'Explorez et sauvegardez vos filières favorites.'
              : 'استكشف واحفظ التخصصات المفضلة لديك.'}
          </p>
        </div>
      </div>
    </div>
  );
}
