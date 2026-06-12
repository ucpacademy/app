import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';

export default async function AdminEventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const { lang } = await params;
  const { search = '', status = '' } = await searchParams;
  const dict = await getDictionary(lang);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });

  if (search) {
    query = query.or(
      `title_fr.ilike.%${search}%,title_ar.ilike.%${search}%,location_fr.ilike.%${search}%`,
    );
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data: events } = await query;

  const translations = {
    title: lang === 'fr' ? 'Événements' : 'الأحداث',
    add: lang === 'fr' ? 'Ajouter un événement' : 'إضافة حدث',
    empty: lang === 'fr' ? 'Aucun événement.' : 'لا توجد أحداث.',
    edit: lang === 'fr' ? 'Modifier' : 'تعديل',
    delete: lang === 'fr' ? 'Supprimer' : 'حذف',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {translations.title}
          </h1>
          <Link href={`/${lang}/(dashboard)/admin/events/new`}>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {translations.add}
            </Button>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex gap-2">
          <form method="get" className="w-full flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="search"
                placeholder={
                  lang === 'fr'
                    ? 'Chercher des événements...'
                    : 'البحث عن الأحداث...'
                }
                defaultValue={search}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <select
              name="status"
              defaultValue={status}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="">
                {lang === 'fr' ? 'Tous les statuts' : 'جميع الحالات'}
              </option>
              <option value="upcoming">
                {lang === 'fr' ? 'À venir' : 'قادم'}
              </option>
              <option value="ongoing">
                {lang === 'fr' ? 'En cours' : 'جاري'}
              </option>
              <option value="completed">
                {lang === 'fr' ? 'Complété' : 'مكتمل'}
              </option>
            </select>
            <Button type="submit" variant="outline">
              {lang === 'fr' ? 'Filtrer' : 'تصفية'}
            </Button>
          </form>
        </div>

        {/* Events List */}
        {!events || events.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 dark:text-slate-400">
            {translations.empty}
          </Card>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <Card key={event.id} className="p-4 bg-white dark:bg-slate-900">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {lang === 'fr' ? event.title_fr : event.title_ar}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(event.event_date).toLocaleDateString(
                        lang === 'fr' ? 'fr-FR' : 'ar-SA',
                      )}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      event.status === 'upcoming'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20'
                        : event.status === 'ongoing'
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/20'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20'
                    }`}
                  >
                    {event.status}
                  </span>
                  <Link href={`/${lang}/(dashboard)/admin/events/${event.id}`}>
                    <Button variant="outline" size="sm">
                      {translations.edit}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
