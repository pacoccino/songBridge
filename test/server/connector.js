var Connector = require('server/connectors/connector');

var connector;

describe('Connector', function() {
    beforeEach(function() {
        connector = new Connector();
    });

    it('creates', function() {
        expect(connector).not.to.be.null;
    });

    it('get public', function() {
        var infos = Connector.getPublicInfo();
        expect(infos.name).to.equal('undefined');
    });
});