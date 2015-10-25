app.service('Deezer', function($http, $window, $cookies) {

  var _infos = {
    name: "Deezer"
  };

  var _auth = null;

  var connect = function() {
    $window.location.href = '/api/auth/login/deezer'
  };

  var disconnect = function() {
    $window.location.href = '/api/auth/logout/deezer'
  };

  return {
    infos: _infos,
    auth: _auth,
    connect: connect,
    disconnect: disconnect
  };
});
