import { cookies } from 'next/headers';
import { createServerSupabaseClient as createServer } from '@supabase/ssr';

export function createServerSupabaseClient() {
  // Use @supabase/ssr helper with Next.js App Router cookies
  return createServer({ cookies });
}
