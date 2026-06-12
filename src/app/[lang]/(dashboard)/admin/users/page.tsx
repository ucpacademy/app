import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDictionary, type Lang } from '@/utils/dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, Shield, User } from 'lucide-react';

export default async function AdminUsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<{ search?: string; role?: string }>;
}) {
  const { lang } = await params;
  const { search = '', role = '' } = await searchParams;
  const dict = await getDictionary(lang);
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq('role', role);
  }

  const { data: users } = await query;

  const translations = {
    title: lang === 'fr' ? 'Utilisateurs' : 'المستخدمون',
    empty: lang === 'fr' ? 'Aucun utilisateur.' : 'لا يوجد مستخدمون.',
    search: lang === 'fr' ? 'Chercher un utilisateur...' : 'البحث عن مستخدم...',
    allRoles: lang === 'fr' ? 'Tous les rôles' : 'جميع الأدوار',
    student: lang === 'fr' ? 'Étudiant' : 'طالب',
    admin: lang === 'fr' ? 'Admin' : 'مسؤول',
    moderator: lang === 'fr' ? 'Modérateur' : 'محرر',
    joined: lang === 'fr' ? 'Inscrit le' : 'انضم في',
    view: lang === 'fr' ? 'Voir' : 'عرض',
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      case 'moderator':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'moderator':
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          {translations.title}
        </h1>

        {/* Filter Bar */}
        <div className="mb-6 flex gap-2">
          <form method="get" className="w-full flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="search"
                placeholder={translations.search}
                defaultValue={search}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <select
              name="role"
              defaultValue={role}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="">{translations.allRoles}</option>
              <option value="student">{translations.student}</option>
              <option value="admin">{translations.admin}</option>
              <option value="moderator">{translations.moderator}</option>
            </select>
            <Button type="submit" variant="outline">
              {lang === 'fr' ? 'Filtrer' : 'تصفية'}
            </Button>
          </form>
        </div>

        {/* Users List */}
        {!users || users.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 dark:text-slate-400">
            {translations.empty}
          </Card>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <Card key={user.id} className="p-4 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {user.full_name ||
                            (lang === 'fr' ? 'Sans nom' : 'بدون اسم')}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-1 ${getRoleColor(user.role)}`}
                    >
                      {getRoleIcon(user.role)}
                      {user.role === 'student'
                        ? translations.student
                        : user.role === 'admin'
                          ? translations.admin
                          : translations.moderator}
                    </span>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {translations.joined}{' '}
                      {new Date(user.created_at).toLocaleDateString(
                        lang === 'fr' ? 'fr-FR' : 'ar-SA',
                      )}
                    </div>
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
