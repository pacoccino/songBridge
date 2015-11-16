var app = angular.module('App', [
    'ngMaterial',
    'ngRoute',
    'ngCookies',
    'ngMdIcons'
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


    var customBlueMap = 		$mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50'
        })
        .accentPalette('pink');



    $routeProvider
        .when('/main', {
            controller: 'MainController',
            templateUrl:'src/views/main/main.html'
        })
        .when('/platform', {
            controller: 'PlatformController',
            templateUrl:'src/views/Platform/platform.html'
        })
        .when('/boby', {
            controller: 'BobyController',
            templateUrl:'src/views/Boby/bobyView.html'
        })
        .otherwise({
          redirectTo: '/main'
        });

});
