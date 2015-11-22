app.directive('serviceDashboard', function() {

    return {
        restrict: 'E',
        templateUrl: 'src/directives/serviceDashboard/serviceDashboard.html',
        controller: function($scope, $mdDialog) {

            $scope.showAdvanced = function(ev) {
                $mdDialog.show({
                        controller: ServiceDetailsCtrl,
                        templateUrl: 'src/modals/ServiceDetailsCtrl.tmpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    })
                    .then(function() {
                    }, function() {
                    });
            };
        }
    }
});