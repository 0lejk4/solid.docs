

require('dotenv').config();

const port = process.env.PORT;

if (!port) {
  console.error('port is not configured');
  process.exit(1);
}

const Http = require('./http/http');

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED', err);
});

process.on('uncaughtException', (err) => {
  console.error('UNHANDLED', err);
});

const routes = require('./http/modules/routes');

const http = new Http(port, routes);

(async () => {
  await http.start();
})();
