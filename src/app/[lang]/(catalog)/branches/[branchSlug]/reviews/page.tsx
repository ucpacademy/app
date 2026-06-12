'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

export default function ReviewsPage({
  params,
}: {
  params: Promise<{ lang: Lang; branchSlug: string }>;
}) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>('fr');
  const [branchSlug, setBranchSlug] = useState('');
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setLang(resolvedParams.lang);
      setBranchSlug(resolvedParams.branchSlug);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (!branchSlug) return;

    const fetchReviews = async () => {
      try {
        const { data: branchData, error: branchError } = await supabase
          .from('branches')
          .select('id, title_fr, title_ar, slug')
          .eq('slug', branchSlug)
          .single();

        if (branchError) throw branchError;
        setBranch(branchData);

        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(
            `
            id,
            rating,
            title_fr,
            title_ar,
            content_fr,
            content_ar,
            helpful_count,
            created_at,
            user:profiles(full_name, avatar_url)
          `,
          )
          .eq('branch_id', branchData.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [branchSlug]);

  const markHelpful = async (reviewId: string, currentCount: number) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ helpful_count: currentCount + 1 })
        .eq('id', reviewId);

      if (error) throw error;
      setReviews(
        reviews.map((r) =>
          r.id === reviewId ? { ...r, helpful_count: currentCount + 1 } : r,
        ),
      );
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const dict = {
    title: lang === 'fr' ? 'Avis' : 'التقييمات',
    writeReview: lang === 'fr' ? 'Écrire un avis' : 'كتابة رأي',
    emptyReviews:
      lang === 'fr' ? 'Aucun avis pour le moment.' : 'لا توجد تقييمات حالياً.',
    helpful: lang === 'fr' ? 'Utile' : 'مفيد',
    backToDetail: lang === 'fr' ? 'Retour au détail' : 'العودة إلى التفاصيل',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black flex items-center justify-center">
        <Card className="p-8 text-center bg-white dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {lang === 'fr' ? 'Branche non trouvée' : 'لم يتم العثور على الفرع'}
          </p>
          <Link href={`/${lang}/(catalog)/branches`}>
            <Button>{dict.backToDetail}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href={`/${lang}/branches/${branchSlug}`}
            className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm mb-2 block"
          >
            ← {dict.backToDetail}
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {lang === 'fr' ? branch.title_fr : branch.title_ar}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">{dict.title}</p>
        </div>

        {reviews.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{dict.emptyReviews}</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 bg-white dark:bg-slate-900">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {review.user?.full_name ||
                          (lang === 'fr' ? 'Anonyme' : 'مجهول')}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                      {lang === 'fr' ? review.title_fr : review.title_ar}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(review.created_at).toLocaleDateString(
                      lang === 'fr' ? 'fr-FR' : 'ar-SA',
                    )}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {lang === 'fr' ? review.content_fr : review.content_ar}
                </p>
                <button
                  onClick={() => markHelpful(review.id, review.helpful_count)}
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>
                    {review.helpful_count} {dict.helpful}
                  </span>
                </button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
