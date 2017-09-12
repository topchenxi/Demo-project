define(['../module'], function(ng) {

    ng.factory('myFollowHistoryService', ['$http', 'api',
        function($http, api) {

            function filterQuickParams(params, status) {
                var keyArray = ['isfollowed'],
                    valArray = ['follower'],
                    array = [];
                for (var i = 0, len = keyArray.length; i < len; i++) {
                    if (params[keyArray[i]]) {
                        array.push(valArray[i]);
                        delete params[keyArray[i]];
                    }
                }
                if (array.length) params.filters = array.join(',');

                if (params.searchType && params.searchTypeValue) {
                    var platSearchArray = ['', 'buyerName', 'companyName', 'email', 'userName', 'userId', 'cfId'],
                        cfecSearchArray = ['', 'email', 'buyerName', 'cfId', 'companyName'],
                        searchArray = status == 1 ? platSearchArray : cfecSearchArray;
                    params[searchArray[+params.searchType]] = params.searchTypeValue;
                }

                delete params.searchType;
                delete params.searchTypeValue;

                return params;
            };

            function filterBusinessParams(params, status) {
                if (params.searchType && params.searchTypeValue) {
                    if (status == 2) {
                        params['publisherId'] = params.searchTypeValue;
                    } else if (status == 3) {
                        params['createById'] = params.searchTypeValue;
                    }
                }
                delete params.searchType;
                delete params.searchTypeValue;
                return params;
            }

            return {
                getHistoryPlatBuyer: function(params) {
                    return $http.get(api.getHistoryPlatBuyer, {
                        'params': filterQuickParams(params, 1)
                    });
                },
                getHistoryCfecBuyer: function(params) {
                    return $http.get(api.getHistoryCfecBuyer, {
                        'params': filterQuickParams(params, 4)
                    });
                },
                getHistoryPurchase: function(params) {
                    delete params.isfollowed;
                    return $http.get(api.getHistoryPurchase, {
                        'params': filterBusinessParams(params, 2)
                    });
                },
                getHistoryInquiry: function(params) {
                    return $http.get(api.getHistoryInquiry, {
                        'params': filterBusinessParams(params, 3)
                    });
                },
                getBusinessTraceFlag: function(params) {
                    return $http.get(api.getBusinessTraceFlag, {
                        'params': params
                    })
                },
                saveBuyerBusinessTrace: function(params) {
                    return $http.get(api.saveBuyerBusinessTrace, {
                        'params': params
                    })
                }
            };
        }
    ])

    ng.controller('myFollowHistoryCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        'myFollowHistoryService',
        'myfollowService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog, myFollowHistoryService, myfollowService, commonService, commonTool) {

            var vm = $scope.vm = {};
            var paging = $scope.paging = {

                // 最近跟进标识
                flagId: null,
                // 剔除免跟进商机,
                isTrace: 1,
                // 只查看未回复商机
                isReply: 0,
                isfollowed: 1,
                // 分页
                page: 1,
                pageSize: 10
            };
            var tools = $scope.tools = {};
            /*
                平台采购商:1
                采购需求:2
                询盘:3
                广交会采购商:4
             */
            vm.platStatus = 1;

            tools = $.extend(tools, {
                // 总入口
                getPlatBuyerHistory: function(status) {
                    var targetStatus = status ? status : vm.platStatus;
                    vm.items = null;
                    switch (targetStatus) {
                        case 1:
                            this.getHistoryPlatBuyer();
                            break;
                        case 2:
                            this.getHistoryPurchase();
                            break;
                        case 3:
                            this.getHistoryInquiry();
                            break;
                        case 4:
                            this.getHistoryCfecBuyer();
                            break;
                        default:
                            this.getHistoryPlatBuyer();
                            break;
                    }
                },
                // 平台采购商 -> 采购商
                getHistoryPlatBuyer: function() {
                    myFollowHistoryService.getHistoryPlatBuyer(commonTool.filterParam(paging)).success(function(data) {
                        if (data.status !== 'success') return;
                        vm.items = data.data.items;
                        paging.total = data.data.total;
                    })
                },
                // 平台采购商 -> 采购需求
                getHistoryPurchase: function() {
                    myFollowHistoryService.getHistoryPurchase(commonTool.filterParam(paging)).success(function(data) {
                        if (data.status !== 'success') return;
                        vm.items = data.page.items;
                        paging.total = data.page.total;
                    })
                },
                // 平台采购商 -> 询盘
                getHistoryInquiry: function() {
                    myFollowHistoryService.getHistoryInquiry(commonTool.filterParam(paging)).success(function(data) {
                        if (data.status !== 'success') return;
                        vm.items = data.page.items;
                        paging.total = data.page.total;
                    })
                },
                // 广交会采购商 -> 采购商
                getHistoryCfecBuyer: function() {
                    myFollowHistoryService.getHistoryCfecBuyer(commonTool.filterParam(paging)).success(function(data) {
                        if (data.status !== 'success') return;
                        vm.items = data.data.items;
                        paging.total = data.data.total;
                    })
                },
                addFollowRecordCfec: function(type, buyerId) {
                    $scope.buyerId = buyerId;
                    $scope.tools = tools;
                    $scope.type = type;
                    $scope.source = type == 1 ? 'myFollowHistoryPalt' : 'myFollowHistoryCfec';
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 900,
                        templateUrl: '/controller/buyer/dialogTmp/followRecordDlg.html',
                        controller: 'insertfollowRcdCtrl'
                    })
                },
                // 加入跟进清单
                addToList: function(type, companyId) {
                    this.addListRequest(companyId, type);

                },
                // 加入跟进清单 -- 请求
                addListRequest: function(buyerCompanyIds, type) {
                    var params = {
                        buyerCompanyIds: buyerCompanyIds
                    };
                    myfollowService.addToList(params, type).success(function(data) {
                        if (data.status !== 'success') return;
                        $rootScope.alertMsgService.setMessage("保存成功", 'success');
                        tools.getPlatBuyerHistory();
                    })

                },
                search: function() {
                    paging.page = 1;
                    this.getPlatBuyerHistory();
                },
                reset: function() {
                    paging.flagId = null;
                    paging.isTrace = 1;
                    paging.isReply = 0;
                    paging.isfollowed = 1;
                    paging.flag = null;
                    paging.page = 1;
                    paging.pageSize = 10;
                    paging.searchType = null;
                    paging.searchTypeValue = null;
                    paging.productName = null;
                    paging.subject = null;
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = this.newpagesize;
                        this.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    this.getPlatBuyerHistory();
                },
                keepFollowPro: function(procurementId, buyerId) {
                    $scope.buyerId = buyerId;
                    $scope.procurementIds = procurementId;
                    $scope.type = 2;
                    $scope.tools = tools;
                    $scope.source = 'followHisPro';
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
                keepFollowInq: function(messageId, buyerId, messageTypeId) {

                    $scope.buyerId = buyerId;
                    $scope.inquiryInfos = messageId + ';' + messageTypeId;
                    $scope.type = 3;
                    $scope.tools = tools;
                    $scope.source = 'followHisInq';
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 700,
                        templateUrl: '/controller/buyer/dialogTmp/followBusinessDlg.html',
                        controller: 'followBusRcdCtrl',
                        title: "跟进商机"
                    })

                }

            });

            var method = {
                init: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                // 最近跟进标识
                initFollowSign: function() {
                    return [new this.init('Not a Buyer', 1), new this.init('Bounce Email', 2), new this.init('Buying Lead', 3), new this.init('Phone Call Connected', 4), new this.init('Phone Call Disconnected', 5), new this.init('Not speak English', 6), new this.init('Whatsapp', 7), new this.init('Wechat', 8), new this.init('Skype', 9), new this.init('SNS', 10), new this.init('Email', 11), new this.init('No Instant Messenger', 12), new this.init('Others', 13)];
                }
            };


            (function() {
                myFollowHistoryService.getBusinessTraceFlag().success(function(data) {
                    if (data.status !== 'success') return;
                    vm.businessTraceArray = data.data;
                });
                // 最近跟进标识
                vm.followSignArray = method.initFollowSign();
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
                tools.getPlatBuyerHistory();
            }())
        }
    ])



})
