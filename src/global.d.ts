/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    PUBLIC_PATH?: string;
  }
}
