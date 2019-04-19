const { promises: fs, createReadStream, createWriteStream, constants } = require('fs');
const { join } = require('path');

module.exports = {
  getStream: async (path) => {
    const fullpath = join(__dirname, '..', 'data', path);
    await fs.access(fullpath, constants.F_OK | constants.R_OK);
    return createReadStream(fullpath);
  },
  getContent: async (path) => {
    const fullpath = join(__dirname, '..', 'data', path);
    await fs.access(fullpath, constants.F_OK | constants.R_OK);
    return fs.readFile(fullpath);
  },
  upsertContent: async (path, content) => {
    const fullpath = join(__dirname, '..', 'data', path);
    await fs.access(fullpath, constants.F_OK | constants.W_OK);
    return fs.writeFile(fullpath, content);
  },
  upsertStream: async (path) => {
    const fullpath = join(__dirname, '..', 'data', path);
    await fs.access(fullpath, constants.F_OK | constants.W_OK);
    return createWriteStream(fullpath);
  },
  createContent: async (path, content) => {
    const fullpath = join(__dirname, '..', 'data', path);

    try {
      await fs.access(fullpath, constants.F_OK);
      throw new Error('cannot Create file, it already exists');
    } catch (err) {
      if (err.code === 'ENOENT') {
        return fs.writeFile(fullpath, content);
      }
      throw err;
    }
  },
  createStream: async (path) => {
    const fullpath = join(__dirname, '..', 'data', path);

    try {
      await fs.access(fullpath, constants.F_OK);
      throw new Error('cannot Create file, it already exists');
    } catch (err) {
      if (err.code === 'ENOENT') {
        return createWriteStream(fullpath);
      }
      throw err;
    }
  },
  deleteFile: (path) => {
    const file = join(__dirname, '..', 'data', path);
    return fs.unlink(file);
  },
};
