const allowedOrigin = process.env.FRONTEND_URL;

const isAllowedReferer = (referer) => (
  referer === allowedOrigin || referer.startsWith(`${allowedOrigin}/`)
);

const validateOrigin = (req, res, next) => {
  const origin = req.get('origin');
  const referer = req.get('referer');

  if (origin) {
    if (origin !== allowedOrigin) {
      return res.status(403).json({
        message: 'Origen no permitido'
      });
    }

    return next();
  }

  if (referer) {
    if (!isAllowedReferer(referer)) {
      return res.status(403).json({
        message: 'Referer no permitido'
      });
    }

    return next();
  }

  return res.status(403).json({
    message: 'Se requiere Origin o Referer valido'
  });
};

module.exports = {
  validateOrigin
};
