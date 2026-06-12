import { getAdminInstitutions } from '@/lib/education';
import { type Lang } from '@/lib/i18n';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function AdminInstitutionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const institutions = await getAdminInstitutions();

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {lang === 'fr' ? 'Institutions' : 'المؤسسات'}
          </h1>
          <p className="text-slate-500 mt-2">
            {lang === 'fr'
              ? 'Gérez les écoles, partenaires et fournisseurs de programmes.'
              : 'قم بإدارة المدارس والشركاء ومزودي البرامج.'}
          </p>
        </div>
        <Link href={`/${lang}/(dashboard)/admin/institutions/new`}>
          <Button>
            {lang === 'fr' ? 'Nouvelle institution' : 'مؤسسة جديدة'}
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {institutions.length === 0 ? (
          <Card className="p-10 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
            {lang === 'fr'
              ? 'Aucune institution trouvée pour le moment.'
              : 'لا توجد مؤسسات حتى الآن.'}
          </Card>
        ) : (
          institutions.map((institution: any) => (
            <Card
              key={institution.id}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {lang === 'fr' ? institution.name_fr : institution.name_ar}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {institution.slug}
                  </p>
                </div>
                <div className="text-slate-600 dark:text-slate-300 text-sm">
                  {lang === 'fr' ? 'Créée le' : 'تاريخ الإنشاء'}{' '}
                  {new Date(institution.created_at).toLocaleDateString(
                    lang === 'fr' ? 'fr-FR' : 'ar-SA',
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
