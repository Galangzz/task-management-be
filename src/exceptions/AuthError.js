const ClientError = require('./ClientError');

class AuthError extends ClientError {
    constructor(message) {
        super(message);
        this.name = 'Unauthorized';
        this.statusCode = 401;
    }
}

module.exports = AuthError;
