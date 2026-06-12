'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { type Lang } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BranchOption {
  id: string;
  slug: string;
  title_fr: string;
  title_ar: string;
}

interface InstitutionOption {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
}

interface ProgramData {
  id: string;
  slug: string;
  branch_id: string;
  institution_id?: string | null;
  title_fr: string;
  title_ar: string;
  description_fr?: string | null;
  description_ar?: string | null;
  duration_months?: number | null;
  capacity?: number | null;
  price_usd?: number | null;
  price_mad?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  status: string;
}

export function ProgramEditor({
  program,
  branches,
  institutions,
  lang,
}: {
  program: ProgramData;
  branches: BranchOption[];
  institutions: InstitutionOption[];
  lang: Lang;
}) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const [branchId, setBranchId] = useState(program.branch_id);
  const [institutionId, setInstitutionId] = useState(
    program.institution_id ?? '',
  );
  const [slug, setSlug] = useState(program.slug);
  const [titleFr, setTitleFr] = useState(program.title_fr);
  const [titleAr, setTitleAr] = useState(program.title_ar);
  const [descriptionFr, setDescriptionFr] = useState(
    program.description_fr ?? '',
  );
  const [descriptionAr, setDescriptionAr] = useState(
    program.description_ar ?? '',
  );
  const [durationMonths, setDurationMonths] = useState(
    program.duration_months?.toString() ?? '',
  );
  const [capacity, setCapacity] = useState(program.capacity?.toString() ?? '');
  const [priceUsd, setPriceUsd] = useState(program.price_usd?.toString() ?? '');
  const [priceMad, setPriceMad] = useState(program.price_mad?.toString() ?? '');
  const [startDate, setStartDate] = useState(program.start_date ?? '');
  const [endDate, setEndDate] = useState(program.end_date ?? '');
  const [status, setStatus] = useState(program.status);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const normalizeSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('programs')
      .update({
        branch_id: branchId,
        institution_id: institutionId || null,
        slug: normalizeSlug(slug),
        title_fr: titleFr,
        title_ar: titleAr,
        description_fr: descriptionFr || null,
        description_ar: descriptionAr || null,
        duration_months: durationMonths ? parseInt(durationMonths, 10) : null,
        capacity: capacity ? parseInt(capacity, 10) : null,
        price_usd: priceUsd ? parseFloat(priceUsd) : null,
        price_mad: priceMad ? parseFloat(priceMad) : null,
        start_date: startDate || null,
        end_date: endDate || null,
        status,
      })
      .eq('id', program.id);

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    await router.push(`/${lang}/(dashboard)/admin/programs`);
    router.refresh();
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Filière' : 'التخصص'}
            </span>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {lang === 'fr' ? branch.title_fr : branch.title_ar}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Institution' : 'المؤسسة'}
            </span>
            <select
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">
                {lang === 'fr'
                  ? 'Aucune institution sélectionnée'
                  : 'لم يتم تحديد مؤسسة'}
              </option>
              {institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {lang === 'fr' ? institution.name_fr : institution.name_ar}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Slug
            </span>
            <input
              value={slug}
              onChange={(e) => setSlug(normalizeSlug(e.target.value))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Statut' : 'الحالة'}
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
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
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Durée (mois)' : 'المدة (أشهر)'}
            </span>
            <input
              type="number"
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Capacité' : 'السعة'}
            </span>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Prix USD' : 'السعر بالدولار'}
            </span>
            <input
              type="number"
              step="0.01"
              value={priceUsd}
              onChange={(e) => setPriceUsd(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Prix MAD' : 'السعر بالدرهم'}
            </span>
            <input
              type="number"
              step="0.01"
              value={priceMad}
              onChange={(e) => setPriceMad(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Date de début' : 'تاريخ البدء'}
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Date de fin' : 'تاريخ الانتهاء'}
            </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {lang === 'fr' ? 'Description (FR)' : 'الوصف (فرنسي)'}
          </span>
          <textarea
            value={descriptionFr}
            onChange={(e) => setDescriptionFr(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {lang === 'fr' ? 'Description (AR)' : 'الوصف (عربي)'}
          </span>
          <textarea
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>

        {message ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
            {message}
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving
              ? lang === 'fr'
                ? 'Enregistrement…'
                : 'جارٍ الحفظ…'
              : lang === 'fr'
                ? 'Sauvegarder le programme'
                : 'حفظ البرنامج'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
