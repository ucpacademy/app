'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import Link from 'next/link';
import { Loader2, ShieldAlert, Clock, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AuthGuard({
  children,
  requiredRole,
  lang,
}: {
  children: React.ReactNode;
  requiredRole: string;
  lang: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRole, setHasRole] = useState(false);
  const [requestStatus, setRequestStatus] = useState<
    'none' | 'pending' | 'approved' | 'rejected'
  >('none');
  const [supabase] = useState(() => createBrowserSupabaseClient());

  // Inline login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      if (isMounted) setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          if (isMounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) setIsAuthenticated(true);

        // Fetch profile to get role array
        const { data: profile } = await supabase
          .from('profiles')
          .select('roles')
          .eq('id', user.id)
          .single();

        const roles = profile?.roles || [];

        // Admins can access everything, otherwise check for specific role
        if (roles.includes(requiredRole) || roles.includes('admin')) {
          if (isMounted) setHasRole(true);
        } else {
          // Fetch the latest role request status if they don't have the role
          const { data: request } = await supabase
            .from('role_requests')
            .select('status')
            .eq('user_id', user.id)
            .eq('requested_role', requiredRole)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (isMounted && request) {
            setRequestStatus(request.status as any);
          }
        }
      } catch (error) {
        console.error('AuthGuard error:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [supabase, requiredRole, refreshTrigger]);

  const handleRequestAccess = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('role_requests').insert({
          user_id: user.id,
          requested_role: requiredRole,
          status: 'pending',
        });
        setRequestStatus('pending');
      }
    } catch (error) {
      console.error('Failed to request access:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Success! Trigger a re-check of auth and roles
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: any) {
      setLoginError(
        lang === 'fr'
          ? 'Échec de la connexion. Veuillez vérifier vos identifiants.'
          : 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.',
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // State 1: User is not logged in at all
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <Card className="max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-2">
            <Lock className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lang === 'fr' ? 'Connexion requise' : 'تسجيل الدخول مطلوب'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {lang === 'fr'
                ? 'Veuillez vous connecter pour accéder à ce tableau de bord.'
                : 'يرجى تسجيل الدخول للوصول إلى لوحة القيادة هذه.'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {loginError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400 rounded-lg text-center">
                {loginError}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {lang === 'fr' ? 'Adresse e-mail' : 'البريد الإلكتروني'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder={
                  lang === 'fr' ? 'votre@email.com' : 'votre@email.com'
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {lang === 'fr' ? 'Mot de passe' : 'كلمة المرور'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={isLoggingIn} className="w-full">
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isLoggingIn
                ? lang === 'fr'
                  ? 'Connexion...'
                  : 'جاري تسجيل الدخول...'
                : lang === 'fr'
                  ? 'Se connecter'
                  : 'تسجيل الدخول'}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-500">
            {lang === 'fr' ? 'Pas encore de compte ?' : 'ليس لديك حساب؟'}{' '}
            <Link
              href={`/${lang}/signup`}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              {lang === 'fr' ? "S'inscrire" : 'إنشاء حساب'}
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // State 2: User is logged in but doesn't have the required role
  if (!hasRole) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          {requestStatus === 'pending' ? (
            <>
              <Clock className="w-16 h-16 mx-auto text-amber-500" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {lang === 'fr' ? 'Demande en cours' : 'الطلب قيد المعالجة'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {lang === 'fr'
                    ? "Votre demande d'accès est en cours de traitement par un administrateur."
                    : 'طلب الوصول الخاص بك قيد المعالجة حاليًا بواسطة مسؤول.'}
                </p>
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/${lang}/student`}>
                  {lang === 'fr' ? 'Retour à mon espace' : 'العودة لمساحتي'}
                </Link>
              </Button>
            </>
          ) : requestStatus === 'rejected' ? (
            <>
              <ShieldAlert className="w-16 h-16 mx-auto text-red-500" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {lang === 'fr' ? 'Demande refusée' : 'تم رفض الطلب'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {lang === 'fr'
                    ? "Votre demande d'accès a été refusée. Veuillez contacter le support."
                    : 'تم رفض طلب الوصول الخاص بك. يرجى الاتصال بالدعم.'}
                </p>
              </div>
              <Button onClick={handleRequestAccess} className="w-full">
                {lang === 'fr'
                  ? 'Faire une nouvelle demande'
                  : 'تقديم طلب جديد'}
              </Button>
            </>
          ) : (
            <>
              <ShieldAlert className="w-16 h-16 mx-auto text-indigo-600" />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {lang === 'fr' ? 'Accès restreint' : 'وصول مقيد'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {lang === 'fr'
                    ? `Vous n'avez pas les permissions pour accéder à cet espace. Souhaitez-vous postuler ?`
                    : `ليس لديك أذونات للوصول إلى هذه المساحة. هل ترغب في التقديم؟`}
                </p>
              </div>
              <Button onClick={handleRequestAccess} className="w-full">
                {lang === 'fr' ? "Demander l'accès" : 'طلب الوصول'}
              </Button>
            </>
          )}
        </Card>
      </div>
    );
  }

  // State 3: User is authorized! Let them see the dashboard.
  return <>{children}</>;
}
