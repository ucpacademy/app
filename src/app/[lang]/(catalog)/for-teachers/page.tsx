import { type Lang } from '@/lib/i18n';
import {
  Globe,
  BarChart,
  LayoutTemplate,
  MessageCircle,
  ArrowRight,
  Sparkles,
  BookMarked,
  MonitorPlay,
} from 'lucide-react';
import Link from 'next/link';

export default async function ForTeachersPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const isFr = lang === 'fr';

  const features = [
    {
      icon: Globe,
      title: isFr ? 'Audience Mondiale' : 'جمهور عالمي',
      description: isFr
        ? 'Dépassez les frontières de la salle de classe physique. Enseignez à des milliers d’apprenants passionnés partout dans le monde.'
        : 'تجاوز حدود الفصل الدراسي المادي. Teach thousands of passionate learners around the world.',
    },
    {
      icon: LayoutTemplate,
      title: isFr ? 'Création Intuitive' : 'إنشاء بديهي',
      description: isFr
        ? 'Structurez vos programmes, modules et leçons sans effort technique grâce à un créateur moderne et clair.'
        : 'قم بتنظيم برامجك ووحداتك ودروسك دون أي جهد تقني بفضل منشئ حديث وواضح.',
    },
    {
      icon: MessageCircle,
      title: isFr ? 'Engagement Profond' : 'تفاعل عميق',
      description: isFr
        ? 'Créez une véritable communauté autour de vos cours, répondez aux questions et favorisez l’entraide.'
        : 'أنشئ مجتمعًا حقيقيًا حول دوراتك، وأجب عن الأسئلة، وعزز التعاون المتبادل.',
    },
    {
      icon: BarChart,
      title: isFr ? 'Analytique Puissante' : 'تحليلات قوية',
      description: isFr
        ? 'Suivez les performances de vos étudiants, comprenez leurs difficultés et améliorez continuellement votre contenu.'
        : 'تتبع أداء طلابك، وافهم عقباتهم، وحسّن محتواك باستمرار.',
    },
  ];

  const steps = [
    {
      title: isFr ? 'Publiez votre cours' : 'انشر دورتك',
      description: isFr
        ? 'Ajoutez vos modules et vos ressources en quelques minutes.'
        : 'أضف وحداتك ومواردك خلال دقائق قليلة.',
    },
    {
      title: isFr ? 'Renforcez l’engagement' : 'عزز التفاعل',
      description: isFr
        ? 'Animez vos séances, répondez aux questions et ouvrez une vraie conversation.'
        : 'أدر جلساتك، وابدأ حوارًا حقيقيًا.',
    },
    {
      title: isFr ? 'Mesurez l’impact' : 'قِس التأثير',
      description: isFr
        ? 'Observez la progression et ajustez votre pédagogie en continu.'
        : 'راقب التقدم واضبط أسلوبك التدريسي باستمرار.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:pt-32 sm:pb-24 lg:px-8 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100 via-slate-50 to-slate-50 dark:from-amber-900/20 dark:via-slate-950 dark:to-slate-950" />
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm dark:border-amber-900/40 dark:bg-slate-900/60 dark:text-amber-300">
            <Sparkles className="h-4 w-4" />
            {isFr ? 'Outils de formation modernes' : 'أدوات تدريب حديثة'}
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl">
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              {isFr ? 'Inspirez la prochaine génération' : 'ألهم الجيل القادم'}
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
            {isFr
              ? 'Partagez votre expertise avec une audience globale, attirez de nouveaux apprenants et développez l’impact de votre pédagogie.'
              : 'شارك خبرتك مع جمهور عالمي، وجذب متعلمين جدد، وقم بتوسيع تأثير تربيتك.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/${lang}/programs`}
              className="rounded-full bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700"
            >
              {isFr ? 'Voir les programmes' : 'اعرض البرامج'}
            </Link>
            <Link
              href={`/${lang}/signup`}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-amber-500 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {isFr ? 'Devenir enseignant' : 'كن معلّمًا'}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
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
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              {isFr ? 'Pourquoi c’est efficace' : 'لماذا هذا فعال'}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isFr
                ? 'Un espace simple pour transmettre davantage'
                : 'مساحة بسيطة لنقل المزيد'}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"
              >
                <p className="mb-3 text-sm font-semibold text-amber-600 dark:text-amber-400">
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
        <div className="rounded-[3rem] bg-amber-600 p-10 text-white shadow-2xl shadow-amber-600/20 sm:p-16 dark:bg-amber-500">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            {isFr
              ? 'Partagez votre savoir dès aujourd’hui'
              : 'شارك معرفتك اليوم'}
          </h2>
          <Link
            href={`/${lang}/signup`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-amber-600 transition hover:bg-amber-50"
          >
            {isFr ? 'Devenir enseignant' : 'كن معلّمًا'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
