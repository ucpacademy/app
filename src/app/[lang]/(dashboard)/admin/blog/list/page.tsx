import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

export default async function AdminBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<{ search?: string; status?: string; author?: string }>;
}) {
  const { lang } = await params;
  const { search = '', status = '', author = '' } = await searchParams;
  const dict = await getDictionary(lang);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('blog_posts')
    .select(
      `
    id,
    title_fr,
    title_ar,
    status,
    featured,
    published_at,
    author:profiles(full_name)
  `,
    )
    .order('published_at', { ascending: false });

  if (search) {
    query = query.or(`title_fr.ilike.%${search}%,title_ar.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data: posts } = (await query) as any;

  const translations = {
    title: lang === 'fr' ? 'Blog' : 'المدونة',
    add: lang === 'fr' ? 'Ajouter un article' : 'إضافة مقالة',
    empty: lang === 'fr' ? 'Aucun article.' : 'لا توجد مقالات.',
    edit: lang === 'fr' ? 'Modifier' : 'تعديل',
    author: lang === 'fr' ? 'Auteur' : 'المؤلف',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {translations.title}
          </h1>
          <Link href={`/${lang}/admin/blog/new` as any}>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {translations.add}
            </Button>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex gap-2">
          <form method="get" className="w-full flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="search"
                placeholder={
                  lang === 'fr' ? 'Chercher un article...' : 'البحث عن مقالة...'
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
              <option value="">
                {lang === 'fr' ? 'Tous les statuts' : 'جميع الحالات'}
              </option>
              <option value="draft">
                {lang === 'fr' ? 'Brouillon' : 'مسودة'}
              </option>
              <option value="published">
                {lang === 'fr' ? 'Publié' : 'منشور'}
              </option>
              <option value="archived">
                {lang === 'fr' ? 'Archivé' : 'مؤرشف'}
              </option>
            </select>
            <Button type="submit" variant="outline">
              {lang === 'fr' ? 'Filtrer' : 'تصفية'}
            </Button>
          </form>
        </div>

        {/* Posts List */}
        {!posts || posts.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 dark:text-slate-400">
            {translations.empty}
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} className="p-4 bg-white dark:bg-slate-900">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {lang === 'fr' ? post.title_fr : post.title_ar}
                      </h3>
                      {post.featured && (
                        <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-500/20 px-2 py-1 rounded">
                          {lang === 'fr' ? 'En vedette' : 'مميز'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      {post.author?.full_name && (
                        <span>
                          {translations.author}: {post.author.full_name}
                        </span>
                      )}
                      {post.published_at && (
                        <span>
                          {new Date(post.published_at).toLocaleDateString(
                            lang === 'fr' ? 'fr-FR' : 'ar-SA',
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/20'
                        : post.status === 'draft'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20'
                    }`}
                  >
                    {post.status}
                  </span>
                  <Link href={`/${lang}/admin/blog/${post.id}` as any}>
                    <Button variant="outline" size="sm">
                      {lang === 'fr' ? 'Modifier' : 'تعديل'}
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
