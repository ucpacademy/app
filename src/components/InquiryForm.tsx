'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { type Lang } from '@/lib/i18n';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export function InquiryForm({
  branchId,
  lang,
}: {
  branchId: string;
  lang: Lang;
}) {
  const supabase = createBrowserSupabaseClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const msg = formData.get('message') as string;

    // Get user id if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('inquiries').insert({
      branch_id: branchId,
      user_id: user?.id || null,
      name,
      email,
      phone,
      message: msg,
      status: 'pending',
    });

    if (error) {
      setMessage({
        text: lang === 'fr' ? 'Une erreur est survenue.' : 'حدث خطأ.',
        type: 'error',
      });
    } else {
      setMessage({
        text:
          lang === 'fr'
            ? 'Votre demande a été envoyée avec succès !'
            : 'تم إرسال طلبك بنجاح!',
        type: 'success',
      });
      (e.target as HTMLFormElement).reset();
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="p-8 border-slate-200 dark:border-slate-800 shadow-xl shadow-indigo-500/5 bg-white dark:bg-slate-900 rounded-3xl">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          {lang === 'fr' ? 'Intéressé(e) ?' : 'مهتم؟'}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
          {lang === 'fr'
            ? 'Laissez-nous vos coordonnées et nous vous contacterons avec plus de détails.'
            : 'اترك تفاصيلك وسنتصل بك لمزيد من التفاصيل.'}
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            {lang === 'fr' ? 'Nom complet' : 'الاسم الكامل'}
          </label>
          <input
            required
            name="name"
            type="text"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              {lang === 'fr' ? 'Email' : 'البريد الإلكتروني'}
            </label>
            <input
              required
              name="email"
              type="email"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              {lang === 'fr' ? 'Téléphone' : 'رقم الهاتف'}
            </label>
            <input
              required
              name="phone"
              type="tel"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
            {lang === 'fr' ? 'Message (Optionnel)' : 'رسالة (اختياري)'}
          </label>
          <textarea
            name="message"
            rows={4}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            placeholder={lang === 'fr' ? 'Vos questions...' : 'أسئلتك...'}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 mt-4"
        >
          {isSubmitting ? (
            lang === 'fr' ? (
              'Envoi...'
            ) : (
              'جاري الإرسال...'
            )
          ) : (
            <>
              {lang === 'fr' ? 'Envoyer la demande' : 'إرسال الطلب'}
              <Send className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
