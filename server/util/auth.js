const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = process.env;

// exports.sign = (username) => {
//     return new Promise((res, rej) => {
//         jwt.sign({ username }, JWT_SECRET_KEY, {
//             algorithm: 'HS256',
//             expiresIn: '14d'
//         }, (err, token) => {
//             if (err) rej(err);
//             res(token);
//         });
//     });
// };

module.exports = (token) => {
    return new Promise((result, reject) => {
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) return reject(err);
            return result(decoded);
        });
    });
};