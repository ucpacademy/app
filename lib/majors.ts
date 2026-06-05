import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';

export async function getMajors() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('majors').select('*');

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Database['public']['Tables']['majors']['Row'][];
}

export async function getMajorBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('majors')
    .select('*, translations:major_translations(name, lang)')
    .eq('slug', slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as
    | (Database['public']['Tables']['majors']['Row'] & {
        translations?: Array<{
          name: string;
          lang: string;
        }>;
      })
    | null;
}

export async function getBranchesForMajor(majorId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('branches')
    .select('id, slug, major_id, translations:branch_translations(title, lang)')
    .eq('major_id', majorId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Array<
    Database['public']['Tables']['branches']['Row'] & {
      translations?: Array<{
        title: string;
        lang: string;
      }>;
    }
  >;
}

export async function getBranchDetails(branchSlug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('branches')
    .select(
      '*, major:majors(id, slug, translations:major_translations(name, lang)), translations:branch_translations(title, lang, content, benefits, faqs)',
    )
    .eq('slug', branchSlug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as
    | (Database['public']['Tables']['branches']['Row'] & {
        major: {
          id: string;
          slug: string;
          translations?: Array<{
            name: string;
            lang: string;
          }>;
        };
        translations?: Array<{
          title: string;
          content: string;
          lang: string;
          benefits?: string;
          faqs?: unknown;
        }>;
      })
    | null;
}
