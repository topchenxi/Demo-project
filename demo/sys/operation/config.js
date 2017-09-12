'use strict';

const packagePath = './components';


require.config({
    paths: {
        // angular 组件
        'angular': packagePath + '/angular/angular',
        'animate': packagePath + '/angular-animate/angular-animate',
        'ui-bootstrap': packagePath + '/angular-bootstrap/ui-bootstrap-tpls.min',
        'ui-route': packagePath + '/angular-ui-router/release/angular-ui-router',
        'sanitize': packagePath + '/angular-sanitize/angular-sanitize.min',
        'dialog': packagePath + '/ng-dialog/js/ngDialog',
        'ui-upload': packagePath + '/ng-file-upload/ng-file-upload',


        'jquery': packagePath + '/jquery/dist/jquery',

        'validation': packagePath + '/jquery-validation/dist/jquery.validate',
        'validation-lang': packagePath + '/jquery-validation/src/localization/messages_zh',
        'validation-method': packagePath + '/jquery-validation/dist/additional-methods',

        'cfec-common': packagePath + '/cfec-common/service',
        'calendar': packagePath + '/calendar/laydate.dev',
        'calendarCss': packagePath + '/calendar/laydate',
        'ngclipboard': packagePath + '/ngclipboard-master/dist/ngclipboard',
        'clipboard': packagePath + '/clipboard/dist/clipboard',


        'umeditor': packagePath + '/umeditor/utf8-jsp/umeditor',
        'umeditor-config': packagePath + '/umeditor/utf8-jsp/umeditor.config',
        'umeditor-lang': packagePath + '/umeditor/utf8-jsp/lang/zh-cn/zh-cn',

        'ngc-plugin': './directive/pluginDef',
        'ngc-validation': './directive/validationDef',
        'ngc-editor': './directive/ui-umeditor',

        'app': './app',
        'route': './route',

        'constant': './service/constant',
        'commonService': './service/commonService',

    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'validation': {
            deps: ['jquery']
        },
        'validation-lang': {
            deps: ['jquery', 'validation']
        },
        'angular': {
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
        'ngclipboard': {
            deps: ['angular', 'clipboard']
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
        'animate': {
            deps: ['angular'],
            exports: 'ngAnimate'
        },
        'sanitize': {
            deps: ['angular']
        },
        'cfec-common': {
            deps: ['angular']
        },
        'app': {
            exports: 'app',
            deps: ['angular']
        }
    },
    map: {
        '*': {
            'css': './components/require-css/css.js',
            'text': './components/requirejs/text.js'
        }
    },
    waitSeconds: 0
});

require([
    'jquery',
    'angular',
    'sanitize',
    'ui-route',
    'ui-bootstrap',
    'ui-upload',
    'animate',
    'dialog',
    'ngclipboard',
    'route',
    'constant',
    'cfec-common',
    'commonService',
    './controller/controller',
    './service/permission',
    'app',
    'calendar',
    'validation',
    'validation-method',
    'ngc-plugin',
    'ngc-validation',
    'ngc-editor'
], function() {
    //在Angular运行之前获取到用户的permission的映射关系
    var path = url;
    var data = {
        "status": "success",
        "errorCode": null,
        "message": "fetch seller info success",
        "type": null,
        "data": {
            "provinceCode": null,
            "cityCode": null,
            "regionCode": null,
            "companyId": 1,
            "userId": 1,
            "sellerId": 1,
            "supplierPhoto": "/group1/M00/67/4E/wKgKEVV0HseAO26CAAAk8fFD6-w209.jpg",
            "email": "huhongkai@cf-ec.com",
            "mobile": "125463333",
            "supplierName": null,
            "firstName": "jim1",
            "lastName": "san",
            "nameEn": null,
            "gender": 2,
            "officeAddress": "广州凤浦中路679号广交会大厦13楼tests91",
            "officeEnAddress": "bbbbbb",
            "zipCode": "5114911",
            "telephone": "155555555591",
            "msn": "186796333791",
            "fax": "186796333791",
            "qq": "19181591",
            "setSecurityIssuesCode": "32329790-e670-4983-8a16-bf35f8e51168",
            "securityValidTime": 1435231398000,
            "useNum": 1,
            "auditStatus": 3,
            "exceptionReason": null,
            "countryId": 8,
            "auditorName": null,
            "auditTime": 1432804068000
        },
        "page": {
            "page": 1,
            "total": 0,
            "pageSize": 15,
            "maxPage": 0,
            "items": null
        }
    };

    localStorage.userInfo = JSON.stringify(data);

    angular.bootstrap(document, ['webapp']);

});
