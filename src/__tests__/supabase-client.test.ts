import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Supabase client security', () => {
  const clientSource = readFileSync(
    resolve(__dirname, '../integrations/supabase/client.ts'),
    'utf-8'
  );

  it('should read URL from environment variables first', () => {
    expect(clientSource).toContain('import.meta.env.VITE_SUPABASE_URL');
  });

  it('should read anon key from environment variables first', () => {
    expect(clientSource).toContain('import.meta.env.VITE_SUPABASE_ANON_KEY');
  });

  it('should not reference service_role key', () => {
    expect(clientSource.toLowerCase()).not.toContain('service_role');
    expect(clientSource).not.toContain('SUPABASE_SERVICE_ROLE');
  });

  it('should only contain anon role fallbacks, never privileged keys', () => {
    // Anon key fallback is safe (public by design, protected by RLS)
    // But service_role or admin keys must never appear
    const serviceRolePattern = /['"]eyJ[^'"]*"role"\s*:\s*"service_role"[^'"]*['"]/;
    expect(clientSource).not.toMatch(serviceRolePattern);
  });
});
