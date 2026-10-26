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
  majors,
}: {
  lang: Lang;
  initialMajorId: string;
  majors: any[];
}) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const [majorId, setMajorId] = useState(initialMajorId);
  const [slug, setSlug] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitleFr(newTitle);
    setSlug(
      newTitle
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, ''), // Remove invalid characters
    );
  };

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
            {lang === 'fr' ? 'Filière' : 'التخصص'}
          </label>
          <select
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
            value={majorId}
            onChange={(e) => setMajorId(e.target.value)}
            disabled={!!initialMajorId}
          >
            <option value="">
              {lang === 'fr' ? 'Sélectionnez une filière...' : 'اختر تخصصًا...'}
            </option>
            {majors.map((m) => (
              <option key={m.id} value={m.id}>
                {lang === 'fr' ? m.name_fr : m.name_ar}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            value={slug}
            onChange={(e) =>
              setSlug(
                e.target.value
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, ''),
              )
            }
            placeholder="ex: sage-femme"
          />
          <p className="text-xs text-slate-500 mt-1 px-1">
            {lang === 'fr'
              ? 'Généré automatiquement à partir du titre, mais peut être modifié.'
              : 'يتم إنشاؤه تلقائيًا من العنوان، ولكن يمكن تعديله.'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {lang === 'fr' ? 'Titre (Français)' : 'العنوان (بالفرنسية)'}
          </label>
          <input
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white dark:bg-slate-900"
            value={titleFr}
            onChange={handleTitleChange}
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
