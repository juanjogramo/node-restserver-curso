const jwt = require('jsonwebtoken');

/// Verify Token
let verifyToken = (req, res, next) => {
    let authorization = req.get('Authorization');

    jwt.verify(authorization, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                errorCode: 401,
                message: err.message
            });
        }

        req.user = decoded.user;
        next();
    });
};

/// Verify Admin Role

let verifyRole = (req, res, next) => {
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            status: 'failure',
            message: 'The user is not an administrator'
        })
    }

};

module.exports = {
    verifyToken,
    verifyRole
}