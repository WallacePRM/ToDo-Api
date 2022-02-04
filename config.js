
exports.getJwtSecret = () => {

    return process.env.SECRET || 'minhachavejwt';
}

exports.getEmailUser = () => {

    return process.env.EMAIL_USER;
}

exports.getEmailPassword = () => {

    return process.env.EMAIL_PASSWORD;
}