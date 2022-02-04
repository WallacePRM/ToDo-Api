const jwt = require('jsonwebtoken');
const config = require('../config');

exports.makeToken = (data) => {

    const token = jwt.sign(data, config.getJwtSecret());

    return token;
};

exports.parseToken = (token) => {

    const data = jwt.verify(token, config.getJwtSecret());

    return data;
};

exports.generateToken = (userId) => {

    return this.makeToken({
        userId: userId
    });

};

exports.getToken = (req) => {

    let token = req.headers.authorization;
    token = token || req.cookies.authorization;

    if (!token)
        token = req.query.token;

    if (token)
        token = token.replace('Bearer ', '');

    return token;
};

exports.verifyUserFromToken = (req, res) => {

    try {
        const token = this.getToken(req);

        return this.parseToken(token);
    }
    catch(error) {

        res.status(422).send({message: 'Token inválido'});

        console.error(error);
    }
};