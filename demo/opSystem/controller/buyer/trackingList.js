define(['../module'], function(ng) {
    ng.factory('buyerTrackingService', ['$http', 'api',
            function($http, api) {
                return {
                    // 获取采购商互动行为跟踪列表
                    getbuyerTrackingList: function(params) {
                        return $http.get(api.getbuyerTrackingList, {
                            'params': params
                        });
                    },
                    // 获取采购商未二次回复采购需求列表
                    getPurchaseReplyList: function(params) {
                        return $http.get(api.getPurchaseReplyList, {
                            'params': params
                        });
                    },
                    // 获取采购商未二次回复询盘列表
                    getInquiryReplyList: function(params) {
                        return $http.get(api.getInquiryReplyList, {
                            'params': params
                        })
                    },
                    addFollowBusinessRcd: function(params, type) {
                        // 1  采购商跟进商机
                        // 2  采购需求跟进商机
                        // 3  询盘跟进商机
                        var url = type == 1 ? api.saveBusinessTraceByBatch : api.saveBuyerBusinessTrace;
                        return $http.get(url, {
                            'params': params
                        })
                    },
                    // 获取采购需求详情
                    getPurchaseDetail: function(params) {
                        return $http.get(api.getPurchaseDetail, {
                            'params': params
                        });
                    },
                    // 采购需求详细页 供应商回复情况
                    queryMatchSupplierReplyInfo: function(params) {
                        return $http.get(api.queryMatchSupplierReplyInfo, {
                            'params': params
                        })
                    },
                    getContactMsg: function(params) {
                        return $http.get(api.getPchsSplContactMsg, {
                            'params': params
                        });
                    },
                    getCategoryPath: function(params) {
                        return $http.get(api.getCategoryPath, {
                            'params': params
                        });
                    },
                    getBusinessTraceFlag: function(params) {
                        return $http.get(api.getBusinessTraceFlag, {
                            'params': params
                        })
                    },
                    // 获取询盘详情
                    getInquiryDetail: function(params) {
                        return $http.get(api.getInquiryDetail, {
                            'params': params
                        });
                    },
                    // 更新公司跟进人
                    updateFollowBuyer: function(params) {
                        var requestApi = api.batchUpdateBuyerPlatFollower;
                        return $http.post(requestApi, params);
                    },
                    // 导出
                    exportBuyerList: function(params) {
                        return $http.get(api.exportBuyerList, {
                            'params': params
                        })
                    },
                    // 重发邮件
                    reSendQutoteEmail: function(params) {
                        return $http.post(api.reSendQutoteEmail, params);
                    },
                    // 报价详情——刷新邮件状态接口
                    refreshQuotePriceEmailState: function(params) {
                        return $http.get(api.refreshQuotePriceEmailState, {
                            'params': params
                        })
                    }
                };
            }
        ]).controller('followBusRcdCtrl', [
            '$scope',
            '$rootScope',
            'ngDialog',
            'buyerTrackingService',
            'commonTool',
            function($scope, $rootScope, ngDialog,
                buyerTrackingService, commonTool) {
                var vm = $scope.vm = {},
                    tools = $scope.tools,
                    type = $scope.type,
                    source = $scope.source,
                    recordInfo = $scope.recordInfo = {
                        buyerId: $scope.buyerId,
                        // 商机跟进状态 *
                        followStatus: 1,
                        // 跟进标识 *
                        flagId: null,
                        // 跟进内容
                        content: null,

                        procurementIds: $scope.procurementIds,

                        inquiryInfos: $scope.inquiryInfos,

                        timeIntervalBizSend: $scope.timeIntervalBizSend,

                        timeIntervalTwoUnReply: $scope.timeIntervalTwoUnReply
                    };


                tools = angular.extend(tools, {
                    submitDlg: function() {
                        buyerTrackingService.addFollowBusinessRcd(commonTool.filterParam(recordInfo), type).success(function(data) {
                            if (data.status === 'success') {
                                $rootScope.alertMsgService.setMessage('添加成功', 'success');
                                ngDialog.closeAll();
                                tools.actionAfterSubmit();
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }

                        })
                    },
                    actionAfterSubmit: function() {
                        switch (source) {
                            case 'trackingList':
                                tools.getbuyerTrackingList();
                                break;
                            case 'purchaseReply':
                                tools.getPurchaseReplyList();
                                tools.clearCheckBox();
                                break;
                            case 'inquiryReply':
                                tools.getInquiryReplyList();
                                tools.clearCheckBox();
                                break;
                            case 'purchaseReqDetail':
                                tools.tab.init(0, 'tabBuyerFollow');
                                break;
                            case 'inquiryMgrDetail':
                                tools.toBuyerDetail();
                                break;
                            case 'followHisPro':
                                tools.getHistoryPurchase();
                                break;
                            case 'followHisInq':
                                tools.getHistoryInquiry();
                                break;
                            default:
                                // statements_def
                                break;
                        }
                    },
                    closeDlg: function() {
                        ngDialog.closeAll();
                    }
                });

                (function() {
                    buyerTrackingService.getBusinessTraceFlag().success(function(data) {
                        if (data.status != 'success') return;
                        vm.businessTraceArray = data.data;
                        recordInfo.flagId = vm.businessTraceArray[0].flagId;
                    });
                }())

            }
        ])
        // 列表
        .controller('buyerTrackingListCtrl', [
            '$scope', '$rootScope', 'ngDialog',
            '$location', '$uibModal', 'buyerTrackingService',
            'commonService', 'commonTool', 'api',
            function($scope, $rootScope, ngDialog,
                $location, $uibModal, buyerTrackingService,
                commonService, commonTool, api) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    timeIntervalBizSend: 30,
                    timeIntervalTwoUnReply: 72,
                    buyerType: 1,
                    buyerValue: null,
                    followerId: null,
                    sorter: 'qtyUnPmct:DESC'
                };

                vm.selectionItme = [];
                vm.showOperateFlag = false;
                vm.needNode = true;
                vm.businessTraceArray = [];

                tools = $.extend(tools, {
                    // 采购商互动行为跟踪列表
                    getbuyerTrackingList: function(isSearchButton) {
                        if (isSearchButton) {
                            paging.page = 1;
                        }
                        // 如果没有权限
                        if (!tools.getPermission()) {
                            // 是跟进人 查看自己的
                            paging.isMyFollow = 1;
                        } else {
                            // 不是跟进人 查看所有
                            paging.isMyFollow = 0;
                        }
                        buyerTrackingService.getbuyerTrackingList(commonTool.filterParam(paging)).success(function(data) {
                            if (data.page.items != null) {
                                vm.items = data.page.items;
                            } else {
                                vm.items = [];
                            }
                            paging.total = data.page.total;
                            paging.pageSize = data.page.pageSize;
                            vm.selectionItme = [];
                            vm.showOperateFlag = false;
                            vm.allChecked = false;

                        });
                    },
                    // 获取权限
                    getPermission: function() {
                        var moduleName = '采购商管理';
                        var functionName = '采购商互动行为跟踪';
                        var opearName = '查看所有采购商跟进人';

                        if ($rootScope.userOpers != undefined && $rootScope.userOpers != null) {
                            var data = $rootScope.userOpers;
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].moduleName == moduleName) {
                                    var functionList = data[i].functionList;
                                    for (var k = 0; k < functionList.length; k++) {
                                        if (functionList[k].functionName == functionName) {
                                            var userOpear = functionList[k].userOpear;
                                            for (var j = 0; j < userOpear.length; j++) {
                                                if (userOpear[j].opearName == opearName) {
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            }
                                        } else {
                                            if (k == functionList.length) {
                                                return false;
                                            }
                                        }
                                    }
                                } else {
                                    if (i == data.length) {
                                        return false;
                                    }
                                }
                            }
                        } else {
                            return false;
                        }
                    },
                    // 获取UserID
                    getUserId: function() {
                        if (localStorage.userInfo != undefined && localStorage.userInfo != null) {
                            var userInfo = JSON.parse(localStorage.userInfo);
                            var userId = userInfo.data.userId;
                            return userId;
                        } else {
                            return null;
                        }
                    },
                    report: function() {
                        if (commonTool.isEmpty(paging.followerId) || paging.followerId == -10) {
                            $rootScope.alertMsgService.setMessage('请选择采购商跟进人再进行导出操作', 'warning')
                            return;
                        }
                        window.location.href = api.exportBuyerList + '?' + $.param(paging);
                    },
                    // 分页
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize ? tools.newpagesize : 1;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        tools.getbuyerTrackingList();
                    },
                    // 重置
                    reset: function() {
                        paging.page = 1;
                        paging.pageSize = 10;
                        paging.timeIntervalBizSend = 30;
                        paging.timeIntervalTwoUnReply = 72;
                        paging.buyerType = 1;
                        paging.buyerValue = null;
                        paging.followId = null;
                        paging.followerId = null;
                        paging.countryId = null;
                        paging.sorter = 'qtyUnPmct:DESC';
                    },
                    followBusiness: function(buyerId) {
                        $scope.buyerId = buyerId;
                        $scope.type = 1;
                        $scope.tools = tools;
                        $scope.timeIntervalBizSend = paging.timeIntervalBizSend;
                        $scope.timeIntervalTwoUnReply = paging.timeIntervalTwoUnReply;

                        $scope.source = 'trackingList';
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 700,
                            templateUrl: '/controller/buyer/dialogTmp/followBusinessDlg.html',
                            controller: 'followBusRcdCtrl',
                            title: "跟进商机"
                        })
                    },
                    // 关闭弹出层
                    close: function() {
                        tools.checkAll(false);
                        vm.needNode = true;
                        ngDialog.closeAll();
                    },
                    checkAll: function(checked) {
                        vm.selectionItme = [];
                        vm.showOperateFlag = checked ? true : false;
                        angular.forEach(vm.items, function(item) {
                            item.$checked = checked;
                            if (true === checked) {
                                vm.selectionItme.push(item.companyId);
                            }
                        });
                    },
                    selection: function() {
                        var selectionItme = [];
                        angular.forEach(vm.items, function(item) {
                            if (item.$checked === true) {
                                selectionItme.push(item.companyId);
                            }
                        });
                        vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                        vm.selectionItme = selectionItme;
                    },
                    // 修改分配跟进人
                    chxFollowBuyerByAll: function() {
                        tools.chxStatusByNotify(vm.selectionItme.join(','), null);
                    },
                    chxFollowBuyer: function(companyId, followerId) {
                        tools.chxStatusByNotify(companyId, followerId);
                    },
                    // 修改分配跟进人
                    chxStatusByNotify: function(companyIds, followerId) {
                        $scope.tools = tools;
                        $scope.status = vm.followMgStatus;
                        $scope.companyIds = companyIds;
                        $scope.followerId = followerId;
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 500,
                            templateUrl: 'chxStatusByNotify.html',
                            controller: 'chxStatusByNotifyCtrl'
                        })
                    },
                    // 商机发布时间
                    timeIntervalBizSend: [new init('7天内', 7), new init('15天内', 15), new init('30天内', 30), new init('60天内', 60), new init('90天内', 90)],
                    // 采购商未二次回复时长
                    timeIntervalTwoUnReply: [new init('不限', null), new init('超过12小时', 12), new init('超过一天', 24), new init('超过三天', 24 * 3), new init('超过一周', 24 * 7), new init('超过两周', 24 * 7 * 2), ],
                    // 采购商搜索
                    buyerType: [new init('采购商姓名', 1), new init('公司名称', 2), new init('邮箱', 3), new init('用户名', 4), new init('用户ID', 5), new init('广交会ID', 6)],
                    // 排序规则
                    sorter: [new init("采购商创建时间降序", "userCreateTime:DESC"), new init("采购商创建时间升序", "userCreateTime:ASC"), new init("采购需求数降序", "qtyUnPmct:DESC"), new init("采购需求发布时间降序", "procurementLatestSendTime:DESC"), new init("询盘数降序", "qtyUnInquiry:DESC")]
                });

                function init(title, key) {
                    this.title = title;
                    this.key = key;
                };

                (function() {
                    commonService.getCountries().success(function(data) {
                        tools.countries = 'success' === data.status ? data.data : [];
                    });
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);
                    var params = {
                        groupId: 282,
                        page: 1,
                        pageSize: 100,
                        valid: 1
                    };
                    commonService.getFollowPeople(params).success(function(data) {
                        if ('success' !== data.status) return;
                        vm.followPeopleArray = data.page.items;
                        vm.followPeopleArray.unshift({
                            userId: -10,
                            realName: '无跟进人'
                        })

                    });
                    // 采购商互动行为跟踪列表
                    tools.getbuyerTrackingList(true);
                }())

            }
        ]).controller('buyerPurchaseReplyCtrl', [
            // 采购需求未二次回复列表
            '$scope',
            '$rootScope',
            'ngDialog',
            '$location',
            '$window',
            '$uibModal',
            'buyerTrackingService',
            'buyerService',
            'commonService',
            'commonTool',
            function($scope, $rootScope, ngDialog,
                $location, $window, $uibModal, buyerTrackingService, buyerService,
                commonService, commonTool) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var search = $location.search();
                var tabs = $scope.tabs = {};
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    buyerId: search.buyerId,
                    timeIntervalBizSend: search.timeIntervalBizSend,
                    timeIntervalTwoUnReply: search.timeIntervalTwoUnReply,
                    buyerType: search.buyerType,
                    buyerValue: search.buyerValue,
                    followId: search.followId
                };

                vm.isMyFollow = search.isMyFollow;

                vm.selectionItme = [];
                vm.showOperateFlag = false;
                vm.needNode = true;

                vm.procurementInfo = null;


                // 跟进记录
                var followPlatParams = {
                    buyerId: null,

                    page: 1,
                    pageSize: 5
                };

                vm.fullCategory = null;

                vm.followRecordLsit = null;

                tools = angular.extend(tools, {
                    getFullCategory: function(array) {
                        if (commonTool.isEmpty(array)) return;
                        var tmpArray = [];
                        for (var i = 0, len = array.length; i < len; i++) {
                            tmpArray.push(array[i].categoryName);
                        }
                        vm.fullCategory = tmpArray.join(',');
                    },
                    // 获取采购商未二次回复采购需求列表
                    getPurchaseReplyList: function(isSearchButton) {
                        if (isSearchButton) {
                            paging.page = 1;
                        }
                        buyerTrackingService.getPurchaseReplyList(commonTool.filterParam(paging)).success(function(data) {
                            if (data.page.items != null) {
                                vm.buyerInfo = data.data;
                                followPlatParams.buyerId = vm.buyerInfo.personInfo.buyerId;
                                tools.getPlatFollowRecordList();
                                vm.items = data.page.items;
                                paging.userId = data.data.personInfo.userId;
                                tools.getFullCategory(vm.buyerInfo.cateList);
                            } else {
                                vm.items = [];
                            }
                            paging.total = data.page.total;
                            paging.pageSize = data.page.pageSize;
                        });
                    },
                    getPlatFollowRecordList: function() {
                        buyerService.getFollowRecordList(commonTool.filterParam(followPlatParams)).success(function(data) {
                            vm.followRecordLsit = data.page.items;
                        })
                    },
                    // 分页
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        tools.getPurchaseReplyList();
                    },
                    checkAll: function(checked) {
                        vm.selectionItme = [];
                        vm.showOperateFlag = checked ? true : false;
                        angular.forEach(vm.items, function(item) {
                            item.$checked = checked;
                            if (true === checked) {
                                vm.selectionItme.push(item.procurementId);
                            }
                        });
                    },
                    selection: function() {
                        var selectionItme = [];
                        angular.forEach(vm.items, function(item) {
                            if (item.$checked === true) {
                                selectionItme.push(item.procurementId);
                            }
                        });
                        vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                        vm.selectionItme = selectionItme;
                    },
                    // 跟进该采购商的商机
                    followBusiness: function(id) {
                        var ids = '';
                        if (commonTool.isEmpty(id)) {
                            ids = vm.selectionItme.join(',');
                            if (commonTool.isEmpty(ids)) {
                                $rootScope.alertMsgService.setMessage("请先选择处理的记录", 'warning');
                                return;
                            }
                        } else {
                            ids = id;
                        }
                        tools.followBusinessConfirm(ids);
                    },
                    clearCheckBox: function() {
                        vm.allChecked = false;
                        vm.selectionItme = [];
                        vm.showOperateFlag = false;
                    },
                    // 批量跟进该采购商的所有商机 弹出层
                    followBusinessConfirm: function(procurementIds) {
                        $scope.buyerId = paging.buyerId;
                        $scope.procurementIds = procurementIds;
                        $scope.type = 2;
                        $scope.tools = tools;
                        $scope.source = 'purchaseReply';
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 700,
                            templateUrl: '/controller/buyer/dialogTmp/followBusinessDlg.html',
                            controller: 'followBusRcdCtrl',
                            title: "跟进商机"
                        })
                    },
                    checkChange: function() {
                        vm.checkedItems = [];
                        angular.forEach(vm.followContent, function(item) {
                            if (item.$checked === true && item.text != '其他') {
                                vm.checkedItems.push(item.text);
                            }
                            if (item.$checked === true && item.text == '其他') {
                                vm.needNode = false;
                            } else {
                                vm.needNode = true;
                            }
                        });
                    },
                    // 添加采购商跟进记录
                    followBuyer: function(id) {
                        $scope.buyerId = id;
                        $scope.tools = tools;
                        $scope.type = 1;
                        $scope.source = 'purchaseReply';
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 900,
                            templateUrl: '/controller/buyer/dialogTmp/followRecordDlg.html',
                            controller: 'insertfollowRcdCtrl'
                        })
                    },
                    // 关闭弹出层
                    close: function() {
                        tools.checkAll(false);
                        vm.needNode = true;
                        ngDialog.closeAll();
                    },
                    getProcurement: function(procurementId) {
                        buyerTrackingService.getPurchaseDetail({
                            'procurementId': procurementId
                        }).success(function(data) {
                            vm.procurementInfo = data.data;
                            buyerTrackingService.getCategoryPath({
                                'categoryId': vm.procurementInfo.detailInfo.productLastCategoryId,
                                'noIndus': true
                            }).success(function(data) {
                                if (data.status === 'success') {
                                    vm.procurementInfo.detailInfo.comlpeteCategoryPath = data.data.categoryStructureEn;
                                }
                            })
                        })
                        buyerTrackingService.queryMatchSupplierReplyInfo({
                            'page': 1,
                            'pageSize': 100,
                            'procurementId': procurementId
                        }).success(function(data) {
                            if (data.status == 'success') {
                                vm.procurementInfo.MatchSupplier = data.page.items;
                            }
                        })
                    },
                    getMessages: function(param) {
                        tabs.messages = [];
                        buyerTrackingService.getContactMsg(param).success(function(rs) {
                            if (rs.status == 'success') {
                                tabs.messages = rs.data;
                            }
                        })
                    },
                    showMsgDialog: function(messageId) {
                        // 获取站内信
                        var pm = {};
                        pm.messageId = messageId;
                        tools.getMessages(pm);
                        ngDialog.open({
                            title: "站内信沟通内容",
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            templateUrl: '/controller/purchase/message.html',
                            width: 700
                        })
                    },
                    open: function(path, isFile) {
                        if (isFile) {
                            path = imgUrl + path;
                        }
                        $window.open(path);
                    },
                    reSendEmail: function(item) {

                        ngDialog.open({
                            template: './controller/seller/dialogTmp/confirmdDlg.html',
                            width: 500,
                            title: '确认',
                            scope: $scope,
                            controller: ['$scope', function($scope) {
                                var vm = $scope.vm = {
                                    messages: '请确认是否重发邮件',
                                    submitMsg: '确定',
                                    cancelMsg: '取消',
                                    submit: function() {
                                        buyerTrackingService.reSendQutoteEmail({
                                            'qutoPriceId': item.inqueryUUID
                                        }).success(function(data) {
                                            if (data.status == 'success') {
                                                $rootScope.alertMsgService.setMessage('操作成功');
                                                tools.getProcurement(item.procurementId);
                                                $scope.closeThisDialog();
                                            } else {
                                                $rootScope.alertMsgService.setMessage('操作失败', 'warning');
                                            }
                                        })
                                    },
                                    close: function() {
                                        $scope.closeThisDialog();
                                    }
                                };
                            }]
                        })




                    },
                    // 刷新邮件状态接口
                    refreshQuotePriceEmailState: function(item) {
                        if (!item.inqueryUUID) return;
                        var params = {
                            quoteId: item.inqueryUUID
                        };
                        buyerTrackingService.refreshQuotePriceEmailState({
                            quoteId: item.inqueryUUID
                        }).success(function(data) {
                            if (data.status == 'success') {
                                if (data.data != null) {
                                    $rootScope.alertMsgService.setMessage("刷新成功", 'success');
                                    tools.getProcurement(item.procurementId);
                                } else {
                                    $rootScope.alertMsgService.setMessage("刷新成功，状态无变化", 'success');
                                }
                            } else {
                                $rootScope.alertMsgService.setMessage("刷新状态失败，请刷新页面重试", 'warning');
                            }
                        }).error(function() {
                            $rootScope.alertMsgService.setMessage("刷新状态失败，请刷新页面重试", 'warning');
                        });
                    }
                });

                (function() {

                    vm.pages = commonService.setPageSizeArray(10, 30, 50);

                    tools.getPurchaseReplyList();

                }())
            }
        ]).controller('buyerInquiryReplyCtrl', [
            // 询盘未二次回复列表
            '$scope',
            '$rootScope',
            'ngDialog',
            '$location',
            '$uibModal',
            'buyerTrackingService',
            'buyerService',
            'commonService',
            'commonTool',
            function($scope,
                $rootScope,
                ngDialog,
                $location,
                $uibModal,
                buyerTrackingService,
                buyerService,
                commonService,
                commonTool
            ) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var search = $location.search();
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    buyerId: search.buyerId,
                    timeIntervalBizSend: search.timeIntervalBizSend,
                    timeIntervalTwoUnReply: search.timeIntervalTwoUnReply,
                    buyerType: search.buyerType,
                    buyerValue: search.buyerValue,
                    followId: search.followId
                };

                vm.selectionItme = [];
                vm.showOperateFlag = false;
                vm.allFollowBusinessConfirm = {};
                vm.allFollowBusinessConfirm.data = [];
                vm.needNode = true;
                vm.imgUrl = imgUrl;
                vm.inquiryItem = {
                    sellerInquiryItem: null
                };

                vm.isMyFollow = search.isMyFollow;

                // 跟进记录
                var followPlatParams = {
                    buyerId: null,

                    page: 1,
                    pageSize: 5
                };

                tools = $.extend(tools, {
                    getFullCategory: function(array) {
                        if (commonTool.isEmpty(array)) return;
                        var tmpArray = [];
                        for (var i = 0, len = array.length; i < len; i++) {
                            tmpArray.push(array[i].categoryName);
                        }
                        vm.fullCategory = tmpArray.join(',');
                    },
                    // 获取采购商未二次回复采购需求列表
                    getInquiryReplyList: function(isSearchButton) {
                        if (isSearchButton) {
                            paging.page = 1;
                        }
                        buyerTrackingService.getInquiryReplyList(commonTool.filterParam(paging)).success(function(data) {
                            if (data.page.items != null) {
                                vm.buyerInfo = data.data;
                                followPlatParams.buyerId = vm.buyerInfo.personInfo.buyerId;
                                tools.getPlatFollowRecordList();
                                vm.items = data.page.items;
                                paging.userId = data.data.personInfo.userId;
                                tools.getFullCategory(vm.buyerInfo.cateList);
                            } else {
                                vm.items = [];
                            }
                            paging.total = data.page.total;
                            paging.pageSize = data.page.pageSize;
                        });
                    },
                    getPlatFollowRecordList: function() {
                        buyerService.getFollowRecordList(commonTool.filterParam(followPlatParams)).success(function(data) {
                            vm.followRecordLsit = data.page.items;
                        })
                    },
                    // 分页
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        tools.getInquiryReplyList();
                    },
                    checkAll: function(checked) {
                        vm.selectionItme = [];
                        vm.showOperateFlag = checked ? true : false;
                        angular.forEach(vm.items, function(item) {
                            item.$checked = checked;
                            if (true === checked) {
                                var tempid = item.inquiryId + ';' + item.inquiryType;
                                vm.selectionItme.push(tempid);
                            }
                        });
                    },
                    selection: function() {
                        var selectionItme = [];
                        angular.forEach(vm.items, function(item) {
                            if (item.$checked === true) {
                                var tempid = item.inquiryId + ';' + item.inquiryType;
                                selectionItme.push(tempid);
                            }
                        });
                        vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                        vm.selectionItme = selectionItme;
                    },
                    // 跟进该采购商的商机
                    followBusiness: function(id, type) {
                        var ids = '';
                        if (commonTool.isEmpty(type) && commonTool.isEmpty(id)) {
                            ids = vm.selectionItme.join(',');
                            if (commonTool.isEmpty(ids)) {
                                $rootScope.alertMsgService.setMessage("请先选择处理的记录", 'warning');
                                return;
                            }
                        } else {
                            ids = id + ';' + type;
                        }
                        tools.followBusinessConfirm(ids);
                    },
                    clearCheckBox: function() {
                        vm.allChecked = false;
                        vm.selectionItme = [];
                        vm.showOperateFlag = false;
                    },
                    // 批量跟进该采购商的所有商机 弹出层
                    followBusinessConfirm: function(inquiryInfos) {

                        $scope.buyerId = paging.buyerId;
                        $scope.inquiryInfos = inquiryInfos;
                        $scope.type = 3;
                        $scope.tools = tools;
                        $scope.source = 'inquiryReply';
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 700,
                            templateUrl: '/controller/buyer/dialogTmp/followBusinessDlg.html',
                            controller: 'followBusRcdCtrl',
                            title: "跟进商机"
                        })
                    },
                    checkChange: function() {
                        vm.checkedItems = [];
                        angular.forEach(vm.followContent, function(item) {
                            if (item.$checked === true && item.text != '其他') {
                                vm.checkedItems.push(item.text);
                            }
                            if (item.$checked === true && item.text == '其他') {
                                vm.needNode = false;
                            } else {
                                vm.needNode = true;
                            }
                        });
                    },
                    // 添加采购商跟进记录
                    followBuyer: function(id) {
                        $scope.buyerId = id;
                        $scope.tools = tools;
                        $scope.type = 1;
                        $scope.source = 'inquiryReply';
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 900,
                            templateUrl: '/controller/buyer/dialogTmp/followRecordDlg.html',
                            controller: 'insertfollowRcdCtrl'
                        })
                    },

                    // 关闭弹出层
                    close: function() {
                        tools.checkAll(false);
                        vm.needNode = true;
                        ngDialog.closeAll();
                    },
                    getInquiry: function(inquiryId) {
                        buyerTrackingService.getInquiryDetail({
                            'messageId': inquiryId
                        }).success(function(data) {
                            vm.inquiryItem = data.data;
                            if (vm.inquiryItem.messageContactList && vm.inquiryItem.messageContactList.length) {
                                var tmpArray = vm.inquiryItem.messageContactList;
                                for (var i = tmpArray.length - 1; i >= 0; i--) {
                                    var item = tmpArray[i];
                                    if (item.userType == 2) {
                                        vm.inquiryItem.sellerInquiryItem = item;
                                        break;
                                    }
                                }
                            }
                        })
                    }
                });

                (function() {
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);
                    tools.getInquiryReplyList();
                }())
            }
        ]).controller('chxStatusByNotifyCtrl', [
            '$scope',
            '$rootScope',
            'ngDialog',
            'buyerTrackingService',
            'commonService',
            'commonTool',
            function(
                $scope,
                $rootScope,
                ngDialog,
                buyerTrackingService,
                commonService,
                commonTool) {
                var vm = $scope.vm = {};
                var tools = $scope.tools;
                var companyIds = $scope.companyIds;
                vm.follower = $scope.followerId;

                tools = $.extend(tools, {
                    submit: function() {
                        if (commonTool.isEmpty(vm.follower)) {
                            $rootScope.alertMsgService.setMessage('请先选择跟进人', 'warning');
                            return;
                        }
                        var params = {
                            companyIds: companyIds,
                            followerUserId: vm.follower
                        };
                        buyerTrackingService.updateFollowBuyer(params).success(function(data) {
                            if (data.status === 'success') {
                                $rootScope.alertMsgService.setMessage("修改成功", 'success');
                                ngDialog.closeAll();
                                tools.getbuyerTrackingList();
                            }
                        })
                    },
                    close: function() {
                        ngDialog.closeAll();
                    }
                });

                init_data();

                function init_data() {
                    var params = {
                        groupId: 282,
                        page: 1,
                        pageSize: 100,
                        valid: 1
                    };
                    commonService.getFollowPeople(params).success(function(data) {
                        if ('success' == data.status) {
                            vm.followPeopleArray = data.page.items;
                        }
                    });
                }

            }
        ])
});