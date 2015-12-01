var Errors = {};

Errors.UNKNOWN = { code: 500, message:  "Unkown error" };
Errors.UNKNOWN_SERVICE = { code: 400, message:  "Unkown music service" };
Errors.NO_SERVICE_SPECIFIED = { code: 400, message:  "Please specify a service" };
Errors.AUTH_STATE_MISMATCH = { code: 400, message:  "Authentication state mismatch" };
Errors.AUTH_ERROR = { code: 400, message:  "Authentication error" };
Errors.AUTH_NOT_CONNECTED = { code: 401, message:  "Not connected" };

Errors.sendError = function(res, errorId, exception) {

    var error = Errors[errorId];
    if(!error) {
        error = Errors['UNKNOWN'];
    }

    var message = error.message;

    if(exception) {
        message += " : " + exception.toString();
    }

    res.status(error.code).send(message);
};

module.exports = Errors;