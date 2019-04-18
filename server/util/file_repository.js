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
        const path = join(__dirname, '..', 'data', user, name);
        await fs.access(path, constants.F_OK | constants.W_OK);
        return fs.writeFile(path, data);
    },
    upsertStream: async (name, user) => {
        const path = join(__dirname, '..', 'data', user, name);
        await fs.access(path, constants.F_OK | constants.W_OK);
        return createWriteStream(path);    
    },
    createContent: async (name, user, data) => {
        const path = join(__dirname, '..', 'data', user, name);
        
        try {
            await fs.access(path, constants.F_OK);
            throw new Error('cannot Create file, it already exists');
        } catch (err) {
            if (err.code === 'ENOENT') {
                return fs.writeFile(path, data);
            }
            throw err;
        }
    },
    createStream: async (name, user) => {
        const path = join(__dirname, '..', 'data', user, name);
        
        try {
            await fs.access(path, constants.F_OK);
            throw new Error('cannot Create file, it already exists');
        } catch (err) {
            if (err.code === 'ENOENT') {
                return createWriteStream(path);
            }
            throw err;
        }
    },
    deleteFile: (name, user) => {
        const file = join(__dirname, '..', 'data', user, name); 
        return fs.unlink(file);
    },
};
