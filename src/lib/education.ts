import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function getAdminPrograms() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('programs')
    .select(
      `
      id,
      title_fr,
      title_ar,
      duration_months,
      capacity,
      price_usd,
      status,
      branch:branches(title_fr,title_ar,slug),
      institution:institutions(name_fr,name_ar,slug)
    `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getAdminInstitutions() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('institutions')
    .select('id,slug,name_fr,name_ar,featured,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getPublishedInstitutions() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('institutions')
    .select(
      'id,slug,name_fr,name_ar,description_fr,description_ar,logo_url,website',
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getInstitutionBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('institutions')
    .select(
      `
      id,
      slug,
      name_fr,
      name_ar,
      description_fr,
      description_ar,
      logo_url,
      website,
      location_fr,
      location_ar,
      contact_email,
      featured,
      programs:programs(id,title_fr,title_ar,description_fr,description_ar,duration_months,price_usd,branch:branches(slug,title_fr,title_ar))
    `,
    )
    .eq('slug', slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getInstitutionById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('institutions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAllInstitutions() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('institutions')
    .select('id,slug,name_fr,name_ar')
    .order('name_fr', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getBranches() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('branches')
    .select('id,slug,title_fr,title_ar')
    .order('title_fr', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getProgramById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
