angular.module('App').service('spotify', function($http, $q) {

  var myState = null;
  var myAuth = {
    access_token: null,
    refresh_token: null
  };

  var appToken = {
    id: "29301ecd40bc431096167df74fd4937c",
    secret: "791f299041f0455c83d95b8854a91bb3",
    redirect_url: "http://localhost:8080/#/auth/spotify"
  };

  var isAuthenticated = function() {
    return myAuth.access_token !== null;
  };

  var auth = function(params) {
    var code = params.code;
    var state = params.state;

    var def = $q.defer();
    var prom = def.promise;

    if(!state || state !== myState) {
      console.error("Invalid state");
      def.reject("Invalid state");
    }
    else {
      myState = null;

      var authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        data: {
          code: code,
          redirect_uri: appToken.redirect_url,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(appToken.id + ':' + appToken.secret).toString('base64'))
        }
      };

      $http(authOptions).then(function(response) {
        myAuth.access_token = response.data.access_token;
        myAuth.refresh_token = response.data.refresh_token;
        def.resolve();
      }, function(response) {
        def.reject();
      });
    }

    return prom;
  };

  var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  var getAuthUrl = function() {
    var base  = 'https://accounts.spotify.com/authorize?';
    var url = base;
    var scope = 'user-read-private user-read-email';
    myState = generateRandomString(16);

    url += 'response_type=code';
    url += '&client_id=' + appToken.id;
    url += '&scope=' + scope;
    url += '&redirect_uri=' + appToken.redirect_url;
    url += '&state=' + myState;

    return url;
  };

  return {
    auth: auth,
    getAuthUrl: getAuthUrl,
    isAuthenticated: isAuthenticated
  };
})
