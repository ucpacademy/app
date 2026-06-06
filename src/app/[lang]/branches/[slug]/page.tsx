import Image from 'next/image';
import { getBranchDetails } from '@/lib/majors';
import { type Lang } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { InquiryForm } from '@/components/InquiryForm';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export const revalidate = 60;

export default async function BranchPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const decodedSlug = decodeURIComponent(resolvedParams.slug);

  const branch = await getBranchDetails(decodedSlug);

  if (!branch) notFound();

  const translation =
    branch.translations?.find((t: any) => t.lang === lang) ||
    branch.translations?.[0];
  const majorTranslation =
    branch.major?.translations?.find((t: any) => t.lang === lang) ||
    branch.major?.translations?.[0];
  const faqs = Array.isArray(translation?.faqs)
    ? (translation.faqs as { question: string; answer: string }[])
    : [];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[50vh] min-h-[400px] bg-slate-900 flex items-center justify-center overflow-hidden">
        {branch.featured_image && (
          <>
            <Image
              src={branch.featured_image}
              alt={translation?.title}
              fill
              className="absolute inset-0 object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          </>
        )}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center mt-12">
          <Link
            href={`/${lang}/majors`}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />{' '}
            {lang === 'fr' ? 'Retour aux filières' : 'العودة إلى التخصصات'}
          </Link>
          <div className="mb-6 inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-200 text-sm font-semibold border border-indigo-500/30 backdrop-blur-md">
            {majorTranslation?.name}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight max-w-4xl leading-tight">
            {translation?.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-16 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Benefits */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
                {lang === 'fr' ? 'Ce que vous allez apprendre' : 'ما ستتعلمه'}
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-lg">
                {translation?.benefits
                  ?.split('\n')
                  .filter(Boolean)
                  .map((paragraph: string, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                      <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{paragraph.trim()}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Gallery */}
            {branch.gallery && branch.gallery.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
                  {lang === 'fr' ? 'La vie de campus' : 'الحياة الجامعية'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {branch.gallery.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative"
                    >
                      <Image
                        src={img}
                        alt={`Gallery image ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
                  {lang === 'fr' ? 'Questions Fréquentes' : 'الأسئلة الشائعة'}
                </h2>
                <div className="space-y-4">
                  {faqs.map(
                    (
                      faq: { question: string; answer: string },
                      idx: number,
                    ) => (
                      <details
                        key={idx}
                        className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 [&_summary::-webkit-details-marker]:hidden transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-lg text-slate-900 dark:text-white">
                          {faq.question}
                          <span className="ml-4 flex-shrink-0 transition-transform duration-300 group-open:-rotate-180">
                            <svg
                              className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        </summary>
                        <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed text-lg border-t border-slate-200 dark:border-slate-700 pt-4 mt-2 mx-6">
                          {faq.answer}
                        </div>
                      </details>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 sticky top-24">
            <InquiryForm branchId={branch.id} lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
}
