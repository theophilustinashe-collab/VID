@echo off
set PORT=8080
set DATABASE_URL=postgresql://neondb_owner:npg_V9WkaUpbT7Gq@ep-icy-hat-adekz7qm.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
set SESSION_SECRET=supersecret
set NODE_ENV=development
node artifacts/api-server/dist/index.mjs
