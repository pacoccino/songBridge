app.controller('MainController', [
    '$scope', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$mdToast', 'Spotify', 'Deezer',

    function ( $scope, $mdSidenav, $mdBottomSheet, $log, $q, $mdToast, Spotify, Deezer ) {

        $scope.list1 = [
            {
                name: 'Spotify',
                connector: Spotify
            },
            {
                name: 'Deezer',
                connector: Deezer
            }
        ];

        $scope.selectConnector = function(element) {
            $scope.connector = element.connector;
        };

        $scope.selectConnector($scope.list1[0]);
    }
]);
