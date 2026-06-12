import { Navbar } from '@/components/ui/Navbar';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { I18nProvider } from '@/src/locales/I18nProvider';

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
    <I18nProvider lang={lang} dict={dictionary}>
      <Navbar dictionary={dictionary.navbar} currentLang={lang} />
      <main className="flex-1 flex flex-col">{children}</main>
    </I18nProvider>
  );
}
