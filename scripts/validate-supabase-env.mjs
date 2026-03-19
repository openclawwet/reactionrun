const decodeJwtPayload = (value) => {
  const parts = value.split(".");

  if (parts.length !== 3) {
    return null;
  }

  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
  } catch {
    return null;
  }
};

const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseKey) {
  process.exit(0);
}

const payload = decodeJwtPayload(supabaseKey);

if (payload?.role === "service_role") {
  console.error(
    "[supabase] Refusing to build with a service_role key in VITE_SUPABASE_ANON_KEY. Use the public anon/publishable key instead.",
  );
  process.exit(1);
}
