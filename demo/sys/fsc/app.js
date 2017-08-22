define(['angular'], function(angular) {

  var app = angular.module('webapp', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'webapp.Ctrl', 'ngFileUpload', 'ng.ueditor', 'pascalprecht.translate','cfec.common']);

  //多语言切换
  app.config(['$translateProvider', function($translateProvider) {
    var lang = window.localStorage.lang || 'zh';
    $translateProvider.preferredLanguage(lang);
    $translateProvider.useStaticFilesLoader({
      prefix: '/pubpage/fsc/languages/',
      suffix: '.json'
    });
  }]);

  return app;
});