// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Supabase service role key (use only on server side)
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
