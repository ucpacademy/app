import { type Lang } from '@/lib/i18n';
import { AuthForm } from '@/components/AuthForm';

export default async function SignupPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang as Lang) || 'fr';

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-160px)]">
      <AuthForm lang={lang} initialMode="signup" />
    </div>
  );
}
