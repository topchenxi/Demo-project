define(['../module'], function(ng) {
  ///seller_center/addressSetting/fetchSellerAddrInfo.cf?sellerId=1&CompanyId=1&addressManagementType=2
  ng
    .factory('addressService', ['$http', 'api',
      function($http, api) {
        return {
          //获取收货地址
          fetchSellerAddrInfo: function(params) {
            return $http.get(api.fetchSellerAddrInfo, {
              'params': params
            })
          },
          //删除收货地址
          deleteSellerAddrInfo: function(params) {
            return $http.post(api.deleteSellerAddrInfo, params)
          },
          //添加保存地址
          saveSellerAddrInfo: function(params) {
            return $http.post(api.saveSellerAddrInfo, params)
          }
        }
      }
    ])
    //收货地址
    .controller('receivingCtrl', ['$scope', '$modal','$translate', 'addressService',
      function($scope, $modal, $translate, addressService) {

        //地址最大数量
        $scope.maxCount = 5;
        //地址类型 1.收货地址; 2退货地址
        $scope.addressManagementType = 1;

        var params = {
            'sellerId': $scope.userInfo.sellerId,
            'CompanyId': $scope.userInfo.companyId,
            //地址类型  1.收货地址; 2退货地址
            'addressManagementType': 1
          }
          //获取地址
        addressService.fetchSellerAddrInfo(params)
          .success(function(data) {
            $scope.addressGather = [];
            if ('success' === data.status) {
              $scope.addressGather = data.data;
            }
          })

        //删除地址
        $scope.remove = function(index) {
          if (confirm("确认删除？")) {
            var addressManagementId = $scope.addressGather[index].addressManagementId

            addressService.deleteSellerAddrInfo({
                'addressManagementId': addressManagementId
              })
              .success(function(data) {
                if ('success' === data.status) {
                  alert("操作成功");

                  $scope.addressGather.splice(index, 1);

                } else {
                  alert(data.message)
                }
              })
          };
        }

        //修改地址
        $scope.modify = function(index) {
          var addAddress = $modal.open({
            animation: true,
            templateUrl: './controller/address/addAddress.html',
            controller: 'AddAddressCtrl',
            size: '',
            scope: $scope,
            resolve: {
              index: function() {
                return index;
              }
            }
          })
        }

        //添加地址
        $scope.add = function() {
          if ($scope.addressGather.length >= $scope.maxCount) {
            alert('最多添加5个地址');
            return;
          }
          var addAddress = $modal.open({
            animation: true,
            templateUrl: './controller/address/addAddress.html',
            controller: 'AddAddressCtrl',
            size: '',
            scope: $scope,
            resolve: {
              index: function() {
                return -1;
              }
            }
          })
        }
      }
    ])
    //退货地址
    .controller('returnsCtrl', ['$scope', '$http', '$modal', '$location', 'api', 'addressService',
      function($scope, $http, $modal, $location, api, addressService) {

        $scope.title = "退货地址"
          //地址最大数量
        $scope.maxCount = 5;
        $scope.addressManagementType = 2;
        var params = {
            'sellerId': $scope.userInfo.sellerId,
            'CompanyId': $scope.userInfo.companyId,
            //地址类型  1.收货地址; 2退货地址
            'addressManagementType': 2
          }
          //获取地址
        addressService.fetchSellerAddrInfo(params)
          .success(function(data) {
            $scope.addressGather = [];
            if ('success' === data.status) {
              $scope.addressGather = data.data;
            }
          })

        //删除地址
        $scope.remove = function(index) {
          if (confirm("确认删除？")) {
            var addressManagementId = $scope.addressGather[index].addressManagementId

            addressService.deleteSellerAddrInfo({
                'addressManagementId': addressManagementId
              })
              .success(function(data) {
                if ('success' === data.status) {
                  alert(data.message)
                  $scope.addressGather.splice(index, 1)

                } else {
                  alert(data.message)
                }
              })
          };
        }

        //修改地址
        $scope.modify = function(index) {
          console.log(index);
          var addAddress = $modal.open({
            animation: true,
            templateUrl: './controller/address/addAddress.html',
            controller: 'AddAddressCtrl',
            size: '',
            scope: $scope,
            resolve: {
              index: function() {
                return index;
              }
            }
          })
        }

        //添加地址
        $scope.add = function() {
          if ($scope.addressGather.length >= $scope.maxCount) {
            alert('最多添加5个地址');
            return;
          }
          var addAddress = $modal.open({
            animation: true,
            templateUrl: './controller/address/addAddress.html',
            controller: 'AddAddressCtrl',
            size: '',
            scope: $scope,
            resolve: {
              index: function() {
                return -1;
              }
            }
          })
        }
      }
    ])
    .controller('AddAddressCtrl', ['$scope', '$modalInstance', 'index', 'addressService', 'publicApi',
      function($scope, $modalInstance, index, addressService, publicApi) {

        if (-1 === index) {
          $scope.title = "添加地址";
          $scope.address = {}
          $scope.address.addressManagementId = '';
        } else {
          $scope.title = "修改地址";
          $scope.address = $scope.addressGather[index];
          $scope.address.addressManagementId = $scope.addressGather[index].addressManagementId;
        }

        var areaDict = $scope.areaDict = {};
        //获取国家列表
        publicApi.county()
          .success(function(data){
            if ('success' === data.status) {
              areaDict.countys = data.data;
            } else {
              alert(data.message);
            }
          });

        //地址 联级
        //获取省的地区
        publicApi.getCity('10').success(function(data){
          if ('success' === data.status) {
            areaDict.provinces = data.data;
          } else {
            alert(data.message);
          }
        });

        //市级
        $scope.$watch('address.provinceCode', function(newValue){
          publicApi.getCity('20,'+ newValue).success(function(data){
            if ('success' === data.status) {
              areaDict.citys = data.data;

              //清空
              $scope.address.regionCode = null;
              areaDict.regions = null;
            } else {
              alert(data.message);
            }
          });
        });
        //区
        $scope.$watch('address.cityCode', function(newValue){
          publicApi.getCity('30,'+ newValue).success(function(data){
            if ('success' === data.status) {
              areaDict.regions = data.data;
              console.log(areaDict.cityCode);
            } else {
              alert(data.message);
            }
          });
        });

        //判断是更新还是新政
        $scope.submit = function() {
          //卖家id
          $scope.address.sellerId = $scope.userInfo.sellerId;
          //公司id
          $scope.address.companyId = $scope.userInfo.companyId;
          //地址类型
          $scope.address.addressManagementType = $scope.addressManagementType;

          addressService.saveSellerAddrInfo($scope.address)
            .success(function(data) {
              if ('success' === data.status) {
                //判断新增还是修改
                if (-1 === index) {
                  $scope.addressGather.push($scope.address);
                } else {
                  $scope.addressGather[index] = $scope.address
                }

                $modalInstance.close();
              } else {
                alert(data.message);
              }
            })

        }
        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ])

})