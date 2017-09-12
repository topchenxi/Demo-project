define(['../module'], function(ng) {
	ng

		.factory('newclassService', ['$http', 'api', function($http, api) {
		return {
			// 获取分类列表
			getClassifyList: function(params) {
				return $http.get(api.getClassifyList, {
					'params': params
				});
			},

			// 保存分类
			saveClassify: function(params) {
				return $http.post(api.saveClassify, params);
			},

			// 删除分类
			delClassify: function(params) {
				return $http.post(api.delClassify, params)
			},

			// 获取内容列表
			getContentList: function(params) {
				return $http.get(api.getContentList, {
					'params': params
				});
			},

			// 保存内容
			saveContent: function(params) {
				return $http.post(api.saveContent, params);
			},

			// 删除内容
			delContent: function(params) {
				return $http.post(api.delContent, params)
			},

			// 发布内容
			pubContent: function(params) {
				return $http.post(api.pubContent, params)
			},

			// 获取分类列表
			getChildClassifyList: function(params) {
				return $http.get(api.getChildClassifyList, {
					'params': params
				});
			},

			// 序列号是否存在
			checkSerialNumber: function(params) {
				return $http.get(api.checkSerialNumber, {
					'params': params
				});
			},
		};
	}])

	// 帮助中心分类列表
	.controller('HelpcenterCtrl', ['$scope', '$rootScope', '$location', 'newclassService',
		'$uibModal', 'commonService', 'commonTool',
		function($scope, $rootScope, $location, newclassService,
			$uibModal, commonService, commonTool) {



			$rootScope.goCats = true;
			$scope.classname = "content-width-s";
			$scope.title = '帮助中心分类列表';
			$scope.one = '首页';

			var vm = $scope.vm = {};
			var tools = $scope.tools = {};

			//初始分页信息
			var paging = $scope.paging = {
				'page': 1,
				'pageSize': 10,

				/*搜索参数*/
				'categoryName': null,
			};

			tools.pages = [{
				"pageSize": 10,
				"pagename": "显示10条",
			}, {
				"pageSize": 20,
				"pagename": "显示20条",
			}, {
				"pageSize": 30,
				"pagename": "显示30条",
			}];

			// 获取分类列表
			tools.getclassifyList = function() {
				console.log(newclassService);
				newclassService.getClassifyList(paging)
					.success(function(data) {
						if ('success' === data.status) {
							vm.items = data.data;
							paging.total = data.page.total;

						}
					})
			}
			tools.getclassifyList();

			// 切换页码
			tools.getnewpage = function() {

				if (tools.newpagesize == null) {
					console.log('1111');
				} else {
					paging.page = tools.newpagesize;
					tools.getclassifyList();

					tools.newpagesize = null;
				}
			}


			//全选
			vm.checkAll = function(checked) {
				vm.selectionItme = [];
				angular.forEach(vm.items, function(item) {

					item.$checked = checked;
					if (true === checked) {
						vm.selectionItme.push(item.faqCategoryId);
					}
				});
				if (true !== checked) {
					vm.selectionItme = [];
				}
			};
			//定义所选择的项目
			vm.selectionItme = [];
			//获取所选的
			vm.selection = function() {
				var selectionItme = [];
				angular.forEach(vm.items, function(item) {
					if (item.$checked === true) {
						selectionItme.push(item.faqCategoryId);
					}
				});
				vm.selectionItme = selectionItme;

			};

			//修改父类
			tools.notifyclassify = function(item) {
				$scope.item = item;
				$scope.getlist = tools;

				$uibModal.open({
					animation: true,
					templateUrl: 'notifyclassify.html',
					controller: 'NotifyClassifyCtrl',
					size: '',
					scope: $scope,
					resolve: {
						index: function() {
							return -1;
						}
					}
				})
			}

			//全选或全不选
			vm.selectionItme = [];
			vm.checkAll = function(checked) {
				vm.selectionItme = [];
				angular.forEach(vm.items, function(item) {
					item.$checked = checked;
					if (true === checked) {
						vm.selectionItme.push(item.faqCategoryId);
					}
				});
			};

			//获取所选的
			vm.selection = function() {
				var selectionItme = [];
				angular.forEach(vm.items, function(item) {
					if (item.$checked === true) {
						selectionItme.push(item.faqCategoryId);
					}
				});
				vm.selectionItme = selectionItme;
			};

			//获取点击数据
			tools.getindex = function(item) {
				for (var index = 0; index < vm.items.length; index++) {
					if (vm.items[index].faqCategoryId == item.faqCategoryId) {
						item.$checked = !item.$checked;
						if (item.$checked == true) vm.selectionItme.push(item.faqCategoryId);
						if (item.$checked == false) vm.selectionItme.pop(item.faqCategoryId);
					}
				}
			}

			// 删除分类
			tools.del = function(itemId) {
				var faqCategoryIds = "";
				if (commonTool.isEmpty(itemId)) {
					vm.allChecked = false;
					faqCategoryIds = vm.selectionItme.join(',');
					if (commonTool.isEmpty(faqCategoryIds)) {
						alert("请先选择要删除的分类!");
						return;
					}
				} else {
					faqCategoryIds = itemId;
				}
				var pag = {
					'faqCategoryIds': faqCategoryIds,
				};
				newclassService.delClassify(pag).success(function(data) {
					tools.getclassifyList();
					if ('success' == data.status) {
						alert('成功');
					} else {
						alert("请先选择要删除的分类!");
					}
				});
			}

			// 添加父类
			tools.addclassify = function() {
				$scope.getlist = tools;
				$uibModal.open({
					animation: true,
					templateUrl: 'addclassify.html',
					controller: 'AddClassifyCtrl',
					size: '',
					scope: $scope,
					resolve: {
						index: function() {
							return -1;
						}
					}
				})

				tools.getclassifyList();
			}

			// 子分类列表
			tools.childclassify = function(faqCategoryId) {
				$location.path('/helpcenter/childclassifylist').search({
					'faqCategoryId': faqCategoryId
				});
			}

			//搜索
			tools.search = function() {
				tools.getclassifyList();
			}
		}
	])

	// 子分类列表
	.controller('childclassifyCtrl', ['$scope', '$location', 'newclassService', '$uibModal', 'commonService', 'commonTool',
		function($scope, $location, newclassService, $uibModal, commonService, commonTool) {

			$scope.title = '子分类列表';
			var vm = $scope.vm = {};
			var search = $location.search();
			var tools = $scope.tools = {};

			//初始分页信息
			var paging = $scope.paging = {
				'page': 1,
				'pageSize': 10,

				/*搜索参数*/
				'categoryName': null,
			};

			tools.pages = [{
				"pageSize": 10,
				"pagename": "显示10条",
			}, {
				"pageSize": 20,
				"pagename": "显示20条",
			}, {
				"pageSize": 30,
				"pagename": "显示30条",
			}];

			tools.faqCategoryId = parseInt(search.faqCategoryId);

			var id = tools.faqCategoryId;
			tools.getChildClassifyList = function() {
				paging.parentId = tools.faqCategoryId;
				newclassService.getChildClassifyList(paging)
					.success(function(data) {
						if ('success' === data.status) {

							vm.items = data.data;
							console.log(vm.items);
							paging.total = data.page.total;
						}
					})
			}
			tools.getChildClassifyList();


			tools.getnewpage = function() {

				if (tools.newpagesize == null) {
					console.log('1111');
				} else {
					paging.page = tools.newpagesize;
					tools.getChildClassifyList();

					tools.newpagesize = null;
				}
			}

			tools.getContentpage = function(faqCategoryId) {
				$location.path('/helpcenter/contentlist').search({
					'faqCategoryId': faqCategoryId,
					'id': id,
				});

			}


			tools.back = function() {
				$location.path('/helpcenter/classifylist');
			}

			tools.delclassify = function(faqCategoryId) {
				paging = {
					'faqCategoryIds': faqCategoryId,
				};
				newclassService.delClassify(paging).success(function(data) {
					tools.getChildClassifyList();
					if ('success' == data.status) {

						alert('成功');
					} else {
						alert('失败');
					}
				});

			}

			// 修改子类
			tools.notifyclassify = function(item) {
				$scope.newitem = item;
				$scope.getlist = tools;
				$uibModal.open({
					animation: true,
					templateUrl: 'notifyclassify.html',
					controller: 'NotifyChildClassify',
					size: '',
					scope: $scope,
					resolve: {
						index: function() {
							return -1;
						}
					}
				})


			}


			// 添加子类
			tools.addchildclassify = function() {
				$scope.getlist = tools;
				$uibModal.open({
					animation: true,
					templateUrl: 'addchildclassify.html',
					controller: 'AddChildClassifyCtrl',
					size: '',
					scope: $scope,
					resolve: {
						index: function() {
							return -1;
						}
					}
				})
			}

			//全选或全不选
			vm.selectionItme = [];
			vm.checkAll = function(checked) {
				vm.selectionItme = [];
				angular.forEach(vm.items, function(item) {

					item.$checked = checked;
					if (true === checked) {
						vm.selectionItme.push(item.faqCategoryId);
					}
				});
			};

			//获取所选的
			vm.selection = function() {
				var selectionItme = [];
				angular.forEach(vm.items, function(item) {
					if (item.$checked === true) {
						selectionItme.push(item.faqCategoryId);
					}

				});
				console.log(selectionItme);
				vm.selectionItme = selectionItme;
			};

			tools.getindex = function(item) {
				for (var index = 0; index < vm.items.length; index++) {
					if (vm.items[index].faqCategoryId == item.faqCategoryId) {
						item.$checked = !item.$checked;
						if (item.$checked == true) vm.selectionItme.push(item.faqCategoryId);
						if (item.$checked == false) vm.selectionItme.pop(item.faqCategoryId);
					}
				}
			}

			// 删除子类
			tools.del = function(itemId) {
				console.log('delete');
				var faqCategoryIds = "";
				if (commonTool.isEmpty(itemId)) {
					vm.allChecked = false;
					faqCategoryIds = vm.selectionItme.join(',');
					if (commonTool.isEmpty(faqCategoryIds)) {
						alert("请先选择要删除的分类!");
						return;
					}
				} else {
					faqCategoryIds = itemId;
				}

				var pag = {
					'faqCategoryIds': faqCategoryIds,
				};
				newclassService.delClassify(pag).success(function(data) {
					tools.getChildClassifyList();
					if ('success' == data.status) {

						alert('成功');
					} else {
						alert('失败');
					}
				});
			}

			// 搜索
			tools.search = function() {
				tools.getChildClassifyList();
			}



		}
	])

	//帮助中心内容列表
	.controller('ContentCtrl', ['$scope', '$location', 'newclassService',
		'$uibModal', 'commonService', 'commonTool',
		function($scope, $location, newclassService,
			$uibModal, commonService, commonTool) {

			$scope.title = '帮助中心内容列表';

			var vm = $scope.vm = {};
			var tools = $scope.tools = {};
			var search = $location.search();

			//初始分页信息
			var paging = $scope.paging = {
				'page': 1,
				'pageSize': 10,

				/*搜索参数*/
				'contentTitle': null,
				'categoryName': null,
			};

			tools.pages = [{
				"pageSize": 10,
				"pagename": "显示10条",
			}, {
				"pageSize": 20,
				"pagename": "显示20条",
			}, {
				"pageSize": 30,
				"pagename": "显示30条",
			}];

			tools.faqCategoryId = parseInt(search.faqCategoryId);
			tools.id = parseInt(search.id);
			// 获取内容列表
			tools.getContentList = function() {

				paging.faqCategoryId = tools.faqCategoryId;
				newclassService.getContentList(paging)
					.success(function(data) {
						if ('success' === data.status) {
							vm.items = data.data;
							console.log(vm.items);
							paging.total = data.page.total;
						}
					})
			}
			tools.getContentList();
			// 跳转
			tools.getnewpage = function() {

				if (tools.newpagesize == null) {
					console.log('1111');
				} else {
					paging.page = tools.newpagesize;
					tools.getContentList();

					tools.newpagesize = null;
				}
			}
			// 发布
			tools.publishContent = function(contentitem) {
				console.log(contentitem);
				var params = {
					faqContentIds: contentitem.contentId
				}
				newclassService.pubContent(params)
					.success(function(data) {
						if ('success' === data.status) {
							alert('发布成功');
							tools.getContentList();
						} else {
							alert('发布失败');
						}
					})
			}
			// 返回
			tools.back = function() {
				$location.path('/helpcenter/childclassifylist').search({
					'faqCategoryId': tools.id
				});
			}
			// 删除内容
			tools.delContent = function(item) {
				paging = {
					'faqContentIds': item.contentId,
				};
				newclassService.delContent(paging).success(function(data) {
					tools.getContentList();
					if ('success' == data.status) {

						alert('成功');
					} else {
						alert('失败');
					}
				});

			}
			// 修改内容
			tools.notifycontent = function(item) {
				$scope.getlist = tools;
				$scope.newitem = item;
				$scope.faqCategoryId = tools.id;
				$uibModal.open({
					animation: true,
					templateUrl: 'notifycontent.html',
					controller: 'NotifyContentCtrl',
					size: '',
					scope: $scope,
					resolve: {
						index: function() {
							return -1;
						}
					}
				})
			}
			// 添加内容
			tools.addcontent = function() {
				$scope.getlist = tools;
				$scope.a = tools.id;
				$uibModal.open({
					animation: true,
					templateUrl: 'addcontent.html',
					controller: 'AddContentCtrl',
					size: '',
					scope: $scope,
					resolve: {
						index: function() {
							return -1;
						}
					}
				})
			}

			//全选或全不选
			vm.selectionItme = [];
			vm.checkAll = function(checked) {
				vm.selectionItme = [];
				angular.forEach(vm.items, function(item) {
					item.$checked = checked;
					if (true === checked) {
						vm.selectionItme.push(item.contentId);
					}
				});
			};

			//获取所选的
			vm.selection = function() {
				var selectionItme = [];
				angular.forEach(vm.items, function(item) {
					if (item.$checked === true) {
						selectionItme.push(item.contentId);
					}
				});
				console.log(selectionItme);
				vm.selectionItme = selectionItme;
			};


			tools.getindex = function(item) {
				for (var index = 0; index < vm.items.length; index++) {
					if (vm.items[index].contentId == item.contentId) {

						item.$checked = !item.$checked;
						if (item.$checked == true) vm.selectionItme.push(item.contentId);
						if (item.$checked == false) vm.selectionItme.pop(item.contentId);
					}
				}
			}

			// 删除
			tools.del = function(itemId) {
				console.log('delete');
				var faqContentIds = "";
				if (commonTool.isEmpty(itemId)) {
					//批量
					console.log("批量:" + vm.selectionItme);
					vm.allChecked = false;
					faqContentIds = vm.selectionItme.join(',');
					if (commonTool.isEmpty(faqContentIds)) {
						alert("请先选择要删除的分类!");
						return;
					}
				} else {
					//单个
					faqContentIds = itemId;
					console.log("单个:" + itemId);

				}

				pag = {
					'faqContentIds': faqContentIds,
				};
				newclassService.delContent(pag).success(function(data) {
					tools.getContentList();
					if ('success' == data.status) {
						alert('成功');
					} else {
						alert('失败');
					}
				});
			}

			tools.search = function() {

				tools.getContentList();
			}
		}
	])

	//添加内容
	.controller('AddContentCtrl', ['$scope', '$location', 'newclassService', '$uibModalInstance',
		'$uibModal', 'commonService', 'commonTool',
		function($scope, $location, newclassService, $uibModalInstance, $uibModal,
			commonService, commonTool) {

			var vm = $scope.vm = {};
			var tools = $scope.tools = {};
			var item = $scope.item = {};
			var a = $scope.a;

			var paging = $scope.paging;
			var getlist = $scope.getlist;
			var par = {};

			// 获取分类列表
			tools.getChildClassifyList = function() {
				par = {
					'parentId': a
				}

				newclassService.getChildClassifyList(par)
					.success(function(data) {
						if ('success' === data.status) {
							vm.items = data.data;
							tools.classifys = vm.items;
						}
					})
			}

			tools.getChildClassifyList();

			// 关闭窗口
			$scope.close = function() {
				$uibModalInstance.dismiss('cancel');
			}

			// 保存内容
			$scope.submit = function() {
				if (null == paging.faqCategoryId) {
					alert('请先选择分类');
				} else if (null == item.contentTitle || "" == item.contentTitle) {
					alert('请先填写标题');
				} else {
					console.log(item.contentDetail);
					item.faqCategoryId = paging.faqCategoryId;
					newclassService.saveContent(item).success(function(data) {
						if ('success' == data.status) {
							alert('成功');
						} else {
							alert('失败');
						}
						getlist.getContentList();
					});
					$uibModalInstance.dismiss('cancel');
				}
			}
		}
	])

	//修改内容
	.controller('NotifyContentCtrl', ['$scope', '$location', 'newclassService', '$uibModalInstance',
		'$uibModal', 'commonService', 'commonTool',
		function($scope, $location, newclassService, $uibModalInstance, $uibModal,
			commonService, commonTool) {

			var tools = $scope.tools = {};
			var newitem = $scope.newitem;
			var getlist = $scope.getlist;
			var a = $scope.a;
			var faqCategoryId = $scope.faqCategoryId;
			console.log(newitem.contentDetail);
			var item = $scope.item = {
				'contentId': newitem.contentId,
				'faqCategoryId': newitem.faqCategoryId,
				'creator': null,
				'editor': null,
				'publisher': newitem.publisher,
				'contentTitle': newitem.contentTitle,
			};
			if (newitem.contentDetail != null) {
				item.contentDetail = newitem.contentDetail;
			}
			var vm = $scope.vm = {};
			var paging = $scope.paging;

			// 获取分类
			tools.getChildClassifyList = function() {
				par = {
					'parentId': faqCategoryId
				}
				newclassService.getChildClassifyList(par)
					.success(function(data) {
						if ('success' === data.status) {
							vm.items = data.data;
							tools.classifys = vm.items;
						}
					})
			}
			tools.getChildClassifyList();

			// 关闭窗口
			$scope.close = function() {
				$uibModalInstance.dismiss('cancel');
			}

			// 修改内容
			$scope.submit = function() {

				if (null == paging.faqCategoryId) {
					alert('请先选择分类');
				} else if (null == item.contentTitle || "" == item.contentTitle) {
					alert('请先填写标题');
				} else {
					item.faqCategoryId = paging.faqCategoryId;
					newclassService.saveContent(item).success(function(data) {
						if ('success' == data.status) {
							console.log('修改成功');
							getlist.getContentList();
						} else {
							alert('修改失败');
						}
					});
					$uibModalInstance.dismiss('cancel');
				}
			}

			// 发布
			$scope.savepublish = function() {
				$scope.submit();
				var params = {
					faqContentIds: newitem.contentId
				}
				newclassService.pubContent(params)
					.success(function(data) {
						if ('success' === data.status) {
							alert('发布成功');
							getlist.getContentList();
						} else {
							alert('发布失败');
						}
					})
			}
		}
	])

	//添加父类
	.controller('AddClassifyCtrl', ['$scope', '$location', 'newclassService', '$uibModalInstance',
		'$uibModal', 'commonService', 'commonTool',
		function($scope, $location, newclassService, $uibModalInstance, $uibModal,
			commonService, commonTool) {

			var additem = $scope.additem = {};

			var tools = $scope.tools = {};
			var getlist = $scope.getlist;

			// 关闭窗口
			$scope.close = function() {

				$uibModalInstance.dismiss('cancel');
			}

			// 添加分类
			$scope.submit = function() {
				if (null == additem.categoryName) {
					alert('请先填写分类名称');
				} else {
					if (null == additem.serialNumber) {
						alert('请先填写序列号');
					} else
					if (additem.serialNumber >= 4294967295) {
						console.log(additem.serialNumber.length);
						alert('序列号不能大于4294967295');
					} else {

						var checksn = {
							serialNumber: additem.serialNumber
						};
						console.log(checksn);
						newclassService.checkSerialNumber(checksn).success(function(data) {
							if ('success' == data.status) {
								additem = {
									'faqCategoryId': null,
									'parentId': null,
									'categoryType': 0,
									'editor': null,
									'categoryName': additem.categoryName,
									'serialNumber': additem.serialNumber,
									'creator': null,
									'remark': additem.remark,
								};
								newclassService.saveClassify(additem).success(function(data) {

									if ('success' == data.status) {
										alert('保存成功');
										getlist.getclassifyList();
									} else {
										alert('保存失败');
									}
								});
								$uibModalInstance.dismiss('cancel');
							} else {
								alert("序列号存在");
							}
						});
					}
				}
			}
		}
	])

	//添加子类
	.controller('AddChildClassifyCtrl', ['$scope', '$location', 'newclassService', '$uibModalInstance',
		'$uibModal', 'commonService', 'commonTool',
		function($scope, $location, newclassService, $uibModalInstance, $uibModal,
			commonService, commonTool) {

			var additem = $scope.additem = {};
			var vm = $scope.vm = {};
			//页面其他数据，方法
			var tools = $scope.tools = {};
			var getlist = $scope.getlist;
			//初始分页信息
			var paging = $scope.paging;



			tools.getClassifyList = function() {
				var par = {};
				newclassService.getClassifyList(par)
					.success(function(data) {
						tools.classifys = data.data;
					})
			}

			tools.getClassifyList();

			paging.faqCategoryId = $scope.paging.parentId;


			$scope.close = function() {

				$uibModalInstance.dismiss('cancel');
			}

			$scope.submit = function() {
				if (null == paging.faqCategoryId) {
					alert('请先选择类别');
				} else if (null == additem.serialNumber || additem.serialNumber == '') {
					alert('请先填写序列号')
				} else if (additem.serialNumber >= 4294967295) {
					console.log(additem.serialNumber.length);
					alert('序列号不能大于4294967295');
				} else {
					var checksn = {
						serialNumber: additem.serialNumber
					};
					console.log(checksn);
					newclassService.checkSerialNumber(checksn).success(function(data) {
						if ('success' == data.status) {
							additem = {
								'faqCategoryId': null,
								'parentId': paging.faqCategoryId,
								'categoryType': 1,
								'editor': null,
								'categoryName': additem.categoryName,
								'serialNumber': additem.serialNumber,
								'creator': null,
								'remark': additem.remark,
							};
							newclassService.saveClassify(additem).success(function(data) {
								if ('success' == data.status) {
									alert('成功');
								} else {
									alert('失败');
								}
								getlist.getChildClassifyList();
							});
							$uibModalInstance.dismiss('cancel');
						} else {
							alert("序列号存在");
						}
					});


				}
			}
		}
	])

	//修改子类
	.controller('NotifyChildClassify', ['$scope', '$location', 'newclassService', '$uibModalInstance',
		'$uibModal', 'commonService', 'commonTool',
		function($scope, $location, newclassService, $uibModalInstance, $uibModal,
			commonService, commonTool) {

			var newitem = $scope.newitem;
			var additem = $scope.additem = newitem;
			var cn = additem.serialNumber;
			var vm = $scope.vm = {};
			//页面其他数据，方法
			var tools = $scope.tools = {};
			var getlist = $scope.getlist;



			//初始分页信息
			var paging = $scope.paging;



			tools.getClassifyList = function() {
				var par = {};
				newclassService.getClassifyList(par)
					.success(function(data) {
						tools.classifys = data.data;
					})
			}

			tools.getClassifyList();

			paging.faqCategoryId = $scope.paging.parentId;

			$scope.close = function() {
				getlist.getChildClassifyList();
				$uibModalInstance.dismiss('cancel');
			}

			$scope.submit = function() {
				console.log(cn);
				if (additem.serialNumber == null || additem.serialNumber == '') {
					alert('请先填写序列号');
				} else if (additem.serialNumber >= 4294967295) {
					console.log(additem.serialNumber.length);
					alert('序列号不能大于4294967295');
				} else {
					if (null == paging.faqCategoryId) {
						alert('请先选择分类');
					} else {

						if (cn == additem.serialNumber) {

							additem = {
								'faqCategoryId': additem.faqCategoryId,
								'parentId': paging.faqCategoryId,
								'categoryType': 0,
								'editor': null,
								'categoryName': additem.categoryName,
								'serialNumber': additem.serialNumber,
								'creator': null,
								'remark': additem.remark,
							};
							newclassService.saveClassify(additem).success(function(data) {
								if ('success' == data.status) {
									alert('成功');
									getlist.getChildClassifyList();
								} else {
									alert('失败');
								}
							});
							$uibModalInstance.dismiss('cancel');
						} else {
							var checksn = {
								serialNumber: additem.serialNumber
							};
							console.log(checksn);
							newclassService.checkSerialNumber(checksn).success(function(data) {
								if ('success' == data.status) {
									additem = {
										'faqCategoryId': additem.faqCategoryId,
										'parentId': null,
										'categoryType': 0,
										'editor': null,
										'categoryName': additem.categoryName,
										'serialNumber': additem.serialNumber,
										'creator': null,
										'remark': additem.remark,
									};
									newclassService.saveClassify(additem).success(function(data) {
										if ('success' == data.status) {
											alert('成功');
											getlist.getChildClassifyList();
										} else {
											alert('失败');
										}
									});
									$uibModalInstance.dismiss('cancel');
								} else {
									alert("序列号存在");
								}
							});
						}
					}
				}
			}
		}
	])

	//修改父类
	.controller('NotifyClassifyCtrl', ['$scope', '$location', 'newclassService', '$uibModalInstance',
		'$uibModal', 'commonService', 'commonTool',
		function($scope, $location, newclassService, $uibModalInstance, $uibModal,
			commonService, commonTool) {

			var newitem = $scope.item;
			var additem = $scope.additem = newitem;
			var vm = $scope.vm = {};
			var sn = additem.serialNumber;
			//页面其他数据，方法
			var tools = $scope.tools = {};
			var getlist = $scope.getlist;

			$scope.close = function() {
				getlist.getclassifyList();
				$uibModalInstance.dismiss('cancel');
			}

			$scope.submit = function() {
				console.log(sn);

				if (null == additem.categoryName || additem.serialNumber == '') {
					alert('请先填写分类名称');
				} else if (null == additem.serialNumber || additem.serialNumber == '') {
					alert('请先填写序列号')
				} else if (additem.serialNumber >= 4294967295) {
					console.log(additem.serialNumber.length);
					alert('序列号不能大于4294967295');
				} else {
					if (sn == additem.serialNumber) {
						console.log('相同');
						additem = {
							'faqCategoryId': additem.faqCategoryId,
							'parentId': null,
							'categoryType': 0,
							'editor': null,
							'categoryName': additem.categoryName,
							'serialNumber': additem.serialNumber,
							'creator': null,
							'remark': additem.remark,
						};
						newclassService.saveClassify(additem).success(function(data) {
							if ('success' == data.status) {
								alert('成功');
								getlist.getclassifyList();
							} else {
								alert('失败');
							}
						});
						$uibModalInstance.dismiss('cancel');
					} else {
						console.log('不相同');
						var checksn = {
							serialNumber: additem.serialNumber
						};
						console.log(checksn);
						newclassService.checkSerialNumber(checksn).success(function(data) {
							if ('success' == data.status) {
								additem = {
									'faqCategoryId': additem.faqCategoryId,
									'parentId': null,
									'categoryType': 0,
									'editor': null,
									'categoryName': additem.categoryName,
									'serialNumber': additem.serialNumber,
									'creator': null,
									'remark': additem.remark,
								};
								newclassService.saveClassify(additem).success(function(data) {
									if ('success' == data.status) {
										alert('成功');
										getlist.getclassifyList();
									} else {
										alert('失败');
									}
								});
								$uibModalInstance.dismiss('cancel');
							} else {
								alert("序列号存在");
							}
						});
					}
				}
			}
		}
	])

	.filter('setPublishStatus', function() {
		return function(isPublish) {
			var str = null;
			if (isPublish == 1) {
				str = "已发布";
			} else {
				str = "未发布";
			}
			return str;
		};
	});

});