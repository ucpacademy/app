'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BookmarksPage({ lang }: { lang: Lang }) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('bookmarks')
          .select(
            `
            id,
            branch:branches(id, slug, title_fr, title_ar, gallery),
            program:programs(id, title_fr, title_ar)
          `,
          )
          .eq('user_id', user.id);

        if (error) throw error;
        setBookmarks(data || []);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const removeBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);
      if (error) throw error;
      setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const dict = {
    title: lang === 'fr' ? 'Mes Favoris' : 'المفضلات الخاصة بي',
    description:
      lang === 'fr'
        ? 'Retrouvez les branches et programmes que vous avez enregistrés'
        : 'ابحث عن الفروع والبرامج التي حفظتها',
    empty:
      lang === 'fr'
        ? "Vous n'avez pas encore enregistré de favoris."
        : 'لم تحفظ أي مفضلات حتى الآن.',
    removeLabel: lang === 'fr' ? 'Supprimer' : 'حذف',
    viewLabel: lang === 'fr' ? 'Voir' : 'عرض',
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

        {bookmarks.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{dict.empty}</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => {
              const isBranch = !!bookmark.branch;
              const item = isBranch ? bookmark.branch : bookmark.program;
              const title =
                lang === 'fr'
                  ? isBranch
                    ? item.title_fr
                    : item.title_fr
                  : isBranch
                    ? item.title_ar
                    : item.title_ar;
              const href = isBranch
                ? `/${lang}/branches/${item.slug}`
                : `/${lang}/(catalog)/programs`;

              return (
                <Card
                  key={bookmark.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-slate-900"
                >
                  {/* Image */}
                  {isBranch && item.gallery && item.gallery[0] && (
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={item.gallery[0]}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <Link href={href}>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-3">
                        {title}
                      </h3>
                    </Link>

                    <div className="flex gap-2">
                      <Link href={href} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full justify-center gap-2"
                        >
                          {dict.viewLabel}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <button
                        onClick={() => removeBookmark(bookmark.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
