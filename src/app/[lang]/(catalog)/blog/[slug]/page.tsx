import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDictionary, type Lang } from '@/utils/dictionary';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: Lang; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createServerSupabaseClient();

  const slugField = lang === 'fr' ? 'slug_fr' : 'slug_ar';
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select(
      `
      *,
      author:profiles(full_name, avatar_url)
    `,
    )
    .eq(slugField, slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black flex items-center justify-center">
        <Card className="p-8 text-center bg-white dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {lang === 'fr' ? 'Article non trouvé' : 'لم يتم العثور على المقالة'}
          </p>
          <Link
            href={`/${lang}/(catalog)/blog`}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {lang === 'fr' ? 'Retour au blog' : 'العودة إلى المدونة'}
          </Link>
        </Card>
      </div>
    );
  }

  const title = lang === 'fr' ? post.title_fr : post.title_ar;
  const content = lang === 'fr' ? post.content_fr : post.content_ar;
  const publishedDate = new Date(post.published_at);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href={`/${lang}/(catalog)/blog`}
          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm mb-8 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'fr' ? 'Retour au blog' : 'العودة إلى المدونة'}
        </Link>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="w-full h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={post.featured_image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Post Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            {publishedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {publishedDate.toLocaleDateString(
                    lang === 'fr' ? 'fr-FR' : 'ar-SA',
                    {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    },
                  )}
                </span>
              </div>
            )}
            {post.author?.full_name && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author.full_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <Card className="p-8 bg-white dark:bg-slate-900 mb-8 prose dark:prose-invert max-w-none">
          <div
            className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg space-y-6"
            dangerouslySetInnerHTML={{
              __html: content?.replace(/\n/g, '<br />') || '',
            }}
          />
        </Card>

        {/* Author Card */}
        {post.author && (
          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/30">
            <div className="flex items-center gap-4">
              {post.author.avatar_url && (
                <img
                  src={post.author.avatar_url}
                  alt={post.author.full_name}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  {post.author.full_name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {lang === 'fr' ? 'Auteur' : 'المؤلف'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Related Posts */}
        {post.featured && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {lang === 'fr' ? 'Articles Recommandés' : 'المقالات الموصى بها'}
            </h2>
            <Link
              href={`/${lang}/(catalog)/blog`}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {lang === 'fr'
                ? "Voir plus d'articles"
                : 'عرض المزيد من المقالات'}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
