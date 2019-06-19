const { getStream } = require('../../util/file_repository');
const { join } = require('path');

const GetMixin = {
  GET: {
    handle: async (cmd) => {
      console.log(cmd);

      const path = join(cmd.username, cmd.filename);
      const stream = await getStream(path);

      return stream;
    },
    doc: 'Get action',
  },
};

module.exports = GetMixin;
