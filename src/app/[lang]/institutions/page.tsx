import Link from 'next/link';
import { getPublishedInstitutions } from '@/lib/education';
import { type Lang } from '@/lib/i18n';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function InstitutionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const institutions = await getPublishedInstitutions();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            {lang === 'fr' ? 'Institutions partenaires' : 'المؤسسات الشريكة'}
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            {lang === 'fr'
              ? 'Découvrez les écoles et fournisseurs qui proposent des programmes d’apprentissage.'
              : 'اكتشف المدارس والمزودين الذين يقدمون برامج تعليمية.'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {institutions.length === 0 ? (
            <Card className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
              {lang === 'fr'
                ? 'Aucune institution à afficher pour le moment.'
                : 'لا توجد مؤسسات للعرض حالياً.'}
            </Card>
          ) : (
            institutions.map((institution: any) => (
              <Link
                key={institution.id}
                href={`/${lang}/institutions/${institution.slug}`}
                className="group"
              >
                <Card className="h-full p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        {lang === 'fr'
                          ? institution.name_fr
                          : institution.name_ar}
                      </h2>
                      <p className="mt-3 text-slate-600 dark:text-slate-300">
                        {lang === 'fr'
                          ? institution.description_fr?.substring(0, 140)
                          : institution.description_ar?.substring(0, 140)}
                      </p>
                    </div>
                    <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                      <span className="text-sm font-semibold">
                        {lang === 'fr' ? 'Voir' : 'عرض'} →
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
