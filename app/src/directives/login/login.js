angular.module('App')
.directive('login', function( $window, spotify ) {

  return {
        restrict: 'E',
        templateUrl: "src/directives/login/login.html",
        scope: {
        },
        link: function (scope, element) {
          scope.actLogin = function() {
            $window.location.href = spotify.getAuthUrl();
          };
        }
      };
    }
);
