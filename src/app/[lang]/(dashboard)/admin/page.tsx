import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { type Lang } from '@/lib/i18n';
import Link from 'next/link';
import { GraduationCap, GitBranch, MessageSquare } from 'lucide-react';

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/${lang}/login`);
  }

  const { data: userData, error: userErrorDb } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userErrorDb || userData?.role !== 'admin') {
    redirect(`/${lang}/student`);
  }

  const [majorsRes, branchesRes, inquiriesRes] = await Promise.all([
    supabase.from('majors').select('*', { count: 'exact', head: true }),
    supabase.from('branches').select('*', { count: 'exact', head: true }),
    supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
  ]);

  const majorsCount = majorsRes.count ?? 0;
  const branchesCount = branchesRes.count ?? 0;
  const inquiriesCount = inquiriesRes.count ?? 0;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'fr' ? "Vue d'ensemble" : 'نظرة عامة'}
        </h1>
        <p className="text-slate-500 mt-2">
          {lang === 'fr'
            ? "Bienvenue sur votre panneau d'administration."
            : 'مرحبًا بك في لوحة الإدارة الخاصة بك.'}
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <Link
          href={`/${lang}/admin/majors`}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {lang === 'fr' ? 'Filières & Branches' : 'التخصصات والفروع'}
          </h3>
          <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            {majorsCount || 0}{' '}
            <span className="text-sm font-normal text-slate-500">
              filières / {branchesCount || 0} branches
            </span>
          </p>
        </Link>

        <Link
          href={`/${lang}/admin/inquiries`}
          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {lang === 'fr' ? 'Demandes en attente' : 'طلبات معلقة'}
          </h3>
          <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            {inquiriesCount || 0}
          </p>
        </Link>
      </div>
    </div>
  );
}
