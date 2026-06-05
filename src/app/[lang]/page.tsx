import Image from 'next/image';
import Link from 'next/link';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { BranchSearch } from '@/components/BranchSearch';
import { Award, BookOpen, ShieldCheck, Users, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const dictionary = await getDictionary(lang);

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 inset-x-0 h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/70 via-white to-white dark:from-indigo-900/20 dark:via-slate-950 dark:to-slate-950 -z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center pt-24 md:pt-32 pb-20 text-center px-4 max-w-7xl mx-auto w-full z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {lang === 'fr'
              ? 'Inscriptions ouvertes pour 2026'
              : 'التسجيل مفتوح لعام 2026'}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 max-w-5xl leading-[1.1]">
          {lang === 'fr' ? 'Façonnez votre ' : 'اصنع '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
            {lang === 'fr' ? 'Avenir ' : 'مستقبلك '}
          </span>
          <br className="hidden md:block" />
          {lang === 'fr' ? 'avec Excellence' : 'بامتياز'}
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
          {lang === 'fr'
            ? 'Découvrez des programmes académiques de premier plan, trouvez votre passion et obtenez tous les outils nécessaires pour réussir votre carrière.'
            : 'اكتشف برامج أكاديمية رائدة، ابحث عن شغفك، واحصل على جميع الأدوات اللازمة للنجاح في مسيرتك المهنية.'}
        </p>

        <div className="w-full max-w-3xl relative z-50">
          <BranchSearch lang={lang as any} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-16">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden relative"
              >
                <Image
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="Student"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm z-10">
              +2k
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1 text-amber-400 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Award key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {lang === 'fr'
                ? "Rejoints par des milliers d'étudiants"
                : 'انضم إلينا آلاف الطلاب'}
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {lang === 'fr' ? 'Pourquoi choisir Excel ?' : 'لماذا تختار إكسل؟'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {lang === 'fr'
                ? 'Une pédagogie innovante tournée vers la réussite professionnelle.'
                : 'أسلوب تعليمي مبتكر موجه نحو النجاح المهني.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {lang === 'fr' ? "Programmes d'Élite" : 'برامج النخبة'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'fr'
                  ? "Des formations reconnues et adaptées aux exigences du marché de l'emploi actuel."
                  : 'تدريب معترف به ومكيف مع متطلبات سوق العمل الحالي.'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-500/5 rounded-bl-full -z-10" />
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {lang === 'fr' ? 'Diplômes Accrédités' : 'شهادات معتمدة'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'fr'
                  ? "Obtenez des certifications d'État reconnues à l'échelle nationale et internationale."
                  : 'احصل على شهادات حكومية معترف بها وطنياً ودولياً.'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {lang === 'fr' ? "Réseau d'Alumni" : 'شبكة الخريجين'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'fr'
                  ? "Rejoignez une communauté active de professionnels et d'entreprises partenaires."
                  : 'انضم إلى مجتمع نشط من المحترفين والشركات الشريكة.'}
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href={`/${lang}/majors`}
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              {lang === 'fr'
                ? 'Découvrir toutes nos filières'
                : 'اكتشف جميع تخصصاتنا'}{' '}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
