'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, Plus, BellRing } from 'lucide-react';
import { type Lang } from '@/lib/i18n';

export function Announcements({
  programId,
  lang,
  isInstructor = false,
}: {
  programId: string;
  lang: Lang;
  isInstructor?: boolean;
}) {
  const isFr = lang === 'fr';
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('program_announcements')
      .select('*, author:profiles(id, full_name)')
      .eq('program_id', programId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAnnouncements(data);
    }
  };

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setUserId(data.user?.id || null));
    fetchAnnouncements();
  }, [programId, supabase]);

  const handleCreate = async () => {
    if (!userId || !newTitle.trim() || !newContent.trim()) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('program_announcements').insert({
      program_id: programId,
      author_id: userId,
      title: newTitle.trim(),
      content: newContent.trim(),
    });

    if (!error) {
      setNewTitle('');
      setNewContent('');
      setIsCreating(false);
      await fetchAnnouncements();
    }
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(lang, {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
            <BellRing className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isFr ? 'Annonces' : 'الإعلانات'}
          </h2>
        </div>
        {isInstructor && !isCreating && (
          <Button
            onClick={() => setIsCreating(true)}
            variant="outline"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {isFr ? 'Nouvelle Annonce' : 'إعلان جديد'}
          </Button>
        )}
      </div>

      {/* Creation Form (Instructors Only) */}
      {isCreating && (
        <Card className="p-5 border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={isFr ? 'Titre de l’annonce' : 'عنوان الإعلان'}
              className="w-full p-2 text-lg font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={
                isFr ? 'Détails de votre annonce...' : 'تفاصيل الإعلان...'
              }
              className="w-full min-h-[120px] p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none resize-y"
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsCreating(false)}>
                {isFr ? 'Annuler' : 'إلغاء'}
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isSubmitting || !newTitle || !newContent}
              >
                {isFr ? 'Publier' : 'نشر الإعلان'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card
            key={announcement.id}
            className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {announcement.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 mb-4">
              {isFr ? 'Posté par ' : 'نشر بواسطة '}{' '}
              <span className="text-indigo-600">
                {announcement.author?.full_name}
              </span>{' '}
              • {formatDate(announcement.created_at)}
            </p>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {announcement.content}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
