const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = process.env;

module.exports = (token) => {
  return new Promise((result, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) return reject(err);
      return result(decoded);
    });
  });
};
