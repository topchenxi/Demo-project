define(['angular'], function(angular) {
    var ngcValidation = angular.module('ngc.validation', []);
    ngcValidation
    
    .directive('ngcJumppage', function() {
        return {
            restrict: 'AC',
            link: function(scope, elem, attrs) {
                elem.bind('keyup', function() {
                    var v = elem.val();
                    if (!(/^[\d]+$/g.test(v)) || v < 1 || isBiggerThanMax()) {
                        $(".j-jump").attr("disabled", "disabled");
                        elem.css("border-color", "#E50000");
                    } else {
                        $(".j-jump").removeAttr("disabled");
                        elem.css("border-color", "#E6E6E6");
                    }
                });

                function isBiggerThanMax(){
                    var flag = false;
                    if(attrs.hasOwnProperty('maxpage')){
                        var maxpage = attrs['maxpage'];
                        if(elem.val()>parseInt(maxpage,10)){
                            flag = true;
                        }
                    }else if(typeof scope.paging != 'undefined' && scope.paging!= null && elem.val() > scope.paging.total){
                        flag = true;
                    }
                    return flag;
                }
            }
        };
    })
    .directive('ngcPercent', function() {
        /*百分数*/
        return {
            restrict: 'AC',
            require: '?ngModel',
            link: function(scope, elem, attrs, ngModel) {
                var v = elem.val();
                var customValidator = function(v) {
                    var validity = ngModel.$isEmpty(v) || (/^\d{1,3}(\.\d{1,2})?$/.test(v) && parseFloat(v) <= 100);
                    ngModel.$setValidity("ngcPercent", validity);
                    return validity ? v : undefined;
                };
                ngModel.$formatters.push(customValidator);
                ngModel.$parsers.push(customValidator);
            }
        }
    })

    .directive('ngcMin',function(){
        // 只适用于正整数的限制
        return {
            restrict:'A',
            require:'?ngModel',
            link: function(scope, elm, attr, ctrl) {
              if (!ctrl) return;

              var min= -1;
              attr.$observe('ngcMin', function(value) {
                var intVal = parseInt(value, 10);
                min = isNaN(intVal) ? -1 : intVal;
                ctrl.$validate();
              });
              ctrl.$validators.ngcMin = function(modelValue, viewValue) {
                // 返回true 验证通过
                return (min < 0) || ctrl.$isEmpty(viewValue) || (viewValue >= min);
              };
            }
        }
    })
    .directive('ngcMax',function(){
        // 只适用于正整数的限制
        return {
            restrict:'A',
            require:'?ngModel',
            link: function(scope, elm, attr, ctrl) {
              if (!ctrl) return;

              var max= -1;
              attr.$observe('ngcMax', function(value) {
                var intVal = parseInt(value, 10);
                max = isNaN(intVal) ? -1 : intVal;
                ctrl.$validate();
              });
              ctrl.$validators.ngcMax = function(modelValue, viewValue) {
                // 返回true 验证通过
                return (max < 0) || ctrl.$isEmpty(viewValue) || (viewValue <= max);
              };
            }
        }
    })

    /**
     * 接口的status 返回success时验证通过,返回fail验证不通过
     */    
    .directive('ngcRemote',function($http){
    /*远程校验*/
        return {
            restrict:'A',
            require:'?ngModel',
            link:function(scope,elem,attrs,ngModel){
                 
                
                elem.bind('blur',function(e){
                    var data=eval('('+attrs.ngcRemote+')');
                    var url=data.url,original=data.original,val = elem.val(),validity=true;
                    if(ngModel.$isEmpty(url) || ngModel.$isEmpty(val) || original == val){
                            ngModel.$setValidity("ngcRemote", validity);
                    }else{
                        var param = {};
                        param.key=val;
                        $http.post(url,param).success(function(rs){
                            if(rs.status==='fail'){  // 已存在
                                validity = false;
                            }
                            ngModel.$setValidity("ngcRemote", validity);
                        }).error(function(rs){
                            ngModel.$setValidity("ngcRemote", validity);
                            console.log(rs);
                        })
                        }
                        
                    })
                
            }
        }
    })
    .directive('ngcChecknorepeat',function(){
        // 发布采购需求时，主题名里单词重复次数限制
        return {
            restrict:'A',
            require:'?ngModel',
            link: function(scope, elm, attr, ctrl) {
                if (!ctrl) return;

                var str = elm.val();
                var customValidator = function(str) {
                    var rs = true; // 校验通过
                    // 将所有非字母替换为空格,再以空格分隔
                    if(!ctrl.$isEmpty(str)){
                        var strSpace = " " + str.replace(/[^a-zA-Z]+/g, " ") + " ";
                        var strs = strSpace.replace(/(^\s*)|(\s*$)/g, '').split(" ");

                        if (strs.length >= 3) {
                            for (var i = 0; i < strs.length; i++) {
                              var tmp = strs[i];
                              // 连续三次
                              var rp3 = new RegExp('[^A-Za-z](' + tmp + ' ){3,}', 'g');
                              if (rp3.test(strSpace)) {
                                rs = false;
                                break;
                              } else if (strSpace.split(tmp + " ").length >= 4) {
                                // 出现4次
                                var ct = 0;
                                for (var j = i + 1; j < strs.length; j++) {
                                  if (strs[j] === tmp) {
                                    ++ct;
                                    if (ct >= 3) {
                                      rs = false;
                                      break;
                                    }
                                  }
                                }
                                if (rs === false) {
                                  break;
                                }
                              }
                            }
                        }
                    }
                    ctrl.$setValidity("checknorepeat", rs);

                    return rs ? str : undefined;
                };

                ctrl.$formatters.push(customValidator);
                ctrl.$parsers.push(customValidator);
            }
        }
    })
    return ngcValidation;
});
