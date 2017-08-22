define(['angular', 'umeditor', 'umeditor-lang', 'umeditor-config'], function(angular, UM) {
  var ngUM = angular.module('ng.ueditor', []);
  ngUM.directive('ueditor', [function() {
    return {
      restrict: 'AC',
      require: 'ngModel',
      link: function(scope, ele, attr, ctrl) {

        console.log(1);
        var _initContent,
          editor,
          editorReady = false;
        var _UEConfig = scope.config ? scopt.config : {};
        var _editorId = attr.id ? attr.id : "_editor" + (Date.now());
        editor = UM.getEditor(_editorId, _UEConfig);

        editor.ready(function() {
          editorReady = true;
          //editor.setContent(_initContent);
          editor.addListener('contentChange', function() {
            scope.$apply(function() {
              ctrl.$setViewValue(editor.getContent());
            });
          });
        });

        // ctrl.$render = function() {
        //           _self.modelContent = (ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
        //           _updateByRender = true;
        //           _self.setEditorContent();
        //         };
        // //当model改变时赋值
        ctrl.$render = function() {
           console.log(2,ctrl);
          // console.log(2,ctrl.$viewValue);
          _initContent = (ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
          if (_initContent && editor && editorReady) {
            //console.log(3,ctrl.$viewValue);
            editor.setContent(_initContent);

          }
        };
      }
    };
  }]);
});