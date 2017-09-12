define(['../module'], function(ng) {
    ng.factory('keywordMgrService', ['$http', 'api', function($http, api) {
        return {
            getProductKwList: function(params) {
                return $http.get(api.getProductKwList, {
                    params: params
                });
            },
            getProductKwDetail: function(params) {
                return $http.get(api.getProductKwDetail, {
                    params: params
                });
            },
            addOrUpdateProductKw: function(params) {
                return $http.post(api.addOrUpdateProductKw, params);
            },
            deleteProductKw: function(params) {
                return $http.post(api.deleteProductKw, params);
            },

            exportProductKw: function(params) {
                console.log(params);
                var keywordParams = '';
                var indusIdParams = '';
                if (params.keyword) {
                    keywordParams = 'keyword=' + params.keyword + '&';
                }
                if (params.indusId) {
                    indusIdParams = 'indusId=' + params.indusId;
                }
                var url = api.exportProductKw + '?' + keywordParams + indusIdParams;
                window.open(url);
            },
            importProductKw: function(params) {
                return $http.get(api.importProductKw, {
                    'params': params
                });
            },


            getSellerKwList: function(params) {
                return $http.get(api.getSellerKwList, {
                    params: params
                });
            },
            getSellerKwDetail: function(params) {
                return $http.get(api.getSellerKwDetail, {
                    params: params
                });
            },
            addOrUpdateSellerKw: function(params) {
                return $http.post(api.addOrUpdateSellerKw, params);
            },

            exportSellerKw: function(params) {
                console.log(params);
                var keywordParams = '';
                var indusIdParams = '';
                if (params.keyword) {
                    keywordParams = 'keyword=' + params.keyword + '&';
                }
                if (params.indusId) {
                    indusIdParams = 'indusId=' + params.indusId;
                }
                var url = api.exportSellerKw + '?' + keywordParams + indusIdParams;
                window.open(url);
            },
            importSellerKw: function(params) {
                return $http.get(api.importSellerKw, {
                    'params': params
                });
            },
            deleteSellerKw: function(params) {
                return $http.post(api.deleteSellerKw, params);
            }
        };
    }]).controller('productKwListCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        'Upload',
        'api',
        '$location',
        'keywordMgrService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog, Upload, api, $location, keywordMgrService, commonService, commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {

                page: 1,
                pageSize: 10,

                indusId: null,
                keyword: null
            };

            vm.selectionItme = [];

            vm.showOperateFlag = false;

            vm.exportFlag = true;

            tools = $.extend(tools, {
                getProductKwList: function() {
                    vm.allChecked = false;
                    vm.showOperateFlag = false;
                    keywordMgrService.getProductKwList(commonTool.filterParam(paging)).success(function(data) {
                        vm.items = data.data;
                        paging.total = data.page.total;
                        // paging.pageSize = data.page.total;
                    });
                },
                checkAll: function(checked) {
                    vm.selectionItme = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {
                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionItme.push(item.keyId);
                        }
                    });
                },
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.keyId);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    this.getProductKwList();
                },
                search: function() {
                    if (!commonTool.isEmpty(paging.indusId) || !commonTool.isEmpty(paging.keyword)) {
                        vm.exportFlag = false;
                    }
                    paging.page = 1;
                    this.getProductKwList(true);
                },
                reset: function() {
                    vm.exportFlag = true;
                    paging = $scope.paging = {
                        page: 1,
                        pageSize: 10,
                        indusId: null,
                        keyword: null
                    };
                },
                toAddOrNotifyKw: function(id) {
                    $location.path('/keywordMgr/addProductKw').search({
                        'id': id
                    })
                },
                toDeleteKwByOne: function(ids) {
                    console.log(ids);
                    this.confirm(ids, -3);
                },
                toDeleteKwByMuti: function() {
                    if (vm.selectionItme.length <= 0) return;
                    var ids = vm.selectionItme.join(',');
                    this.confirm(ids, -3);
                },
                confirm: function(ids, auditStatus) {
                    $scope.ids = ids;
                    $scope.tools = tools;
                    $scope.status = auditStatus;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'confirm.html',
                        controller: 'productKwConfirmCtrl'
                    })
                },
                onSuccess: function(e) {
                    $rootScope.alertMsgService.setMessage("获取成功", 'success');
                },
                onError: function(e) {
                    $rootScope.alertMsgService.setMessage("获取失败", 'warning');
                },
                exportKws: function() {
                    if (commonTool.isEmpty(paging.indusId) && commonTool.isEmpty(paging.keyword)) {
                        $rootScope.alertMsgService.setMessage("请先填写筛选条件", 'warning');
                        return;

                    }

                    var pg = commonTool.filterParam(paging);
                    keywordMgrService.exportProductKw(commonTool.filterParam(paging));
                },
                uploadFile: function(file) {
                    if (commonTool.isEmpty(file)) return;
                    var myFile = file[0];
                    if ((!/.*\.(xls)|(xlsx)$/.test(myFile.name)) || myFile.size > 2 * 1024 * 1024) {
                        $rootScope.alertMsgService.setMessage("请重新支持格式：xls/xlsx;文件大小不超过2M", 'warning');
                        return false;
                    }
                    Upload.upload({
                        url: api.uploadContract,
                        file: myFile
                    }).success(function(data, status, headers, config) {
                        var obj = {
                            filePath: data.data.url
                        };
                        keywordMgrService.importProductKw(obj).success(function(data) {
                            if ('success' === data.status) {
                                
                                tools.getProductKwList();
                                $rootScope.showDataList = [];
                                if (commonTool.isEmpty(data.data) || data.data.length <= 0) return;
                                $rootScope.showDataList = data.data;
                                ngDialog.open({
                                    appendClassName: "dialog-activeM",
                                    scope: $scope,
                                    animation: true,
                                    width: 500,
                                    templateUrl: 'showData.html',
                                    controller: 'showImportDataCtrl'
                                })

                            } else {
                                $rootScope.alertMsgService.setMessage("导入失败", 'warning');
                            }
                        })
                    });
                }
            });

            init_data();

            function init_data() {
                tools.getProductKwList();
                vm.pages = commonService.setPageSizeArray(10, 30, 50);

                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if (data.status === 'success') {
                        vm.categoriesList = data.data;
                    }
                })
            };

        }
    ]).controller('sellerKwListCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        'Upload',
        'api',
        '$location',
        'keywordMgrService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog, Upload, api, $location, keywordMgrService, commonService, commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {

                page: 1,
                pageSize: 10,

                indusId: null,
                keyword: null
            };

            vm.selectionItme = [];

            vm.showOperateFlag = false;

            vm.exportFlag = true;

            tools = $.extend(tools, {
                getSellerKwList: function() {
                    vm.allChecked = false;
                    vm.showOperateFlag = false;
                    keywordMgrService.getSellerKwList(commonTool.filterParam(paging)).success(function(data) {
                        vm.items = data.data;
                        paging.total = data.page.total;
                        // paging.pageSize = data.page.total;
                    });
                },
                checkAll: function(checked) {
                    vm.selectionItme = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {
                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionItme.push(item.keyId);
                        }
                    });
                },
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.keyId);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    this.getSellerKwList();
                },
                search: function() {
                    if (!commonTool.isEmpty(paging.indusId) || !commonTool.isEmpty(paging.keyword)) {
                        vm.exportFlag = false;
                    }
                    paging.page = 1;
                    this.getSellerKwList(true);
                },
                reset: function() {
                    vm.exportFlag = true;
                    paging = $scope.paging = {
                        page: 1,
                        pageSize: 10,
                        indusId: null,
                        keyword: null
                    };
                },
                toAddOrNotifyKw: function(id) {
                    $location.path('/keywordMgr/addSellerKw').search({
                        'id': id
                    })
                },
                toDeleteKwByOne: function(ids) {
                    console.log(ids);
                    this.confirm(ids, -3);
                },
                toDeleteKwByMuti: function() {
                    if (vm.selectionItme.length <= 0) return;
                    var ids = vm.selectionItme.join(',');
                    this.confirm(ids, -3);
                },
                confirm: function(ids, auditStatus) {
                    $scope.ids = ids;
                    $scope.tools = tools;
                    $scope.status = auditStatus;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'confirm.html',
                        controller: 'sellerKwConfirmCtrl'
                    })
                },
                onSuccess: function(e) {
                    $rootScope.alertMsgService.setMessage("获取成功", 'success');
                },
                onError: function(e) {
                    $rootScope.alertMsgService.setMessage("获取失败", 'warning');
                },
                exportKws: function() {
                    if (commonTool.isEmpty(paging.indusId) && commonTool.isEmpty(paging.keyword)) {
                        $rootScope.alertMsgService.setMessage("请先填写筛选条件", 'warning');
                        return;
                    }
                    var pg = commonTool.filterParam(paging);
                    keywordMgrService.exportSellerKw(commonTool.filterParam(paging));
                },
                uploadFile: function(file) {
                    if (commonTool.isEmpty(file)) return;
                    var myFile = file[0];
                    if ((!/.*\.(xls)|(xlsx)$/.test(myFile.name)) || myFile.size > 2 * 1024 * 1024) {
                        $rootScope.alertMsgService.setMessage("请重新支持格式：xls/xlsx;文件大小不超过2M", 'warning');
                        return false;
                    }
                    Upload.upload({
                        url: api.uploadContract,
                        file: myFile
                    }).success(function(data, status, headers, config) {
                        var obj = {
                            filePath: data.data.url
                        };
                        keywordMgrService.importSellerKw(obj).success(function(data) {
                            if ('success' === data.status) {
                               
                                tools.getSellerKwList();
                                console.log(data.data);
                                $rootScope.showDataList = [];
                                if (commonTool.isEmpty(data.data) || data.data.length <= 0) return;
                                $rootScope.showDataList = data.data;
                                ngDialog.open({
                                    appendClassName: "dialog-activeM",
                                    scope: $scope,
                                    animation: true,
                                    width: 500,
                                    templateUrl: 'showData.html',
                                    controller: 'showImportDataCtrl'
                                })
                            } else {
                                $rootScope.alertMsgService.setMessage("导入失败", 'warning');
                            }
                        })
                    });
                }
            });

            init_data();

            function init_data() {
                tools.getSellerKwList();
                vm.pages = commonService.setPageSizeArray(10, 30, 50);

                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if (data.status === 'success') {
                        vm.categoriesList = data.data;
                    }
                })
            };
        }
    ]).controller('addProductKwCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$location',
        'keywordMgrService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog, $location, keywordMgrService, commonService, commonTool) {

            var search = $location.search();

            var tools = $scope.tools = {};
            var vm = $scope.vm = {};

            vm.item = {};


            var id = commonTool.isEmpty(search.id) ? null : parseInt(search.id);

            $rootScope.targetCategories = [];
             var reg = /[\u4e00-\u9fa5]/g;

            tools = $.extend(tools, {
                getProductKwDetail: function() {
                    if (!id) return;
                    keywordMgrService.getProductKwDetail({
                        'keyId': id
                    }).success(function(data) {
                        console.log(data);
                        vm.item = data.data;
                        tools.init_cateArray(data.data);
                    })
                },
                selectCate: function() {
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 740,
                        templateUrl: '/controller/keywordMgr/selectCategories.html',
                        controller: 'kwSelectCateCtrl',
                        title: "选择类目"
                    })
                },
                getBack: function() {
                    history.go(-1);
                },
                init_cateArray: function(obj) {
                    if (commonTool.isEmpty(obj.categoryIds) || commonTool.isEmpty(obj.categoryNames)) return;
                    var tmp_categoryIdArray = obj.categoryIds.split(',');
                    var tmp_categoryNameArray = obj.categoryNames.split(',');
                    if (tmp_categoryIdArray.length != tmp_categoryNameArray.length) return;
                    var tmp_array = [];
                    for (var i = 0; i < tmp_categoryIdArray.length; i++) {
                        var tmp_obj = {
                            categoryId: tmp_categoryIdArray[i],
                            categoryName: tmp_categoryNameArray[i],
                            indusId: obj.indusId
                        };
                        tmp_array.push(tmp_obj);
                    }
                    $rootScope.targetCategories = tmp_array;
                },
                saveInfo: function() {
                    if (commonTool.isEmpty(vm.item.keyword)) {
                        $rootScope.alertMsgService.setMessage("请先填写关键词", 'warning');
                        return;
                    }
                    if ($rootScope.targetCategories.length <= 0) {
                        $rootScope.alertMsgService.setMessage("请先选择类目", 'warning');
                        return;
                    }
                    if (reg.test(vm.item.keyword)) {
                        $rootScope.alertMsgService.setMessage("不能输入中文字符", 'warning');
                        return;
                    }
                    var categoryIds = [];
                    for (var i = 0; i < $rootScope.targetCategories.length; i++) {
                        var item = $rootScope.targetCategories[i];
                        categoryIds.push(item.categoryId);
                    }
                    var target_obj = {
                        keyId: id,
                        keyword: vm.item.keyword,
                        categoryIds: categoryIds.join(','),
                        indusId: $rootScope.targetCategories[0].category1Id,
                        status: 3
                    };
                    console.log(target_obj);
                    keywordMgrService.addOrUpdateProductKw(target_obj).success(function(data) {
                        console.log(data);
                        if (data.status == 'success') {
                            $rootScope.alertMsgService.setMessage("保存成功", 'success');
                            window.location.href = '/#/keywordMgr/productKw';
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                }
            });

            init_data();

            function init_data() {
                tools.getProductKwDetail();
            }

        }
    ]).controller('addSellerKwtCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$location',
        'keywordMgrService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog, $location, keywordMgrService, commonService, commonTool) {
            var search = $location.search();

            var tools = $scope.tools = {};
            var vm = $scope.vm = {};

            vm.item = {};


            var id = commonTool.isEmpty(search.id) ? null : parseInt(search.id);

            console.log(id);

            var reg = /[\u4e00-\u9fa5]/g;

            tools = $.extend(tools, {
                getProductKwDetail: function() {
                    if (!id) return;
                    keywordMgrService.getSellerKwDetail({
                        'keyId': id
                    }).success(function(data) {
                        console.log(data);
                        vm.item = data.data;
                    })
                },
                selectCate: function() {
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 740,
                        templateUrl: '/controller/keywordMgr/selectCategories.html',
                        controller: 'kwSelectCateCtrl',
                        title: "选择类目"
                    })
                },
                getBack: function() {
                    history.go(-1);
                },
                saveInfo: function() {
                    if (commonTool.isEmpty(vm.item.keyword)) {
                        $rootScope.alertMsgService.setMessage("请先填写关键词", 'warning');
                        return;
                    }
                    if (commonTool.isEmpty(vm.item.indusId)) {
                        $rootScope.alertMsgService.setMessage("请先选择类目", 'warning');
                        return;
                    }
                    if (reg.test(vm.item.keyword)) {
                        $rootScope.alertMsgService.setMessage("不能输入中文字符", 'warning');
                        return;
                    }
                    var target_obj = {
                        keyId: id,
                        keyword: vm.item.keyword,
                        categoryIds: vm.item.indusId,
                        indusId: vm.item.indusId,
                        status: 3
                    };
                    console.log(target_obj);
                    keywordMgrService.addOrUpdateSellerKw(target_obj).success(function(data) {
                        console.log(data);
                        if (data.status == 'success') {
                            $rootScope.alertMsgService.setMessage("保存成功", 'success');
                            window.location.href = '/#/keywordMgr/sellerKw'
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                }
            });

            init_data();

            function init_data() {
                tools.getProductKwDetail();
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    vm.categorisList = data.data;
                })
            }

        }
    ]).controller('kwSelectCateCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        '$controller', '$location',
        'commonService', 'commonTool',
        function(
            $scope, $rootScope, ngDialog,
            $controller, $location,
            commonService, commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};

            vm.searchCategoresList = [];
            vm.categoryArray = [];
            vm.hasSelectCate = [];
            console.log($rootScope.targetCategories);
            if (!commonTool.isEmpty($rootScope.targetCategories) && $rootScope.targetCategories.length > 0) {
                for (var i = 0; i < $rootScope.targetCategories.length; i++) {
                    var item = $rootScope.targetCategories[i];
                    vm.hasSelectCate.push(item);
                }
            }
            tools = $.extend(tools, {
                submit: function() {
                    $rootScope.targetCategories = vm.hasSelectCate;
                    $scope.closeThisDialog();
                },
                close: function() {
                    $scope.closeThisDialog();
                },
                isExist: function(target_item) {
                    if (vm.hasSelectCate.length == 0) return false;
                    for (var i = 0; i < vm.hasSelectCate.length; i++) {
                        var item = vm.hasSelectCate[i];
                        if (item.categoryId == target_item.categoryId) return true;
                    }
                    return false;
                },
                getChildcate: function(parentId) {
                    var obj = '#categoryId' + parentId;
                    $(obj).addClass('active').siblings('li').removeClass('active');
                    commonService.getCategoryChildren({
                        parentId: parentId
                    }).success(function(data) {
                        if ('success' == data.status) {
                            vm.categoryArray = [];
                            vm.categoryArray[0] = data.data;
                        }
                    })
                },
                chooseCate: function(item, index) {
                    var obj = '#categoryId' + item.categoryId;
                    $(obj).addClass('active').siblings('li').removeClass('active');
                    if (item.isBottom) {
                        if (!this.isExist(item)) {
                            if (vm.hasSelectCate.length == 0) {
                                vm.hasSelectCate.push(item);
                            } else {
                                if (vm.hasSelectCate[0].category1Id != item.category1Id) {
                                    $rootScope.alertMsgService.setMessage("只能选择一种行业下的类目", 'warning');
                                } else {
                                    vm.hasSelectCate.push(item);
                                }
                            }

                        }
                        return;
                    }
                    commonService.getCategoryChildren({
                        parentId: item.categoryId
                    }).success(function(data) {
                        if ('success' == data.status) {
                            var len = vm.categoryArray.length;
                            vm.categoryArray.splice(index + 1, len - index - 1);
                            vm.categoryArray.push(data.data);
                        }
                    })
                },
                delCategory: function(target_item) {
                    for (var i = 0; i < vm.hasSelectCate.length; i++) {
                        var item = vm.hasSelectCate[i];
                        if (item.categoryId == target_item.categoryId) {
                            vm.hasSelectCate.splice(i, 1);
                            return;
                        }
                    }
                },
                searchCate: function() {
                    searchCategories(vm.cateKeyword);
                },
                chxSelectCate: function(item) {
                    var obj = '#search' + item.categoryId;
                    $(obj).addClass('active').siblings('li').removeClass('active');
                    var obj = {
                            categoryId: item.categoryId,
                            categoryName: item.categoryName
                        }
                        // console.log(obj);
                        // $rootScope.hasSelectCate = obj;
                    vm.hasSelectCate.push(obj)
                },
                checCatekKeyUp: function() {
                    // searchCategories(vm.cateKeyword);
                },
                checkCateKeyUp: function(event) {
                    var keycode = window.event ? event.keyCode : event.which;
                    if (keycode == 13) searchCategories(vm.cateKeyword);
                }

            });

            function searchCategories(keyword) {
                if (commonTool.isEmpty(keyword)) {
                    vm.searchCategoresList = [];
                    return;
                }
                commonService.searchCategories({
                    keywords: keyword
                }).success(function(data) {
                    console.log(data);
                    if (data.status == 'success') {
                        vm.searchCategoresList = data.data;
                    }
                })
            }

            init_data();

            function init_data() {
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if ('success' == data.status) {
                        vm.firstLevelCate = data.data;
                    }
                });
            }
        }
    ]).controller('productKwConfirmCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$location',
        'keywordMgrService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog, $location, keywordMgrService, commonService, commonTool) {
            var vm = $scope.vm = {},
                tools = $scope.tools,
                ids = $scope.ids,
                status = $scope.status;
            console.log(ids);
            tools = $.extend(tools, {
                submit: function() {
                    var params = {
                        keyIds: ids,
                        status: status
                    };
                    keywordMgrService.deleteProductKw(params).success(function(data) {
                        if ('success' == data.status) {
                            ngDialog.closeAll();
                            $rootScope.alertMsgService.setMessage('删除成功', 'success');
                            tools.getProductKwList();
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                },
                close: function() {
                    ngDialog.closeAll();
                }
            });

        }
    ]).controller('sellerKwConfirmCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$location',
        'keywordMgrService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog, $location, keywordMgrService, commonService, commonTool) {
            var vm = $scope.vm = {},
                tools = $scope.tools,
                ids = $scope.ids,
                status = $scope.status;
            console.log(ids);
            tools = $.extend(tools, {
                submit: function() {
                    var params = {
                        keyIds: ids,
                        status: status
                    };
                    keywordMgrService.deleteSellerKw(params).success(function(data) {
                        if ('success' == data.status) {
                            ngDialog.closeAll();
                            $rootScope.alertMsgService.setMessage('删除成功', 'success');
                            tools.getSellerKwList();
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                },
                close: function() {
                    ngDialog.closeAll();
                }
            });

        }
    ]).controller('showImportDataCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$location',
        'keywordMgrService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog, $location, keywordMgrService, commonService, commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};

            console.log($rootScope.showDataList);
        }
    ]).filter("getTargetCategoryName", function() {
        return function(targetCategories) {
            if (targetCategories == null || targetCategories == undefined || targetCategories.length <= 0) return '请选择分类';
            var tmp_array = [];
            for (var i = 0; i < targetCategories.length; i++) {
                var item = targetCategories[i];
                tmp_array.push(item.categoryName);
            }
            return tmp_array.join(',');
        };
    }).filter("getTargetCategoryId", function() {
        return function(targetCategories) {
            if (targetCategories == null || targetCategories == undefined || targetCategories.length <= 0) return '';
            var tmp_array = [];
            for (var i = 0; i < targetCategories.length; i++) {
                var item = targetCategories[i];
                tmp_array.push(item.categoryId);
            }
            return tmp_array.join(',');
        };
    }).filter("getKwUrl", function() {
        return function(domain, keyWord, targetCategories) {
            if (keyWord == null || keyWord == '') return '';
            var tmp_kw = $.trim(keyWord);
            var tmp_url = ecDomain + '/products-directory/' + tmp_kw.replace(/\ /g, '-') + '.html';
            return tmp_url;
        };
    }).filter("getSellerKwUrl", function() {
        return function(domain, keyWord, indusId) {
            if (keyWord == null || keyWord == '') return '';
            var tmp_kw = $.trim(keyWord);
            var tmp_url = ecDomain + '/china-suppliers/' + tmp_kw.replace(/\ /g, '-') + '.html';
            return tmp_url;
        };
    })
});
