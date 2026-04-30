import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Supabase client security', () => {
  const clientSource = readFileSync(
    resolve(__dirname, '../integrations/supabase/client.ts'),
    'utf-8'
  );

  it('reads URL from environment variables', () => {
    expect(clientSource).toContain('import.meta.env.VITE_SUPABASE_URL');
  });

  it('reads anon key from environment variables', () => {
    expect(clientSource).toContain('import.meta.env.VITE_SUPABASE_ANON_KEY');
  });

  it('does not include hardcoded Supabase URLs or JWT fallbacks', () => {
    expect(clientSource).not.toMatch(/['"]https:\/\/[a-z0-9]+\.supabase\.co['"]/);
    expect(clientSource).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}/);
    expect(clientSource).toContain('Missing Supabase environment variables');
  });

  it('should not reference service_role key', () => {
    expect(clientSource.toLowerCase()).not.toContain('service_role');
    expect(clientSource).not.toContain('SUPABASE_SERVICE_ROLE');
  });

  it('does not contain privileged JWT-shaped keys', () => {
    const serviceRolePattern = /['"]eyJ[^'"]*"role"\s*:\s*"service_role"[^'"]*['"]/;
    expect(clientSource).not.toMatch(serviceRolePattern);
  });
});
