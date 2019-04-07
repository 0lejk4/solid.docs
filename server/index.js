'use strict';

require('dotenv').config();

const port = process.env.PORT;

if (!port) {
  console.error('port is not configured');
  process.exit(1);
}

// process.on('unhandledRejection', (err) => {
//     console.err('UNHANDLED', err);
// });

// process.on('uncaughtException', (err) => {
//     console.err('UNHANDLED', err);
// });

const Http = require('./http/http');

const http = new Http(port);

(async () => {
  await http.start();
})();
