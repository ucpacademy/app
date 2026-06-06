import Image from 'next/image';
import { getMajorsWithBranches } from '@/lib/majors';
import { type Lang } from '@/lib/i18n';
import Link from 'next/link';
import { GraduationCap, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function MajorsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';

  const majors = await getMajorsWithBranches();

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 text-center">
        {lang === 'fr' ? 'Explorez nos Filières' : 'استكشف تخصصاتنا'}
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 text-center mb-16 max-w-2xl mx-auto leading-relaxed">
        {lang === 'fr'
          ? "Découvrez nos programmes d'excellence et trouvez la voie qui correspond parfaitement à vos ambitions."
          : 'اكتشف برامجنا المميزة واعثر على المسار الذي يناسب طموحاتك تمامًا.'}
      </p>

      <div className="space-y-16">
        {majors?.map((major) => {
          const majorName =
            major.translations?.find(
              (t: { lang: string; name: string }) => t.lang === lang,
            )?.name || major.slug;
          return (
            <section key={major.id} className="space-y-8">
              <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {majorName}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {major.branches?.map(
                  (branch: {
                    id: string;
                    slug: string;
                    featured_image: string | null;
                    translations?: { lang: string; title: string }[];
                  }) => {
                    const branchTitle =
                      branch.translations?.find((t) => t.lang === lang)
                        ?.title || branch.slug;
                    return (
                      <Link
                        key={branch.id}
                        href={`/${lang}/branches/${branch.slug}`}
                        className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
                      >
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                          {branch.featured_image ? (
                            <Image
                              src={branch.featured_image}
                              alt={branchTitle}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <GraduationCap className="w-12 h-12 opacity-20" />
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight mb-2">
                            {branchTitle}
                          </h3>
                          <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {lang === 'fr'
                              ? 'Découvrir la branche'
                              : 'اكتشف الفرع'}{' '}
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    );
                  },
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
