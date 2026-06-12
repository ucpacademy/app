'use client';

import { useEffect, useState } from 'react';
import { useTransition } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';
import { useI18n } from '@/src/locales/I18nProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteProgram } from '@/src/lib/admin-actions';
import Link from 'next/link';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  Users,
  Clock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Program {
  id: string;
  title_fr: string;
  title_ar: string;
  duration_months?: number;
  capacity?: number;
  price_usd?: number;
  status: string;
  branch?: { title_fr: string; title_ar: string };
}

export function ProgramsList({
  initialPrograms,
}: {
  initialPrograms: Program[];
}) {
  const { lang, dict } = useI18n();
  const [programs, setPrograms] = useState(initialPrograms);
  const [filteredPrograms, setFilteredPrograms] = useState(initialPrograms);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    let filtered = programs;

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title_fr.toLowerCase().includes(query) ||
          p.title_ar.includes(query) ||
          p.branch?.title_fr.toLowerCase().includes(query),
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredPrograms(filtered);
  }, [search, statusFilter, programs]);

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;

    startTransition(async () => {
      const result = await deleteProgram(id);
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        setPrograms(programs.filter((p) => p.id !== id));
        router.refresh();
      }
    });
  };

  const translations = {
    title: lang === 'fr' ? 'Programmes' : 'البرامج',
    add: lang === 'fr' ? 'Ajouter un programme' : 'إضافة برنامج',
    empty:
      lang === 'fr' ? 'Aucun programme trouvé.' : 'لم يتم العثور على برامج.',
    search:
      lang === 'fr' ? 'Chercher les programmes...' : 'البحث عن البرامج...',
    status: lang === 'fr' ? 'Statut' : 'الحالة',
    edit: lang === 'fr' ? 'Modifier' : 'تعديل',
    delete: lang === 'fr' ? 'Supprimer' : 'حذف',
    allStatuses: lang === 'fr' ? 'Tous les statuts' : 'جميع الحالات',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {translations.title}
        </h1>
        <Link href="/admin/programs/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {translations.add}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={translations.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">{translations.allStatuses}</option>
          <option value="draft">{lang === 'fr' ? 'Brouillon' : 'مسودة'}</option>
          <option value="published">
            {lang === 'fr' ? 'Publié' : 'منشور'}
          </option>
          <option value="archived">
            {lang === 'fr' ? 'Archivé' : 'مؤرشف'}
          </option>
        </select>
      </div>

      {/* List */}
      {filteredPrograms.length === 0 ? (
        <Card className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
          {translations.empty}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="p-4 bg-white dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {lang === 'fr' ? program.title_fr : program.title_ar}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {program.branch
                      ? lang === 'fr'
                        ? program.branch.title_fr
                        : program.branch.title_ar
                      : ''}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                    {program.duration_months && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {program.duration_months}{' '}
                        {lang === 'fr' ? 'mois' : 'أشهر'}
                      </div>
                    )}
                    {program.capacity && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {program.capacity} {lang === 'fr' ? 'places' : 'مكان'}
                      </div>
                    )}
                    {program.price_usd && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />${program.price_usd}
                      </div>
                    )}
                    <span
                      className={`px-2 py-1 rounded ${
                        program.status === 'published'
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}
                    >
                      {program.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/programs/${program.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit2 className="w-4 h-4" />
                      {translations.edit}
                    </Button>
                  </Link>
                  <button
                    onClick={() =>
                      handleDelete(
                        program.id,
                        lang === 'fr' ? program.title_fr : program.title_ar,
                      )
                    }
                    disabled={isPending}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
