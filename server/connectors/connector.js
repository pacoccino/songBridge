var Connector = function() {

};

Connector.infos = {
    name: 'undefined'
};

// todo inheritance
Connector.getPublicInfo = function() {
    return this.infos;
};

module.exports = Connector;