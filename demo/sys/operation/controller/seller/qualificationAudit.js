define(['../module'], function(ng) {
    ng.factory('qualificationAuditServer', ['$http', 'api',
        function($http, api) {
            return {
                getSellerIdentity: function(params) {
                    return $http.get(api.getSellerIdentity, {
                        'params': params
                    });
                },
                getSellerIdentityDetail: function(sellerId) {
                    return $http.get(api.getSellerIdentityDetail, {
                        'params': {
                            'sellerId': sellerId
                        }
                    })
                },
                chgSellerIdentityAudit: function(params) {
                    return $http.post(api.chgSellerIdentityAudit, params)
                }
            };
        }
    ])

    ng.controller('QualificationAuditIndexCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'qualificationAuditServer',
        'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, qualificationAuditServer,
            commonService, commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {
                mainCategoryId: null,
                auditStatus: 2,
                page: 1,
                pageSize: 10,
                companyName: null,
                startDate: null,
                endDate: null
            };
            vm.showOperateFlag = false;
            vm.selectionItme = [];

            // 定义"申请时间:起始时间"控件
            var start = {
                elem: '#startTime',
                choose: function(data) {
                    end.min = data;
                    end.start = data;
                    paging.startDate = data;
                },
                clear: function() {
                    paging.startDate = null;
                }
            };
            // 定义"申请时间:截止时间"控件
            var end = {
                elem: '#endTime',
                choose: function(data) {
                    start.max = data;
                    paging.endDate = data;
                },
                clear: function() {
                    paging.endDate = null;
                }
            };


            tools = $.extend(tools, {
                getSellerIdentity: function() {
                    vm.allChecked = false;
                    vm.showOperateFlag = false;
                    qualificationAuditServer.getSellerIdentity(paging).success(function(data) {
                        vm.items = data.data.items;
                        paging.total = data.page.total;
                        paging.pageSize = data.page.pageSize;
                    })
                },
                search: function() {
                    tools.getSellerIdentity();
                },
                // 点击"申请时间:起始时间"输入框事件
                initStartDate: function() {
                    laydate(start);
                },
                // 点击"申请时间:起始时间"输入框事件
                initEndDate: function() {
                    laydate(end);
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    tools.getSellerIdentity();
                },
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.sellerId);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                },
                checkAll: function(checked) {
                    vm.selectionItme = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {

                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionItme.push(item.sellerId);
                        }
                    });
                    if (true !== checked) {
                        vm.selectionItme = [];
                    }
                },
                confirm: function(sellerId, auditStatus) {
                    $scope.sellerId = sellerId;
                    $scope.tools = tools;
                    $scope.type = 'list';
                    $scope.status = auditStatus;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'confirm.html',
                        controller: 'sellerAuditToConfirmCtrl'
                    })
                },
                chxAuditByOne: function(sellerId, status) {
                    tools.confirm(sellerId, status);

                },
                chxAuditByAll: function(status) {
                    var params = {
                        sellerIds: vm.selectionItme.join(','),
                        auditStatus: status
                    };
                    if (commonTool.isEmpty(params.sellerIds)) {
                        $rootScope.alertMsgService.setMessage("请先选择要审核的卖家资质", 'warning');
                        return;
                    }
                    tools.confirm(params.sellerIds, params.auditStatus);
                    vm.selectionItme = [];
                }
            });

            init_data();

            function init_data() {
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if (data.status == 'success') {
                        vm.categorys1List = data.data;
                    }
                });
                tools.getSellerIdentity();
            };
        }
    ])

    ng.controller('QualificationAuditDetailCtrl', [
        '$scope', '$location', 'Upload', 'ngDialog', 'api', '$uibModal', 'qualificationAuditServer', 'commonTool',
        function($scope, $location, Upload, ngDialog, api, $uibModal, qualificationAuditServer, commonTool) {
            var vm = $scope.vm = {};

            var tools = $scope.tools = {};
            var params = $location.search();

            tools = $.extend(tools, {
                getdetail: function() {
                    qualificationAuditServer.getSellerIdentityDetail(params.sellerId).success(function(data) {
                        if ('success' === data.status) {
                            vm.item = data.data;
                            auditStatus = vm.item.status;
                        }
                    });
                },
                confirm: function(sellerId, auditStatus) {
                    $scope.sellerId = sellerId;
                    $scope.tools = tools;
                    $scope.type = 'detail';
                    $scope.status = auditStatus;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        templateUrl: 'confirm.html',
                        controller: 'sellerAuditToConfirmCtrl'
                    })
                },
                toChange: function() {
                    vm.newItem = angular.copy(vm.item);
                    if (vm.newItem.threeInOne == 1) {
                        vm.newItem.threeInOne = true;
                    } else {
                        vm.newItem.threeInOne = false;
                    }
                    vm.isChg = true;
                },
                cancelChange: function() {
                    vm.newItem = null;
                    vm.isChg = false;
                },
                enLarge: function(str_img) {
                    $scope.str_img = str_img;
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'enlarge.html',
                        controller: 'SqEnLargeCtrl',
                        size: '',
                        scope: $scope,
                        resolve: {
                            index: function() {
                                return -1;
                            }
                        }
                    })
                },
                updateImg: function(files, attrName) {
                    if (files && files.length > 0) {
                        var file = files[0];
                        if ((!/.*\.(png)|(jpg)|(gif)|(PNG)|(JPG)|(GIF)$/.test(file.name)) || file.size > 2 * 1024 * 1024) {
                            $rootScope.alertMsgService.setMessage("请重新选择图片,上传图片支持格式：png,jpg,gif;文件大小不超过2M", 'warning');
                            return false;
                        }
                        Upload.upload({
                            url: api.uploadContract,
                            file: file,
                            attrName: attrName

                        }).progress(function(evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        }).success(function(data, status, headers, config) {
                            vm.newItem[config.attrName] = data.data.url;
                        });
                    }

                },
                saveQlfctInfo: function() {
                    vm.newItem.auditTime = null;
                    vm.newItem.updateTime = null;
                    vm.newItem.createTime = null;
                    if (vm.newItem.threeInOne == true) {
                        vm.newItem.threeInOne = 1;
                        vm.newItem.orgCode = vm.newItem.bizLicence;
                        vm.newItem.taxRegCode = vm.newItem.bizLicence;
                        vm.newItem.taxRegImg = vm.newItem.commInstrumentImg;
                        vm.newItem.bizCodeImg = vm.newItem.commInstrumentImg;
                    } else {
                        vm.newItem.threeInOne = 0;
                    }
                    qualificationAuditServer.saveSellerIdentity(commonTool.filterParam(vm.newItem)).success(function(data) {
                        if (data.status == 'success') {
                            $rootScope.alertMsgService.setMessage("保存成功", 'success');
                            tools.cancelChange();
                            tools.getdetail();
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                }
            });

            init_data();

            function init_data() {
                tools.getdetail();
            };

        }
    ])

    ng.controller('sellerAuditToConfirmCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'qualificationAuditServer', 'commonTool',
        function($scope, $rootScope, ngDialog,
            qualificationAuditServer, commonTool) {
            var vm = $scope.vm = {},
                tools = $scope.tools,
                sellerId = $scope.sellerId,
                type = $scope.type,
                status = $scope.status;
            vm.status = status;
            tools = $.extend(tools, {
                submit: function() {
                    if (vm.status == -1 && commonTool.isEmpty(vm.reason)) {
                        $rootScope.alertMsgService.setMessage('请先填写审核原因', 'warning');
                        return;
                    }
                    var params = {
                        sellerIds: sellerId,
                        auditStatus: vm.status
                    };
                    if (vm.status == -1) params.reason = vm.reason;
                    qualificationAuditServer.chgSellerIdentityAudit(params).success(function(data) {
                        if ('success' == data.status) {
                            ngDialog.closeAll();
                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                            if (type == 'list') {
                                tools.getSellerIdentity(false);
                            } else if (type == 'detail') {
                                tools.getdetail();
                            } else if (type == 'sellerDetail') {
                                tools.getdetail();
                            } else {
                                tools.getdetail();
                            }
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
    ])



});