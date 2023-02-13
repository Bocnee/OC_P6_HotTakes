// Middelware pour le TOKEN
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
//      On vient splitter le token dans le header, pour enlever le Baerer
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'TOKEN_RANDOM');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};