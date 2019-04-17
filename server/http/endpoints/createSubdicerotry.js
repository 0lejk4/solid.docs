const { SYSTEM_TOKEN } = process.env;
const { mkdir } = require('fs').promises;
const { join } = require('path');

const usernameReg = /^\w+$/g;

module.exports = (app) => {
  app.post('/createsubdir', async (req, res) => {
    try {
      let body = '';
      req.on('data', (chunck) => body += chunck);

      await new Promise((res, rej) => {
        req.on('end', res);
        req.on('err', rej);
      });

      const { username } = JSON.parse(body);

      if (req.query.systemToken != SYSTEM_TOKEN) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: '`systemToken` required' }));
      }

      if (!username || !usernameReg.test(username)) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'Username is not valid' }));
      }

      const path = join(__dirname, '..', '..', 'data', username);
      await mkdir(path, { recursive: true });

      res.statusCode = 201;
      return res.end();
    } catch (err) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: err.message }));
    }
  });
};
