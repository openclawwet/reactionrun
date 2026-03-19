import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const readJwtPayload = (value: string) => {
  const parts = value.split(".");

  if (parts.length !== 3) {
    return null;
  }

  try {
    const decoded = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as { role?: string };
  } catch {
    return null;
  }
};

const isSupabaseServiceRoleKey = (value: string) => {
  if (!value) {
    return false;
  }

  const payload = readJwtPayload(value);
  return payload?.role === "service_role";
};

const hasUnsafeSupabaseKey =
  typeof supabaseAnonKey === "string" && isSupabaseServiceRoleKey(supabaseAnonKey);

if (hasUnsafeSupabaseKey) {
  console.error(
    "Reaction Run: VITE_SUPABASE_ANON_KEY contains a service_role key. Replace it with the public anon/publishable key immediately.",
  );
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !hasUnsafeSupabaseKey,
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
