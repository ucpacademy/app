import { getBranches } from '@/lib/majors';
import { type Lang } from '@/lib/i18n';
import Link from 'next/link';

export default async function AdminBranchesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';

  const branches = await getBranches();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {lang === 'fr' ? 'Branches' : 'الفروع'}
        </h1>
        <Link
          href={`/${lang}/admin/branches/new`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl"
        >
          New Branch
        </Link>
      </div>
      <div className="grid gap-4">
        {branches.map((b: any) => (
          <div
            key={b.id}
            className="p-4 rounded-xl border bg-white dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{b.slug}</p>
                <p className="text-sm text-slate-500">{b.id}</p>
              </div>
              <Link
                href={`/${lang}/admin/branches/${b.id}`}
                className="text-indigo-600"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
