/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ADSENSE_CLIENT_ID?: string;
  readonly VITE_ADSENSE_SLOT_TEST?: string;
  readonly VITE_ADSENSE_SLOT_PRIMARY?: string;
  readonly VITE_ADSENSE_SLOT_SECONDARY?: string;
  readonly VITE_ADSENSE_SITE_READY?: string;
  readonly VITE_ADSENSE_CMP_READY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
