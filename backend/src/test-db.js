const pool = require('./config/db');

async function test() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa:', result.rows);
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

test().finally(() => pool.end());
