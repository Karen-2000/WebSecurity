require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Backend funcionando correctamente'
  });
});



module.exports = app;