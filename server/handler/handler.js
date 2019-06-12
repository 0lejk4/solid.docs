const { createContent, createStream, getContent, getStream, upsertContent, upsertStream, deleteFile } = require('../util/file_repository.js');

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
    return cmdHandler.handle(cmd, typeHandler);
  }
}

const HOCON = require('./hocon/action_handler');

module.exports = new HandlerManager({
  HOCON,
});
