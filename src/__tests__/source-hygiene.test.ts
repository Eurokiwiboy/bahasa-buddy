import { describe, expect, it } from 'vitest';
import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const repoRoot = resolve(__dirname, '../..');
const trackedFiles = () =>
  execFileSync('git', ['ls-files'], { cwd: repoRoot, encoding: 'utf-8' })
    .split('\n')
    .filter(Boolean);

describe('source hygiene', () => {
  it('does not keep retired host or dev tagger remnants in tracked files', () => {
    const retiredHost = 'lo' + 'vable';
    const retiredProjectRef = 'efp' + 'gaasufgsfimakduve';
    const retiredTemplateName = 'vite_' + 'react_shadcn_ts';
    const retiredDevTagger = retiredHost + '-tagger';
    const retiredTaggerSymbol = 'component' + 'Tagger';

    const forbidden = [
      retiredHost,
      retiredDevTagger,
      retiredTaggerSymbol,
      retiredProjectRef,
      retiredTemplateName,
      `bahasabuddy.${retiredHost}.app`,
    ];

    const offenders = trackedFiles().flatMap((file) => {
      if (file === 'src/__tests__/source-hygiene.test.ts') return [];

      const source = readFileSync(resolve(repoRoot, file), 'utf-8').toLowerCase();
      return forbidden
        .filter((term) => source.includes(term.toLowerCase()))
        .map((term) => `${file}: ${term}`);
    });

    expect(offenders).toEqual([]);
  });
});
