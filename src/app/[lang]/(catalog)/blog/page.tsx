import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDictionary, type Lang } from '@/utils/dictionary';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createServerSupabaseClient();

  const { data: posts, error } = (await supabase
    .from('blog_posts')
    .select(
      `
      id,
      title_fr,
      title_ar,
      excerpt_fr,
      excerpt_ar,
      featured_image,
      slug_fr,
      slug_ar,
      published_at,
      author:profiles(full_name)
    `,
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })) as any;

  const title = lang === 'fr' ? 'Blog' : 'المدونة';
  const description =
    lang === 'fr'
      ? 'Lire les derniers articles et actualités'
      : 'اقرأ أحدث المقالات والأخبار';

  const readMoreLabel = lang === 'fr' ? 'Lire la suite' : 'اقرأ المزيد';

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

        {!posts || posts.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
            {lang === 'fr' ? 'Aucun article publié.' : 'لا توجد مقالات منشورة.'}
          </Card>
        ) : (
          <div className="grid gap-8">
            {/* Featured Post */}
            {posts[0] && (
              <Link
                href={
                  `/${lang}/blog/${posts[0][lang === 'fr' ? 'slug_fr' : 'slug_ar']}` as any
                }
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer bg-white dark:bg-slate-900 h-full">
                  <div className="md:flex h-full">
                    {posts[0].featured_image && (
                      <div className="md:w-2/5 h-80 md:h-auto overflow-hidden">
                        <img
                          src={posts[0].featured_image}
                          alt={
                            lang === 'fr'
                              ? posts[0].title_fr
                              : posts[0].title_ar
                          }
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-8 md:w-3/5 flex flex-col justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                          {lang === 'fr'
                            ? posts[0].title_fr
                            : posts[0].title_ar}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
                          {lang === 'fr'
                            ? posts[0].excerpt_fr
                            : posts[0].excerpt_ar}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        {posts[0].published_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(
                                posts[0].published_at,
                              ).toLocaleDateString(
                                lang === 'fr' ? 'fr-FR' : 'ar-SA',
                              )}
                            </span>
                          </div>
                        )}
                        {posts[0].author?.full_name && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{posts[0].author.full_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {/* Other Posts Grid */}
            {posts.length > 1 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.slice(1).map((post: any) => (
                  <Link
                    key={post.id}
                    href={
                      `/${lang}/blog/${post[lang === 'fr' ? 'slug_fr' : 'slug_ar']}` as any
                    }
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-slate-900 flex flex-col">
                      {post.featured_image && (
                        <div className="w-full h-48 overflow-hidden rounded-t-2xl">
                          <img
                            src={post.featured_image}
                            alt={lang === 'fr' ? post.title_fr : post.title_ar}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                          {lang === 'fr' ? post.title_fr : post.title_ar}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1">
                          {lang === 'fr' ? post.excerpt_fr : post.excerpt_ar}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          {post.published_at && (
                            <span>
                              {new Date(post.published_at).toLocaleDateString(
                                lang === 'fr' ? 'fr-FR' : 'ar-SA',
                              )}
                            </span>
                          )}
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                            {readMoreLabel}
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
