import { createServerSupabaseClient } from '@/lib/supabase/server';
import { type Lang } from '@/lib/i18n';
import { InquiriesList } from './InquiriesList';

export default async function AdminInquiriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const supabase = await createServerSupabaseClient();

  // Fetch all inquiries and join the specific branch translations to display the branch name
  const { data: inquiries } = await supabase
    .from('inquiries')
    .select(
      `
      *,
      branch:branches(
        slug,
        translations:branch_translations(title, lang)
      )
    `,
    )
    .order('status', { ascending: true }) // Pending first
    .order('created_at', { ascending: false }); // Newest first

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'fr' ? 'Demandes en attente' : 'الاستفسارات المعلقة'}
        </h1>
        <p className="text-slate-500 mt-2">
          {lang === 'fr'
            ? "Gérez et répondez aux demandes d'information des étudiants."
            : 'قم بإدارة والرد على طلبات معلومات الطلاب.'}
        </p>
      </div>

      <InquiriesList initialInquiries={inquiries || []} lang={lang} />
    </div>
  );
}
