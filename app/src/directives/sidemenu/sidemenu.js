angular.module('App')
.directive('sidemenu', function() {
  var nbMenu = 0;
  return {
        restrict: 'E',
        templateUrl: "src/directives/sidemenu/sidemenu.html",
        scope: {
          list: '=',
          title: '@'
        },
        link: function (scope, element) {

          scope.menuId = nbMenu;
          nbMenu++;

          scope.menuPosition = 'left';
          scope.selected = null;

          scope.select = function(element) {
            scope.selected = element;
          };

        }
      };
    }
);
