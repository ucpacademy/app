'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type Lang } from '@/lib/i18n';
import { Search, GraduationCap } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser';

export function BranchSearch({ lang }: { lang: Lang }) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const [branches, setBranches] = useState<
    {
      id: string;
      slug: string;
      translations?: { title: string; lang: string }[];
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      const { data } = await supabase
        .from('branches')
        .select('id, slug, translations:branch_translations(title, lang)');
      if (data) setBranches(data);
    };
    fetchBranches();
  }, [supabase]);

  const filteredBranches = branches.filter((b) => {
    const title = b.translations?.find((t) => t.lang === lang)?.title || '';
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center group">
        <Search className="absolute left-6 w-6 h-6 text-indigo-500 transition-transform group-focus-within:scale-110" />
        <input
          type="text"
          placeholder={
            lang === 'fr'
              ? 'Rechercher une branche... (ex: sage-femme)'
              : 'ابحث عن فرع... (مثال: قابلة)'
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-16 pr-6 py-5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500/20 focus:border-indigo-500 shadow-xl shadow-indigo-500/10 outline-none text-slate-900 dark:text-white transition-all text-lg font-medium placeholder-slate-400"
        />
      </div>

      {isFocused && searchTerm && (
        <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {filteredBranches.length > 0 ? (
            filteredBranches.map((branch) => {
              const title =
                branch.translations?.find((t) => t.lang === lang)?.title ||
                branch.slug;
              return (
                <button
                  key={branch.id}
                  onMouseDown={() =>
                    router.push(`/${lang}/branches/${branch.slug}`)
                  }
                  className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors flex items-center gap-4 group"
                >
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-lg text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {title}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="px-6 py-10 text-center text-slate-500 font-medium">
              {lang === 'fr'
                ? 'Aucune branche trouvée.'
                : 'لم يتم العثور على أي فرع.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
