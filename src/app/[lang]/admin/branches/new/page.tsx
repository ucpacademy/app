import { type Lang } from '@/lib/i18n';
import { NewBranchForm } from './NewBranchForm';

export default async function NewBranchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ major_id?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const majorId = resolvedSearchParams?.major_id || '';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'fr' ? 'Nouvelle Branche' : 'فرع جديد'}
        </h1>
      </div>
      <NewBranchForm lang={lang} initialMajorId={majorId} />
    </div>
  );
}
