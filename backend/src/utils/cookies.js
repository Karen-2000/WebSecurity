const ONE_HOUR_IN_MS = 60 * 60 * 1000;
const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

const buildCookieBaseOptions = (maxAge) => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge,
    path: '/'
  };
};

const buildAuthCookieOptions = () => buildCookieBaseOptions(ONE_HOUR_IN_MS);

const buildActivityCookieOptions = () => buildCookieBaseOptions(FIVE_MINUTES_IN_MS);

module.exports = {
  buildAuthCookieOptions,
  buildActivityCookieOptions
};
