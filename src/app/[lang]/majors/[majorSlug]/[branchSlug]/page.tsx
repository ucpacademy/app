import { notFound } from 'next/navigation';
import { getDictionary, type Lang } from '@/lib/i18n';
import { getBranchDetails } from '@/lib/majors';

type BranchDetails = {
  major: {
    id: string;
    slug: string;
    translations?: Array<{ name: string; lang: string }>;
  };
  translations?: Array<{ title: string; content: string; lang: string }>;
};

export default async function BranchDetailsPage({
  params,
}: {
  params: Promise<{ lang: string; branchSlug: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Lang;
  const { branchSlug } = resolvedParams;
  const dictionary = await getDictionary(lang);
  const branch = (await getBranchDetails(branchSlug)) as BranchDetails | null;

  if (!branch) {
    notFound();
  }

  const translation =
    branch.translations?.find((t) => t.lang === lang) ||
    branch.translations?.[0];
  const majorTranslation =
    branch.major?.translations?.find((t) => t.lang === lang) ||
    branch.major?.translations?.[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-950">
        {translation?.title}
      </h1>
      <p className="mt-3 text-slate-600">
        {lang === 'fr'
          ? `Filière : ${majorTranslation?.name}`
          : `التخصص: ${majorTranslation?.name}`}
      </p>
      <article className="mt-8 rounded-3xl bg-white p-8 shadow-sm shadow-slate-200 text-slate-700">
        {translation?.content}
      </article>
    </div>
  );
}
