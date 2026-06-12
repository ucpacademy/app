'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { type Lang } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function NewMajorForm({ lang }: { lang: Lang }) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const [slug, setSlug] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const { error } = await supabase.rpc('add_major', {
      p_slug: slug,
      p_name_fr: nameFr,
      p_name_ar: nameAr,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      setIsSaving(false);
      return;
    }

    router.push(`/${lang}/admin/majors`);
    router.refresh();
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSave} className="space-y-4">
        {message && (
          <p className="text-red-500 text-sm font-medium">{message}</p>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white dark:bg-slate-900"
            value={slug}
            onChange={(e) =>
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]+/g, '')
                  .replace(/\s+/g, '-'),
              )
            }
            placeholder="ex: sante-ts"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {lang === 'fr' ? 'Nom (Français)' : 'الاسم (بالفرنسية)'}
          </label>
          <input
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white dark:bg-slate-900"
            value={nameFr}
            onChange={(e) => setNameFr(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {lang === 'fr' ? 'Nom (Arabe)' : 'الاسم (بالعربية)'}
          </label>
          <input
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white dark:bg-slate-900"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
          />
        </div>
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-2"
          >
            {isSaving
              ? '...'
              : lang === 'fr'
                ? 'Créer la filière'
                : 'إنشاء التخصص'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
