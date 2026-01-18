// services/supabaseClient.js

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase Client Init - URL defined:", !!url, "Key defined:", !!key);
if (url) console.log("Supabase URL preview:", url.substring(0, 15) + "...");

export const supabase =
  url && key
    ? createClient(url, key)
    : {
        auth: {
          getUser: async () => ({ data: { user: null } }),
          getSession: async () => ({ data: { session: null } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        from: () => ({ 
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: [], error: null }),
          upsert: () => Promise.resolve({ data: [], error: null }),
        }),
        storage: {
          from: () => ({
            upload: () => Promise.resolve({ data: {}, error: null }),
            getPublicUrl: () => ({ data: { publicUrl: "" } }),
          })
        }
      };
