define([
    'angular',
    'umeditor',
    'umeditor-lang',
    'umeditor-config'
], function(angular, UM) {

    var ngUM = angular.module('ngc.umeditor', []);


    ngUM.directive('ngcUmeditor', function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, ele, attr, ctrl) {

                var _initContent,
                    _editorReady = false,
                    _UEConfig = scope.config ? scope.config : {},
                    _editorId = attr.id ? attr.id : "_editor" + (Date.now());

                // 初始化编辑器
                var editor = UM.getEditor(_editorId, _UEConfig);

                editor.ready(function() {
                    _editorReady = true;
                    editor.addListener('contentChange', function() {
                        // 编辑器内容发送变化时，绑定到model里面
                        // scope.$apply(function() {
                            ctrl.$setViewValue(editor.getContent());
                        // });
                    });
                });
                // model赋值时 同步到编辑器
                ctrl.$render = function() {
                    _initContent = (ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
                    if (_initContent && editor && _editorReady) {
                        editor.setContent(_initContent);
                    }
                };
            }
        };
    })



    return ngUM;
})
