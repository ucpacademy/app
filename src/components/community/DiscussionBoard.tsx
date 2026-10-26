'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, MessageSquare, Send, CornerDownRight } from 'lucide-react';
import { type Lang } from '@/lib/i18n';

export function DiscussionBoard({
  programId,
  lang,
}: {
  programId: string;
  lang: Lang;
}) {
  const isFr = lang === 'fr';
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('program_posts')
      .select(
        `
        id, content, created_at, parent_post_id, author_id,
        author:profiles(id, full_name, avatar_url)
      `,
      )
      .eq('program_id', programId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setPosts(data);
    }
  };

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setUserId(data.user?.id || null));
    fetchPosts();
  }, [programId, supabase]);

  const handleSubmit = async (parentId: string | null = null) => {
    if (!userId) return;
    const content = parentId ? replyContent : newPostContent;
    if (!content.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase.from('program_posts').insert({
      program_id: programId,
      author_id: userId,
      content: content.trim(),
      parent_post_id: parentId,
    });

    if (!error) {
      if (parentId) {
        setReplyContent('');
        setReplyingTo(null);
      } else {
        setNewPostContent('');
      }
      await fetchPosts();
    }
    setIsSubmitting(false);
  };

  // Separate threads and replies
  const threads = posts
    .filter((p) => !p.parent_post_id)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const getReplies = (parentId: string) =>
    posts.filter((p) => p.parent_post_id === parentId);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(lang, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6">
      {/* Write a new post */}
      <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={
                isFr
                  ? 'Partagez quelque chose avec la communauté...'
                  : 'شارك شيئًا مع المجتمع...'
              }
              className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 outline-none resize-y transition-all"
            />
            <div className="flex justify-end">
              <Button
                onClick={() => handleSubmit(null)}
                disabled={isSubmitting || !newPostContent.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6"
              >
                {isSubmitting ? '...' : isFr ? 'Publier' : 'نشر'}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Threads List */}
      <div className="space-y-4">
        {threads.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            {isFr
              ? 'Aucune discussion pour le moment. Soyez le premier !'
              : 'لا توجد مناقشات حتى الآن. كن الأول!'}
          </div>
        ) : (
          threads.map((thread) => (
            <Card
              key={thread.id}
              className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
            >
              {/* Main Thread */}
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {thread.author?.avatar_url ? (
                    <img
                      src={thread.author.avatar_url}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {thread.author?.full_name || 'Utilisateur'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(thread.created_at)}
                  </div>
                </div>
              </div>
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-13">
                {thread.content}
              </div>

              {/* Thread Actions */}
              <div className="mt-4 flex gap-4 pl-13">
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === thread.id ? null : thread.id)
                  }
                  className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                  <CornerDownRight className="w-4 h-4" />
                  {isFr ? 'Répondre' : 'رد'}
                </button>
              </div>

              {/* Replies */}
              <div className="mt-4 space-y-3 pl-10 border-l-2 border-slate-100 dark:border-slate-800">
                {getReplies(thread.id).map((reply) => (
                  <div key={reply.id} className="pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {reply.author?.full_name || 'Utilisateur'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDate(reply.created_at)}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                      {reply.content}
                    </div>
                  </div>
                ))}

                {/* Reply Input */}
                {replyingTo === thread.id && (
                  <div className="pl-4 pt-2 flex gap-2">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={
                        isFr ? 'Écrire une réponse...' : 'اكتب ردا...'
                      }
                      className="flex-1 text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSubmit(thread.id)}
                      disabled={isSubmitting || !replyContent.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {isFr ? 'Envoyer' : 'إرسال'}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
