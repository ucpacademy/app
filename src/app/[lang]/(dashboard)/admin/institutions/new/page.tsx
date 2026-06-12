import { type Lang } from '@/lib/i18n';
import { NewInstitutionForm } from './NewInstitutionForm';

export default async function AdminNewInstitutionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {lang === 'fr' ? 'Nouvelle institution' : 'مؤسسة جديدة'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {lang === 'fr'
            ? 'Créez une nouvelle institution pour héberger des programmes et guider les enseignants.'
            : 'أنشئ مؤسسة جديدة لاستضافة البرامج وإرشاد المعلمين.'}
        </p>
        <NewInstitutionForm lang={lang as Lang} />
      </div>
    </div>
  );
}
