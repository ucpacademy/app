'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { type Lang } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function NewBranchForm({
  lang,
  initialMajorId,
}: {
  lang: Lang;
  initialMajorId: string;
}) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const [majorId, setMajorId] = useState(initialMajorId);
  const [slug, setSlug] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const { data: newBranchId, error } = await supabase.rpc('add_branch', {
      p_major_id: majorId,
      p_slug: slug,
      p_title_fr: titleFr,
      p_title_ar: titleAr,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      setIsSaving(false);
      return;
    }

    // Redirect directly to the full branch editor to upload images and FAQs
    router.push(`/${lang}/admin/branches/${newBranchId}`);
    router.refresh();
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSave} className="space-y-4">
        {message && (
          <p className="text-red-500 text-sm font-medium">{message}</p>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">
            {lang === 'fr' ? 'ID de la Filière' : 'معرّف التخصص'}
          </label>
          <input
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500"
            value={majorId}
            onChange={(e) => setMajorId(e.target.value)}
            readOnly={!!initialMajorId}
          />
        </div>
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
                  .replace(/[\s_]+/g, '-')
                  .replace(/[^a-z0-9-]+/g, ''),
              )
            }
            placeholder="ex: sage-femme"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {lang === 'fr' ? 'Titre (Français)' : 'العنوان (بالفرنسية)'}
          </label>
          <input
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white dark:bg-slate-900"
            value={titleFr}
            onChange={(e) => setTitleFr(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {lang === 'fr' ? 'Titre (Arabe)' : 'العنوان (بالعربية)'}
          </label>
          <input
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white dark:bg-slate-900"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
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
                ? "Continuer vers l'éditeur"
                : 'متابعة إلى المحرر'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
