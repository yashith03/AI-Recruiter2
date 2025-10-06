// services/supabaseClient.js

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  url && key
    ? createClient(url, key)
    : {
        auth: {
          getUser: async () => ({ data: { user: null } }),
        },
        from: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
      };
