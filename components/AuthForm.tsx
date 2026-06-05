'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { type Lang } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function AuthForm({
  lang,
  initialMode = 'login',
}: {
  lang: Lang;
  initialMode?: 'login' | 'signup';
}) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>(
    'info',
  );

  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(lang === 'fr' ? 'Traitement en cours...' : 'جاري المعالجة...');
    setMessageType('info');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone: phone,
            },
            emailRedirectTo: `${window.location.origin}/${lang}/auth/callback`,
          },
        });

        if (error) throw error;

        setMessage(
          lang === 'fr'
            ? '✓ Vérifiez votre email pour le lien de confirmation.'
            : '✓ تحقق من بريدك الإلكتروني للحصول على رابط التأكيد.',
        );
        setMessageType('success');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage(
          lang === 'fr' ? '✓ Connexion réussie !' : '✓ تم تسجيل الدخول بنجاح!',
        );
        setMessageType('success');

        // Direct to student area by default, Admin check on layout will take care of Admins navigating elsewhere
        router.push(`/${lang}/student`);
        router.refresh();
      }
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : 'Une erreur est survenue',
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const nextMode = mode === 'login' ? 'signup' : 'login';
    setMode(nextMode);
    setMessage('');
    router.push(`/${lang}/${nextMode}`);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-950 dark:text-white">
          {mode === 'login'
            ? lang === 'fr'
              ? 'Connexion'
              : 'تسجيل الدخول'
            : lang === 'fr'
              ? 'Créer un compte'
              : 'إنشاء حساب'}
        </h2>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          {mode === 'login'
            ? lang === 'fr'
              ? 'Accédez à votre espace sécurisé'
              : 'الوصول إلى مساحتك الآمنة'
            : lang === 'fr'
              ? 'Rejoignez-nous en quelques clics'
              : 'انضم إلينا في بضع نقرات'}
        </p>
      </div>
      <Card className="space-y-6 p-6 sm:p-8 border-slate-200 dark:border-slate-800">
        {message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm font-medium ${
              messageType === 'error'
                ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-800'
                : messageType === 'success'
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 border border-green-200 dark:border-green-800'
                  : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {lang === 'fr' ? 'Nom complet' : 'الاسم الكامل'}
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={
                    lang === 'fr' ? 'Ex: Jean Dupont' : 'مثال: أحمد محمد'
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {lang === 'fr' ? 'Numéro de téléphone' : 'رقم الهاتف'}
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition"
                  type="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+212 600 000 000"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {lang === 'fr' ? 'Adresse email' : 'البريد الإلكتروني'}
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={
                lang === 'fr' ? 'exemple@email.com' : 'example@email.com'
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {lang === 'fr' ? 'Mot de passe' : 'كلمة المرور'}
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm mt-2"
          >
            {loading
              ? lang === 'fr'
                ? 'Traitement...'
                : 'جاري المعالجة...'
              : mode === 'login'
                ? lang === 'fr'
                  ? 'Se connecter'
                  : 'تسجيل الدخول'
                : lang === 'fr'
                  ? 'Créer mon compte'
                  : 'إنشاء حسابي'}
          </Button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus:outline-none"
          >
            {mode === 'login'
              ? lang === 'fr'
                ? "Vous n'avez pas de compte ? S'inscrire"
                : 'ليس لديك حساب؟ سجل الآن'
              : lang === 'fr'
                ? 'Vous avez déjà un compte ? Se connecter'
                : 'لديك حساب بالفعل؟ تسجيل الدخول'}
          </button>
        </div>
      </Card>
    </div>
  );
}
