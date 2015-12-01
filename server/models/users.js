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

Users.prototype.createDebug = function(cb) {
    var user = this.create();
    user._id = 1;
    user.setConnection(
        {
            infos : { serviceId: 'spotify'}
        },
        {"access_token":"BQA5nJE0LyZyvhokO45vcfsNT_0WaqP5OjeN8uyBMBwaghfOgH50R7qVg2lYv6SHsoV0MSTr9Gwd_hk3e4UE3g_vEIzda8fjCw_1K656prce7Z6giCtgfgXDJx425R0P0U0XNy5nicqiosXHu9ezf44_","refresh_token":"AQDFOUiLtLtf5ZFGZb2WUGn6ysmSzahEDUyiQIcgzFJOVhVeUqH7E9LYP7stFNVW-04znyjBqDpw9OrM8eSF28GqGs2BWT3OplkjYgy0WatWkg_EuEnSpb7JGHMQKyt7csY"}
    );

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
