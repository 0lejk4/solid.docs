const { promises: fs, createReadStream, createWriteStream, constants } = require('fs');
const { join } = require('path');

module.exports = {
    getStream: async (name, user) => {
        const path = join(__dirname, '..', 'data', user, name); 
        await fs.access(path, constants.F_OK | constants.R_OK);
        return createReadStream(path);
    },
    getContent: async (name, user) => {
        const path = join(__dirname, '..', 'data', user, name); 
        await fs.access(path, constants.F_OK | constants.R_OK);
        return fs.readFile(path);    
    },
    upsertContent: async (name, user, data) => {
        const path = join(__dirname, '..', '..', 'data', user, name);
        await fs.access(path, constants.F_OK | constants.W_OK);
        return fs.writeFile(path, data);
    },
    upsertStream: async (name, user) => {
        const path = join(__dirname, '..', '..', 'data', user, name);
        await fs.access(path, constants.F_OK | constants.W_OK);
        return createWriteStream(path);    
    },
    createContent: async (name, data) => {
        const path = join(__dirname, '..', '..', 'data', user, name);
        const exists = await fs.access(path, constants.F_OK).catch({});
        if (exists) {
            throw new Error('cannot Create file, it already exists');
        }
        return fs.writeFile(path, data);
    },
    createStream: async (name, user) => {
        // const path = join(__dirname, '..', '..', 'data', user, name);
        // const exists = await fs.access(path, constants.F_OK).catch(() => {});
        // if (exists) {
        //     throw new Error('cannot Create file, it already exists');
        // }
        // return createWriteStream(path);    

        const path = join(__dirname, '..', '..', 'data', user, name);
        
        try {
            await fs.access(path, constants.F_OK);
            throw new Error('cannot Create file, it already exists');
        } catch (err) {
            console.log(err.code);
            if (err.code === 'ENOENT') {
                return createWriteStream(path);
            }
        }
    },
    deleteFile: (name, user) => {
        const file = join(__dirname, '..', 'data', user, name); 
        return fs.unlink(file);
    },
};
