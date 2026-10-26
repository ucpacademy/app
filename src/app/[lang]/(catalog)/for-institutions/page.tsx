import { type Lang } from '@/lib/i18n';
import {
  Building2,
  ShieldCheck,
  UsersRound,
  LineChart,
  ArrowRight,
  Rocket,
  Landmark,
  Database,
} from 'lucide-react';
import Link from 'next/link';

export default async function ForInstitutionsPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const isFr = lang === 'fr';

  const features = [
    {
      icon: Building2,
      title: isFr ? 'Campus Numérique Centralisé' : 'حرم جامعي رقمي مركزي',
      description: isFr
        ? 'Réunissez vos filières, programmes et enseignants sous une seule expérience institutionnelle cohérente.'
        : 'اجمع تخصصاتك وبرامجك ومعلميك تحت تجربة مؤسسية واحدة متماسكة.',
    },
    {
      icon: UsersRound,
      title: isFr ? 'Gestion du Personnel' : 'إدارة الموظفين',
      description: isFr
        ? 'Invitez vos instructeurs, gérez leurs rôles et attribuez les accès nécessaires à chaque équipe.'
        : 'ادعُ المدربين، وأدر أدوارهم، ووزّع الصلاحيات اللازمة لكل فريق.',
    },
    {
      icon: ShieldCheck,
      title: isFr ? 'Sécurité Entreprise' : 'أمان على مستوى المؤسسات',
      description: isFr
        ? 'Protégez vos données, vos programmes et votre réputation avec une infrastructure fiable et sécurisée.'
        : 'احمِ بياناتك وبرامجك وسمعتك عبر بنية موثوقة وآمنة.',
    },
    {
      icon: LineChart,
      title: isFr ? 'Insights & Rapports' : 'رؤى وتقارير',
      description: isFr
        ? 'Suivez l’engagement, analysez les performances et pilotez la croissance de votre offre.'
        : 'تابع التفاعل، وحلل الأداء، ووجه نمو عرضك.',
    },
  ];

  const pillars = [
    {
      icon: Landmark,
      title: isFr ? 'Image institutionnelle forte' : 'هوية مؤسسية قوية',
      description: isFr
        ? 'Présentez votre établissement avec une identité cohérente et moderne.'
        : 'اعرض مؤسستك بهوية متسقة وحديثة.',
    },
    {
      icon: Rocket,
      title: isFr ? 'Croissance rapide' : 'نمو سريع',
      description: isFr
        ? 'Attirez de nouveaux étudiants grâce à une visibilité optimisée.'
        : 'اجذب طلابًا جددًا بفضل رؤية محسّنة.',
    },
    {
      icon: Database,
      title: isFr ? 'Pilotage simple' : 'إدارة سهلة',
      description: isFr
        ? 'Gérez vos contenus et votre organisation sans friction.'
        : 'أدر محتواك ومنظمتك دون تعقيد.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:pt-32 sm:pb-24 lg:px-8 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100 via-slate-50 to-slate-50 dark:from-emerald-900/20 dark:via-slate-950 dark:to-slate-950" />
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900/60 dark:text-emerald-300">
            <Building2 className="h-4 w-4" />
            {isFr
              ? 'Pour les établissements d’enseignement'
              : 'للمؤسسات التعليمية'}
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {isFr
                ? 'L’avenir de l’éducation numérique'
                : 'مستقبل التعليم الرقمي'}
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
            {isFr
              ? 'Équipez votre université ou centre de formation avec une plateforme puissante pour gérer l’apprentissage à grande échelle.'
              : 'جهّز جامعتك أو مركز تدريبك بمنصة قوية لإدارة التعلم على نطاق واسع.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/${lang}/institutions`}
              className="rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              {isFr ? 'Découvrir les établissements' : 'استكشف المؤسسات'}
            </Link>
            <Link
              href={`/${lang}/signup`}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {isFr ? 'Créer un espace institutionnel' : 'أنشئ مساحة مؤسسية'}
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
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              {isFr ? 'Ce que vous gagnez' : 'ما الذي تكسبه'}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isFr ? 'Une plateforme pensée pour grandir' : 'منصة مصممة للنمو'}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-6 text-center">
        <div className="rounded-[3rem] bg-emerald-600 p-10 text-white shadow-2xl shadow-emerald-600/20 sm:p-16 dark:bg-emerald-500">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            {isFr
              ? 'Prêt à numériser votre institution ?'
              : 'هل أنت مستعد لرقمنة مؤسستك؟'}
          </h2>
          <Link
            href={`/${lang}/signup`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-emerald-600 transition hover:bg-emerald-50"
          >
            {isFr ? 'Enregistrer votre établissement' : 'سجل مؤسستك'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
