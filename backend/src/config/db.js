import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      console.log('POSTGRESQL CONNECTED!');
    } finally {
      client.release();
    }
  } catch (err) {
    console.log('DATABASE CONNECTION FAILED: ', err);
  }
};

export const query = (text, params) => {
  return pool.query(text, params);
};