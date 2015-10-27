var Errors = {};

Errors.UNKNOWN = { code: 500, message:  "Unkown error" };
Errors.UNKNOWN_SERVICE = { code: 400, message:  "Unkown music service" };

Errors.sendError = function(res, error) {
    var error = Errors[error];
    if(!error) {
        error = Errors['UNKNOWN'];
    }

    res.status(error.code).send(error.message);
};

module.exports = Errors;