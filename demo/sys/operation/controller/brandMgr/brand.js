define(['../module'],function(ng){
	ng
	// ********服务层 [[
	.factory('brandService', ['$http', 'api', function($http, api) {
      return {
		// 111 品牌分类管理
        getClassifyList: function(params) {
          return $http.get(api.getClassifyList,{'param':params});
        },

        // 112 品牌库管理
        getBaseList: function(params) {
          return $http.get(api.getBaseList, {
            'params': params
          });
        },

        // 113 品牌审核管理
        getAuditList: function(params) {
          return $http.get(api.getAuditList, {
            'params': params
          });
        },

        // 114 企业品牌管理
        getEnterpriseBrandList: function(params) {
          return $http.get(api.getEnterpriseBrandList, {
            'params': params
          });
        },
		// 115 企业品牌有效期查看
        getValidDateList: function(params) {
            return $http.get(api.getValidDateList, {
                'params': params
            });
        }

      };
    }])
	// ********服务层 ]]
	
	// ********控制器 [[
	// 111 品牌分类管理
	.controller('ClassifyListCtrl', ['$scope','$uibModal','brandService', function($scope,$uibModal,service){
			console.log('ClassifyListCtrl');
            var tools = $scope.tools = {};
            var vm = $scope.vm = {};

            // 添加或修改时打开子窗口
            tools.updateClassify = function(id){
                var param = {};
                param.type = "add";
                // Todo 如果是更改,获取要更改的数据
                var item = null;
                if(id != null ){
                    param.type = "update";
                    param.item = item;
                }
                $uibModal.open({
                    animation: true,
                    templateUrl: './controller/brandMgr/classifyUpdate.html',
                    controller: 'ClassifyUpdateCtrl',
                    scope: $scope,
                    resolve: {
                        param: function(){
                            return angular.copy(param);
                        }
                    }
                })
            };
		}])
        .controller('ClassifyUpdateCtrl', ['$scope','brandService','param',function($scope,service,param){
            console.log('ClassifyUpdateCtrl==',param);
            var vm = $scope.vm = {};
            vm.item = {};
            vm.title = "新增分类";
            if(param.type == "update"){
                vm.title = "修改分类";
                vm.item = param.item;
            }



        }])


	// 112 品牌库管理
	.controller('BaseListCtrl', ['$scope', function($scope){
			console.log('BaseListCtrl');
		}])
	
	// 113 企业品牌授权管理
	.controller('EnterpriseBrandListCtrl', ['$scope', function($scope){
			
			console.log('EnterpriseBrandListCtrl');
		}])
	
	// 114 企业品牌有效期查看
	.controller('ValidDateListCtrl', ['$scope', function($scope){
			console.log('ValidDateListCtrl');
		}])

	// ********控制器 ]]
	
	// ********过滤器
		
})