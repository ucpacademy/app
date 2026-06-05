import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary, type Lang } from '@/lib/i18n';
import { getBranchesForMajor, getMajorBySlug } from '@/lib/majors';

type MajorWithTranslations = {
  id: string;
  slug: string;
  translations?: Array<{ name: string; lang: string }>;
};

type BranchWithTranslations = {
  id: string;
  slug: string;
  translations?: Array<{ title: string; lang: string }>;
};

export default async function MajorDetailsPage({
  params,
}: {
  params: Promise<{ lang: string; majorSlug: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Lang;
  const { majorSlug } = resolvedParams;
  const dictionary = await getDictionary(lang);
  const major = (await getMajorBySlug(
    majorSlug,
  )) as MajorWithTranslations | null;

  if (!major) {
    notFound();
  }

  const branches = (await getBranchesForMajor(
    major.id,
  )) as BranchWithTranslations[];
  const majorTranslation =
    major.translations?.find((t) => t.lang === lang) || major.translations?.[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href={`/${lang}/majors`}
        className="text-sm font-semibold text-slate-950 underline-offset-4 hover:underline"
      >
        {lang === 'fr' ? '← Retour aux filières' : '← العودة إلى التخصصات'}
      </Link>
      <h1 className="mt-6 text-3xl font-semibold text-slate-950">
        {majorTranslation?.name}
      </h1>
      <p className="mt-3 text-slate-600">
        {lang === 'fr' ? 'Branches disponibles :' : 'الفروع المتاحة:'}
      </p>
      <ul className="mt-6 grid gap-4">
        {branches.length > 0 ? (
          branches.map((branch) => {
            const branchTranslation =
              branch.translations?.find((t) => t.lang === lang) ||
              branch.translations?.[0];
            return (
              <li
                key={branch.id}
                className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200"
              >
                <Link
                  href={`/${lang}/majors/${majorSlug}/${branch.slug}`}
                  className="text-lg font-semibold text-slate-950"
                >
                  {branchTranslation?.title}
                </Link>
              </li>
            );
          })
        ) : (
          <li className="text-slate-500">
            {lang === 'fr'
              ? 'Aucune branche disponible.'
              : 'لا توجد فروع متاحة.'}
          </li>
        )}
      </ul>
    </div>
  );
}
