// services/supabaseServer.js
import { createClient } from "@supabase/supabase-js";

export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    throw new Error("Supabase server env vars missing");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
