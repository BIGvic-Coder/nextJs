// app/lib/supabase-server.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Throw clear error if missing
if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL is not defined. Make sure your .env file is at the project root."
  );
}

if (!supabaseServiceKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined."
  );
}

// Create a single Supabase client instance
export const supabaseServer: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceKey
);
