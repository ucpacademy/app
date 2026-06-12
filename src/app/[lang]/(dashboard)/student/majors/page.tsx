import Link from 'next/link';
import { type Lang } from '@/lib/i18n';

export default async function StudentMajorsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {lang === 'fr' ? 'Filières favorites' : 'التخصصات المفضلة'}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          {lang === 'fr'
            ? 'Bientôt vous pourrez ajouter vos filières préférées et recevoir des mises à jour.'
            : 'قريبًا ستتمكن من إضافة التخصصات المفضلة لديك وتلقي التحديثات.'}
        </p>
        <Link
          href={`/${lang}/majors`}
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {lang === 'fr' ? 'Explorer les filières' : 'استكشاف التخصصات'}
        </Link>
      </div>
    </div>
  );
}
