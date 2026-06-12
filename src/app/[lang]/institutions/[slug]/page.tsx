import { notFound } from 'next/navigation';
import { getInstitutionBySlug } from '@/lib/education';
import { type Lang } from '@/lib/i18n';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default async function InstitutionPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const slug = resolvedParams.slug;
  const institution = await getInstitutionBySlug(slug);

  if (!institution) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3">
          <Link
            href={`/${lang}/institutions`}
            className="text-indigo-600 dark:text-indigo-400 text-sm font-medium"
          >
            {lang === 'fr' ? 'Retour aux institutions' : 'العودة إلى المؤسسات'}
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            {lang === 'fr' ? institution.name_fr : institution.name_ar}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl">
            {lang === 'fr'
              ? institution.description_fr
              : institution.description_ar}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <Card className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {lang === 'fr' ? 'Informations générales' : 'معلومات عامة'}
                </h2>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {lang === 'fr' ? 'Localisation' : 'الموقع'}
                    </dt>
                    <dd className="mt-1 text-slate-700 dark:text-slate-300">
                      {lang === 'fr'
                        ? institution.location_fr
                        : institution.location_ar}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {lang === 'fr' ? 'Site web' : 'الموقع الإلكتروني'}
                    </dt>
                    <dd className="mt-1 text-indigo-600 dark:text-indigo-400">
                      <a
                        href={institution.website}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {institution.website}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {lang === 'fr' ? 'Contact' : 'التواصل'}
                    </dt>
                    <dd className="mt-1 text-slate-700 dark:text-slate-300">
                      {institution.contact_email}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {lang === 'fr' ? 'Modes de formation' : 'أنماط التدريب'}
                </h2>
                <div className="space-y-4 text-slate-600 dark:text-slate-300">
                  {institution.location_fr ? (
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {lang === 'fr' ? 'Formation sur site' : 'تدريب حضوري'}
                      </p>
                      <p>
                        {lang === 'fr'
                          ? 'Des programmes sont proposés sur le campus à cette adresse.'
                          : 'يتم تقديم برامج في الموقع في هذه المؤسسة.'}
                      </p>
                    </div>
                  ) : null}
                  {institution.website ? (
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {lang === 'fr'
                          ? 'Formation en ligne'
                          : 'التدريب عبر الإنترنت'}
                      </p>
                      <p>
                        {lang === 'fr'
                          ? 'Des formations à distance peuvent être suivies via le site web de l’établissement.'
                          : 'يمكن متابعة الدورات عبر الإنترنت من خلال الموقع الإلكتروني للمؤسسة.'}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {lang === 'fr' ? 'Programmes disponibles' : 'البرامج المتاحة'}
                </h2>
                {institution.programs?.length ? (
                  <div className="space-y-4">
                    {institution.programs.map((program: any) => (
                      <div
                        key={program.id}
                        className="rounded-3xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {lang === 'fr'
                                ? program.title_fr
                                : program.title_ar}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                              {lang === 'fr'
                                ? program.description_fr?.substring(0, 120)
                                : program.description_ar?.substring(0, 120)}
                            </p>
                          </div>
                          <div className="text-right space-y-2">
                            <Link
                              href={`/${lang}/branches/${program.branch.slug}`}
                              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                            >
                              {lang === 'fr'
                                ? 'Voir le programme'
                                : 'عرض البرنامج'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">
                    {lang === 'fr'
                      ? 'Aucun programme disponible pour cette institution.'
                      : 'لا يوجد برامج متاحة لهذه المؤسسة.'}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              {lang === 'fr' ? 'Accès rapide' : 'الوصول السريع'}
            </h2>
            <div className="space-y-3">
              <Link
                href={`/${lang}/institutions`}
                className="block text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {lang === 'fr'
                  ? 'Retour à la liste des institutions'
                  : 'العودة إلى قائمة المؤسسات'}
              </Link>
              <Link
                href={`/${lang}/majors`}
                className="block text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {lang === 'fr' ? 'Voir les filières' : 'عرض التخصصات'}
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
