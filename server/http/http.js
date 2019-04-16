const polka = require('polka');

module.exports = class RestServer {
  constructor(port, routes) {
    this.port = port;
    this.routes = routes;
    this.server = polka();
  }
  start() {
    return new Promise((res, rej) => {
      this.routes(this.server);
      this.server.listen(this.port, (e) => {
        if (e) rej(e);
        else {
          console.log(`Http interface is successully running on ${this.port} port`);
          res();
        };
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
