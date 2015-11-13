app.service('Connectors', function($http, Backend) {

    var _connectors = [];

    var getConnectors = function() {
        var request = {
            url: Backend.apiUrl + "connectors"
        };

        $http(request).then(function(data) {
            _connectors = data;
        });
    };

    getConnectors();

    return {
        getConnectors: getConnectors,
        connectors: _connectors
    };
});
