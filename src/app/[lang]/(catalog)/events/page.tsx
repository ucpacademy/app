import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDictionary, type Lang } from '@/utils/dictionary';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createServerSupabaseClient();

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .in('status', ['upcoming', 'ongoing'])
    .order('event_date', { ascending: true });

  const title = lang === 'fr' ? 'Événements' : 'الأحداث';
  const description =
    lang === 'fr'
      ? 'Rejoignez nos événements éducatifs et réseautage'
      : 'انضم إلى أحداثنا التعليمية والتواصل';

  const upcomingLabel = lang === 'fr' ? 'À venir' : 'قادم';
  const ongoingLabel = lang === 'fr' ? 'En cours' : 'جاري';
  const registerLabel = lang === 'fr' ? "S'inscrire" : 'تسجيل';
  const capacityLabel = lang === 'fr' ? 'places restantes' : 'أماكن متبقية';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {!events || events.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
            {lang === 'fr'
              ? 'Aucun événement prévu.'
              : 'لا توجد أحداث مخطط لها.'}
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const eventDate = new Date(event.event_date);
              const isOngoing = event.status === 'ongoing';
              const spotsLeft = event.capacity
                ? event.capacity - (event.registered_count || 0)
                : null;

              return (
                <Link
                  key={event.id}
                  href={`/${lang}/events/${event.id}` as any}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-slate-900">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      {/* Event Image */}
                      {event.image_url && (
                        <div className="w-full md:w-48 h-40 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={event.image_url}
                            alt={
                              lang === 'fr' ? event.title_fr : event.title_ar
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Event Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isOngoing
                                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                            }`}
                          >
                            {isOngoing ? ongoingLabel : upcomingLabel}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                          {lang === 'fr' ? event.title_fr : event.title_ar}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          {lang === 'fr'
                            ? event.description_fr
                            : event.description_ar}
                        </p>

                        {/* Event Details */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {eventDate.toLocaleDateString(
                                lang === 'fr' ? 'fr-FR' : 'ar-SA',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                            </span>
                          </div>
                          {event.location_fr && (
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {lang === 'fr'
                                  ? event.location_fr
                                  : event.location_ar}
                              </span>
                            </div>
                          )}
                          {spotsLeft !== null && (
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <Users className="w-4 h-4" />
                              <span>
                                {spotsLeft} {capacityLabel}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Register Button */}
                        <Button className="flex items-center gap-2">
                          {registerLabel}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
