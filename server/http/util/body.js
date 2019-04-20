module.exports = async (req, res, next) => {
    
    let body = '';
    req.on('data', (chunck) => { body += chunck });

    await new Promise((resolve, reject) => {
        req.on('end', resolve);
        req.on('error', reject);
    });

    req.body = JSON.parse(body);
    return next();
};
