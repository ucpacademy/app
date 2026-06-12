import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Search, Trash2 } from 'lucide-react';

export default async function AdminFAQPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { lang } = await params;
  const { search = '', category = '' } = await searchParams;
  const dict = await getDictionary(lang);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('faqs')
    .select('*')
    .order('order_index', { ascending: true });

  if (search) {
    query = query.or(
      `question_fr.ilike.%${search}%,question_ar.ilike.%${search}%,answer_fr.ilike.%${search}%,answer_ar.ilike.%${search}%`,
    );
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data: faqs } = await query;

  // Get unique categories
  const categories = faqs ? [...new Set(faqs.map((f) => f.category))] : [];

  const translations = {
    title: lang === 'fr' ? 'FAQ' : 'الأسئلة المتكررة',
    add: lang === 'fr' ? 'Ajouter une FAQ' : 'إضافة سؤال',
    empty: lang === 'fr' ? 'Aucune FAQ.' : 'لا توجد أسئلة.',
    category: lang === 'fr' ? 'Catégorie' : 'الفئة',
    allCategories: lang === 'fr' ? 'Toutes les catégories' : 'جميع الفئات',
    edit: lang === 'fr' ? 'Modifier' : 'تعديل',
    delete: lang === 'fr' ? 'Supprimer' : 'حذف',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {translations.title}
          </h1>
          <Link href={`/${lang}/(dashboard)/admin/faqs/new`}>
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
                  lang === 'fr' ? 'Chercher une FAQ...' : 'البحث عن سؤال...'
                }
                defaultValue={search}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <select
              name="category"
              defaultValue={category}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="">{translations.allCategories}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline">
              {lang === 'fr' ? 'Filtrer' : 'تصفية'}
            </Button>
          </form>
        </div>

        {/* FAQs List */}
        {!faqs || faqs.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 dark:text-slate-400">
            {translations.empty}
          </Card>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <Card key={faq.id} className="p-4 bg-white dark:bg-slate-900">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {lang === 'fr' ? faq.question_fr : faq.question_ar}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {lang === 'fr' ? faq.answer_fr : faq.answer_ar}
                    </p>
                  </div>
                  <Link href={`/${lang}/(dashboard)/admin/faqs/${faq.id}`}>
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
