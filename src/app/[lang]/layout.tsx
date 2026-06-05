import '../globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { getDictionary, type Lang } from '@/utils/dictionary';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang}>
      <body className="bg-white dark:bg-black min-h-screen flex flex-col text-slate-900 dark:text-slate-50 antialiased selection:bg-blue-200 selection:text-blue-900">
        <Navbar dictionary={dictionary.navbar} currentLang={lang} />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
