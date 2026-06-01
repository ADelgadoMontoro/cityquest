import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(__dirname, '..');
const require = createRequire(import.meta.url);
const wranglerCliEntrypoint = require.resolve('wrangler/bin/wrangler.js');
const localXdgConfigHome = join(workspaceRoot, '.wrangler-home');
const workerUrl = 'http://127.0.0.1:8787/';

mkdirSync(localXdgConfigHome, { recursive: true });

function sleep(milliseconds) {
  return new Promise((resolvePromise) => {
    setTimeout(resolvePromise, milliseconds);
  });
}

async function waitForWorkerReadiness() {
  const timeoutAt = Date.now() + 15_000;

  while (Date.now() < timeoutAt) {
    try {
      const response = await fetch(workerUrl);

      if (!response.ok) {
        throw new Error(`Unexpected status code: ${response.status}`);
      }

      const payload = await response.json();

      if (payload?.status === 'initialized' && payload?.service === 'cityquest-api') {
        return;
      }
    } catch {
      await sleep(500);
      continue;
    }
  }

  throw new Error('Timed out while waiting for the local Worker runtime to become ready.');
}

const childProcess = spawn(
  process.execPath,
  [wranglerCliEntrypoint, 'dev', '--ip', '127.0.0.1', '--port', '8787'],
  {
    cwd: workspaceRoot,
    env: {
      ...process.env,
      XDG_CONFIG_HOME: localXdgConfigHome,
    },
    stdio: 'inherit',
  },
);

try {
  await waitForWorkerReadiness();
} finally {
  childProcess.kill();
}

const exitCode = await new Promise((resolvePromise) => {
  childProcess.once('exit', (code) => {
    resolvePromise(code ?? 0);
  });
});

if (exitCode !== 0 && exitCode !== 1) {
  process.exit(exitCode);
}
