app.directive('login', function( $window  ) {

  return {
        restrict: 'E',
        templateUrl: "src/directives/login/login.html",
        scope: {
            connector: '='
        },
        link: function (scope, element) {
          scope.actLogin = function() {
              scope.connector.goToLogin();
          };
        }
      };
    }
);
