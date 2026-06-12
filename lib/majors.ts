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

export async function getBranches() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getBranchDetails(branchSlug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('branches')
    .select(
      '*, major:majors(id, slug, translations:major_translations(name, lang)), translations:branch_translations(title, lang, content, benefits, faqs), programs:programs(id,title_fr,title_ar,description_fr,description_ar,duration_months,capacity,price_usd,status,institution:institutions(id,slug,name_fr,name_ar,location_fr,location_ar,website))',
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
        programs?: Array<{
          id: string;
          title_fr: string;
          title_ar: string;
          description_fr?: string | null;
          description_ar?: string | null;
          duration_months?: number | null;
          capacity?: number | null;
          price_usd?: number | null;
          status: string;
          institution?: {
            id: string;
            slug: string;
            name_fr: string;
            name_ar: string;
            location_fr?: string | null;
            location_ar?: string | null;
            website?: string | null;
          } | null;
        }>;
      })
    | null;
}

export async function getMajorsWithBranches() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('majors').select(`
      id,
      slug,
      translations:major_translations(name,lang),
      branches(
        id,
        slug,
        featured_image,
        translations:branch_translations(title,lang)
      )
    `);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getBranchesForSearch() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('branches')
    .select('id, slug, translations:branch_translations(title, lang)');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getAdminInquiries() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('inquiries')
    .select(
      `
      *,
      branch:branches(
        slug,
        translations:branch_translations(title, lang)
      )
    `,
    )
    .order('status', { ascending: true }) // Pending first
    .order('created_at', { ascending: false }); // Newest first

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
