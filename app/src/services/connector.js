app.service('Connector', function($http, Connectors, Backend) {

  this.infos = {

  };

  var appendServiceUrl = function(url) {
    url += "?serviceId=" + this.infos.serviceId;
  };

  var callServiceUrl = function(url) {
    url = appendServiceUrl(url);

    $window.location.href = url;
  };

  var connect = function() {
    var loginUrl = Backend.apiUrl + "auth/login";

    callServiceUrl(loginUrl);
  };

  var disconnect = function() {
    var loginUrl = Backend.apiUrl + "auth/logout";

    callServiceUrl(loginUrl);
  };

  var authState = function() {
    var loginUrl = Backend.apiUrl + "auth/authState";

    loginUrl = appendServiceUrl(loginUrl);


  };

  return {
    connect: connect,
    disconnect: disconnect
  };
});
