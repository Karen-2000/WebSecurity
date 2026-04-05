const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const parseBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

const isSupabaseHost = (host) => typeof host === 'string' && host.includes('supabase.co');

const buildPoolConfig = () => {
  const connectionString = process.env.DATABASE_URL || process.env.DB_URL;
  const host = process.env.DB_HOST;
  const useSsl = parseBoolean(
    process.env.DB_SSL,
    Boolean(connectionString) || isSupabaseHost(host)
  );

  const baseConfig = {
    max: Number(process.env.DB_POOL_MAX || 10),
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 10000),
    connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 10000)
  };

  if (connectionString) {
    return {
      ...baseConfig,
      connectionString,
      ssl: useSsl
        ? {
            rejectUnauthorized: false
          }
        : false
    };
  }

  return {
    ...baseConfig,
    host,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: useSsl
      ? {
          rejectUnauthorized: false
        }
      : false
  };
};

const pool = new Pool(buildPoolConfig());

pool.on('error', (error) => {
  console.error('Database pool error:', error.message);
});

pool.testConnection = async () => {
  const result = await pool.query('SELECT NOW() AS now');
  return result.rows[0];
};

module.exports = pool;
