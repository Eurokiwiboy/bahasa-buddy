// src/integrations/supabase/client.ts
// Updated Supabase client with proper configuration

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Environment variables with hardcoded fallback for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ||
  'https://zxmwfvyqrtqtsrfhdvhv.supabase.co';

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4bXdmdnlxcnRxdHNyZmhkdmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTkzNjUsImV4cCI6MjA4NTYzNTM2NX0.5vaShQEGwrpzKtX6mAI22Ta5UU72CiwbBf4wbgRWAvI';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials');
}

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
