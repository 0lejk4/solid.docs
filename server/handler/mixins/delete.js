const { deleteFile } = require('../../util/file_repository');
const { join } = require('path');

const DeleteMixin = {
  DELETE: {
    handle: (cmd) => {
      console.log(cmd);

      const path = join(cmd.username, cmd.filename);
      return deleteFile(path);
    },
    doc: 'Delete action',
  },
};

module.exports = DeleteMixin;
