const jwt = require("jsonwebtoken");

function authorizationMiddleware(req, res, next) {
    const token = req.header('x-access-token');
    if (!token) {
        return res.status(401).json({ error: 'Authentication required'});
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = authorizationMiddleware;