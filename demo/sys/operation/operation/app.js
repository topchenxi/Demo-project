define(['angular'], function(angular) {

    var app = angular.module('webapp', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'webapp.Ctrl',
        'ngSanitize'
    ]);
    return app;
});
