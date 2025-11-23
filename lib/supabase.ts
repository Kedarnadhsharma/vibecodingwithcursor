import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.'
    );
  }

  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false
      }
    });
  }

  return supabaseClient;
};

// Export createClient as an alias for consistency
export const createClient = getSupabase;

