'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { type Lang } from '@/lib/i18n';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Trash2, Mail, Phone, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function InquiriesList({
  initialInquiries,
  lang,
}: {
  initialInquiries: any[];
  lang: Lang;
}) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';

    // Optimistic update so the UI feels incredibly fast
    setInquiries(
      inquiries.map((inq) =>
        inq.id === id ? { ...inq, status: newStatus } : inq,
      ),
    );

    await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);

    router.refresh();
  };

  const deleteInquiry = async (id: string) => {
    if (
      !confirm(
        lang === 'fr'
          ? 'Êtes-vous sûr de vouloir supprimer cette demande ?'
          : 'هل أنت متأكد من حذف هذا الطلب؟',
      )
    )
      return;

    setInquiries(inquiries.filter((inq) => inq.id !== id));

    await supabase.from('inquiries').delete().eq('id', id);

    router.refresh();
  };

  if (inquiries.length === 0) {
    return (
      <Card className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border-dashed border-2">
        {lang === 'fr'
          ? 'Aucune demande pour le moment.'
          : 'لا توجد طلبات في الوقت الحالي.'}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => {
        const isResolved = inquiry.status === 'resolved';
        const branchTitle =
          inquiry.branch?.translations?.find((t: any) => t.lang === lang)
            ?.title ||
          inquiry.branch?.slug ||
          (lang === 'fr' ? 'Branche inconnue' : 'فرع غير معروف');

        return (
          <Card
            key={inquiry.id}
            className={`p-6 transition-all duration-300 ${isResolved ? 'bg-slate-50 dark:bg-slate-900/40 opacity-75' : 'bg-white dark:bg-slate-900 shadow-sm border-indigo-100 dark:border-indigo-900/50'}`}
          >
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              <div className="space-y-4 flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${isResolved ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'}`}
                  >
                    {isResolved
                      ? lang === 'fr'
                        ? 'Résolu'
                        : 'تم الحل'
                      : lang === 'fr'
                        ? 'En attente'
                        : 'قيد الانتظار'}
                  </span>
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full">
                    {branchTitle}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(inquiry.created_at).toLocaleDateString(
                      lang === 'fr' ? 'fr-FR' : 'ar-SA',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {inquiry.name}
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-slate-400" />{' '}
                      {inquiry.email}
                    </a>
                    {inquiry.phone && (
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-slate-400" />{' '}
                        {inquiry.phone}
                      </a>
                    )}
                  </div>
                </div>

                {inquiry.message && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm border border-slate-100 dark:border-slate-800/60 whitespace-pre-wrap">
                    {inquiry.message}
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => toggleStatus(inquiry.id, inquiry.status)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isResolved
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400'
                  }`}
                >
                  {isResolved ? (
                    <>
                      <Circle className="w-4 h-4" />{' '}
                      {lang === 'fr'
                        ? 'Marquer non résolu'
                        : 'التعليم كغير محلول'}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />{' '}
                      {lang === 'fr' ? 'Marquer résolu' : 'التعليم كمحلول'}
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteInquiry(inquiry.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />{' '}
                  {lang === 'fr' ? 'Supprimer' : 'حذف'}
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
