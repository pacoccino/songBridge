app.directive('platformMenu', function() {

    return {
        restrict: 'E',
        templateUrl: 'src/directives/platformMenu/platformMenu.html',
        controller: function($scope, $location) {

            $scope.goHome = function() {
                $location.path('/boby');
            };
        }
    }
});