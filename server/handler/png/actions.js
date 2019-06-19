const { getContent, getStream } = require('../../util/file_repository');
const { join } = require('path');
const sharp = require('sharp');

const PngActions = {
  SIZE: {
    handle: async (cmd) => {
      console.log(cmd);

      const path = join(cmd.username, cmd.filename);
      const buffer = await getContent(path);
      const metadata = await sharp(buffer).metadata();

      return { width: metadata.width, height: metadata.height };
    },
    doc: {
      description: 'Get PNG image size',
      cmd: {
        username: 'String',
        filename: 'String',
      },
    },
  },
  RESIZE: {
    handle: async (cmd) => {
      console.log(cmd);

      const { width, height } = cmd.payload;
      const resizer = sharp().resize(width, height);

      const path = join(cmd.username, cmd.filename);
      const stream = await getStream(path);

      return stream.pipe(resizer);
    },
    doc: {
      description: 'Resize PNG image',
      cmd: {
        username: 'String',
        filename: 'String',
        payload: {
          width: 'Int',
          height: 'Int',
        }
      },
    },
  },
};

module.exports = PngActions;
