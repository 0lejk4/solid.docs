const { createStream, getStream, deleteFile } = require('../../util/file_repository');
const { join } = require('path');

const CreateMixin = {
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
};

module.exports = CreateMixin;
