/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { type Lang } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function BranchEditor({
  branch,
  lang,
}: {
  branch: {
    id: string;
    slug?: string | null;
    featured_image?: string | null;
    gallery?: string[] | null;
    translations?: {
      id?: string | null;
      lang: string;
      title?: string | null;
      benefits?: string | null;
      faqs?: any;
    }[];
  };
  lang: Lang;
}) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const translation = branch.translations?.find((t) => t.lang === lang) || {
    id: undefined,
    title: '',
    benefits: '',
    faqs: [],
  };

  const [slug, setSlug] = useState(branch.slug || '');
  const [title, setTitle] = useState(translation.title || '');
  const [benefits, setBenefits] = useState(translation.benefits || '');
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(
    Array.isArray(translation.faqs) ? translation.faqs : [],
  );

  const [featuredImage, setFeaturedImage] = useState(
    branch.featured_image || '',
  );
  const [gallery, setGallery] = useState<string[]>(branch.gallery || []);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'featured' | 'gallery',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${branch.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('branch-images')
      .upload(filePath, file);

    if (uploadError) {
      setMessage({
        text: `Upload error: ${uploadError.message}`,
        type: 'error',
      });
      setIsUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('branch-images').getPublicUrl(filePath);

    if (type === 'featured') {
      setFeaturedImage(publicUrl);
    } else {
      setGallery([...gallery, publicUrl]);
    }

    setIsUploading(false);
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGallery(gallery.filter((_, index) => index !== indexToRemove));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleFaqChange = (
    index: number,
    field: 'question' | 'answer',
    value: string,
  ) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleRemoveFaq = (indexToRemove: number) => {
    setFaqs(faqs.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    // 1. Update Branch
    const { error: branchError } = await supabase
      .from('branches')
      .update({ slug, featured_image: featuredImage, gallery })
      .eq('id', branch.id);

    if (branchError) {
      setMessage({
        text: `Branch update error: ${branchError.message}`,
        type: 'error',
      });
      setIsSaving(false);
      return;
    }

    // 2. Update or Insert Translation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const translationData = { title, benefits, faqs: faqs as any };

    if (translation.id) {
      const { error: translationError } = await supabase
        .from('branch_translations')
        .update(translationData)
        .eq('id', translation.id);
      if (translationError)
        return setMessage({
          text: `Translation error: ${translationError.message}`,
          type: 'error',
        });
    } else {
      const { error: translationError } = await supabase
        .from('branch_translations')
        .insert({ branch_id: branch.id, lang, ...translationData });
      if (translationError)
        return setMessage({
          text: `Translation error: ${translationError.message}`,
          type: 'error',
        });
    }

    setMessage({
      text: lang === 'fr' ? 'Sauvegardé avec succès !' : 'تم الحفظ بنجاح!',
      type: 'success',
    });
    setIsSaving(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
        >
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            {lang === 'fr' ? 'Informations Générales' : 'معلومات عامة'}
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white dark:bg-slate-900"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {lang === 'fr' ? 'Titre' : 'العنوان'}
            </label>
            <input
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white dark:bg-slate-900"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {lang === 'fr' ? 'Bénéfices' : 'الفوائد'}
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 px-4 py-2 min-h-[120px] bg-white dark:bg-slate-900"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
            />
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4">
            {lang === 'fr' ? 'Médias' : 'الوسائط'}
          </h2>
          <div>
            <label className="block text-sm font-medium mb-2">
              {lang === 'fr' ? 'Image Principale' : 'الصورة الرئيسية'}
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                {featuredImage ? (
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium rounded-xl transition-colors shadow-sm text-sm">
                <UploadCloud className="w-4 h-4" />
                {isUploading
                  ? '...'
                  : lang === 'fr'
                    ? "Changer l'image"
                    : 'تغيير الصورة'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'featured')}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {lang === 'fr' ? 'Galerie' : 'معرض الصور'}
            </label>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
              <label className="cursor-pointer aspect-square bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors rounded-xl border border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-500 gap-1">
                <Plus className="w-6 h-6" />
                <span className="text-xs font-medium">
                  {lang === 'fr' ? 'Ajouter' : 'إضافة'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'gallery')}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {lang === 'fr' ? 'Foire Aux Questions' : 'الأسئلة الشائعة'}
          </h2>
          <Button
            type="button"
            onClick={handleAddFaq}
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            {lang === 'fr' ? 'Ajouter une question' : 'إضافة سؤال'}
          </Button>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex-1 space-y-3">
                <input
                  placeholder={lang === 'fr' ? 'Question...' : 'السؤال...'}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 font-medium bg-white dark:bg-slate-900"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, 'question', e.target.value)
                  }
                />
                <textarea
                  placeholder={lang === 'fr' ? 'Réponse...' : 'الجواب...'}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm min-h-[80px] bg-white dark:bg-slate-900"
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(index, 'answer', e.target.value)
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFaq(index)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl h-fit transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {faqs.length === 0 && (
            <p className="text-sm text-slate-500 italic text-center py-8">
              {lang === 'fr'
                ? 'Aucune question pour le moment.'
                : 'لا توجد أسئلة حتى الآن.'}
            </p>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving || isUploading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-6 text-lg shadow-sm"
        >
          {isSaving
            ? '...'
            : lang === 'fr'
              ? 'Enregistrer les modifications'
              : 'حفظ التغييرات'}
        </Button>
      </div>
    </form>
  );
}
