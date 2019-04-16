'use strict';

require('dotenv').config();

const app = require('polka')();

const port = process.env.PORT; 

if (!port) {
    console.error('port is not configured');
    process.exit(1);
}

app.listen(port, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Running server at http://0.0.0.0:${port}`)
});

const Http = require('./http/http');

process.on('unhandledRejection', (err) => {
    console.err('UNHANDLED', err);
});

const routes = require('./http/modules/routes');
const http = new Http(port, routes);

(async () => {
    await http.start();
})();


process.on('uncaughtException', (err) => {
    console.err('UNHANDLED', err);
});
