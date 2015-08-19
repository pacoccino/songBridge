angular.module('App')
     .controller('Controller', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$mdToast', 'spotify', 

        function ( $mdSidenav, $mdBottomSheet, $log, $q, $mdToast, spotify ) {
            var self = this;

            this.isLogged = spotify.isAuthenticated;

            self.list1 = [
              {
                _id: 0,
                name: 'aaaa'
              },

              {
                _id: 1,
                name: 'bbbb'
              }
            ];
            self.list2 = [
              {
                _id: 0,
                name: 'cccc'
              },

              {
                _id: 1,
                name: 'ddddd'
              }
            ];

            self.select = function(element) {
              self.leftSelected = element;
            };

        }
     ]);
