'use client';

import { useEffect, useState } from 'react';
import { useTransition } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { useI18n } from '@/src/locales/I18nProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteMajor } from '@/src/lib/admin-actions';
import Link from 'next/link';
import { Search, Plus, Trash2, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MajorsList({ initialMajors }: { initialMajors: any[] }) {
  const { lang } = useI18n();
  const [majors, setMajors] = useState(initialMajors);
  const [filteredMajors, setFilteredMajors] = useState(initialMajors);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const query = search.toLowerCase();
    const filtered = majors.filter(
      (major) =>
        major.name_fr.toLowerCase().includes(query) ||
        major.name_ar.includes(query) ||
        major.slug.toLowerCase().includes(query),
    );
    setFilteredMajors(filtered);
  }, [search, majors]);

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;

    startTransition(async () => {
      const result = await deleteMajor(id);
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        setMajors(majors.filter((m) => m.id !== id));
        router.refresh();
      }
    });
  };

  const dict = {
    title: lang === 'fr' ? 'Majors' : 'التخصصات',
    add: lang === 'fr' ? 'Ajouter une majeure' : 'إضافة تخصص',
    empty:
      lang === 'fr' ? 'Aucune majeure trouvée.' : 'لم يتم العثور على تخصصات.',
    search: lang === 'fr' ? 'Chercher les majeurs...' : 'البحث عن التخصصات...',
    edit: lang === 'fr' ? 'Modifier' : 'تعديل',
    delete: lang === 'fr' ? 'Supprimer' : 'حذف',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {dict.title}
        </h1>
        <Link href="/admin/majors/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {dict.add}
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={dict.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* List */}
      {filteredMajors.length === 0 ? (
        <Card className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
          {dict.empty}
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredMajors.map((major) => (
            <Card
              key={major.id}
              className="p-4 bg-white dark:bg-slate-900 flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {lang === 'fr' ? major.name_fr : major.name_ar}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {major.slug}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/majors/${major.id}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Edit2 className="w-4 h-4" />
                    {dict.edit}
                  </Button>
                </Link>
                <button
                  onClick={() =>
                    handleDelete(
                      major.id,
                      lang === 'fr' ? major.name_fr : major.name_ar,
                    )
                  }
                  disabled={isPending}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
