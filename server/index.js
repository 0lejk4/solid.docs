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
});

process.on('unhandledRejection', (err) => {
    console.err('UNHANDLED', err);
});

process.on('uncaughtException', (err) => {
    console.err('UNHANDLED', err);
});