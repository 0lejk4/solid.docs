const { createContent, createStream, getContent, getStream, upsertContent, upsertStream, deleteFile } = require('../../util/file_repository');
const { join } = require('path');

const Default = require('../default')

const HoconHandler = Object.assign({}, Default, {
  LENGTH: {
    handle: async (cmd) => {
      console.log(cmd);

      const path = join(cmd.username, cmd.filename);
      const buffer = await getContent(path);

      return buffer.length;
    },
  },
});

module.exports = HoconHandler;
