// src/integrations/supabase/client.ts
// Updated Supabase client with proper configuration

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// The anon key is intentionally kept as a fallback for zero-config hosted deployments
// (e.g. Lovable, Vercel preview branches) that don't inject VITE_ env vars at build time.
//
// This is safe because:
//   1. The Supabase anon key is a *public* key — Supabase's own docs say it's fine to include
//      in client-side code, similar to a Firebase apiKey.
//   2. Row Level Security (RLS) is enabled on every table. Without a valid JWT the anon role
//      can only reach rows the RLS policies explicitly allow.
//
// When to remove the fallback:
//   If you move to a self-hosted or CI-deployed build that always injects VITE_SUPABASE_URL
//   and VITE_SUPABASE_ANON_KEY, replace the `|| '...'` fallbacks with a hard error:
//     if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error('Missing Supabase env vars');
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zxmwfvyqrtqtsrfhdvhv.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4bXdmdnlxcnRxdHNyZmhkdmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTkzNjUsImV4cCI6MjA4NTYzNTM2NX0.5vaShQEGwrpzKtX6mAI22Ta5UU72CiwbBf4wbgRWAvI';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper to check if user is authenticated
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
};

// Helper to check session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
};

// Helper to verify database connection
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
    return false;
  }
};