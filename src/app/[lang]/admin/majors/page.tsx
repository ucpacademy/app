import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { type Lang } from '@/lib/i18n';
import Link from 'next/link';
import { Plus, Edit3, Image as ImageIcon } from 'lucide-react';

export default async function AdminMajorsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const supabase = await createServerSupabaseClient();

  // Fetch all majors wrapped with their associated branches and translations
  const { data: majors } = await supabase.from('majors').select(`
      id,
      slug,
      translations:major_translations(name,lang),
      branches(
        id,
        slug,
        featured_image,
        translations:branch_translations(title,lang)
      )
    `);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {lang === 'fr' ? 'Filières & Branches' : 'التخصصات والفروع'}
          </h1>
          <p className="text-slate-500 mt-2">
            {lang === 'fr'
              ? 'Gérez la hiérarchie de vos programmes, leurs images, et FAQs.'
              : 'قم بإدارة تسلسل برامجك الأكاديمية والصور والأسئلة الشائعة.'}
          </p>
        </div>
        <Link
          href={`/${lang}/admin/majors/new`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-5 h-5" />
          {lang === 'fr' ? 'Nouvelle Filière' : 'تخصص جديد'}
        </Link>
      </div>

      <div className="grid gap-6 mt-8">
        {majors?.map((major) => {
          const majorName =
            major.translations.find((t: any) => t.lang === lang)?.name ||
            major.slug;

          return (
            <div
              key={major.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
            >
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {majorName}
                  </h2>
                  <p className="text-sm text-slate-500 font-mono mt-1">
                    {major.slug}
                  </p>
                </div>
                <Link
                  href={`/${lang}/admin/branches/new?major_id=${major.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  {lang === 'fr' ? 'Ajouter une branche' : 'إضافة فرع'}
                </Link>
              </div>

              <div className="p-6">
                {!major.branches || major.branches.length === 0 ? (
                  <p className="text-slate-500 text-sm italic">
                    {lang === 'fr'
                      ? 'Aucune branche pour le moment.'
                      : 'لا توجد فروع حتى الآن.'}
                  </p>
                ) : (
                  <ul className="grid lg:grid-cols-2 gap-4">
                    {major.branches.map((branch: any) => {
                      const branchTitle =
                        branch.translations.find((t: any) => t.lang === lang)
                          ?.title || branch.slug;
                      return (
                        <li
                          key={branch.id}
                          className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors bg-white dark:bg-slate-900"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 relative">
                              {branch.featured_image ? (
                                <Image
                                  src={branch.featured_image}
                                  alt={branchTitle}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">
                                {branchTitle}
                              </p>
                              <p className="text-xs text-slate-400 font-mono mt-1">
                                {branch.slug}
                              </p>
                            </div>
                          </div>
                          <Link
                            href={`/${lang}/admin/branches/${branch.id}`}
                            className="opacity-0 group-hover:opacity-100 flex items-center gap-2 text-sm px-3 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg transition-opacity hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
                          >
                            <Edit3 className="w-4 h-4" />
                            {lang === 'fr' ? 'Éditer' : 'تعديل'}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
        {majors?.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">
              {lang === 'fr' ? 'Aucune filière trouvée.' : 'لا يوجد تخصصات.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
