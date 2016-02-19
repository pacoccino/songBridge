var User = require('./user');
var _ = require('lodash');

function Users() {
    this.users = [];
}

Users.prototype.create = function() {
    var user = new User();

    this.users.push(user);

    return user;
};

Users.prototype.delete = function(userId) {
    if(!userId) return;

    var userIndex = _.findIndex(this.users, {_id: userId});
    if(userIndex !== -1)
        this.users.splice(userIndex, 1);
};

Users.prototype.getById = function(userId, serviceId) {
    if(!userId) return;

    var user;

    if(!serviceId) {
        user = _.find(this.users, function(user) {
            return (user._id.toString() === userId);
        });
    }
    else {
        user = _.find(this.users, function(user) {
            var serviceConnection = user.getConnection(serviceId);

            return (serviceConnection && serviceConnection.userId == userId);
        });
    }

    return user;
};

Users.prototype.findOrCreate = function(userId, serviceId) {

    var user = this.getById(userId, serviceId);

    if(!user) {
        return this.create();
    }

    return user;
};

module.exports = Users;
