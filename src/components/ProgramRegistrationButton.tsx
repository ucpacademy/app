'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { type Lang } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

interface ProgramRegistrationButtonProps {
  programId: string;
  status: string;
  capacity?: number | null;
  lang: Lang;
}

export function ProgramRegistrationButton({
  programId,
  status,
  capacity,
  lang,
}: ProgramRegistrationButtonProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);

        const { data: enrolledData, error: enrolledError } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('program_id', programId)
          .single();

        if (!enrolledError && enrolledData) {
          setIsEnrolled(true);
        }

        if (capacity) {
          const { count, error: countError } = await supabase
            .from('enrollments')
            .select('id', { count: 'exact', head: true })
            .eq('program_id', programId);

          if (!countError && typeof count === 'number') {
            setIsFull(count >= capacity);
          }
        }
      } catch (err) {
        console.error('Program registration status error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, [programId, capacity, supabase]);

  const handleRegister = async () => {
    try {
      setError('');
      setSubmitting(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/${lang}/login`);
        return;
      }

      const { error: insertError } = await supabase.from('enrollments').insert({
        user_id: user.id,
        program_id: programId,
        status: 'active',
      });

      if (insertError) {
        if (insertError.code === '23505') {
          setIsEnrolled(true);
        } else {
          setError(insertError.message);
        }
        return;
      }

      setIsEnrolled(true);
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        lang === 'fr'
          ? 'Impossible de vous inscrire pour le moment.'
          : 'تعذر التسجيل في الوقت الحالي.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const buttonText = () => {
    if (loading) return lang === 'fr' ? 'Chargement...' : 'جاري التحميل...';
    if (isEnrolled) return lang === 'fr' ? 'Déjà inscrit' : 'مسجل بالفعل';
    if (!isAuthenticated)
      return lang === 'fr'
        ? 'Se connecter pour s’inscrire'
        : 'سجل الدخول للتسجيل';
    if (isFull) return lang === 'fr' ? 'Places complètes' : 'امتلأت الأماكن';
    if (status !== 'published')
      return lang === 'fr' ? 'Inscription non disponible' : 'التسجيل غير متاح';
    return lang === 'fr' ? 'S’inscrire' : 'التسجيل';
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        disabled={
          loading ||
          submitting ||
          isEnrolled ||
          isFull ||
          status !== 'published'
        }
        onClick={handleRegister}
        className="w-full"
      >
        {buttonText()}
      </Button>
      {!loading && isAuthenticated && isFull && (
        <p className="text-sm text-rose-600 dark:text-rose-400">
          {lang === 'fr'
            ? 'Les inscriptions sont fermées pour ce programme.'
            : 'التسجيل مغلق لهذا البرنامج.'}
        </p>
      )}
      {error ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}
    </div>
  );
}
