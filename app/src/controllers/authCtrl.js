angular.module('App')
     .controller('authCtrl', [ '$routeParams', '$location', 'spotify',
        function ( $routeParams, $location, spotify ) {
            var self = this;

            switch($routeParams.operator) {
              case 'spotify':
                spotify.auth($location.search()).then(function() {
                  console.log('token: ', spotify.getToken());
                  $location.path('/');
                });
                break;
              default:
              $location.path('/');
            }
          }
     ]);
