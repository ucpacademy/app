import { type Lang } from '@/lib/i18n';
import { getBranches, getAllInstitutions } from '@/lib/education';
import { NewProgramForm } from './NewProgramForm';

export default async function AdminNewProgramPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const branches = await getBranches();
  const institutions = await getAllInstitutions();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {lang === 'fr' ? 'Nouveau programme' : 'برنامج جديد'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {lang === 'fr'
            ? 'Ajoutez un programme structuré avec une institution, une filière et une durée.'
            : 'أضف برنامجًا منظمًا مع مؤسسة وتخصص ومدة.'}
        </p>
        <NewProgramForm
          lang={lang}
          branches={branches}
          institutions={institutions}
        />
      </div>
    </div>
  );
}
