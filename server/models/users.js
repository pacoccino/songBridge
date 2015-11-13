var User = require('./user');
var _ = require('lodash');

function Users() {
    this.users = [];
}

Users.prototype.create = function(cb) {
    var user = new User();

    this.users.push(user);

    cb && cb(user);

    return user;
};


Users.prototype.delete = function(userId, cb) {
    if(!userId) return;

    var userIndex = _.findIndex(this.users, {_id: userId});
    if(userIndex !== -1)
        this.users.splice(userIndex, 1);

    cb && cb();
};

Users.prototype.getById = function(userId, cb) {
    if(!userId) return;

    var user = _.find(this.users, {_id: userId});

    cb && cb(user);
    return user;
};


module.exports = Users;
