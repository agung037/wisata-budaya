const JWT = require('@hapi/jwt');

const createToken = (user) => {
  return JWT.token.generate(
    {
      aud: 'wisata-budaya-audience',
      iss: 'wisata-budaya-api',
      id: user.id,
      email: user.email,
      name: user.name
    },
    {
      key: 'rahasia-jwt-wisata-budaya', // Ganti dengan secret key yang lebih aman
      algorithm: 'HS256'
    },
    {
      ttlSec: 14 * 24 * 60 * 60 // Token berlaku 14 hari
    }
  );
};

const registerJwtMethods = (server) => {
  server.method('createToken', createToken);
};

module.exports = {
  registerJwtMethods
}; 