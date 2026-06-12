'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ==================== MAJORS ====================

export async function createMajor(data: {
  slug: string;
  name_fr: string;
  name_ar: string;
  description_fr?: string;
  description_ar?: string;
  icon?: string;
  color?: string;
  featured?: boolean;
}) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('majors').insert([data]);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateMajor(id: string, data: any) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('majors').update(data).eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteMajor(id: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('majors').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ==================== PROGRAMS ====================

export async function createProgram(data: {
  branch_id: string;
  title_fr: string;
  title_ar: string;
  description_fr?: string;
  description_ar?: string;
  duration_months?: number;
  capacity?: number;
  price_usd?: number;
  price_mad?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
}) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('programs').insert([data]);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateProgram(id: string, data: any) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('programs').update(data).eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteProgram(id: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('programs').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ==================== EVENTS ====================

export async function createEvent(data: {
  title_fr: string;
  title_ar: string;
  description_fr?: string;
  description_ar?: string;
  event_date: string;
  end_date?: string;
  location_fr?: string;
  location_ar?: string;
  event_url?: string;
  image_url?: string;
  capacity?: number;
  status?: string;
}) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('events').insert([data]);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateEvent(id: string, data: any) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('events').update(data).eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteEvent(id: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ==================== BLOG POSTS ====================

export async function createBlogPost(data: {
  title_fr: string;
  title_ar: string;
  slug_fr: string;
  slug_ar: string;
  content_fr: string;
  content_ar: string;
  excerpt_fr?: string;
  excerpt_ar?: string;
  featured_image?: string;
  status?: string;
  featured?: boolean;
  published_at?: string;
}) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('blog_posts').insert([
      {
        ...data,
        author_id: user.id,
      },
    ]);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateBlogPost(id: string, data: any) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
      .from('blog_posts')
      .update(data)
      .eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ==================== FAQs ====================

export async function createFAQ(data: {
  category: string;
  question_fr: string;
  question_ar: string;
  answer_fr: string;
  answer_ar: string;
  order_index?: number;
}) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('faqs').insert([data]);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateFAQ(id: string, data: any) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('faqs').update(data).eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteFAQ(id: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ==================== INQUIRIES ====================

export async function updateInquiry(
  id: string,
  data: {
    status?: string;
    priority?: string;
    assigned_to?: string;
    notes?: string;
  },
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
      .from('inquiries')
      .update(data)
      .eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteInquiry(id: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ==================== REVIEWS ====================

export async function updateReview(id: string, data: { status: string }) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('reviews').update(data).eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteReview(id: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) return { error: error.message };

    revalidatePath('/(dashboard)/admin');
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
