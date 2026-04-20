const jwt = require('jsonwebtoken');

const JWT_ALGORITHM = 'HS256';
const JWT_ISSUER = 'websecurity-backend';
const JWT_AUDIENCE = 'websecurity-frontend';

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: [JWT_ALGORITHM],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  });
};

module.exports = {
  generateToken,
  verifyToken
};
