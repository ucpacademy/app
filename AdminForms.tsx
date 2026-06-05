'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { Dictionary } from '@/utils/dictionary';

export function AdminForms({
  dictionary,
}: {
  dictionary: Dictionary['admin_forms'];
}) {
  const supabase = createClient();

  // States for Major
  const [majorSlug, setMajorSlug] = useState('');
  const [majorFr, setMajorFr] = useState('');
  const [majorAr, setMajorAr] = useState('');

  // States for Branch
  const [branchMajorId, setBranchMajorId] = useState('');
  const [branchSlug, setBranchSlug] = useState('');
  const [branchFr, setBranchFr] = useState('');
  const [branchAr, setBranchAr] = useState('');

  const handleAddMajor = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('majors')
      .insert([{ slug: majorSlug, name_fr: majorFr, name_ar: majorAr }]);
    if (error) alert(error.message);
    else alert(dictionary.major_added);
  };

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('branches')
      .insert([
        {
          major_id: branchMajorId,
          slug: branchSlug,
          title_fr: branchFr,
          title_ar: branchAr,
          content_fr: 'Contenu ici',
          content_ar: 'المحتوى هنا',
        },
      ]);
    if (error) alert(error.message);
    else alert(dictionary.branch_added);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        marginTop: '1rem',
      }}
    >
      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        <h3>{dictionary.add_major_title}</h3>
        <form
          onSubmit={handleAddMajor}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxWidth: '300px',
          }}
        >
          <input
            placeholder={dictionary.major_slug}
            required
            value={majorSlug}
            onChange={(e) =>
              setMajorSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/[\s_]+/g, '-')
                  .replace(/[^a-z0-9-]+/g, ''),
              )
            }
          />
          <input
            placeholder={dictionary.major_name_fr}
            required
            value={majorFr}
            onChange={(e) => setMajorFr(e.target.value)}
          />
          <input
            placeholder={dictionary.major_name_ar}
            required
            value={majorAr}
            onChange={(e) => setMajorAr(e.target.value)}
          />
          <button type="submit">{dictionary.save_major}</button>
        </form>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        <h3>{dictionary.add_branch_title}</h3>
        <form
          onSubmit={handleAddBranch}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxWidth: '300px',
          }}
        >
          <input
            placeholder={dictionary.branch_major_id}
            required
            value={branchMajorId}
            onChange={(e) => setBranchMajorId(e.target.value)}
          />
          <input
            placeholder={dictionary.branch_slug}
            required
            value={branchSlug}
            onChange={(e) =>
              setBranchSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/[\s_]+/g, '-')
                  .replace(/[^a-z0-9-]+/g, ''),
              )
            }
          />
          <input
            placeholder={dictionary.branch_title_fr}
            required
            value={branchFr}
            onChange={(e) => setBranchFr(e.target.value)}
          />
          <input
            placeholder={dictionary.branch_title_ar}
            required
            value={branchAr}
            onChange={(e) => setBranchAr(e.target.value)}
          />
          <button type="submit">{dictionary.save_branch}</button>
        </form>
      </div>
    </div>
  );
}
