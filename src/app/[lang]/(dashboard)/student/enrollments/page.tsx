'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Award, Clock, CheckCircle2, Users } from 'lucide-react';
import Link from 'next/link';

export default function EnrollmentsPage({ lang }: { lang: Lang }) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('enrollments')
          .select(
            `
            id,
            enrollment_date,
            status,
            progress_percent,
            certificate_url,
            program:programs(
              id,
              title_fr,
              title_ar,
              duration_months,
              branch:branches(id, title_fr, title_ar, slug)
            )
          `,
          )
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (error) throw error;
        setEnrollments(data || []);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const dict = {
    title: lang === 'fr' ? 'Mes Inscriptions' : 'التسجيلات الخاصة بي',
    description:
      lang === 'fr'
        ? 'Suivez votre progression dans les programmes'
        : 'تابع تقدمك في البرامج',
    empty:
      lang === 'fr'
        ? "Vous n'avez pas d'inscriptions actives."
        : 'لا توجد تسجيلات نشطة.',
    completedLabel: lang === 'fr' ? 'مكتمل' : 'مكتمل',
    enrolledLabel: lang === 'fr' ? 'Enrolled' : 'مسجل',
    progressLabel: lang === 'fr' ? 'Progress' : 'التقدم',
    durationLabel: lang === 'fr' ? 'Duration' : 'المدة',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            {lang === 'fr' ? 'Chargement...' : 'جاري التحميل...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {dict.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {dict.description}
          </p>
        </div>

        {enrollments.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
            <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{dict.empty}</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {enrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/${lang}/branches/${enrollment.program.branch.slug}`}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-slate-900">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {lang === 'fr'
                          ? enrollment.program.title_fr
                          : enrollment.program.title_ar}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {lang === 'fr'
                          ? enrollment.program.branch.title_fr
                          : enrollment.program.branch.title_ar}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">
                            {dict.progressLabel}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {enrollment.progress_percent}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${enrollment.progress_percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
                        <div>
                          <div className="text-slate-500 dark:text-slate-400">
                            {lang === 'fr' ? 'Inscrit le' : 'مسجل في'}
                          </div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {new Date(
                              enrollment.enrollment_date,
                            ).toLocaleDateString(
                              lang === 'fr' ? 'fr-FR' : 'ar-SA',
                            )}
                          </div>
                        </div>
                        {enrollment.program.duration_months && (
                          <div>
                            <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {dict.durationLabel}
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {enrollment.program.duration_months}{' '}
                              {lang === 'fr' ? 'mois' : 'أشهر'}
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            {lang === 'fr' ? 'Statut' : 'الحالة'}
                          </div>
                          <div className="font-semibold text-slate-900 dark:text-white capitalize">
                            {enrollment.status === 'active'
                              ? lang === 'fr'
                                ? 'Actif'
                                : 'نشط'
                              : lang === 'fr'
                                ? 'Terminé'
                                : 'مكتمل'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {enrollment.certificate_url && (
                      <div className="flex flex-col items-center gap-2">
                        <Award className="w-8 h-8 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          {lang === 'fr' ? 'Certificat' : 'شهادة'}
                        </span>
                        <a
                          href={enrollment.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                        >
                          {lang === 'fr' ? 'Télécharger' : 'تحميل'}
                        </a>
                      </div>
                    )}
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
