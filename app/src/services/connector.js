app.service('Connector', function($http, Backend, $window) {

  function Connector(infos) {
    this.infos = infos;
    this.userInfo = null;
  }

  Connector.prototype.getName = function (url) {
    return this.infos.name;
  };

  Connector.prototype.appendServiceUrl = function (url) {
    return url + "?serviceId=" + this.infos.serviceId;
  };

  Connector.prototype.callServiceUrl = function (url) {
    url = this.appendServiceUrl(url);

    $window.location.href = url;
  };

  Connector.prototype.connect = function () {
    var loginUrl = Backend.apiUrl + "auth/login";

    this.callServiceUrl(loginUrl);
  };

  Connector.prototype.disconnect = function () {
    var loginUrl = Backend.apiUrl + "auth/logout";

    this.callServiceUrl(loginUrl);
  };

  Connector.prototype.getUserInfo = function () {

    var reqUrl = Backend.apiUrl + "auth/me";
    reqUrl = this.appendServiceUrl(reqUrl);

    var req = {
      url: reqUrl,
      method: 'GET'
    };

    var self = this;
    $http(req).then(function(userInfo){
      self.userInfo = userInfo.data;
    }, function(error) {
      self.userInfo = null;
    });
  };

  return Connector;
});