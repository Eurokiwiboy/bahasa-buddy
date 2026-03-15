import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Supabase client security', () => {
  const clientSource = readFileSync(
    resolve(__dirname, '../integrations/supabase/client.ts'),
    'utf-8'
  );

  it('should not contain hardcoded Supabase URLs', () => {
    const hardcodedUrl = /['"]https:\/\/[a-z]+\.supabase\.co['"]/;
    expect(clientSource).not.toMatch(hardcodedUrl);
  });

  it('should not contain hardcoded JWT tokens', () => {
    const hardcodedJwt = /['"]eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+['"]/;
    expect(clientSource).not.toMatch(hardcodedJwt);
  });

  it('should read URL from environment variables', () => {
    expect(clientSource).toContain('import.meta.env.VITE_SUPABASE_URL');
  });

  it('should read anon key from environment variables', () => {
    expect(clientSource).toContain('import.meta.env.VITE_SUPABASE_ANON_KEY');
  });

  it('should not reference service_role key', () => {
    expect(clientSource.toLowerCase()).not.toContain('service_role');
    expect(clientSource).not.toContain('SUPABASE_SERVICE_ROLE');
  });
});
