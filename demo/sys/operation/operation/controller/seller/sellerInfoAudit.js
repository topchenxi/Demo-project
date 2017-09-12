define(['../module'], function(ng) {
    ng
        .factory('sellerInfoService', ['$http', 'api',
            function($http, api) {
                return {
                    // 列表
                    getSellerInfoList: function(params) {
                        return $http.get(api.getSellerInfoList, {
                            'params': params
                        });
                    },
                    // 修改状态chgSellerInfoAudit
                    chgSellerInfoAudit: function(params) {
                        return $http.post(api.chgSellerInfoAudit, params)
                    },
                    // 历史记录
                    getSellerInfoAuditRecord: function(params) {
                        return $http.get(api.getSellerInfoAuditRecord, {
                            'params': params
                        })
                    },
                    // 获取当前页面类型
                    setPageType: function(loct) {
                        var pageType = null;
                        switch (loct) {
                            case "domainNameList":
                                pageType = 1;
                                break; //专属域名审核
                            case "companyImageList":
                                pageType = 2;
                                break; //公司形象审核
                            case "certificateList":
                                pageType = 3;
                                break; //认证证书审核
                            case "videoList":
                                pageType = 4;
                                break; //视频审核
                            case "logoList":
                                pageType = 5;
                                break; //公司LOGO审核
                            default:
                                break;
                        }
                        return pageType;
                    }
                }
            }
        ])
        .controller('SellerInfoCtrl', [
            '$scope', '$controller', '$window', 'ngDialog',
            '$location', '$uibModal', 'sellerInfoService',
            'commonService', 'commonTool',
            function(
                $scope, $controller, $window, ngDialog,
                $location, $uibModal, service,
                commonService, commonTool) {

                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                var pageType = 1;
                var loct = $location.$$path;
                // 1:待审核;2:审核不通过;3:审核通过
                var TO_AUDIT = $scope.TO_AUDIT = 1,
                    PASS_AUDIT = $scope.PASS_AUDIT = 3,
                    FAIL_AUDIT = $scope.FAIL_AUDIT = 2;
                loct = loct.substr(loct.lastIndexOf('/') + 1);
                var pageType = service.setPageType(loct);
                var paging = $scope.paging = {
                    'searchDateType': "0",
                    'auditStatus': null,
                    'page': 1,
                    'pageSize': 10,
                    'startDate': null,
                    'endDate': null,
                    //搜索类型 1:公司名;2:域名;3:审核人;默认为1
                    'searchType': "1",
                    //录入查询值 当searchType in (1..7)中，此值有效
                    'searchValue': null,
                    //审核类型 1:专属域名;2:公司形象;3:认证证书;4:视频;5:公司LOGO
                    'type': pageType
                };
                vm.showOperateFlag = false;
                // 定义"发布时间:起始时间"控件
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
                // 定义"发布时间:截止时间"控件
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
                    // 点击"发布时间:起始时间"输入框事件
                    initStartDate: function() {
                        laydate(start);
                    },
                    // 点击"发布时间:起始时间"输入框事件
                    initEndDate: function() {
                        laydate(end);
                    },
                    confirm: function(sellerIds, auditStatus) {
                        $scope.sellerIds = sellerIds;
                        $scope.tools = tools;
                        $scope.status = auditStatus;
                        $scope.type = paging.type;
                        $scope.pageType = 'current';
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 500,
                            templateUrl: 'confirm.html',
                            controller: 'sellerAuditConfirmCtrl'
                        })
                    },
                    // 查询列表
                    getSellerInfoList: function(status) {
                        vm.showOperateFlag = false;
                        if (status == paging.auditStatus) {
                            return;
                        } else if (status != null) {
                            paging.auditStatus = status;
                        }
                        status == TO_AUDIT ? paging.searchDateType = "0" : '';

                        service.getSellerInfoList(commonTool.filterParam(paging)).success(function(data) {
                            if (data.status == "success") {
                                vm.items = data.data;
                                paging.total = data.page.total;
                                paging.pageSize = data.page.pageSize;
                                vm.allChecked = false;
                            }
                        })
                    },
                    // 搜素
                    search: function() {
                        page = 1;
                        tools.getSellerInfoList(null);
                    },
                    reset: function() {
                        $('#startTime').val('');
                        $('#endTime').val('');
                        paging.searchDateType = "0";
                        paging.startDate = null;
                        paging.endDate = null;
                        paging.searchType = "1";
                        paging.searchValue = null;
                    },
                    // 分页组件
                    getnewpage: function(type) {
                        if (type == 1) { // 跳转到第几页
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) { // 每页显示多少条切换时
                            paging.page = 1;
                        }
                        tools.getSellerInfoList(null);
                    },
                    // 历史记录
                    showHistory: function(sellerId, index) {
                        var it = vm.items[index];
                        if (commonTool.isEmpty(it.historyList)) {
                            // 请求历史记录
                            service.getSellerInfoAuditRecord({
                                "id": sellerId,
                                "type": paging.type
                            }).success(function(data) {
                                if (data.status == "success") {
                                    vm.items[index].historyList = data.data;
                                } else {
                                    alert("后台出错");
                                }
                            })
                        }
                        vm.items[index].showUp = 1;
                    },
                    // 图片放大
                    enLarge: function(str_img) {
                        $scope.str_img = str_img;
                        $uibModal.open({
                            animation: true,
                            templateUrl: '/controller/index/enlarge.html',
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
                    // 视频播放
                    showVideo: function(url) {
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'showVideo.html',
                            controller: 'ShowVideoCtrl',
                            size: '',
                            scope: $scope,
                            resolve: {
                                url: function() {
                                    return url;
                                }
                            }
                        })
                    },
                    showMoreCertif: function(id, detail, st) {
                        $window.open('/#/seller/certificateDetail?type=' + paging.type + "&id=" + id + "&imgs=" + detail + "&st=" + st);
                    },
                    // 单个审核
                    changestatus: function(sellerId, status) {
                        tools.confirm(sellerId, status);
                    },
                    // 多个审核
                    audit: function(status) {
                        var params = {
                            'ids': vm.selectionItme.join(','),
                            'auditStatus': status
                        };
                        if (commonTool.isEmpty(params.ids)) {
                            alert("请先选择要审核的项!");
                            return;
                        }
                        tools.confirm(params.ids, params.auditStatus);
                        vm.selectionItme = [];
                    }
                });

                vm = $.extend(vm, {
                    selectionItme: [],
                    // 全选
                    checkAll: function(checked) {
                        vm.selectionItme = [];
                        vm.showOperateFlag = checked ? true : false;
                        angular.forEach(vm.items, function(item) {

                            item.$checked = checked;
                            if (true === checked) {
                                vm.selectionItme.push(item.id + "@" + item.auditLogId);
                            }
                        });
                        if (true !== checked) {
                            vm.selectionItme = [];
                        }
                    },
                    // 批量审核
                    selection: function() {
                        var selectionItme = [];
                        angular.forEach(vm.items, function(item) {
                            if (item.$checked === true) {
                                selectionItme.push(item.id + "@" + item.auditLogId);
                            }
                        });
                        vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                        vm.selectionItme = selectionItme;
                    }
                });

                init_page();

                function init_page() {
                    // 分页-每页记录数
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);
                    // 默认加载待审核的列表
                    tools.getSellerInfoList(TO_AUDIT);
                };


            }
        ])
        .controller('ShowVideoCtrl', [
            '$scope', '$uibModalInstance', 'url',
            function($scope, $uibModalInstance, url) {
                $scope.vedioUrl = imgUrl + url;
                $scope.videoInfo = "videoDefault=" + $scope.vedioUrl + "&autoHide=true&hideType=fade&autoStart=false&holdImage=start.jpg&startVol=60&hideDelay=60&bgAlpha=75";
                $scope.close = function() {
                    $uibModalInstance.dismiss('cancel');
                }
            }
        ])
        .filter('getDomainFromMsg', function() {
            return function(msg) {
                var rs = "";
                if (msg != null && msg != 'undefined') {
                    var indF = msg.indexOf("【");
                    var indL = msg.indexOf("】");
                    if (indF > -1 && indF < indL) {
                        rs = msg.substring(indF + 1, indL);
                    }
                }

                return rs;
            };
        })
        .controller('sellerAuditConfirmCtrl', [
            '$scope', '$rootScope', 'ngDialog',
            'sellerInfoService', 'commonTool',
            function($scope, $rootScope, ngDialog,
                sellerInfoService, commonTool) {
                var vm = $scope.vm = {},
                    tools = $scope.tools,
                    sellerIds = $scope.sellerIds,
                    type = $scope.type,
                    status = $scope.status,
                    pageType = $scope.pageType;
                console.log(sellerIds, ' ', status);
                vm.status = status;
                tools = $.extend(tools, {
                    submit: function() {
                        if (vm.status == 2 && commonTool.isEmpty(vm.reason)) {
                            $rootScope.alertMsgService.setMessage('请先填写审核原因', 'warning');
                            return;
                        }
                        var params = {
                            ids: sellerIds,
                            auditStatus: vm.status,
                            type: type
                        }
                        if (vm.status == 2) params.unPassReason = vm.reason;
                        sellerInfoService.chgSellerInfoAudit(params).success(function(data) {
                            if ('success' == data.status) {
                                ngDialog.closeAll();
                                $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                console.log(pageType);
                                if (pageType == 'current') {
                                    tools.getSellerInfoList(null);
                                } else if (pageType == 'sellerDetail') {
                                    tools.getdetail();
                                } else if (pageType == 'shopDetail') {
                                    tools.getSellerShopInfo();
                                } else {
                                    tools.getSellerInfoList(null);
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

    .controller('CertificateDetail', [
        '$scope', '$rootScope', 'ngDialog',
        '$window', '$location', 'sellerInfoService',
        '$uibModal',
        function($scope, $rootScope, ngDialog, $window, $location, service, $uibModal) {
            var param = $scope.param = {};
            var tools = $scope.tools = {};
            var TO_AUDIT = $scope.TO_AUDIT = 1,
                PASS_AUDIT = $scope.PASS_AUDIT = 3,
                FAIL_AUDIT = $scope.FAIL_AUDIT = 2;
            param.type = $location.search().type;
            param.id = $location.search().id;
            param.st = $location.search().st;
            $scope.imgs = $location.search().imgs.split(',');
            $rootScope.showmenus();
            tools.close = function() {
                $window.close();
            }

            // 单个审核通过or不通过
            tools.changestatus = function(status) {
                tools.confirm(param.id, status);
            };
            tools.confirm = function(auditStatus) {
                $scope.sellerIds = sellerIds;
                $scope.tools = tools;
                $scope.status = auditStatus;
                $scope.type = paging.type;
                $scope.pageType = 'current';
                ngDialog.open({
                    appendClassName: "dialog-activeM",
                    scope: $scope,
                    animation: true,
                    width: 500,
                    templateUrl: 'confirm.html',
                    controller: 'sellerAuditConfirmCtrl'
                })
            }


        }
    ])
});
