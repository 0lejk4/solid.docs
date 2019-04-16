const { promises: fs, createReadStream, createWriteStream, constants } = require('fs');
const { join } = require('path');

module.exports = {
  deleteFile: (name, user = '') => {
    const file = join(__dirname, '..', 'data', user, name); 
    return fs.unlink(file);
  },
  getFileStream: async (name, user = '') => {
    const file = join(__dirname, '..', 'data', user, name); 
    await fs.access(file, constants.F_OK | constants.R_OK);
    return createReadStream(file);
  },
  createFileStream: (name, user = '') => {
    const path = join(__dirname, '..', '..', 'data', user, name);
    return createWriteStream(path);
  },
};
