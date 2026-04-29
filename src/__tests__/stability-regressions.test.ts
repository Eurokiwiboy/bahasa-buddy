import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const readRepoFile = (path: string) =>
  readFileSync(resolve(__dirname, '../..', path), 'utf-8');

describe('stability regressions', () => {
  const secureRpc = readRepoFile('supabase/migrations/20260315000002_secure_rpc.sql');
  const reconcileMigration = readRepoFile('supabase/migrations/20260429000000_reconcile_rls_and_xp.sql');
  const rlsMigration = readRepoFile('supabase/migrations/20260315000001_enable_rls.sql');
  const useChat = readRepoFile('src/hooks/useChat.ts');

  it('keeps add_xp aligned with the profile schema and progress systems', () => {
    for (const migration of [secureRpc, reconcileMigration]) {
      expect(migration).toContain('xp_total');
      expect(migration).toContain('xp_today');
      expect(migration).toContain('current_streak');
      expect(migration).toContain('longest_streak');
      expect(migration).toContain('xp_transactions');
      expect(migration).toContain('daily_goals');
      expect(migration).not.toContain('total_xp');
    }
  });

  it('keeps add_xp limited to the authenticated user and bounded amounts', () => {
    for (const migration of [secureRpc, reconcileMigration]) {
      expect(migration).toContain('p_user_id != auth.uid()');
      expect(migration).toContain('p_amount < 1 OR p_amount > 100');
      expect(migration).toContain('REVOKE EXECUTE ON FUNCTION add_xp');
      expect(migration).toContain('GRANT EXECUTE ON FUNCTION add_xp');
    }
  });

  it('drops permissive baseline RLS policies before applying stricter policies', () => {
    expect(rlsMigration).toContain('DROP POLICY IF EXISTS "Public profiles are viewable by everyone"');
    expect(rlsMigration).toContain('DROP POLICY IF EXISTS "Users can create XP transactions"');
    expect(rlsMigration).toContain('DROP POLICY IF EXISTS "Users can send messages"');
    expect(reconcileMigration).toContain('DROP POLICY IF EXISTS "Public profiles are viewable by everyone"');
    expect(reconcileMigration).toContain('DROP POLICY IF EXISTS "Users can create XP transactions"');
    expect(reconcileMigration).toContain('DROP POLICY IF EXISTS "Users can send messages"');
  });

  it('uses a narrow public profile projection for chat display fields', () => {
    expect(reconcileMigration).toContain('CREATE OR REPLACE VIEW public_profiles');
    expect(reconcileMigration).toContain('display_name');
    expect(reconcileMigration).toContain('avatar_url');
    expect(reconcileMigration).toContain('learning_level');
    expect(useChat).toContain(".from('public_profiles')");
    expect(useChat).not.toContain('profiles:user_id');
  });

  it('settles chat room loading after room fetch success or failure', () => {
    expect(useChat).toMatch(/const fetchRooms = useCallback\(async \(\) => \{\s+setLoading\(true\);/);
    expect(useChat).toContain('} finally {');
    expect(useChat).toContain('setLoading(false);');
  });
});
