'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function ProgramForm({
  lang,
  branches,
}: {
  lang: string;
  branches: any[];
}) {
  const isFr = lang === 'fr';
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formLang, setFormLang] = useState<'fr' | 'ar'>(isFr ? 'fr' : 'ar');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Auto-fallback: if one language is left empty, copy the other language into it
      const title_fr =
        (formData.get('title_fr') as string) ||
        (formData.get('title_ar') as string);
      const title_ar =
        (formData.get('title_ar') as string) ||
        (formData.get('title_fr') as string);
      const description_fr =
        (formData.get('description_fr') as string) ||
        (formData.get('description_ar') as string);
      const description_ar =
        (formData.get('description_ar') as string) ||
        (formData.get('description_fr') as string);

      const { error: dbError } = await supabase.from('programs').insert({
        title_fr,
        title_ar,
        description_fr,
        description_ar,
        branch_id: formData.get('branch_id') as string,
        duration_months: parseInt(
          formData.get('duration_months') as string,
          10,
        ),
        price_usd: parseFloat(formData.get('price_usd') as string),
        capacity: parseInt(formData.get('capacity') as string, 10),
        status: formData.get('status') as string,
        instructor_id: user?.id, // Automatically attach the logged-in teacher!
      });

      if (dbError) throw dbError;

      // Redirect the teacher back to their programs list on success
      router.push(`/${lang}/teacher/programs`);
      router.refresh();
    } catch (err: any) {
      console.error('Error creating program:', err);
      setError(
        isFr
          ? "Une erreur s'est produite lors de la création du programme."
          : 'حدث خطأ أثناء إنشاء البرنامج.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl dark:bg-red-900/10 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Language Switcher */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setFormLang('fr')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${formLang === 'fr' ? 'bg-white dark:bg-slate-950 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Français
            </button>
            <button
              type="button"
              onClick={() => setFormLang('ar')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${formLang === 'ar' ? 'bg-white dark:bg-slate-950 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              العربية
            </button>
          </div>
        </div>

        {/* Toggleable Translation Fields */}
        <div className="space-y-6">
          <div
            className={`space-y-6 ${formLang === 'fr' ? 'block' : 'hidden'}`}
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Titre du programme (Français)
              </label>
              <input
                required={formLang === 'fr'}
                name="title_fr"
                type="text"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Description (Français)
              </label>
              <textarea
                required={formLang === 'fr'}
                name="description_fr"
                rows={5}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div
            className={`space-y-6 ${formLang === 'ar' ? 'block' : 'hidden'}`}
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                عنوان البرنامج (بالعربية)
              </label>
              <input
                required={formLang === 'ar'}
                name="title_ar"
                type="text"
                dir="rtl"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                الوصف (بالعربية)
              </label>
              <textarea
                required={formLang === 'ar'}
                name="description_ar"
                rows={5}
                dir="rtl"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Common Shared Fields (Numbers, Relations, Options) */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {isFr ? 'Branche Associée' : 'الفرع المرتبط'}
            </label>
            <select
              required
              name="branch_id"
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
            >
              <option value="">{isFr ? 'Sélectionnez...' : 'اختر...'}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {isFr ? b.title_fr : b.title_ar}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {isFr ? 'Durée (Mois)' : 'المدة (بالأشهر)'}
            </label>
            <input
              required
              name="duration_months"
              type="number"
              min="1"
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {isFr ? 'Capacité (Places)' : 'السعة (المقاعد)'}
            </label>
            <input
              required
              name="capacity"
              type="number"
              min="1"
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {isFr ? 'Prix du programme (USD)' : 'سعر البرنامج (دولار)'}
            </label>
            <input
              required
              name="price_usd"
              type="number"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-mono"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {isFr ? 'Statut de publication' : 'حالة النشر'}
            </label>
            <select
              required
              name="status"
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
            >
              <option value="draft">
                {isFr ? 'Brouillon (Caché)' : 'مسودة (مخفي)'}
              </option>
              <option value="published">
                {isFr ? 'Publié (Visible)' : 'منشور (مرئي)'}
              </option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full sm:w-auto rounded-xl shadow-md"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : null}
            {isSubmitting
              ? isFr
                ? 'Création en cours...'
                : 'جاري الإنشاء...'
              : isFr
                ? 'Créer le programme'
                : 'إنشاء البرنامج'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
