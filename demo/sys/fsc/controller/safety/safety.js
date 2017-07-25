define(['../module'], function(ng) {
  ng
    .factory('safetyService', ['$http', 'api',
      function($http, api){
        // var getValidate = function(id) {
        //   var deferred = $q.defer();
        //   //检查用户是否已经设置安全问题
        //   $http.get(api.validatSellerHasSecurityIssues, {params:{'sellerId': id}})
        //   .success(function(data){
        //     deferred.resolve(data)
        //   })
        //   .error(function(data){
        //     deferred.reject(data)
        //   });

        //   return deferred.promise;
        // }
        return {
          //检查用户是否已经设置安全问题
          getValidate : function(id) {
            return $http.get(api.validatSellerHasSecurityIssues, {params:{'sellerId': id}})
          },
          //修改手机或者邮箱
          changeEmailORMobile: function(params) {
            return $http.post(api.changeEmailORMobile, params)
          },
          //修改密码
          changepwd: function(params) {
            return $http.post(api.changePass, params)
          },
          //发送安全问题重置邮箱
          sendResetIssues: function(params) {
            return $http.post(api.sendMailForResetIssues, params)
          },
          //获取安全问题
          getIssuesInfo: function(params) {
            return $http.get(api.getIssuesInfoForUser, {'params': params})
          },
          //验证安全问题
          validateIssues: function(params) {
            return $http.post(api.validatSecurityAnswer, params)
          },
          //发送手机验证码
          sendAuthCode: function(params) {
            return $http.post(api.sendAuthCode, params)
          }
        }
      }
    ])
    //账号设置
    //progress 100%
    .controller('safetyCtrl', ['$scope', '$location', '$modal', 'safetyService',
      function($scope, $location, $modal, v) {

        v.getValidate($scope.userInfo.sellerId)
        .success(function(data){
          if ('success' !== data.status) {
            $location.path('/safety/set')
          }
        });

        //
        $scope.go = function(goal) {
          var modalViailat = $modal.open({
            animation: true,
            templateUrl: 'validate.html',
            controller: 'DialogCtrl',
            size: '',
            scope: $scope,
            resolve: {
              goal: function() {
                return goal;
              }
            }
          });
        };
      }
    ])
    //修改邮箱
    //progress 100%
    .controller('changeemailCtrl', ['$scope', '$location', 'safetyService',
      function($scope, $location, safetyService) {
        //验证是否设置安全问题
        safetyService.getValidate($scope.userInfo.sellerId)
        .success(function(data){
          if ('success' !== data.status) {
            $location.path('/safety/set');
            //$scope.hasValidate = true
          }
        });
        $scope.title = '修改邮箱';
        $scope.email = {};
        $scope.email.sellerId = $scope.userInfo.sellerId;

        $scope.submit = function() {
          //验证当前邮箱是否正确
          safetyService.changeEmailORMobile($scope.email)
          .success(function(data) {
            if ('success' === data.status) {
              alert(data.message);
              $location.path('/safety');
            } else {
              alert(data.message);
            }
          });
        };
      }
    ])
    //修改手机
    //progress 80%
    //获取验证码还没做
    .controller('changemobileCtrl', ['$scope', '$location', 'safetyService',
      function($scope, $location, safetyService) {

        //验证是否设置安全问题
        safetyService.getValidate($scope.userInfo.sellerId)
          .success(function(data){
            if ('success' !== data.status) {
              $location.path('/safety/set');
              //$scope.hasValidate = true
            }
          });

        $scope.mobile = {};
        $scope.mobile.cur = $scope.userInfo.mobile;
        $scope.mobile.sellerId = $scope.userInfo.sellerId;

        //发送验证码
        $scope.getCode = function() {
          safetyService.sendAuthCode({'mobile': $scope.mobile.cur})
          .success(function(data) {
            if ('success' === data.status) {
              alert(data.message)
            } else {
              alert(data.message)
            }
          })
        }

        $scope.submit = function() {
          safetyService.changeEmailORMobile($scope.mobile)
          .success(function(data) {
            if ('success' === data.status) {
              alert(data.message)
              $location.path('/set/account')
            } else {
              alert(data.message)
            }
          })
        }
      }
    ])
    //修改密码
    //progress 100%
    .controller('changepwdCtrl', ['$scope', '$location', 'safetyService',
      function($scope, $location, safetyService) {
        //验证是否设置安全问题
        safetyService.getValidate($scope.userInfo.sellerId)
        .success(function(data){
          if ('success' !== data.status) {
            $location.path('/safety/set')
            //$scope.hasValidate = true
          }
        })

        $scope.pass = {};
        $scope.pass.sellerId = $scope.userInfo.sellerId;

        $scope.submit = function() {
          //验证密码
          safetyService.changepwd($scope.pass)
            .success(function(data) {
              if ('success' === data.status) {
                alert('密码修改成功，请牢记您的新密码，不要随意泄露给陌生人。');
              } else {
                alert(data.message)
              }
            })
        }
      }
    ])
    //弹窗
    //progress 100%
    .controller('DialogCtrl', ['$scope', '$modalInstance', '$location', 'goal', 'safetyService',
      function($scope, $modalInstance, $location, goal, safetyService) {

        //获取问题列表
        safetyService.getIssuesInfo({sellerId: $scope.userInfo.sellerId})
          .success(function(data) {
            if ('success' === data.status) {
              $scope.issueOptions = data.data;
            };
          })

        //忘记安全问题， 重新发送重置问题邮件
        $scope.sendEmail = function() {
          safetyService.sendResetIssues({'sellerId': $scope.userInfo.sellerId})
            .success(function(data) {
              alert(data.message)
            })

          $location.path('/safety/find');
          $modalInstance.dismiss('cancel');
        }


        //验证答案
        $scope.validat = {};
        $scope.ok = function() {
          safetyService.validateIssues($scope.validat)
            .success(function(data) {
              if ('success' === data.status) {
                $location.path(goal)
                $modalInstance.close();
              } else {
                alert('回答错误');
              }
            })
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
      }
    ])
    //安全问题设置
    .controller('setCtrl', ['$scope', '$http', '$location', '$rootScope', 'api',
      function($scope, $http, $location, $rootScope, api) {
        $scope.isset = $scope.isshow = false;

        var urlParans = $location.search();


        $http.get(api.validatSellerHasSecurityIssues, {
            params: {
              sellerId: $rootScope.userInfo.sellerId
            }
          })
          .success(function(data) {
            if ('success' === data.status) {
              $scope.isset = true;
            } else {
              $scope.isshow = true;
            }
          })
        $scope.title = "安全问题设置";
        $scope.isIssuesCustom1 = false;
        $scope.isIssuesCustom2 = false;
        $scope.isIssuesCustom3 = false;
        $scope.issueList = [{
          'id': 1,
          'issue': '你的生日是那天'
        }, {
          'id': 2,
          'issue': '你的偶像是谁'
        }, {
          'id': 3,
          'issue': '你最喜欢的动物是什么'
        }, {
          'id': 4,
          'issue': '你的家乡在哪里'
        }, {
          'id': 5,
          'issue': '你的家乡在哪里'
        }, {
          'id': 6,
          'issue': '自定义问题'
        }];
        $scope.saveIssue = {
          securityIssuesSystemId1: '',
          securityIssuesCustom1: '',
          securityIssuesAnswer1: '',
          securityIssuesSystemId2: '',
          securityIssuesCustom2: '',
          securityIssuesAnswer2: '',
          securityIssuesSystemId3: '',
          securityIssuesCustom3: '',
          securityIssuesAnswer3: '',
          saveType: urlParans.saveType || 0,
          sellerId: urlParans.sellerId || $scope.userInfo.sellerId,
          setSecurityIssuesCode: urlParans.setSecurityIssuesCode
        };
        $scope.selectChange = function(id) {
          if (1 === id) {
            if (!$scope.saveIssue.securityIssuesSystemId1) return

            if (6 === $scope.saveIssue.securityIssuesSystemId1) {
              $scope.isIssuesCustom1 = true;
            } else {
              if ($scope.saveIssue.securityIssuesSystemId1 === $scope.saveIssue.securityIssuesSystemId2 || $scope.saveIssue.securityIssuesSystemId1 === $scope.saveIssue.securityIssuesSystemId3) {
                alert('安全问题不能重复')
                $scope.saveIssue.securityIssuesSystemId1 = '';
              }
              $scope.isIssuesCustom1 = false;
            }
          }
          if (2 === id) {
            if (!$scope.saveIssue.securityIssuesSystemId1) return
            if (6 === $scope.saveIssue.securityIssuesSystemId2) {
              $scope.isIssuesCustom2 = true;
            } else {
              if ($scope.saveIssue.securityIssuesSystemId2 === $scope.saveIssue.securityIssuesSystemId1 || $scope.saveIssue.securityIssuesSystemId2 === $scope.saveIssue.securityIssuesSystemId3) {
                alert('安全问题不能重复');
                $scope.saveIssue.securityIssuesSystemId2 = '';
              }
              $scope.isIssuesCustom2 = false;
            }
          }
          if (3 === id) {
            if (!$scope.saveIssue.securityIssuesSystemId1) return
            if (6 === $scope.saveIssue.securityIssuesSystemId3) {
              $scope.isIssuesCustom3 = true;
            } else {
              if ($scope.saveIssue.securityIssuesSystemId3 === $scope.saveIssue.securityIssuesSystemId2 || $scope.saveIssue.securityIssuesSystemId3 === $scope.saveIssue.securityIssuesSystemId1) {
                alert('安全问题不能重复')
                $scope.saveIssue.securityIssuesSystemId3 = '';
              }
              $scope.isIssuesCustom3 = false;
            }
          }
        }
        $scope.submit = function() {
          $.post(api.saveSecurityIssuesInfo, $scope.saveIssue)
            .success(function(data) {
              if ('success' === data.status) {
                alert('保存成功');
                setTimeout(function() {
                  console.log(1);
                  $location.path('/set');
                }, 1000);
              } else {
                alert(data.message);
              }
            });
        };
      }
    ])
    //忘记安全问题
    .controller('findCtrl', ['$scope', 'safetyService',
      function($scope, safetyService) {
        $scope.sendEmail = function() {
          safetyService.sendResetIssues({'sellerId': $scope.userInfo.sellerId})
            .success(function(data) {
              alert(data.message);
            });
        };
      }
    ])
    //重复密码指令
    .directive('repeat', [function(){
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, ele, attrs, ctrl)  {
          if (ctrl) {
            var otherInput = ele.inheritedData('$formController')[attrs.repeat];

            var repeatValidator = function(value) {
              var validity = value === otherInput.$viewValue;
              ctrl.$setValidity('repeat', validity);
              return validity ? value : undefined;
            };

            ctrl.$parsers.push(repeatValidator);
            ctrl.$formatters.push(repeatValidator);

            otherInput.$parsers.push(function(value){
              ctrl.$setValidity('repeat', value === ctrl.$viewValue);

              return value;
            });
          }
        }
      };
    }]);
});