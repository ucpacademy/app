'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ lang: Lang; eventId: string }>;
}) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [lang, setLang] = useState<Lang>('fr');
  const [eventId, setEventId] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setLang(resolvedParams.lang);
      setEventId(resolvedParams.eventId);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (error) throw error;
        setEvent(data);

        // Check if user is already registered
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data: registration } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', eventId)
            .eq('user_id', user.id)
            .single();

          if (registration) {
            setIsRegistered(true);
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegister = async (formData: FormData) => {
    try {
      setRegistering(true);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from('event_registrations').insert({
        event_id: eventId,
        user_id: user?.id || null,
        name,
        email,
        phone,
      });

      if (error) throw error;
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering for event:', error);
    } finally {
      setRegistering(false);
    }
  };

  const dict = {
    registerButton:
      lang === 'fr' ? "S'inscrire à l'événement" : 'التسجيل للحدث',
    registered: lang === 'fr' ? 'Vous êtes inscrit' : 'أنت مسجل',
    shareEvent: lang === 'fr' ? "Partager l'événement" : 'مشاركة الحدث',
    backLabel: lang === 'fr' ? 'Retour aux événements' : 'العودة إلى الأحداث',
    name: lang === 'fr' ? 'Nom' : 'الاسم',
    email: lang === 'fr' ? 'Email' : 'البريد الإلكتروني',
    phone: lang === 'fr' ? 'Téléphone' : 'الهاتف',
    capacityFull: lang === 'fr' ? 'Événement complet' : 'الحدث ممتلئ',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black flex items-center justify-center">
        <Card className="p-8 text-center bg-white dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {lang === 'fr' ? 'Événement non trouvé' : 'لم يتم العثور على الحدث'}
          </p>
          <Link href={`/${lang}/events` as any}>
            <Button>{dict.backLabel}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const eventDate = new Date(event.event_date);
  const spotsLeft = event.capacity
    ? event.capacity - (event.registered_count || 0)
    : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href={`/${lang}/events` as any}
          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm mb-6 block"
        >
          ← {dict.backLabel}
        </Link>

        {/* Event Image */}
        {event.image_url && (
          <div className="w-full h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={event.image_url}
              alt={lang === 'fr' ? event.title_fr : event.title_ar}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {lang === 'fr' ? event.title_fr : event.title_ar}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              {lang === 'fr' ? event.description_fr : event.description_ar}
            </p>

            {/* Details */}
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {lang === 'fr' ? 'Date et heure' : 'التاريخ والوقت'}
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {eventDate.toLocaleDateString(
                      lang === 'fr' ? 'fr-FR' : 'ar-SA',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </div>
                </div>
              </div>

              {event.location_fr && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {lang === 'fr' ? 'Lieu' : 'المكان'}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {lang === 'fr' ? event.location_fr : event.location_ar}
                    </div>
                  </div>
                </div>
              )}

              {spotsLeft !== null && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {lang === 'fr' ? 'Places disponibles' : 'الأماكن المتاحة'}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {spotsLeft} / {event.capacity}
                    </div>
                  </div>
                </div>
              )}

              {event.duration_months && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {lang === 'fr' ? 'Durée' : 'المدة'}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {event.duration_months} {lang === 'fr' ? 'mois' : 'أشهر'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Registration Sidebar */}
          <Card className="p-6 h-fit bg-white dark:bg-slate-900 sticky top-6">
            {isRegistered ? (
              <div className="text-center p-4 bg-green-50 dark:bg-green-500/10 rounded-lg mb-4">
                <div className="text-green-700 dark:text-green-400 font-semibold">
                  ✓ {dict.registered}
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {lang === 'fr' ? "S'inscrire" : 'التسجيل'}
                </h3>
                <form action={handleRegister} className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {dict.name}
                    </label>
                    <input
                      required
                      name="name"
                      type="text"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {dict.email}
                    </label>
                    <input
                      required
                      name="email"
                      type="email"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {dict.phone}
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isFull || registering}
                    className="w-full mt-4"
                  >
                    {registering
                      ? lang === 'fr'
                        ? 'Inscription...'
                        : 'التسجيل...'
                      : isFull
                        ? dict.capacityFull
                        : dict.registerButton}
                  </Button>
                </form>
              </>
            )}

            <button className="w-full flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 p-2 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
              {dict.shareEvent}
            </button>
          </Card>
        </div>
      </section>
    </div>
  );
}
