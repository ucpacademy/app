import { type Lang } from '@/lib/i18n';

export default async function InstitutionInvitationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        {lang === 'fr' ? 'Invitations' : 'الدعوات'}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        {lang === 'fr'
          ? 'Cette section sera complétée prochainement.'
          : 'سيتم إكمال هذا القسم قريبًا.'}
      </p>
    </div>
  );
}
