const { promises: fs, createReadStream, constants } = require('fs');
const { join } = require('path');

module.exports = {
  deleteFile: (name) => {
    const file = join(__dirname, '..', 'data', name); 
    return fs.unlink(file);
  },
  getFileStream: async (name) => {
    const file = join(__dirname, '..', 'data', name); 
    await fs.access(file, constants.F_OK | constants.R_OK);
    return createReadStream(file);
  },
};