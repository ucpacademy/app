'use server';

export type ActionState = {
  success: boolean;
  error: boolean;
  timestamp: number;
};

import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function submitInquiry(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createServerSupabaseClient();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;
  const branch_id = formData.get('branchId') as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from('inquiries').insert({
    branch_id,
    user_id: user?.id || null,
    name,
    email,
    phone,
    message,
    status: 'pending',
  });

  if (error) {
    return { success: false, error: true, timestamp: Date.now() };
  }
  return { success: true, error: false, timestamp: Date.now() };
}

export async function updateInquiryStatus(id: string, status: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteInquiryAction(id: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function saveBranchAction(payload: {
  branchId: string;
  slug: string;
  featuredImage: string | null;
  gallery: string[];
  translationId: string | null;
  lang: string;
  translationData: { title: string; benefits: string; faqs: any };
}) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    // 1. Update Branch
    const { error: branchError } = await supabase
      .from('branches')
      .update({
        slug: payload.slug,
        featured_image: payload.featuredImage,
        gallery: payload.gallery,
      })
      .eq('id', payload.branchId);

    if (branchError) return { error: `Branch error: ${branchError.message}` };

    // 2. Update or Insert Translation
    if (payload.translationId) {
      const { error: tError } = await supabase
        .from('branch_translations')
        .update(payload.translationData)
        .eq('id', payload.translationId);
      if (tError)
        return { error: `Translation update error: ${tError.message}` };
    } else {
      const { error: tError } = await supabase
        .from('branch_translations')
        .insert({
          branch_id: payload.branchId,
          lang: payload.lang,
          ...payload.translationData,
        });
      if (tError)
        return { error: `Translation insert error: ${tError.message}` };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Internal Server Error' };
  }
}
