import { describe, it, expect, vi } from 'vitest';

vi.mock('../integrations/supabase/client', () => {
  const mockAuth = {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signInWithOAuth: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
  };

  return {
    supabase: {
      auth: mockAuth,
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
        upsert: vi.fn().mockResolvedValue({ error: null }),
      }),
    },
  };
});

describe('Auth flow security', () => {
  it('should not expose any credentials in the auth module', async () => {
    const { readFileSync } = await import('fs');
    const { resolve } = await import('path');

    const authSource = readFileSync(
      resolve(__dirname, '../hooks/useAuth.ts'),
      'utf-8'
    );

    expect(authSource).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}/);
    expect(authSource).not.toMatch(/['"]https:\/\/[a-z]+\.supabase\.co['"]/);
  });

  it('should import supabase client from the integrations module', async () => {
    const { readFileSync } = await import('fs');
    const { resolve } = await import('path');

    const authSource = readFileSync(
      resolve(__dirname, '../hooks/useAuth.ts'),
      'utf-8'
    );

    expect(authSource).toContain('supabase');
    expect(authSource).not.toContain('createClient');
  });
});
