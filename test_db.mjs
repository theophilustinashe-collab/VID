import pg from 'pg';
const { Pool } = pg;
const connectionString = 'postgresql://neondb_owner:npg_V9WkaUpbT7Gq@ep-icy-hat-adekz7qm.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({ connectionString });

async function test() {
  try {
    const client = await pool.connect();
    console.log('Connected successfully to the database');
    const res = await client.query('SELECT NOW()');
    console.log('Database time:', res.rows[0]);
    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

test();
