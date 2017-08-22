'use strict';

require.config({
  urlArgs: "_=" + (new Date()).getTime(),
  paths: {
    //插件
    'jquery': '/pubpage/components/jquery/dist/jquery',
    'angular': '/pubpage/components/angular/angular',

    //angular插件
    'ui-route': '/pubpage/components/angular-ui-router/release/angular-ui-router',
    'ui-bootstrap': '/pubpage/components/angular-bootstrap/ui-bootstrap-tpls.min',
    'ui-animate': '/pubpage/components/angular-animate/angular-animate',
    'ui-upload': '/pubpage/components/ng-file-upload/ng-file-upload',
    'ui-translate': '/pubpage/components/angular-translate/angular-translate.min',
    //'ui-translate-load': '/pubpage/components/angular-translate-loader-url/angular-translate-loader-url.min',
    'ui-translate-loader-files': '/pubpage/components/angular-translate-loader-static-files/angular-translate-loader-static-files',

    //组件
    'umeditor': '/pubpage/components/umeditor/utf8-jsp/umeditor',
    'umeditor-config': '/pubpage/components/umeditor/utf8-jsp/umeditor.config',
    'umeditor-lang': '/pubpage/components/umeditor/utf8-jsp/lang/zh-cn/zh-cn',
    //自定义的指令
    'ui-umeditor': '/pubpage/fsc/directive/editor',

    'cfec-common': '/pubpage/components/cfec-common/service',
    'app': './app',
    'route': './route',
    'constant': './service/constant'
  },
  shim: {
    jquery: {
      exports: '$'
    },
    angular: {
      exports: 'angular'
    },
    'ui-route': {
      deps: ['angular'],
      exports: 'ui-route'
    },
    'ui-upload': {
      deps: ['angular']
    },
    'ui-bootstrap': {
      deps: ['angular']
    },
    'ui-animate': {
      deps: ['angular'],
      exports: 'ngAnimate'
    },
    'ui-translate': {
      deps: ['angular']
    },
    'ui-translate-load': {
      deps: ['angular', 'ui-translate']
    },
    'ui-translate-loader-files': {
      deps: ['angular', 'ui-translate']
    },
    'umeditor': {
      deps: ['jquery'],
      exports: 'UM'
    },
    'umeditor-config': {
      deps: ['umeditor']
    },
    'umeditor-lang': {
      deps: ['umeditor']
    },
    'ui-umeditor': {
      deps: ['umeditor']
    },
    'cfec-common': {
      deps: ['angular']
    },
    app: {
      exports: 'app',
      deps: ['angular']
    }
  }
});

require([
  'jquery', 'angular', 'umeditor', 'umeditor-config', 'umeditor-lang', 'ui-route', 'ui-bootstrap', 'ui-upload', 'ui-umeditor', 'ui-translate'
  //,'ui-translate-load'
  , 'ui-translate-loader-files', 'ui-animate'
  //系统js
  , 'route', 'constant', './controller/controller', './service/permission', 'cfec-common', 'app'
], function(app, anguler) {
	if(localStorage.userInfo == undefined || localStorage.userInfo == null ){
		localStorage.userInfo = JSON.stringify("{'stauts':'fail'}");
	}
	angular.bootstrap(document, ['webapp']);

  //在Angular运行之前获取到用户的permission的映射关系
  //var path = 'http://192.168.200.234:8082';
//  var path = 'http://192.168.200.179:8080';
  //var path = 'http://127.0.0.1:3000';
/*  $.ajax({
    type: 'GET',
    url: path + '/seller_center/informationSetting/fetchSellerInfo.cf',
    data: {
      'sellerId': 1
    },
    dataType: 'json',
    success: function(data) {
      localStorage.userInfo = JSON.stringify(data);
      angular.bootstrap(document, ['webapp']);
    },
    error: function(data) {
      alert('与服务器连接失败，请刷新浏览器');
    }
  })*/
});