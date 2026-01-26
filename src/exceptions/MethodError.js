const ClientError = require('./ClientError');

class MethodError extends ClientError {
    constructor(message) {
        super(message, 405);
        this.name = 'MethodNotAllowed';
    }
}

module.exports = MethodError;
