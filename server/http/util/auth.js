const decode = require('../../util/auth');

module.exports = async (req, res, next) => {

    try {

        const token = req.headers['authentication'];
    
        if (!token) {
            throw new Error('Authentification error');
        }
        
        const { username: user } = await decode(token);
        
        if (!user) {
            throw new Error('Authentification error');
        }
    
        req.user = user;
        return next();
    } catch (err) {
        res.statusCode = 401;
        res.end(JSON.stringify({ message: err.message }));
    }
};