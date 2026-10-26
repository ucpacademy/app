import { createServerSupabaseClient } from '@/lib/supabase/server';
import { type Lang } from '@/lib/i18n';
import Link from 'next/link';

export default async function InstitutionDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {lang === 'fr'
          ? "Tableau de bord de l'institution"
          : 'لوحة تحكم المؤسسة'}
      </h1>
      <p className="text-slate-500 mb-8">
        {lang === 'fr'
          ? 'Bienvenue dans votre espace institution. Gérez vos programmes et invitations ici.'
          : 'مرحبًا بك في مساحة المؤسسة الخاصة بك. قم بإدارة برامجك ودعواتك هنا.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-2">
            {lang === 'fr' ? 'Programmes' : 'البرامج'}
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            {lang === 'fr'
              ? 'Consultez et gérez vos programmes de formation.'
              : 'عرض وإدارة برامج التدريب الخاصة بك.'}
          </p>
          <Link
            href={`/${lang}/institution/programs`}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {lang === 'fr' ? 'Gérer les programmes →' : 'إدارة البرامج ←'}
          </Link>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-2">
            {lang === 'fr' ? 'Invitations' : 'الدعوات'}
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            {lang === 'fr'
              ? 'Invitez des professeurs à rejoindre votre institution.'
              : 'دعوة المعلمين للانضمام إلى مؤسستك.'}
          </p>
          <Link
            href={`/${lang}/institution/invitations`}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {lang === 'fr' ? 'Gérer les invitations →' : 'إدارة الدعوات ←'}
          </Link>
        </div>
      </div>
    </div>
  );
}
