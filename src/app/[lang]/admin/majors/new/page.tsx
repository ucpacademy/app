import { type Lang } from '@/lib/i18n';
import { NewMajorForm } from './NewMajorForm';

export default async function NewMajorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'fr' ? 'Nouvelle Filière' : 'تخصص جديد'}
        </h1>
      </div>
      <NewMajorForm lang={lang} />
    </div>
  );
}
