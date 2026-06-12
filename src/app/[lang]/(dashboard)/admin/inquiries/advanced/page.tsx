import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default async function AdminInquiriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}) {
  const { lang } = await params;
  const {
    search = '',
    status = '',
    priority = '',
    dateFrom = '',
    dateTo = '',
  } = await searchParams;
  const dict = await getDictionary(lang);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('inquiries')
    .select(
      `
    id,
    name,
    email,
    phone,
    message,
    status,
    priority,
    created_at,
    branch:branches(title_fr, title_ar)
  `,
    )
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`,
    );
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (priority) {
    query = query.eq('priority', priority);
  }

  if (dateFrom) {
    query = query.gte('created_at', new Date(dateFrom).toISOString());
  }

  if (dateTo) {
    query = query.lte('created_at', new Date(dateTo).toISOString());
  }

  const { data: inquiries } = await query;

  const translations = {
    title: lang === 'fr' ? 'Demandes' : 'الطلبات',
    empty: lang === 'fr' ? 'Aucune demande.' : 'لا توجد طلبات.',
    view: lang === 'fr' ? 'Voir' : 'عرض',
    allStatuses: lang === 'fr' ? 'Tous les statuts' : 'جميع الحالات',
    allPriorities: lang === 'fr' ? 'Toutes les priorités' : 'جميع الأولويات',
    from: lang === 'fr' ? 'De' : 'من',
    to: lang === 'fr' ? 'À' : 'إلى',
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'contacted':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-500/20';
      case 'contacted':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20';
      default:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-500/20';
      case 'low':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20';
      default:
        return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          {translations.title}
        </h1>

        {/* Advanced Filter Bar */}
        <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
          <form method="get" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="search"
                  placeholder={
                    lang === 'fr'
                      ? 'Nom, email, téléphone...'
                      : 'الاسم، البريد الإلكتروني، الهاتف...'
                  }
                  defaultValue={search}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
                />
              </div>

              {/* Status Filter */}
              <select
                name="status"
                defaultValue={status}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              >
                <option value="">{translations.allStatuses}</option>
                <option value="pending">
                  {lang === 'fr' ? 'En attente' : 'قيد الانتظار'}
                </option>
                <option value="contacted">
                  {lang === 'fr' ? 'Contacté' : 'تم التواصل'}
                </option>
                <option value="resolved">
                  {lang === 'fr' ? 'Résolu' : 'تم حله'}
                </option>
                <option value="spam">
                  {lang === 'fr' ? 'Spam' : 'رسالة دعائية'}
                </option>
              </select>

              {/* Priority Filter */}
              <select
                name="priority"
                defaultValue={priority}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
              >
                <option value="">{translations.allPriorities}</option>
                <option value="high">
                  {lang === 'fr' ? 'Haute' : 'عالية'}
                </option>
                <option value="normal">
                  {lang === 'fr' ? 'Normale' : 'عادية'}
                </option>
                <option value="low">
                  {lang === 'fr' ? 'Basse' : 'منخفضة'}
                </option>
              </select>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {/* Date From */}
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {translations.from}
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  defaultValue={dateFrom}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {translations.to}
                </label>
                <input
                  type="date"
                  name="dateTo"
                  defaultValue={dateTo}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
                />
              </div>

              {/* Button */}
              <div className="flex items-end gap-2">
                <Button type="submit" variant="default" className="flex-1">
                  {lang === 'fr' ? 'Filtrer' : 'تصفية'}
                </Button>
                <Link href={`/${lang}/(dashboard)/admin/inquiries`}>
                  <Button variant="outline">
                    {lang === 'fr' ? 'Réinitialiser' : 'إعادة تعيين'}
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Inquiries List */}
        {!inquiries || inquiries.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 dark:text-slate-400">
            {translations.empty}
          </Card>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="p-4 bg-white dark:bg-slate-900">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(inquiry.status)}
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {inquiry.name}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      📧 {inquiry.email} | 📱 {inquiry.phone}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2 line-clamp-1">
                      {inquiry.message ||
                        (lang === 'fr' ? 'Pas de message' : 'بدون رسالة')}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'fr' ? 'Branche' : 'الفرع'}:{' '}
                      {lang === 'fr'
                        ? inquiry.branch?.title_fr
                        : inquiry.branch?.title_ar}
                      {' | '}
                      {new Date(inquiry.created_at).toLocaleDateString(
                        lang === 'fr' ? 'fr-FR' : 'ar-SA',
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusColor(inquiry.status)}`}
                    >
                      {inquiry.status}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded ${getPriorityColor(inquiry.priority)}`}
                    >
                      {inquiry.priority}
                    </span>
                    <Link
                      href={`/${lang}/(dashboard)/admin/inquiries/${inquiry.id}`}
                    >
                      <Button variant="outline" size="sm">
                        {translations.view}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
