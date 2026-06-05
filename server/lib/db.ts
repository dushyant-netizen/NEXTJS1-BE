// lib/db.ts
import { Pool } from 'pg';

// Ensure your .env file has a DATABASE_URL set
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export { pool };