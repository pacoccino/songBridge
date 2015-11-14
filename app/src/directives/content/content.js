app.directive('content', function() {

  return {
        restrict: 'E',
        templateUrl: "src/directives/content/content.html",
        scope: {
            connector: '='
        },
        link: function (scope, element) {
            scope.connect = function() {
                scope.connector.connect();
            };

            scope.disconnect = function() {
                scope.connector.disconnect();
            };
        }
      };
    }
);
