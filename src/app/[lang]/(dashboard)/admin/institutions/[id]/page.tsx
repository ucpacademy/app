import { notFound } from 'next/navigation';
import { type Lang } from '@/lib/i18n';
import { getInstitutionById } from '@/lib/education';
import { InstitutionEditor } from './InstitutionEditor';

export default async function EditInstitutionPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const institutionId = resolvedParams.id;
  const institution = await getInstitutionById(institutionId);

  if (!institution) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'fr' ? 'Modifier l’institution' : 'تعديل المؤسسة'}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {lang === 'fr'
            ? 'Mettez à jour les informations ou changez l’état de la structure.'
            : 'قم بتحديث المعلومات أو تغيير حالة المؤسسة.'}
        </p>
      </div>
      <InstitutionEditor lang={lang} institution={institution} />
    </div>
  );
}
