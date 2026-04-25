const rateLimit = require('express-rate-limit');
const { registerAuditEvent } = require('../utils/audit');

//limita por IP un max de 5 intentos en 5min, si lo excede presenta mensaje
const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    message: 'Demasiados intentos. Intenta nuevamente en 5 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res, _next, options) => {
    try {
      await registerAuditEvent({
        eventType: 'LOGIN_FAILED',
        route: req.originalUrl,
        method: req.method,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        statusCode: options.statusCode,
        details: {
          reason: 'rate_limit_exceeded',
          rate_limit_triggered: true,
          identifier: req.body?.identifier || null
        }
      });
    } catch (error) {
      console.error('Error registrando rate limit de login:', error);
    }

    return res.status(options.statusCode).json(options.message);
  }
});

module.exports = {
  loginRateLimiter
};
