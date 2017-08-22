define(['../module'], function(ng) {
  var path = 'http://192.168.200.201:8080';
  ng
    //个人资料
    .controller('UserCtrl', ['$scope', '$http', '$location', '$rootScope',  'Upload', 'api', 'publicApi', 'commonServer',
      function($scope, $http, $location, $rootScope, Upload, api, publicApi,commonServer) {
        $scope.user = $rootScope.userInfo;
        console.log(publicApi);
        //获取国家列表
        publicApi.county()
          .success(function(data){
            if ('success' === data.status) {
              $scope.countys = data.data;
            } else {
              alert(data.message);
            }
          });


        //上传图片
        //定义图片
        $scope.imgPath = api.imgPath;
        $scope.$watch('files', function() {
          $scope.upload($scope.files);
        });
        $scope.upload = function(files) {
          if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              Upload.upload({
                url: api.uploadImage,
                file: file
              }).progress(function(evt) {
                //进度
                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                 console.log(progressPercentage);
              }).success(function(data, status, headers, config) {
                //$scope.log = 'file ' + config.file.name + 'uploaded. Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                //$scope.$apply();
                if ('success' === data.status) {
                  //pro.imgs.push(data.data.url);
                  $scope.user.supplierPhoto = data.data.url;
                  //$scope.imgPath =  data.data.abslouteUrl;
                }
              });
            }
          }
        };
        $scope.submit = function(){
          delete $scope.user.auditTime;
          delete $scope.user.securityValidTime;
          delete $scope.user.setSecurityIssuesCode;
          $.post(api.saveSellerInfo, $scope.user)
            .success(function(data){
              alert(data.message);
              if ('success' === data.status) {
                $location.path('/sets');
              }
            });
        };
      }
    ])
    //公司资料
    .controller('CompanyCtrl', ['$scope', '$http', '$rootScope', '$location', 'api',
      function($scope, $http, $rootScope, $location, api) {
        $scope.company = {};
        var companyId = $scope.userInfo.companyId;
        $http.get(api.fetchCompanyInfo, {params: {'companyId':companyId}})
          .success(function(data) {
              $scope.company = data.data;
          });

        // $scope.today = function(){ // 创建一个方法，
        //     $scope.dt = new Date(); // 定义一个属性来接收当天日期
        // };
        // $scope.today(); // 运行today方法
        $scope.clear = function(){  //当运行clear的时候将dt置为空
            $scope.company.establishYear = null;
        }
        $scope.open = function($event){  // 创建open方法 。 下面默认行为并将opened 设为true
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        }
        $scope.disabled = function(date , mode){
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
        }

        $scope.maxDate = new Date();

        $scope.dateOptions = {
            formatYear : 'yy',
            startingDay : 1
        }


        $scope.submit = function() {
          $scope.company.companyId = companyId;
          $scope.company.establishYear = new Date($scope.company.establishYear);
          $.post(api.saveCompanyInfo,$scope.company)
            .success(function(data){
              if ('success' === data.status) {
                alert(data.message);
                $location.path('/sets');
              } else {
                alert(data.message);
              }
            });
        };


      }
    ]);

});
