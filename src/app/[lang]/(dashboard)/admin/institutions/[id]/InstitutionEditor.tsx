'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { type Lang } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Institution {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  description_fr?: string | null;
  description_ar?: string | null;
  website?: string | null;
  logo_url?: string | null;
  location_fr?: string | null;
  location_ar?: string | null;
  contact_email?: string | null;
  featured?: boolean | null;
}

export function InstitutionEditor({
  institution,
  lang,
}: {
  institution: Institution;
  lang: Lang;
}) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const [slug, setSlug] = useState(institution.slug);
  const [nameFr, setNameFr] = useState(institution.name_fr);
  const [nameAr, setNameAr] = useState(institution.name_ar);
  const [descriptionFr, setDescriptionFr] = useState(
    institution.description_fr ?? '',
  );
  const [descriptionAr, setDescriptionAr] = useState(
    institution.description_ar ?? '',
  );
  const [locationFr, setLocationFr] = useState(institution.location_fr ?? '');
  const [locationAr, setLocationAr] = useState(institution.location_ar ?? '');
  const [website, setWebsite] = useState(institution.website ?? '');
  const [contactEmail, setContactEmail] = useState(
    institution.contact_email ?? '',
  );
  const [logoUrl, setLogoUrl] = useState(institution.logo_url ?? '');
  const [featured, setFeatured] = useState(Boolean(institution.featured));
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
      .from('institutions')
      .update({
        slug: normalizeSlug(slug),
        name_fr: nameFr,
        name_ar: nameAr,
        description_fr: descriptionFr || null,
        description_ar: descriptionAr || null,
        location_fr: locationFr || null,
        location_ar: locationAr || null,
        website: website || null,
        contact_email: contactEmail || null,
        logo_url: logoUrl || null,
        featured,
      })
      .eq('id', institution.id);

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
              {lang === 'fr' ? 'Mettre en avant' : 'تمييز'}
            </span>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Nom (FR)' : 'الاسم (فرنسي)'}
            </span>
            <input
              required
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
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Emplacement (FR)' : 'الموقع (فرنسي)'}
            </span>
            <input
              value={locationFr}
              onChange={(e) => setLocationFr(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'الموقع (AR)' : 'الموقع (عربي)'}
            </span>
            <input
              value={locationAr}
              onChange={(e) => setLocationAr(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Site web
            </span>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {lang === 'fr' ? 'Email de contact' : 'البريد الإلكتروني'}
            </span>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Logo URL
          </span>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
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
                ? 'Sauvegarder'
                : 'حفظ'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
