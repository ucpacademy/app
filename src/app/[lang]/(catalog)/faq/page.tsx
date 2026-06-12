'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

export default function FAQPage({ lang }: { lang: Lang }) {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setFaqs(data || []);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const dict = {
    title: lang === 'fr' ? 'Questions Fréquemment Posées' : 'الأسئلة المتكررة',
    description:
      lang === 'fr'
        ? 'Trouvez les réponses aux questions courantes'
        : 'ابحث عن إجابات الأسئلة الشائعة',
    empty:
      lang === 'fr' ? 'Aucune FAQ disponible.' : 'لا توجد أسئلة متكررة متاحة.',
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

  // Group FAQs by category
  const faqsByCategory = faqs.reduce(
    (acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {dict.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {dict.description}
          </p>
        </div>

        {Object.keys(faqsByCategory).length === 0 ? (
          <Card className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
            {dict.empty}
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {category}
                </h2>
                <div className="space-y-3">
                  {categoryFaqs.map((faq) => (
                    <Card
                      key={faq.id}
                      className="overflow-hidden bg-white dark:bg-slate-900 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() =>
                        setExpandedId(expandedId === faq.id ? null : faq.id)
                      }
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-900 dark:text-white pr-4">
                            {lang === 'fr' ? faq.question_fr : faq.question_ar}
                          </h3>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0 transition-transform ${
                              expandedId === faq.id
                                ? 'transform rotate-180'
                                : ''
                            }`}
                          />
                        </div>
                        {expandedId === faq.id && (
                          <p className="mt-4 text-slate-600 dark:text-slate-400">
                            {lang === 'fr' ? faq.answer_fr : faq.answer_ar}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
