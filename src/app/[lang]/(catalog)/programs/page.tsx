import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDictionary, type Lang } from '@/utils/dictionary';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Users } from 'lucide-react';

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createServerSupabaseClient();

  const { data: programs, error } = await supabase
    .from('programs')
    .select(
      `
      id,
      title_fr,
      title_ar,
      description_fr,
      description_ar,
      duration_months,
      capacity,
      price_usd,
      branch:branches(id, slug, title_fr, title_ar)
    `,
    )
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const title = lang === 'fr' ? "Programmes d'études" : 'برامج التدريس';
  const description =
    lang === 'fr'
      ? 'Découvrez nos programmes éducatifs complets'
      : 'اكتشف برامجنا التعليمية الشاملة';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {!programs || programs.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
            {lang === 'fr'
              ? 'Aucun programme disponible.'
              : 'لا توجد برامج متاحة.'}
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <Link
                key={program.id}
                href={`/${lang}/branches/${program.branch.slug}#programs`}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-slate-900">
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {lang === 'fr' ? program.title_fr : program.title_ar}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1">
                      {lang === 'fr'
                        ? program.description_fr?.substring(0, 100) + '...'
                        : program.description_ar?.substring(0, 100) + '...'}
                    </p>
                    <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      {program.duration_months && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {program.duration_months}{' '}
                            {lang === 'fr' ? 'mois' : 'أشهر'}
                          </span>
                        </div>
                      )}
                      {program.capacity && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>
                            {program.capacity}{' '}
                            {lang === 'fr' ? 'places' : 'مكان'}
                          </span>
                        </div>
                      )}
                      {program.price_usd && (
                        <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          ${program.price_usd}
                        </div>
                      )}
                    </div>
                    <Button className="w-full mt-4 flex items-center justify-center gap-2">
                      {lang === 'fr' ? 'Voir le programme' : 'عرض البرنامج'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
