require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const protectedRoutes = require('./middlewares/protected.routes');
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const usersRoutes = require('./routes/users.routes');
const rolesRoutes = require('./routes/roles.routes');
const auditRoutes = require('./routes/audit.routes');

const app = express();

app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      baseUri: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"]
    }
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  referrerPolicy: { policy: 'no-referrer' },
  hsts: process.env.NODE_ENV === 'production'
    ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    : false
}));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Backend funcionando correctamente'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/audit-logs', auditRoutes);

module.exports = app;
