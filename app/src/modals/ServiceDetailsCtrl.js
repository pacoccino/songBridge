function ServiceDetailsCtrl($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.connect = function() {
        $scope.service = {
            connected: true
        };
    };
}