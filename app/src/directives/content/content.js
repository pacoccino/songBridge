angular.module('App')
.directive('content', function() {

  return {
        restrict: 'E',
        templateUrl: "src/directives/content/content.html",
        scope: {
        },
        link: function (scope, element) {
        }
      };
    }
);
