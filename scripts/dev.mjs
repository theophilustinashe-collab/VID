import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const env = {
  ...process.env,
  PORT: '8080',
  SESSION_SECRET: 'supersecret',
  NODE_ENV: 'development',
  DATABASE_URL: 'postgresql://neondb_owner:npg_V9WkaUpbT7Gq@ep-icy-hat-adekz7qm.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
};

console.log("🚀 [System] Initializing VID Master Full-Stack...");

// Build API Server first to ensure dist/index.mjs exists
console.log("🚀 [System] Building API Server...");
spawn('pnpm', ['--filter', '@workspace/api-server', 'run', 'build'], {
  stdio: 'inherit',
  shell: true,
  cwd: rootDir
}).on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ [System] API Build failed with code ${code}`);
    process.exit(1);
  }

  // Start API Server
  const apiServer = spawn('node', ['artifacts/api-server/dist/index.mjs'], {
    stdio: 'inherit',
    shell: true,
    cwd: rootDir,
    env
  });

  console.log("🚀 [System] API Server starting on port 8080...");

  // Wait for backend to initialize
  setTimeout(() => {
    console.log("🚀 [System] Starting Vite Frontend on port 3000...");
    const frontend = spawn('pnpm', ['--filter', '@workspace/vid-master', 'run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      cwd: rootDir,
      env: {
        ...process.env,
        PORT: '3000',
        VITE_API_URL: 'http://localhost:8080'
      }
    });

    frontend.on('exit', (code) => {
      console.log(`❌ [System] Frontend exited with code ${code}.`);
    });

    process.on('SIGINT', () => {
      apiServer.kill();
      frontend.kill();
      process.exit();
    });
  }, 2000);

  apiServer.on('exit', (code) => {
    console.log(`❌ [System] API Server exited with code ${code}.`);
  });
});
