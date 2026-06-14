import { ProgramsList } from '@/components/AdminProgramsList';
import { getAdminPrograms } from '@/lib/education';
import { type Lang } from '@/lib/i18n';

export default async function AdminProgramsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const programs = await getAdminPrograms();

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {lang === 'fr' ? 'Programmes' : 'البرامج'}
          </h1>
          <p className="text-slate-500 mt-2">
            {lang === 'fr'
              ? 'Gérez les programmes, leurs statuts, et les institutions associées.'
              : 'قم بإدارة البرامج وحالاتها والمؤسسات المرتبطة بها.'}
          </p>
        </div>
      </div>

      <ProgramsList initialPrograms={programs} />
    </div>
  );
}
