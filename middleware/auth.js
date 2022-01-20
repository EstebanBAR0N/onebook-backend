const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // récupère le token de la requête
        const token = req.headers.authorization.split(' ')[1];

        // vérifie le token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

        // récupère l'ID du user via le token
        const userId = decodedToken.userId;

        // syntaxe { userId } <=> { userId: userId }
        // passé dans le next(), permet de connaître l'id du user
        req.auth = { userId };
        
        // vérifie le userId si il y en a un passé dans le body
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: 'Invalid request!'
        })
    }
};