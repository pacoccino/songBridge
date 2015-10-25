var app = angular.module('App', [
    'ngMaterial',
    'ngRoute',
    'ngCookies'
]);

app.config(function($mdThemingProvider, $mdIconProvider, $routeProvider){

    $mdIconProvider
        .defaultIconSet("./assets/svg/avatars.svg", 128)
        .icon("menu"       , "./assets/svg/menu.svg"        , 24)
        .icon("share"      , "./assets/svg/share.svg"       , 24)
        .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
        .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
        .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
        .icon("phone"      , "./assets/svg/phone.svg"       , 512)
        .icon("send"      , "./assets/svg/comment.svg"       , 512);

        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('red');



    $routeProvider.when('/main', {
      controller: 'MainController',
      templateUrl:'src/views/main/main.html'
    }).otherwise({
      redirectTo: '/main'
    });

});
