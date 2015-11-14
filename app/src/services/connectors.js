app.service('Connectors', function($http, $q, Backend, Connector) {

    var _connectors = [];
    var _connectorsReadyDefer = $q.defer();

    var getConnectors = function() {
        var request = {
            url: Backend.apiUrl + "connectors"
        };

        $http(request).then(function(data) {
            var connectorsInfo = data.data;
            angular.forEach(connectorsInfo, function(connectorInfo) {
                var connector = new Connector(connectorInfo);
                connector.getUserInfo();
                _connectors.push(connector);
            });
            _connectorsReadyDefer.resolve(_connectors);
        });
    };

    getConnectors();

    return {
        getConnectors: getConnectors,
        connectors: _connectors,
        connectorsReady: _connectorsReadyDefer.promise
    };
});
