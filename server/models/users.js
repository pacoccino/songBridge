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
        {"access_token":"BQB2fy2QJPIBUIjX3dN8lXzVeMcohr9xzgl2HBp-Ht8_mnWdVQ_vonCimfxXM-d-pk6Pkrnchf-nrKDb9A3CrigZJHOwtFj_EDLh3vVnwRJlAxuY9lRV-glzv62K5VwQ7kWhYsR3b5kWZH_p8mCVy5oO","refresh_token":"AQBdDs0bvGFTwX4VTZRniS_nXMkf4Srsz49xy-umX7f9sukJylU1P3KPDP6JiNi2LNwffdWbREaVzZQ6VitlcFIvB3mf0-Ui402gSbb_DPdA4p_r8n-DfnP2MZSHIrJ-Iwg"}
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
