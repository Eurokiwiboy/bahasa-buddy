import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Environment variable validation', () => {
  it('.env.example should exist and list required variables', () => {
    const envExample = readFileSync(
      resolve(__dirname, '../../.env.example'),
      'utf-8'
    );
    expect(envExample).toContain('VITE_SUPABASE_URL');
    expect(envExample).toContain('VITE_SUPABASE_ANON_KEY');
  });

  it('.env.example should not contain real credentials', () => {
    const envExample = readFileSync(
      resolve(__dirname, '../../.env.example'),
      'utf-8'
    );
    expect(envExample).not.toContain('zxmwfvyqrtqtsrfhdvhv');
    expect(envExample).not.toContain('efpgaasufgsfimakduve');
    expect(envExample).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}/);
  });

  it('.gitignore should include .env', () => {
    const gitignore = readFileSync(
      resolve(__dirname, '../../.gitignore'),
      'utf-8'
    );
    expect(gitignore).toContain('.env');
  });
});
