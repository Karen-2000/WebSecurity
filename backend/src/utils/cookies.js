const ONE_HOUR_IN_MS = 60 * 60 * 1000;

const buildAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge: ONE_HOUR_IN_MS,
    path: '/'
  };
};

module.exports = {
  buildAuthCookieOptions
};
