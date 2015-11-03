var Errors = {};

Errors.UNKNOWN = { code: 500, message:  "Unkown error" };
Errors.UNKNOWN_SERVICE = { code: 400, message:  "Unkown music service" };
Errors.AUTH_STATE_MISMATCH = { code: 400, message:  "Authentication state mismatch" };

Errors.sendError = function(res, errorId) {

    var error = Errors[errorId];
    if(!error) {
        error = Errors['UNKNOWN'];
    }

    res.status(error.code).send(error.message);
};

module.exports = Errors;