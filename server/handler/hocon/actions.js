const { getContent } = require('../../util/file_repository');
const { join } = require('path');

const HoconActions = {
  LENGTH: {
    handle: async (cmd) => {
      console.log(cmd);

      const path = join(cmd.username, cmd.filename);
      const buffer = await getContent(path);

      return buffer.length;
    },
    doc: {
      description: 'Get length of HOCON file',
      cmd: {
        username: 'String',
        filename: 'String',
      },
    },
  },
};

module.exports = HoconActions;
