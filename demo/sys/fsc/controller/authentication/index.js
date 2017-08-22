define(['../module'], function(ng) {
  ng
    .factory('authService', ['$http', 'api', function($http, api) {
      return {
        //获取卖家身份资料
        getIdentity: function() {
          return $http.get(api.getIdentity);
        },
        //保存卖家资料
        saveIdentity: function(params) {
          return $http.post(api.saveIdentity, params);
        },
        updateIdentity: function(params) {
          return $http.post(api.updateIdentity, params);
        }
      };
    }])
    .factory('infoService', [function() {
      return {};
    }])
    .controller('EntryCtrl', ['$scope', '$location', 'authService',
      function($scope, $location, authService) {
        authService.getIdentity()
        .success(function(data, a, b, c) {
          //已经提交过资料
          if (!data.data) {
            $location.path('/authentication/apply');
          };
          if ( 0 !== data.data.status) {
            $location.path('/authentication/audit');

          } else {
            //未提交资料
            $location.path('/authentication/apply');
          }
        });
      }
    ])
    .controller('ApplyCtrl', ['$scope', '$location', 'authService', 'infoService', function($scope, $location, authService, infoService) {


      //基本资料
      var vm = $scope.vm = infoService;
      $scope.next = function() {
        infoService = vm;
        $location.path('/authentication/apply2');
      };
      $scope.title = 'ddd';
        //上传图片

    }])
    .controller('Apply1Ctrl', ['$scope', '$http', '$location', 'Upload', 'api', 'authService', 'infoService', function($scope, $http, $location, Upload, api, authService, infoService) {
      //图片
      var vm = $scope.vm = infoService;
      if (!infoService.contactName) {
        $location.path('/authentication');
      }

      //上传图片
      $scope.$watch('files', function() {
        $scope.upload($scope.files);

      });
      $scope.upload = function(files, name) {
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
              url: api.uploadImage,
              file: file
            }).progress(function(evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage + '% ' +
                evt.config.file.name + '\n' + $scope.log;
            }).success(function(data, status, headers, config) {
              vm.bizCodeImg = data.data.url;
            });
          }
        }
      };

      $scope.upload1 = function(files, name) {
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
              url: api.uploadImage,
              file: file
            }).progress(function(evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage + '% ' +
                evt.config.file.name + '\n' + $scope.log;
            }).success(function(data, status, headers, config) {
              vm.taxRegImg = data.data.url;
            });
          }
        }
      };

      $scope.upload2 = function(files, name) {
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
              url: api.uploadImage,
              file: file
            }).progress(function(evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage + '% ' +
                evt.config.file.name + '\n' + $scope.log;
            }).success(function(data, status, headers, config) {
              vm.bizEntityIdcardFrontImg = data.data.url;
            });
          }
        }
      };

      $scope.upload3 = function(files, name) {
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
              url: api.uploadImage,
              file: file
            }).progress(function(evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage + '% ' +
                evt.config.file.name + '\n' + $scope.log;
            }).success(function(data, status, headers, config) {
              vm.bizEntityIdcardBackImg = data.data.url;
            });
          }
        }
      };

      $scope.upload4 = function(files, name) {
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
              url: api.uploadImage,
              file: file
            }).progress(function(evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage + '% ' +
                evt.config.file.name + '\n' + $scope.log;
            }).success(function(data, status, headers, config) {
              vm.contactIdcardFrontImg = data.data.url;
            });
          }
        }
      };

      $scope.upload5 = function(files, name) {
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
              url: api.uploadImage,
              file: file
            }).progress(function(evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage + '% ' +
                evt.config.file.name + '\n' + $scope.log;
            }).success(function(data, status, headers, config) {
              vm.contactIdcardBackImg = data.data.url;
            });
          }
        }
      };

      $scope.upload6 = function(files, name) {
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
              url: api.uploadImage,
              file: file
            }).progress(function(evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage + '% ' +
                evt.config.file.name + '\n' + $scope.log;
            }).success(function(data, status, headers, config) {
              vm.corpImg = data.data.url;
            });
          }
        }
      };

      $scope.upload7 = function(files, name) {
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Upload.upload({
              url: api.uploadImage,
              file: file
            }).progress(function(evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage + '% ' +
                evt.config.file.name + '\n' + $scope.log;
            }).success(function(data, status, headers, config) {
              vm.commInstrumentImg = data.data.url;
            });
          }
        }
      };

      $scope.save = function() {
        console.log(vm);
        authService.saveIdentity(vm)
          .success(function(data) {
            if('success' === data.status){
              $location.path("/authentication/audit");
            }else{
              alert("操作失败:"+data.message);
            }
          });
      };
    }])


  .controller('AuditCtrl', ['$scope', '$location', 'authService', function($scope, $location, authService) {
    authService.getIdentity()
      .success(function(data) {
        if ('success' === data.status) {
          var vm = $scope.vm = data.data;
          //$scope.title="审核情况";
          switch (vm.status) {
            case 0:
              vm.message = '新增';
              break;
            case 1:
              vm.message = '审核中';
              $scope.tip = '您的身份认证正在审核中，请耐心等候!';
              break;
            case 2:
              vm.message = '审核中';
              $scope.tip = '您的身份认证正在审核中，请耐心等候!';
              break;
            case 3:
              vm.message = '审核通过';
              $scope.tip = '尊敬的用户您的身份认证已经通过我们的审核,欢迎的你的加入!';
              break;
            case -1:
              vm.message = '审核不通过';
              $scope.tip = '您的身份认证申请未通过审核。';
              $scope.fail = true;
              break;

          }
        } else {

        }
      });
  }]);
});