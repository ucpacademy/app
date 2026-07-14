import { type Lang } from '@/lib/i18n';
import {
  Server,
  Shield,
  Zap,
  Globe2,
  ArrowRight,
  Layers3,
  Cpu,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const isFr = lang === 'fr';

  const features = [
    {
      icon: Zap,
      title: isFr ? 'Performance Éclair (Edge)' : 'أداء فائق السرعة',
      description: isFr
        ? 'Propulsée par Next.js et déployée au plus près des utilisateurs, notre plateforme garantit des temps de chargement instantanés.'
        : 'مدعومة بـ Next.js ومنشورة بالقرب من المستخدمين، تضمن منصتنا أوقات تحميل فورية.',
    },
    {
      icon: Shield,
      title: isFr ? 'Sécurité et Confidentialité' : 'الأمن والخصوصية',
      description: isFr
        ? 'Vos données sont chiffrées et gérées avec des politiques strictes pour protéger chaque interaction et chaque contenu.'
        : 'بياناتك مشفرة وتدار بسياسات صارمة لحماية كل تفاعل وكل محتوى.',
    },
    {
      icon: Server,
      title: isFr ? 'Architecture Évolutive' : 'بنية قابلة للتطوير',
      description: isFr
        ? 'Construite pour accueillir des millions d’utilisateurs en parallèle, sans compromis sur la stabilité.'
        : 'مصممة لاستيعاب ملايين المستخدمين بالتوازي دون أي خسارة في الاستقرار.',
    },
    {
      icon: Globe2,
      title: isFr ? 'Multilinguisme Natif' : 'متعدد اللغات أصلي',
      description: isFr
        ? 'Une expérience véritablement globale, pensée pour le Français et l’Arabe avec une fluidité naturelle.'
        : 'تجربة عالمية حقيقية، مصممة للغتين العربية والفرنسية بسلاسة طبيعية.',
    },
  ];

  const pillars = [
    {
      icon: Layers3,
      title: isFr ? 'Flexible' : 'مرن',
      description: isFr
        ? 'Adaptez la plateforme à vos cas d’usage, vos équipes et votre croissance.'
        : 'قم بتكييف المنصة مع احتياجاتك وفريقك ونموك.',
    },
    {
      icon: Cpu,
      title: isFr ? 'Performant' : 'قوي الأداء',
      description: isFr
        ? 'Des expériences rapides et stables, même à forte charge.'
        : 'تجارب سريعة ومستقرة حتى عند الحمل العالي.',
    },
    {
      icon: Sparkles,
      title: isFr ? 'Moderne' : 'حديث',
      description: isFr
        ? 'Une interface élégante conçue pour un usage quotidien agréable.'
        : 'واجهة أنيقة مصممة لاستخدام يومي مريح.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:pt-32 sm:pb-24 lg:px-8 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 dark:from-blue-900/20 dark:via-slate-950 dark:to-slate-950" />
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm dark:border-blue-900/40 dark:bg-slate-900/60 dark:text-blue-300">
            <Cpu className="h-4 w-4" />
            {isFr
              ? 'Infrastructure de nouvelle génération'
              : 'بنية تحتية من الجيل الجديد'}
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              {isFr
                ? 'Une infrastructure à l’épreuve du futur'
                : 'بنية تحتية مقاومة للمستقبل'}
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
            {isFr
              ? 'Découvrez la technologie robuste, sécurisée et ultra-rapide qui propulse l’écosystème éducatif global.'
              : 'اكتشف التكنولوجيا القوية والآمنة وفائقة السرعة التي تدفع النظام البيئي التعليمي العالمي.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/${lang}/signup`}
              className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {isFr ? 'Découvrir la plateforme' : 'اكتشف المنصة'}
            </Link>
            <Link
              href={`/${lang}/programs`}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {isFr ? 'Explorer les programmes' : 'استكشف البرامج'}
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
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              {isFr
                ? 'Pourquoi elle tient la route'
                : 'لماذا هي قادرة على المضي'}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isFr
                ? 'Un socle moderne pour l’éducation du futur'
                : 'قاعدة حديثة للتعليم في المستقبل'}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
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
        <div className="rounded-[3rem] bg-blue-600 p-10 text-white shadow-2xl shadow-blue-600/20 sm:p-16 dark:bg-blue-500">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            {isFr ? 'Construisons l’avenir ensemble' : 'لنبنِ المستقبل معًا'}
          </h2>
          <Link
            href={`/${lang}/signup`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-blue-600 transition hover:bg-blue-50"
          >
            {isFr ? 'Découvrir la plateforme' : 'اكتشف المنصة'}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
