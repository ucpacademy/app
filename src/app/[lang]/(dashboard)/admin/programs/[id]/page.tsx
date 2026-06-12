import { notFound } from 'next/navigation';
import { type Lang } from '@/lib/i18n';
import {
  getProgramById,
  getAllInstitutions,
  getBranches,
} from '@/lib/education';
import { ProgramEditor } from './ProgramEditor';

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const programId = resolvedParams.id;
  const program = await getProgramById(programId);

  if (!program) {
    notFound();
  }

  const branches = await getBranches();
  const institutions = await getAllInstitutions();

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'fr' ? 'Modifier le programme' : 'تعديل البرنامج'}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {lang === 'fr'
            ? 'Mettez à jour le programme, l’institution ou la durée.'
            : 'قم بتحديث البرنامج أو المؤسسة أو المدة.'}
        </p>
      </div>
      <ProgramEditor
        lang={lang}
        program={program}
        branches={branches}
        institutions={institutions}
      />
    </div>
  );
}
