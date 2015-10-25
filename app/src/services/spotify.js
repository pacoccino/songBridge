app.service('Spotify', function($http, $window, $cookies) {

  var _infos = {
    name: "Spotify"
  };

  var _auth = null;

  var connect = function() {
    $window.location.href = '/api/auth/login/spotify'
  };

  var disconnect = function() {
    $window.location.href = '/api/auth/logout/spotify'
  };


  if($cookies.get('access_token')) {
    _auth = {
        accessToken: $cookies.get('access_token')
     };
  }

  return {
    infos: _infos,
    auth: _auth,
    connect: connect,
    disconnect: disconnect
  };
});
