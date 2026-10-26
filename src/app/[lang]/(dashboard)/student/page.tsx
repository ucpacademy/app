import { type Lang } from '@/lib/i18n';

export default async function StudentPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {lang === 'fr' ? 'Espace étudiant' : 'مساحة الطالب'}
      </h1>
      <p className="text-slate-500 mt-2">
        {lang === 'fr' ? 'Bienvenue étudiant' : 'مرحبًا بالطالب'}
      </p>
    </div>
  );
}
