app.controller('MainController', [
    '$scope', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$mdToast', 'Connectors',

    function ( $scope, $mdSidenav, $mdBottomSheet, $log, $q, $mdToast, Connectors ) {

        $scope.list1 = [];

        $scope.selectConnector = function(connector) {
            $scope.connector = connector;
        };

        Connectors.connectorsReady.then(function(connectors) {
            $scope.list1 = connectors;
            $scope.selectConnector(connectors[0]);
        })

    }
]);
