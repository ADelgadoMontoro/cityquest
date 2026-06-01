import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(__dirname, '..');
const localXdgConfigHome = join(workspaceRoot, '.wrangler-home');
const require = createRequire(import.meta.url);

mkdirSync(localXdgConfigHome, { recursive: true });

const wranglerCliEntrypoint = require.resolve('wrangler/bin/wrangler.js');

const result = spawnSync(process.execPath, [wranglerCliEntrypoint, ...process.argv.slice(2)], {
  cwd: workspaceRoot,
  env: {
    ...process.env,
    XDG_CONFIG_HOME: localXdgConfigHome,
  },
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);
