'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { type Lang } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function NewInstitutionForm({ lang }: { lang: Lang }) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const [slug, setSlug] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descriptionFr, setDescriptionFr] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [locationFr, setLocationFr] = useState('');
  const [locationAr, setLocationAr] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [featured, setFeatured] = useState(false);
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

    const { error } = await supabase.from('institutions').insert([
      {
        slug: normalizeSlug(slug || `${nameFr || nameAr}`),
        name_fr: nameFr,
        name_ar: nameAr,
        description_fr: descriptionFr,
        description_ar: descriptionAr,
        location_fr: locationFr,
        location_ar: locationAr,
        website: website || null,
        contact_email: contactEmail || null,
        logo_url: logoUrl || null,
        featured,
      },
    ]);

    if (error) {
      setMessage(error.message);
      setIsSaving(false);
      return;
    }

    await router.push(`/${lang}/(dashboard)/admin/institutions`);
    router.refresh();
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            {lang === 'fr' ? 'Slug' : 'الرابط'}
          </label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => setSlug(normalizeSlug(e.target.value))}
            placeholder={
              lang === 'fr' ? 'ex: institut-digital' : 'مثال: المؤسسة-الرقمية'
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Nom (FR)' : 'الاسم (فرنسي)'}
            </span>
            <input
              required
              name="name_fr"
              value={nameFr}
              onChange={(e) => setNameFr(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Nom (AR)' : 'الاسم (عربي)'}
            </span>
            <input
              required
              name="name_ar"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Emplacement (FR)' : 'الموقع (فرنسي)'}
            </span>
            <input
              name="location_fr"
              value={locationFr}
              onChange={(e) => setLocationFr(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'الموقع (AR)' : 'location (AR)'}
            </span>
            <input
              name="location_ar"
              value={locationAr}
              onChange={(e) => setLocationAr(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Site web' : 'الموقع الإلكتروني'}
            </span>
            <input
              name="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Email de contact' : 'البريد الإلكتروني للتواصل'}
            </span>
            <input
              name="contact_email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {lang === 'fr' ? 'Description (FR)' : 'الوصف (فرنسي)'}
          </span>
          <textarea
            name="description_fr"
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
            name="description_ar"
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>

        <div className="flex items-center gap-3">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="featured"
            className="text-sm text-slate-700 dark:text-slate-200"
          >
            {lang === 'fr'
              ? 'Mettre en avant cette institution'
              : 'تمييز هذه المؤسسة'}
          </label>
        </div>

        {message ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
            {message}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
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
                ? 'Créer l’institution'
                : 'إنشاء المؤسسة'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
