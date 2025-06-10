// build-no-check.js
import { spawn } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Skip typechecking by setting the environment variable
process.env.VITE_SKIP_TS_CHECK = 'true';

// Run Vite build directly
const buildProcess = spawn('node', ['./node_modules/vite/bin/vite.js', 'build'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: { ...process.env }
});

buildProcess.on('close', (code) => {
  process.exit(code);
}); 