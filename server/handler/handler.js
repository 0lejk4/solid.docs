class HandlerManager {
  constructor(handlers) {
    this.handlers = handlers;
  }

  handle(cmd) {
    const { type, action } = cmd;
    const typeHandler = this.handlers[type];
    if (!typeHandler) throw new Error('No type handler');
    const cmdHandler = typeHandler[action];
    if (!cmdHandler) throw new Error('No cmd handler');
    return cmdHandler.handle(cmd);
  }
}

const HOCON = require('./hocon/handler');
const PNG = require('./png/handler');

module.exports = new HandlerManager({
  HOCON,
  PNG,
});
