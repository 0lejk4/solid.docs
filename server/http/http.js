const polka = require('polka');
const routes = require('./modules/routes');

module.exports = class RestServer {
  constructor(port, handler) {
    this.port = port;
    // this.handler = handler;
    this.server = polka();
  }
  start() {
    return new Promise((res, rej) => {
      routes(this.server);
      this.server.listen(this.port, (e) => {
        if (e) rej(e);
        else res();
      });
    });
  }
  stop() {
    return new Promise((res, rej) => {
      this.server.close((e) => {
        if (e) rej(e);
        else res();
      });
    });
  }
};
