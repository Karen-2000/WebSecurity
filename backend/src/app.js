const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const pool = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Backend funcionando correctamente'
  });
});

app.get('/api/health/db', async (_req, res) => {
  try {
    const result = await pool.testConnection();

    res.status(200).json({
      ok: true,
      message: 'Conexion a base de datos funcionando',
      serverTime: result.now
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: 'No se pudo conectar a la base de datos',
      error: error.message,
      code: error.code || null
    });
  }
});

module.exports = app;
