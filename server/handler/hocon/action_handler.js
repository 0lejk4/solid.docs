const { createContent, createStream, getContent, getStream, upsertContent, upsertStream, deleteFile } = require('../../util/file_repository');
const { join } = require('path');

const HoconHandler = {
    'CREATE': {
        handle: async (cmd) => {
            console.log(cmd)

            const path = join(cmd.username, cmd.filename);
            const stream = await createStream(path);

            const tmpPath = join('tmp', cmd.filename);
            (await getStream(tmpPath)).pipe(stream);
        }
    },
    'LENGTH': {
        handle: async (cmd) => {
            console.log(cmd);

            const path = join(cmd.username, cmd.filename);
            const buffer = await getContent(path);

            return buffer.length;
        }
    }
};

module.exports = HoconHandler;