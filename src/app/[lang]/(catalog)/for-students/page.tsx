import { type Lang } from '@/lib/i18n';
import {
  BookOpen,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  Clock3,
  TrendingUp,
  Compass,
} from 'lucide-react';
import Link from 'next/link';

export default async function ForStudentsPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const isFr = lang === 'fr';

  const features = [
    {
      icon: BookOpen,
      title: isFr ? 'Curriculum d’Elite' : 'مناهج النخبة',
      description: isFr
        ? 'Accédez à des programmes de classe mondiale conçus par des experts de l’industrie, avec un suivi clair et des ressources concrètes.'
        : 'احصل على برامج عالمية المستوى مصممة من خبراء الصناعة مع متابعة واضحة وموارد عملية.',
    },
    {
      icon: Users,
      title: isFr ? 'Communautés Dynamiques' : 'مجتمعات ديناميكية',
      description: isFr
        ? 'Échangez avec d’autres apprenants, posez vos questions et bâtissez votre réseau à chaque étape.'
        : 'تبادل مع المتعلمين الآخرين، واطرح أسئلتك، وابنِ شبكتك في كل خطوة.',
    },
    {
      icon: Sparkles,
      title: isFr ? 'Apprentissage Personnalisé' : 'تعلم مخصص',
      description: isFr
        ? 'Suivez votre progression en temps réel, reprenez là où vous vous étiez arrêté et progressez à votre rythme.'
        : 'تابع تقدمك في الوقت الفعلي، واستأنف من حيث توقفت، وتقدم وفق وتيرتك.',
    },
    {
      icon: Award,
      title: isFr ? 'Certifications Reconnues' : 'شهادات معتمدة',
      description: isFr
        ? 'Valorisez vos compétences avec des certificats d’accomplissement qui renforcent votre profil académique et professionnel.'
        : 'عزز مهاراتك بشهادات إنجاز تعزز ملفك الأكاديمي والمهنى.',
    },
  ];

  const steps = [
    {
      title: isFr ? 'Choisissez votre voie' : 'اختر مسارك',
      description: isFr
        ? 'Parcourez les filières, comparez les programmes et trouvez l’orientation qui vous correspond.'
        : 'استعرض التخصصات، وقارن بين البرامج، وابحث عن الاتجاه الذي يناسبك.',
    },
    {
      title: isFr ? 'Apprenez avec structure' : 'تعلّم بترتيب',
      description: isFr
        ? 'Profitez d’un parcours clair, d’objectifs concrets et d’un accompagnement fluide.'
        : 'استفد من مسار واضح وأهداف عملية ومتابعة سلسة.',
    },
    {
      title: isFr ? 'Validez votre réussite' : 'وثّق نجاحك',
      description: isFr
        ? 'Obtenez des résultats visibles, des certifications et une expérience de formation complète.'
        : 'احصل على نتائج واضحة وشهادات وتجربة تدريبية شاملة.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:pt-32 sm:pb-24 lg:px-8 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 dark:from-indigo-900/20 dark:via-slate-950 dark:to-slate-950" />
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm dark:border-indigo-900/40 dark:bg-slate-900/60 dark:text-indigo-300">
            <Compass className="h-4 w-4" />
            {isFr ? 'Une expérience étudiante moderne' : 'تجربة طلابية حديثة'}
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl">
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              {isFr
                ? 'Façonnez votre avenir académique'
                : 'صغ مستقبلك الأكاديمي'}
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
            {isFr
              ? 'Plongez dans une nouvelle ère de l’éducation. Interagissez avec des mentors, collaborez avec d’autres apprenants et débloquez votre véritable potentiel.'
              : 'انغمس في عصر جديد من التعليم. تفاعل مع الموجهين وتعاون مع المتعلمين الآخرين وأطلق العنان لإمكاناتك الحقيقية.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/${lang}/majors`}
              className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              {isFr ? 'Explorer les filières' : 'استكشف التخصصات'}
            </Link>
            <Link
              href={`/${lang}/signup`}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {isFr ? 'Créer un compte' : 'إنشاء حساب'}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Clock3,
              label: isFr ? 'Accès flexible' : 'وصول مرن',
              value: '24/7',
            },
            {
              icon: TrendingUp,
              label: isFr ? 'Résultats visibles' : 'نتائج واضحة',
              value: '100%',
            },
            {
              icon: Users,
              label: isFr ? 'Support actif' : 'دعم فعال',
              value: 'Live',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <item.icon className="mb-3 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                {isFr ? 'Comment ça marche' : 'كيف يعمل'}
              </p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {isFr ? 'Un parcours clair pour réussir' : 'مسار واضح للنجاح'}
              </h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"
              >
                <p className="mb-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  0{idx + 1}
                </p>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-6 text-center">
        <div className="rounded-[3rem] bg-indigo-600 p-10 text-white shadow-2xl shadow-indigo-600/20 sm:p-16 dark:bg-indigo-500">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            {isFr
              ? 'Prêt à commencer votre voyage ?'
              : 'هل أنت مستعد لبدء رحلتك؟'}
          </h2>
          <Link
            href={`/${lang}/signup`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-indigo-600 transition hover:bg-indigo-50"
          >
            {isFr ? 'Rejoindre gratuitement' : 'انضم مجانًا'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
