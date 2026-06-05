import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const gitDirectory = resolve(repoRoot, '.git');

if (!existsSync(gitDirectory)) {
  console.log('Skipping git hook setup because .git was not found.');
  process.exit(0);
}

const result = spawnSync('git', ['config', 'core.hooksPath', '.husky'], {
  cwd: repoRoot,
  stdio: 'inherit',
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log('Configured git hooks path to .husky');
