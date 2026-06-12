import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  MessageSquare,
  HelpCircle,
  Star,
  Users,
} from 'lucide-react';

interface AdminSection {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  count?: number;
  color: string;
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createServerSupabaseClient();

  // Fetch counts for dashboard cards
  const [
    majorsRes,
    institutionsRes,
    programsRes,
    eventsRes,
    blogRes,
    inquiriesRes,
    reviewsRes,
    faqsRes,
  ] = await Promise.all([
    supabase.from('majors').select('id', { count: 'exact' }),
    supabase.from('institutions').select('id', { count: 'exact' }),
    supabase.from('programs').select('id', { count: 'exact' }),
    supabase.from('events').select('id', { count: 'exact' }),
    supabase.from('blog_posts').select('id', { count: 'exact' }),
    supabase.from('inquiries').select('id', { count: 'exact' }),
    supabase.from('reviews').select('id', { count: 'exact' }),
    supabase.from('faqs').select('id', { count: 'exact' }),
  ]);

  const translations = {
    title: lang === 'fr' ? 'Tableau de Bord Admin' : 'لوحة تحكم المسؤول',
    subtitle:
      lang === 'fr' ? 'Gestion complète du contenu' : 'إدارة محتوى شاملة',
    manage: lang === 'fr' ? 'Gérer' : 'إدارة',
    viewAll: lang === 'fr' ? 'Voir tout' : 'عرض الكل',
  };

  const sections: AdminSection[] = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: lang === 'fr' ? 'Majeurs' : 'التخصصات',
      description:
        lang === 'fr'
          ? 'Gérer les spécialisations académiques'
          : 'إدارة التخصصات الأكاديمية',
      href: `/${lang}/(dashboard)/admin/majors`,
      count: majorsRes.count,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: lang === 'fr' ? 'Programmes' : 'البرامج',
      description:
        lang === 'fr' ? "Gérer les programmes d'études" : 'إدارة برامج الدراسة',
      href: `/${lang}/(dashboard)/admin/programs`,
      count: programsRes.count,
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: lang === 'fr' ? 'Institutions' : 'المؤسسات',
      description:
        lang === 'fr'
          ? 'Gérer les écoles et écoles partenaires'
          : 'إدارة المدارس والشركاء',
      href: `/${lang}/(dashboard)/admin/institutions`,
      count: institutionsRes.count,
      color: 'from-sky-500 to-cyan-600',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: lang === 'fr' ? 'Événements' : 'الأحداث',
      description:
        lang === 'fr'
          ? 'Gérer les événements et webinaires'
          : 'إدارة الأحداث والندوات',
      href: `/${lang}/(dashboard)/admin/events/list`,
      count: eventsRes.count,
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: lang === 'fr' ? 'Blog' : 'المدونة',
      description:
        lang === 'fr'
          ? 'Gérer les articles et actualités'
          : 'إدارة المقالات والأخبار',
      href: `/${lang}/(dashboard)/admin/blog/list`,
      count: blogRes.count,
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: lang === 'fr' ? 'FAQ' : 'الأسئلة المتكررة',
      description:
        lang === 'fr'
          ? 'Gérer les questions fréquentes'
          : 'إدارة الأسئلة المتكررة',
      href: `/${lang}/(dashboard)/admin/faqs/list`,
      count: faqsRes.count,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: lang === 'fr' ? 'Avis' : 'التقييمات',
      description:
        lang === 'fr'
          ? 'Modérer les avis et commentaires'
          : 'مراجعة الآراء والتعليقات',
      href: `/${lang}/(dashboard)/admin/reviews/list`,
      count: reviewsRes.count,
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: lang === 'fr' ? 'Demandes' : 'الطلبات',
      description:
        lang === 'fr' ? 'Gérer les demandes clients' : 'إدارة طلبات العملاء',
      href: `/${lang}/(dashboard)/admin/inquiries/advanced`,
      count: inquiriesRes.count,
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: lang === 'fr' ? 'Utilisateurs' : 'المستخدمون',
      description:
        lang === 'fr'
          ? 'Gérer les profils utilisateurs'
          : 'إدارة ملفات المستخدمين',
      href: `/${lang}/(dashboard)/admin/users`,
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  const totalItems =
    (majorsRes.count || 0) +
    (institutionsRes.count || 0) +
    (programsRes.count || 0) +
    (eventsRes.count || 0) +
    (blogRes.count || 0) +
    (inquiriesRes.count || 0) +
    (reviewsRes.count || 0) +
    (faqsRes.count || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {translations.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {translations.subtitle}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-12">
          <Card className="p-6 bg-white dark:bg-slate-900">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalItems}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'fr' ? 'Éléments au total' : 'إجمالي العناصر'}
            </p>
          </Card>
          <Card className="p-6 bg-white dark:bg-slate-900">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {inquiriesRes.count || 0}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'fr' ? 'Demandes actives' : 'الطلبات النشطة'}
            </p>
          </Card>
          <Card className="p-6 bg-white dark:bg-slate-900">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {eventsRes.count || 0}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'fr' ? 'Événements programmés' : 'الأحداث المجدولة'}
            </p>
          </Card>
          <Card className="p-6 bg-white dark:bg-slate-900">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {reviewsRes.count || 0}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'fr' ? 'Avis soumis' : 'الآراء المُرسلة'}
            </p>
          </Card>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sections.map((section, idx) => (
            <Link key={idx} href={section.href}>
              <Card className="p-6 bg-white dark:bg-slate-900 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <div
                  className={`bg-gradient-to-br ${section.color} rounded-lg p-3 w-fit mb-4 text-white`}
                >
                  {section.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {section.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">
                  {section.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {section.count || 0}
                  </span>
                  <Button variant="outline" size="sm">
                    {translations.manage}
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/30">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {lang === 'fr' ? 'Actions Rapides' : 'إجراءات سريعة'}
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <Link href={`/${lang}/(dashboard)/admin/majors/new`}>
              <Button className="w-full">
                {lang === 'fr' ? '+ Ajouter une majeure' : '+ إضافة تخصص'}
              </Button>
            </Link>
            <Link href={`/${lang}/(dashboard)/admin/programs/new`}>
              <Button className="w-full">
                {lang === 'fr' ? '+ Ajouter un programme' : '+ إضافة برنامج'}
              </Button>
            </Link>
            <Link href={`/${lang}/(dashboard)/admin/events/new`}>
              <Button className="w-full">
                {lang === 'fr' ? '+ Ajouter un événement' : '+ إضافة حدث'}
              </Button>
            </Link>
            <Link href={`/${lang}/(dashboard)/admin/blog/new`}>
              <Button className="w-full">
                {lang === 'fr' ? '+ Écrire un article' : '+ كتابة مقالة'}
              </Button>
            </Link>
            <Link href={`/${lang}/(dashboard)/admin/faqs/new`}>
              <Button className="w-full">
                {lang === 'fr' ? '+ Ajouter une FAQ' : '+ إضافة سؤال'}
              </Button>
            </Link>
            <Link href={`/${lang}/(dashboard)/admin/inquiries/advanced`}>
              <Button className="w-full">
                {lang === 'fr' ? 'Voir les demandes' : 'عرض الطلبات'}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
