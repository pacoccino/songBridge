app.directive('sidemenu', function() {
        var nbMenu = 0;

        return {
            restrict: 'E',
            templateUrl: "src/directives/sidemenu/sidemenu.html",
            scope: {
                list: '=',
                title: '@',
                onSelect:'&'
            },
            link: function (scope, element) {

                scope.menuId = nbMenu;
                nbMenu++;

                scope.menuPosition = 'left';
                scope.selected = null;

                scope.select = function(element) {
                    scope.selected = scope.list.indexOf(element);

                    scope.onSelect({selection: element})
                };

                scope.listName = function(element) {
                    if(element.getName) {
                        return element.getName();
                    }
                    else if(element.name) {
                        return element.name;
                    }
                    else {
                        return "-";
                    }
                }

            }
        };
    }
);
