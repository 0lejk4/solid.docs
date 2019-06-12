const { createContent, createStream, getContent, getStream, upsertContent, upsertStream, deleteFile } = require('../util/file_repository');
const { join } = require('path');

const DefaultHandler = {
  CREATE: {
    handle: async (cmd) => {
      console.log(cmd);

      const path = join(cmd.username, cmd.filename);
      const stream = await createStream(path);

      const tmpPath = join('tmp', cmd.filename);
      (await getStream(tmpPath)).pipe(stream);
      await deleteFile(tmpPath);
    },
  },
  GET: {
    handle: async (cmd) => {
      console.log(cmd);

      const path = join(cmd.username, cmd.filename);
      const stream = await getStream(path);

      return stream;
    },
  },
  DELETE: {
    handle: (cmd) => {
      console.log(cmd);

      const path = join(cmd.username, cmd.filename);
      return deleteFile(path);
    },
  },
  DOC: {
    handle: function(cmd, handler) {
      console.log(cmd);
      if (cmd.fromAction) {
        return handler[cmd.fromAction].doc;
      }
      return handler.doc;
    }
  },
  doc: 'Default doce',
};

module.exports = DefaultHandler;
