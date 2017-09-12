define(['../module'], function(ng) {
	ng
		.factory('categoryattributeServer', ['$http', 'api', function($http, api) {
			return {

				// 获取行业列表
				getIndustryList: function(params) {
					return $http.get(api.getIndustryList, {
						'params': params
					});
				},
				// 获取类目列表
				getCategoryList: function(params) {
					return $http.get(api.getCategoryList, {
						'params': params
					});
				},
				// 获取属性列表
				getAttributeList: function(params) {
					return $http.get(api.getAttributeList, {
						'params': params
					});
				},

				// 保存行业
				saveIndustry: function(params) {
					return $http.post(api.saveIndustry, params);
				},

				// 保存类目
				saveCategory: function(params) {
					return $http.post(api.saveCategory, params);
				},

				// 保存属性
				saveAttribute: function(params) {
					return $http.post(api.saveAttribute, params);
				},

				// 删除行业
				delIndustry: function(params) {
					return $http.post(api.delIndustry, params)
				},

				// 删除类目
				delCategory: function(params) {
					return $http.post(api.delCategory, params)
				},

				// 删除属性
				delIndustry: function(params) {
					return $http.post(api.delIndustry, params)
				},


			};
		}])



	/*行业列表*/
	.controller('CategoryattributeCtrl', ['$scope', '$location', '$uibModal', 'categoryattributeServer', 'commonService', 'commonTool',
		function($scope, $location, $uibModal, categoryattributeServer, commonService, commonTool) {
			console.log('CategoryattributeCtrl');
			$scope.title = '行业列表';

			var vm = $scope.vm = {};
			//页面其他数据，方法
			var tools = $scope.tools = {};

			//初始分页信息
			var paging = $scope.paging = {
				'page': 1,
				'pageSize': 10,

				/*搜索参数*/
				'value': null,
				'qValue': null,
			};


			tools.conditionTypeList = [{
				"title": "行业中文名称",
				"value": "industrychname;"
			}, {
				"title": "行业英文名称",
				"value": "industryenname"
			}, ];


			// 获取行业列表
			tools.getIndustryList = function() {
				// console.log('list');
				// categoryattributeServer.getIndustryList(paging).success(function(data) {
				// 	if ('success' == data.status) {
				// 		vm.items = data.data;
				// 		paging.total = data.page.total;
				// 	}
				// })
			}


			// 跳转类目列表
			tools.toCategoryList = function(item) {
				$location.path('/categoryattribute/categorylist').search({
					'item': item
				});
			}

			tools.reset = function() {
				console.log('重置');
				paging.qValue = null;
			}

			tools.search = function() {
				if (paging.value == null) {
					paging.value = 'industrychname';
				}
				console.log(paging.value);
				console.log(paging.qValue);
			}

			tools.sealstop = function() {

				console.log('封停');
			}


			tools.saveindustry = function() {
				console.log('11');
				$location.path('/categoryattribute/saveindustry').search({
					//'item': item
				});
			}
		}
	])

	/*类目列表*/
	.controller('CategoryCtrl', ['$scope', '$location', '$uibModal', 'categoryattributeServer', 'commonService', 'commonTool',
		function($scope, $location, $uibModal, categoryattributeServer, commonService, commonTool) {

			console.log('CategoryCtrl');
			//$scope.title = 'CategoryCtrl';
			$scope.title = '类目列表';

			var vm = $scope.vm = {};
			//页面其他数据，方法
			var tools = $scope.tools = {};

			var search = $location.search();
			var industryItem = parseInt(search.item);

			//初始分页信息
			var paging = $scope.paging = {
				'page': 1,
				'pageSize': 10,

				/*搜索参数*/
				'value': null,
				'qValue': null,
			};

			tools.conditionTypeList = [{
				"title": "类目中文名称",
				"value": "categorychname"
			}, {
				"title": "类目英文名称",
				"value": "categoryenname"
			}, ]


			//获取类目列表
			tools.getCategoryList = function() {

				// categoryattributeServer.getCategoryList(paging).success(
				// 	function(data) {
				// 		if ('success' == data.status) {
				// 			vm.items = data.data;
				// 			paging.total = data.page.total;
				// 		}
				// 	})
			}

			// 专业类目
			tools.transfercategory = function() {
				console.log('转移类目');
			}

			// 复制类目
			tools.copycategory = function() {
				console.log('复制类目');
			}

			// 封停
			tools.sealstop = function() {
				console.log('封停');
			}

			// 跳转到属性列表
			tools.toAttributeList = function(item) {
				$loaction.path('/categoryattribute/attributelist').search({
					'item': item
				});
			}

			//重置
			tools.reset = function() {
				console.log('重置');
				paging.qValue = null;
			}

			//添加修改类目
			tools.savecategory = function() {
				console.log('11');
				$location.path('/categoryattribute/savecategory').search({
					//'item': item
				});
			}

			//添加属性规格
			tools.saveattribute = function() {
				console.log('111');
				$location.path('/categoryattribute/saveattribute').search({
					// 'item':item
				})
			}
		}
	])

	/*属性列表*/
	.controller('AttributeCtrl', ['$scope', '$location', '$uibModal', 'categoryattributeServer', 'commonService', 'commonTool',
		function($scope, $location, $uibModal, categoryattributeServer, commonService, commonTool) {

			console.log('AttributeCtrl');
			$scope.title = '属性列表';

			var vm = $scope.vm = {};
			//页面其他数据，方法
			var tools = $scope.tools = {};

			var search = $location.search();
			var categoryItem = parseInt(search.item);
			//初始分页信息
			var paging = $scope.paging = {
				'page': 1,
				'pageSize': 10,

				/*搜索参数*/
				'qKey': null,
				'qValue': null,
			};

			tools.conditionTypeList = [{
				"title": "属性中文名称",
				"value": "attributechname"
			}, {
				"title": "属性英文名称",
				"value": "attributeenname"
			}, ]

			tools.reset = function() {
				console.log('重置');
			}

			// 获取属性列表
			tools.getAttributeList = function() {

				// categoryattributeServer.getAttribute(paging).success(
				// 	function(data) {
				// 		if ('success' == data.status) {
				// 			vm.items = data.data;
				// 			paging.total = data.page.total;
				// 		}
				// 	})
			}

			// 保存属性
			tools.saveattribute = function() {
				console.log('111');
				$location.path('/categoryattribute/saveattribute').search({
					// 'item':item
				})
			}
		}
	])

	/*添加行业*/
	.controller('AddIndustryCtrl', ['$scope', '$location', '$uibModal', 'categoryattributeServer', 'commonService', 'commonTool',
		function($scope, $location, $uibModal, categoryattributeServer, commonService, commonTool) {
			//console.log('添加行业');

			var vm = $scope.vm = {};

			$scope.upload = function(files, name) {
				if (files && files.length) {
					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						Upload.upload({
							url: alias.uploadImage,
							file: file
						}).progress(function(evt) {
							var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							$scope.log = 'progress: ' + progressPercentage + '% ' +
								evt.config.file.name + '\n' + $scope.log;
						}).success(function(data, status, headers, config) {
							//vm.bizCodeImg = data.data.url;
							console.log(data.data.url);
						});
					}
				}
			};

			$scope.submit = function() {
				console.log(vm.industrychname);
				console.log(vm.industryenname);
				console.log(vm.industryimg);
				console.log(vm.sort);
				console.log(vm.check);
			}

			$scope.close = function() {
				$location.path('/categoryattribute/industrylist').search({
					// 'item':item
				})
			}

		}
	])

	/*添加类目*/
	.controller('AddCategoryCtrl', ['$scope', '$location', '$uibModal', 'categoryattributeServer', 'commonService', 'commonTool',
		function($scope, $location, $uibModal, categoryattributeServer, commonService, commonTool) {

			//判断是更新还是添加
			var vm = $scope.vm = {};
			console.log('添加111');


			$scope.submit = function() {
				console.log(vm.industrychname);
				console.log(vm.industryenname);
				console.log(vm.industryimg);
				console.log(vm.sort);
				console.log(vm.check);
			}

			$scope.close = function() {
				console.log('11');
				$location.path('/categoryattribute/category')			}
		}
	])

	/*添加属性*/
	.controller('AddAttributeCtrl', ['$scope', '$location', '$uibModal', 'categoryattributeServer', 'commonService', 'commonTool',
		function($scope, $location, $uibModal, categoryattributeServer, commonService, commonTool) {
			//判断是更新还是添加

			var vm = $scope.vm = {};
			console.log('添加111');


			$scope.submit = function() {
				console.log(vm.industrychname);
				console.log(vm.industryenname);
				console.log(vm.industryimg);
				console.log(vm.sort);
				console.log(vm.check);
			}

			$scope.close = function() {
				console.log('11');
				$uibModalInstance.dismiss('cancel');
			}
		}
	])


	.filter('setImgSize', function() {
		return function(sImg, width, height, type) {
			width = width ? width : '180';
			height = height ? height : '180';
			type = type ? 　type : '2';
			var img;
			if (sImg) {
				img = sImg.split(',')[0];
				img = 'http://192.168.10.17' + img.slice(0, img.lastIndexOf('.')) + '_' +
					width + 'x' + height + '_' + type + img.slice(img.lastIndexOf('.'));
			} else {
				img = '/pubpage/view/images/default-img.jpg';
			}
			return img;
		};
	})

});