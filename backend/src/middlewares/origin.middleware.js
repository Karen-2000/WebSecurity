const allowedOrigin = process.env.FRONTEND_URL;
const { registerAuditEvent } = require('../utils/audit');

const registerAccessDenied = async (req, details) => {
  try {
    await registerAuditEvent({
      userId: req.user?.id || null,
      eventType: 'ACCESS_DENIED',
      route: req.originalUrl,
      method: req.method,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      statusCode: 403,
      details
    });
  } catch (error) {
    console.error('Error registrando acceso denegado:', error);
  }
};

const isAllowedReferer = (referer) => (
  allowedOrigin && (referer === allowedOrigin || referer.startsWith(`${allowedOrigin}/`))
);

const validateOrigin = async (req, res, next) => {
  const origin = req.get('origin');
  const referer = req.get('referer');

  if (origin) {
    if (origin !== allowedOrigin) {
      await registerAccessDenied(req, {
        reason: 'invalid_origin',
        origin,
        allowed_origin: allowedOrigin || null
      });

      return res.status(403).json({
        message: 'Origen no permitido'
      });
    }

    return next();
  }

  if (referer) {
    if (!isAllowedReferer(referer)) {
      await registerAccessDenied(req, {
        reason: 'invalid_referer',
        referer,
        allowed_origin: allowedOrigin || null
      });

      return res.status(403).json({
        message: 'Referer no permitido'
      });
    }

    return next();
  }

  await registerAccessDenied(req, {
    reason: 'missing_origin_or_referer',
    allowed_origin: allowedOrigin || null
  });

  return res.status(403).json({
    message: 'Se requiere Origin o Referer valido'
  });
};

module.exports = {
  validateOrigin
};
