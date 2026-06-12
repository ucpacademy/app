import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, Star } from 'lucide-react';

export default async function AdminReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<{ search?: string; status?: string; rating?: string }>;
}) {
  const { lang } = await params;
  const { search = '', status = '', rating = '' } = await searchParams;
  const dict = await getDictionary(lang);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('reviews')
    .select(
      `
    id,
    rating,
    title_fr,
    title_ar,
    status,
    created_at,
    user:profiles(full_name),
    branch:branches(title_fr, title_ar),
    program:programs(title_fr, title_ar)
  `,
    )
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(
      `title_fr.ilike.%${search}%,title_ar.ilike.%${search}%,content_fr.ilike.%${search}%`,
    );
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (rating) {
    query = query.eq('rating', parseInt(rating));
  }

  const { data: reviews } = await query;

  const translations = {
    title: lang === 'fr' ? 'Avis' : 'التقييمات',
    empty: lang === 'fr' ? 'Aucun avis.' : 'لا توجد تقييمات.',
    approve: lang === 'fr' ? 'Approuver' : 'الموافقة',
    reject: lang === 'fr' ? 'Rejeter' : 'رفض',
    allStatuses: lang === 'fr' ? 'Tous les statuts' : 'جميع الحالات',
    allRatings: lang === 'fr' ? 'Tous les scores' : 'جميع التقييمات',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          {translations.title}
        </h1>

        {/* Filter Bar */}
        <div className="mb-6 flex gap-2">
          <form method="get" className="w-full flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="search"
                placeholder={
                  lang === 'fr' ? 'Chercher un avis...' : 'البحث عن رأي...'
                }
                defaultValue={search}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <select
              name="status"
              defaultValue={status}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="">{translations.allStatuses}</option>
              <option value="pending">
                {lang === 'fr' ? 'En attente' : 'قيد الانتظار'}
              </option>
              <option value="approved">
                {lang === 'fr' ? 'Approuvé' : 'موافق عليه'}
              </option>
              <option value="rejected">
                {lang === 'fr' ? 'Rejeté' : 'مرفوض'}
              </option>
            </select>
            <select
              name="rating"
              defaultValue={rating}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="">{translations.allRatings}</option>
              <option value="5">5 ⭐</option>
              <option value="4">4 ⭐</option>
              <option value="3">3 ⭐</option>
              <option value="2">2 ⭐</option>
              <option value="1">1 ⭐</option>
            </select>
            <Button type="submit" variant="outline">
              {lang === 'fr' ? 'Filtrer' : 'تصفية'}
            </Button>
          </form>
        </div>

        {/* Reviews List */}
        {!reviews || reviews.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 dark:text-slate-400">
            {translations.empty}
          </Card>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4 bg-white dark:bg-slate-900">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
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
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {lang === 'fr' ? review.title_fr : review.title_ar}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {review.user?.full_name} {lang === 'fr' ? 'sur' : 'على'}{' '}
                      {review.branch
                        ? lang === 'fr'
                          ? review.branch.title_fr
                          : review.branch.title_ar
                        : review.program
                          ? lang === 'fr'
                            ? review.program.title_fr
                            : review.program.title_ar
                          : 'N/A'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                      review.status === 'approved'
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/20'
                        : review.status === 'pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20'
                          : 'bg-red-100 text-red-700 dark:bg-red-500/20'
                    }`}
                  >
                    {review.status}
                  </span>
                  <Link
                    href={`/${lang}/(dashboard)/admin/reviews/${review.id}`}
                  >
                    <Button variant="outline" size="sm">
                      {lang === 'fr' ? 'Gérer' : 'إدارة'}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
