define(['../module'], function(ng) {
    ng.factory('sellerTrackingService', ['$http', 'api',
            function($http, api) {
                return {
                    // 获取供应商互动行为跟踪列表
                    getsellerTrackingList: function(params) {
                        return $http.get(api.getsellerTrackingList, {
                            'params': params
                        });
                    },
                    // 跟进供应商 跟进内容
                    getFlolowDlgContent: function() {
                        var chkReasons = [];
                        chkReasons[0] = [];
                        chkReasons[1] = [];
                        // 可跟进
                        chkReasons[0][0] = { "text": "登录情况是否改善" };
                        chkReasons[0][1] = { "text": "回复率是否提升" };
                        chkReasons[0][2] = { "text": "商机数量是否提升" };
                        chkReasons[0][3] = { "text": "商品描述是否优化" };
                        chkReasons[0][4] = { "text": "考虑推荐增值服务" };
                        chkReasons[0][5] = { "text": "其他" };

                        // 免跟进
                        chkReasons[1][0] = { "text": "回复率正常" };
                        chkReasons[1][1] = { "text": "无法取得联系" };
                        chkReasons[1][2] = { "text": "客户拒绝沟通" };
                        chkReasons[1][3] = { "text": "缺少运营人员" };
                        chkReasons[1][4] = { "text": "未回复的商机质量差" };
                        chkReasons[1][5] = { "text": "未回复的商机不匹配" };
                        chkReasons[1][6] = { "text": "多次联系，无法激活" };
                        chkReasons[1][7] = { "text": "其他" };
                        return chkReasons;
                    },

                    // 供应商信息
                    getSellerDetail: function(params) {
                        return $http.get(api.getSellerDetail, {
                            'params': params
                        });
                    },
                    // 获取跟进记录
                    getsellerFollowDetail: function(params) {
                        return $http.get(api.getsellerFollowDetail, {
                            'params': params
                        })
                    },
                    // 供应商互动行为跟踪 - 采购需求未一次回复列表
                    getsellerTimesUnreplyProcurement: function(params) {
                        return $http.get(api.getsellerTimesUnreplyProcurement, {
                            'params': params
                        })
                    },
                    // 供应商互动行为跟踪 - 询盘未一次回复列表
                    getsellerTimesUnreplyInquiry: function(params) {
                        return $http.get(api.getsellerTimesUnreplyInquiry, {
                            'params': params
                        })
                    },
                    // 添加供应商跟进记录
                    addsellerFollowRecord: function(params) {
                        return $http.get(api.addsellerFollowRecord, {
                            'params': params
                        })
                    },
                    // 添加采购需求跟进商机
                    saveBusinessTrace: function(params) {
                        return $http.get(api.saveBusinessTrace, {
                            'params': params
                        })
                    },
                    // 添加询盘跟进商机
                    saveBusinessTrace_inquiry: function(params) {
                        return $http.get(api.saveBusinessTrace_inquiry, {
                            'params': params
                        })
                    }
                };
            }
        ])
        // 列表
        .controller('sellerTrackingListCtrl', [
            '$scope', '$rootScope', 'ngDialog',
            '$location', '$uibModal', 'sellerTrackingService',
            'commonService', 'commonTool',
            function($scope, $rootScope, ngDialog,
                $location, $uibModal, sellerTrackingService,
                commonService, commonTool) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    deployPeriod: 30,
                    notReplyPeriod: 72,
                    mainCategory: null,
                    selectType: 0,
                    selectValue: null,
                    orderType: 0
                };

                vm.selectionItme = [];
                vm.showOperateFlag = false;
                vm.needNode = true;


                var method = {
                    key: "",
                    value: "",
                    myObject: function(key, value) {
                        this.key = key;
                        this.value = value;
                    },
                    getFollowSignTypeArray: function() {
                        return [new this.myObject('有效买家', 1), new this.myObject("Can't Find Key Person", 2), new this.myObject('No English', 3), new this.myObject('Not Import from China', 4), new this.myObject('Service Refused', 5), new this.myObject('Fail to Contact', 6), new this.myObject('Not Buyer', 7), new this.myObject('Blick List', 8)];
                    },
                    getFollowSignWayArray: function() {
                        return [new this.myObject('Transfer', 1), new this.myObject('Find Key Person', 2), new this.myObject('LeadExpress', 3), new this.myObject('Inquiry', 4), new this.myObject('E-mail Inquiry', 5), new this.myObject('Online Chat', 6), new this.myObject('Success Case', 7)];
                    },
                    getArrayOfContact: function() {
                        return [new this.myObject('首次联系无人接听', 1), new this.myObject('首次联系打不通', 2), new this.myObject('Wrong Number', 3), new this.myObject('Wrong Email', 4), new this.myObject('Wrong Email &amp; Number', 5)];
                    },
                    getArrayOfBuyer: function() {
                        return [new this.myObject('Personal Customer', 1), new this.myObject('Mainland Manufacturer', 2), new this.myObject('Advertisement', 3), new this.myObject('Cheater', 4), new this.myObject('Not Buyer-Other', 5)];
                    }
                }

                tools = $.extend(tools, {
                    getsellerTrackingList: function(isSearchButton) {
                        if (isSearchButton) {
                            paging.page = 1;
                        }
                        sellerTrackingService.getsellerTrackingList(commonTool.filterParam(paging)).success(function(data) {
                            if (data.page.items != null) {
                                vm.items = data.page.items;
                            } else {
                                vm.items = [];
                            }
                            paging.total = data.page.total;
                            paging.pageSize = data.page.pageSize;
                        });
                    },
                    // 分页
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        tools.getsellerTrackingList();
                    },
                    // 重置
                    reset: function() {
                        paging.page = 1;
                        paging.pageSize = 10;
                        paging.deployPeriod = 30;
                        paging.notReplyPeriod = 72;
                        paging.mainCategory = null;
                        paging.selectType = 0;
                        paging.selectValue = null;
                        paging.orderType = 0;
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
                    // 重置弹出层勾选
                    resetCheckbox: function() {
                        vm.checkedItems = [];
                        vm.sellerDlg.followContent = '';
                        angular.forEach(vm.followContent, function(item_p) {
                            angular.forEach(item_p, function(item) {
                                item.$checked = false;
                            })
                        });
                    },
                    // 弹出层勾选
                    checkChange: function(status) {
                        vm.checkedItems = [];
                        if (status != undefined) {
                            angular.forEach(vm.followContent[status], function(item) {
                                if (item.$checked === true && item.text != '其他') {
                                    vm.checkedItems.push(item.text);
                                }
                                if (item.$checked === true && item.text == '其他') {
                                    vm.needNode = false;
                                } else {
                                    vm.needNode = true;
                                }
                            });
                        } else {
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
                        }
                    },
                    // 跟进供应商
                    followSeller: function(id) {
                        var ids = '';
                        if (commonTool.isEmpty(id)) {
                            vm.allChecked = false;
                            ids = vm.selectionItme.join(',');
                            if (commonTool.isEmpty(ids)) {
                                $rootScope.alertMsgService.setMessage("请先选择处理的记录", 'warning');
                                return;
                            }
                        } else {
                            ids = id;
                        }
                        tools.followSellerConfirm(ids);
                        vm.selectionItme = [];
                        vm.followContent = sellerTrackingService.getFlolowDlgContent();
                    },
                    // 跟进供应商 弹出层
                    followSellerConfirm: function(ids) {
                        $scope.ids = ids;
                        $scope.tools = tools;

                        vm.sellerDlg = {
                            freeFollowPeriod: 30,
                            followStatus: 0,
                            followContent: '',
                            followSignType: null,
                            followSignWay: null,
                            followSignWayArray: [],
                            remarkContent: ''
                        };

                        vm.checkedItems = [];

                        vm.followSellerDlg = ngDialog.open({
                            template: 'followSellerDlgId',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            width: 550,
                            title: "添加供应商跟进记录",
                            controller: ['$scope', function($scope) {
                                var ids = $scope.ids;
                                var tools = $scope.tools;

                                $scope.submit = function() {
                                    var params = {
                                        sellerIds: ids,
                                        followStatus: vm.sellerDlg.followStatus,
                                        freeFollowPeriod: vm.sellerDlg.freeFollowPeriod,
                                        remark: vm.sellerDlg.remarkContent
                                    };

                                    var otherContent = vm.sellerDlg.followContent != '' ? vm.sellerDlg.followContent + ';' : '';
                                    if (vm.needNode == false && vm.sellerDlg.followContent == '') {
                                        $rootScope.alertMsgService.setMessage('请输入其他内容', 'warning');
                                        return;
                                    }
                                    if (vm.checkedItems.length < 1 && vm.sellerDlg.followContent == '') {
                                        $rootScope.alertMsgService.setMessage('请选择原因', 'warning');
                                        return;
                                    } else {
                                        if (vm.checkedItems.length > 0) {
                                            params.followContent = vm.checkedItems.join(';') + ';' + otherContent;
                                        } else {
                                            params.followContent = otherContent;
                                        }
                                    }

                                    sellerTrackingService.addsellerFollowRecord(params)
                                        .success(function(data) {
                                            if ('success' === data.status) {
                                                vm.needNode = true;
                                                tools.getsellerTrackingList();
                                                $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                                tools.close();
                                            } else {
                                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                            }
                                        })
                                }

                            }]

                        });
                    },
                    // 关闭弹出层
                    close: function() {
                        tools.checkAll(false);
                        vm.needNode = true;
                        ngDialog.closeAll();
                    },
                    followSignTypeChange: function() {
                        switch (vm.sellerDlg.followSignType) {
                            case 1:
                                vm.sellerDlg.followSignWayArray = method.getFollowSignWayArray();
                                return;
                            case 6:
                                vm.sellerDlg.followSignWayArray = method.getArrayOfContact();
                                return;
                            case 7:
                                vm.sellerDlg.followSignWayArray = method.getArrayOfBuyer();
                                return;
                            default:
                                vm.sellerDlg.followSignWayArray = [];
                                return;
                        }
                    },
                    followSignTypeArray: method.getFollowSignTypeArray(),
                    // 商机发布时间
                    deployPeriod: [{
                        "title": "7天内",
                        "key": 7
                    }, {
                        "title": "15天内",
                        "key": 15
                    }, {
                        "title": "30天内",
                        "key": 30
                    }, {
                        "title": "60天内",
                        "key": 60
                    }, {
                        "title": "90天内",
                        "key": 90
                    }],
                    // 供应商未一次回复时长
                    notReplyPeriod: [{
                        "title": "超过12小时",
                        "key": 12
                    }, {
                        "title": "超过一天",
                        "key": 24
                    }, {
                        "title": "超过三天",
                        "key": 24 * 3
                    }, {
                        "title": "超过一周",
                        "key": 24 * 7
                    }, {
                        "title": "超过两周",
                        "key": 24 * 7 * 2
                    }],
                    // 供应商搜索
                    selectType: [{
                        "title": "公司中文名",
                        "key": 0
                    }, {
                        "title": "公司英文名",
                        "key": 1
                    }, {
                        "title": "用户名",
                        "key": 2
                    }, {
                        "title": "邮箱",
                        "key": 3
                    }],
                    // 排序规则
                    orderType: [{
                        "title": "近30天商机回复率升序",
                        "key": 0
                    }, {
                        "title": "近30天商机回复率降序",
                        "key": 1
                    }, {
                        "title": "采购需求数降序",
                        "key": 2
                    }, {
                        "title": "询盘数降序",
                        "key": 3
                    }],
                    // 免跟进周期
                    freeFollowPeriod: [{
                        "title": "3天内",
                        "key": 7
                    }, {
                        "title": "7天内",
                        "key": 7
                    }, {
                        "title": "10天内",
                        "key": 10
                    }, {
                        "title": "15天内",
                        "key": 15
                    }, {
                        "title": "20天内",
                        "key": 20
                    }, {
                        "title": "30天内",
                        "key": 30
                    }, {
                        "title": "60天内",
                        "key": 60
                    }, {
                        "title": "90天内",
                        "key": 90
                    }, {
                        "title": "180天内",
                        "key": 180
                    }]
                });

                function init_data() {
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);
                    // 获取主营行业
                    commonService.getAllCategorysOfLevel1().success(function(data) {
                        if (data.status == 'success') {
                            var tempData = data.data;
                            var tempJson = {
                                "categoryId": -10,
                                "categoryName": "无主营行业"
                            }
                            tempData.unshift(tempJson);
                            vm.categorys1List = tempData;
                        }
                    });

                    tools.getsellerTrackingList();
                }

                init_data();
            }
        ])

    // 采购需求未一次回复列表
    .controller('purchaseReplyCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'sellerTrackingService',
        'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, sellerTrackingService,
            commonService, commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var search = $location.search();
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                deployPeriod: search.deployPeriod,
                notReplyPeriod: search.notReplyPeriod,
                sellerId: parseInt(search.sellerId)
            };

            vm.sellerInfo = {};
            vm.followInfo = null;

            vm.selectionItme = [];
            vm.showOperateFlag = false;

            vm.needNode = true;

            var method = {
                key: "",
                value: "",
                myObject: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                getFollowSignTypeArray: function() {
                    return [new this.myObject('有效买家', 1), new this.myObject("Can't Find Key Person", 2), new this.myObject('No English', 3), new this.myObject('Not Import from China', 4), new this.myObject('Service Refused', 5), new this.myObject('Fail to Contact', 6), new this.myObject('Not Buyer', 7), new this.myObject('Blick List', 8)];
                },
                getFollowSignWayArray: function() {
                    return [new this.myObject('Transfer', 1), new this.myObject('Find Key Person', 2), new this.myObject('LeadExpress', 3), new this.myObject('Inquiry', 4), new this.myObject('E-mail Inquiry', 5), new this.myObject('Online Chat', 6), new this.myObject('Success Case', 7)];
                },
                getArrayOfContact: function() {
                    return [new this.myObject('首次联系无人接听', 1), new this.myObject('首次联系打不通', 2), new this.myObject('Wrong Number', 3), new this.myObject('Wrong Email', 4), new this.myObject('Wrong Email &amp; Number', 5)];
                },
                getArrayOfBuyer: function() {
                    return [new this.myObject('Personal Customer', 1), new this.myObject('Mainland Manufacturer', 2), new this.myObject('Advertisement', 3), new this.myObject('Cheater', 4), new this.myObject('Not Buyer-Other', 5)];
                }
            }

            tools = $.extend(tools, {
                // 供应商互动行为跟踪 - 供应商详情
                getSellerDetail: function() {
                    sellerTrackingService.getSellerDetail(paging).success(function(data) {
                        if (commonTool.isEmpty(data.data)) return;
                        vm.sellerInfo = data.data;
                    })
                },
                // 供应商互动行为跟踪 - 供应商跟进状态
                getsellerFollowDetail: function() {
                    sellerTrackingService.getsellerFollowDetail({
                        sellerId: paging.sellerId,
                        page: 1,
                        pageSize: 1
                    }).success(function(data) {
                        if (!data.page.items) return;
                        vm.followInfo = data.page.items[0];
                    })
                },
                // 供应商互动行为跟踪 - 采购需求未一次回复列表
                getsellerTimesUnreplyProcurement: function() {
                    sellerTrackingService.getsellerTimesUnreplyProcurement(commonTool.filterParam(paging)).success(function(data) {
                        if (data.page.items != null) {
                            vm.items = data.page.items;
                        } else {
                            vm.items = [];
                        }
                        paging.total = data.page.total;
                        paging.pageSize = data.page.pageSize;
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
                    tools.getsellerTimesUnreplyProcurement();
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
                // 添加供应商商机跟进记录
                followBusiness: function(id) {
                    var ids = '';
                    if (commonTool.isEmpty(id)) {
                        vm.allChecked = false;
                        ids = vm.selectionItme.join(',');
                        if (commonTool.isEmpty(ids)) {
                            $rootScope.alertMsgService.setMessage("请先选择处理的记录", 'warning');
                            return;
                        }
                    } else {
                        ids = id;
                    }
                    tools.followBusinessConfirm(ids);
                    vm.selectionItme = [];
                },
                // 添加供应商商机跟进记录 弹出层
                followBusinessConfirm: function(ids) {
                    $scope.ids = ids;
                    $scope.tools = tools;

                    vm.businessDlg = {
                        followStatus: 1,
                        content: ''
                    };

                    vm.followBusinessDlg = ngDialog.open({
                        template: 'followBusinessDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        width: 500,
                        title: "添加供应商商机跟进记录",
                        controller: ['$scope', function($scope) {
                            var ids = $scope.ids;
                            var tools = $scope.tools;

                            $scope.submit = function() {
                                var params = {
                                    'procurementIds': ids,
                                    'followStatus': vm.businessDlg.followStatus,
                                    'content': vm.businessDlg.content,
                                    'userType': 1
                                };

                                if (commonTool.isEmpty(vm.businessDlg.content)) {
                                    $rootScope.alertMsgService.setMessage('请输入跟进内容', 'warning');
                                    return;
                                }

                                sellerTrackingService.saveBusinessTrace(params)
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            tools.getsellerTimesUnreplyProcurement();
                                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                            tools.close();
                                        } else {
                                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                        }
                                    })
                            }

                        }]

                    });
                },
                // 重置弹出层勾选
                resetCheckbox: function() {
                    vm.checkedItems = [];
                    vm.sellerDlg.followContent = '';
                    angular.forEach(vm.followContent, function(item_p) {
                        angular.forEach(item_p, function(item) {
                            item.$checked = false;
                        })
                    });
                },
                // 弹出层勾选
                checkChange: function(status) {
                    vm.checkedItems = [];
                    if (status != undefined) {
                        angular.forEach(vm.followContent[status], function(item) {
                            if (item.$checked === true && item.text != '其他') {
                                vm.checkedItems.push(item.text);
                            }
                            if (item.$checked === true && item.text == '其他') {
                                vm.needNode = false;
                            } else {
                                vm.needNode = true;
                            }
                        });
                    } else {
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
                    }
                },
                // 跟进供应商
                followSeller: function(id) {
                    var ids = '';
                    if (commonTool.isEmpty(id)) {
                        vm.allChecked = false;
                        ids = vm.selectionItme.join(',');
                        if (commonTool.isEmpty(ids)) {
                            $rootScope.alertMsgService.setMessage("请先选择处理的记录", 'warning');
                            return;
                        }
                    } else {
                        ids = id;
                    }
                    tools.followSellerConfirm(ids);
                    vm.selectionItme = [];
                    vm.followContent = sellerTrackingService.getFlolowDlgContent();
                },
                // 跟进供应商 弹出层
                followSellerConfirm: function(ids) {
                    $scope.ids = ids;
                    $scope.tools = tools;

                    vm.sellerDlg = {
                        freeFollowPeriod: 30,
                        followStatus: 0,
                        followContent: '',
                        followSignType: null,
                        followSignWay: null,
                        followSignWayArray: [],
                        remarkContent: ''
                    };

                    vm.checkedItems = [];

                    vm.followSellerDlg = ngDialog.open({
                        template: 'followSellerDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        width: 550,
                        title: "添加供应商跟进记录",
                        controller: ['$scope', function($scope) {
                            var ids = $scope.ids;
                            var tools = $scope.tools;

                            $scope.submit = function() {
                                var params = {
                                    sellerIds: ids,
                                    followStatus: vm.sellerDlg.followStatus,
                                    freeFollowPeriod: vm.sellerDlg.freeFollowPeriod,
                                    remark: vm.sellerDlg.remarkContent
                                };

                                var otherContent = vm.sellerDlg.followContent != '' ? vm.sellerDlg.followContent + ';' : '';
                                if (vm.needNode == false && vm.sellerDlg.followContent == '') {
                                    $rootScope.alertMsgService.setMessage('请输入其他内容', 'warning');
                                    return;
                                }
                                if (vm.checkedItems.length < 1 && vm.sellerDlg.followContent == '') {
                                    $rootScope.alertMsgService.setMessage('请选择原因', 'warning');
                                    return;
                                } else {
                                    if (vm.checkedItems.length > 0) {
                                        params.followContent = vm.checkedItems.join(';') + ';' + otherContent;
                                    } else {
                                        params.followContent = otherContent;
                                    }
                                }

                                sellerTrackingService.addsellerFollowRecord(params)
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            vm.needNode = true;
                                            tools.getsellerFollowDetail();
                                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                            tools.close();
                                        } else {
                                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                        }
                                    })
                            }

                        }]

                    });
                },
                // 关闭弹出层
                close: function() {
                    tools.checkAll(false);
                    vm.needNode = true;
                    ngDialog.closeAll();
                },
                followSignTypeChange: function() {
                    switch (vm.sellerDlg.followSignType) {
                        case 1:
                            vm.sellerDlg.followSignWayArray = method.getFollowSignWayArray();
                            return;
                        case 6:
                            vm.sellerDlg.followSignWayArray = method.getArrayOfContact();
                            return;
                        case 7:
                            vm.sellerDlg.followSignWayArray = method.getArrayOfBuyer();
                            return;
                        default:
                            vm.sellerDlg.followSignWayArray = [];
                            return;
                    }
                },
                followSignTypeArray: method.getFollowSignTypeArray(),
                // 免跟进周期
                freeFollowPeriod: [{
                    "title": "3天内",
                    "key": 7
                }, {
                    "title": "7天内",
                    "key": 7
                }, {
                    "title": "10天内",
                    "key": 10
                }, {
                    "title": "15天内",
                    "key": 15
                }, {
                    "title": "20天内",
                    "key": 20
                }, {
                    "title": "30天内",
                    "key": 30
                }, {
                    "title": "60天内",
                    "key": 60
                }, {
                    "title": "90天内",
                    "key": 90
                }, {
                    "title": "180天内",
                    "key": 180
                }]
            });

            function init_data() {
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
                // 获取供应商详情
                tools.getSellerDetail();
                // 供应商互动行为跟踪 - 供应商跟进状态
                tools.getsellerFollowDetail();
                // 供应商互动行为跟踪 - 采购需求未一次回复列表
                tools.getsellerTimesUnreplyProcurement();
            }

            init_data();
        }
    ])

    // 询盘未一次回复列表
    .controller('inquiryReplyCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'sellerTrackingService',
        'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, sellerTrackingService,
            commonService, commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var search = $location.search();
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                deployPeriod: search.deployPeriod,
                notReplyPeriod: search.notReplyPeriod,
                sellerId: parseInt(search.sellerId)
            };

            vm.sellerInfo = {};
            vm.followInfo = null;

            vm.selectionItme = [];
            vm.showOperateFlag = false;

            vm.needNode = true;

            var method = {
                key: "",
                value: "",
                myObject: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                getFollowSignTypeArray: function() {
                    return [new this.myObject('有效买家', 1), new this.myObject("Can't Find Key Person", 2), new this.myObject('No English', 3), new this.myObject('Not Import from China', 4), new this.myObject('Service Refused', 5), new this.myObject('Fail to Contact', 6), new this.myObject('Not Buyer', 7), new this.myObject('Blick List', 8)];
                },
                getFollowSignWayArray: function() {
                    return [new this.myObject('Transfer', 1), new this.myObject('Find Key Person', 2), new this.myObject('LeadExpress', 3), new this.myObject('Inquiry', 4), new this.myObject('E-mail Inquiry', 5), new this.myObject('Online Chat', 6), new this.myObject('Success Case', 7)];
                },
                getArrayOfContact: function() {
                    return [new this.myObject('首次联系无人接听', 1), new this.myObject('首次联系打不通', 2), new this.myObject('Wrong Number', 3), new this.myObject('Wrong Email', 4), new this.myObject('Wrong Email &amp; Number', 5)];
                },
                getArrayOfBuyer: function() {
                    return [new this.myObject('Personal Customer', 1), new this.myObject('Mainland Manufacturer', 2), new this.myObject('Advertisement', 3), new this.myObject('Cheater', 4), new this.myObject('Not Buyer-Other', 5)];
                }
            }

            tools = $.extend(tools, {
                // 供应商互动行为跟踪 - 供应商详情
                getSellerDetail: function() {
                    sellerTrackingService.getSellerDetail(paging).success(function(data) {
                        if (commonTool.isEmpty(data.data)) return;
                        vm.sellerInfo = data.data;
                    })
                },
                // 供应商互动行为跟踪 - 供应商跟进状态
                getsellerFollowDetail: function() {
                    sellerTrackingService.getsellerFollowDetail({
                        sellerId: paging.sellerId,
                        page: 1,
                        pageSize: 1
                    }).success(function(data) {
                        if (data.page.items.length == 0) return;
                        vm.followInfo = data.page.items[0];
                    })
                },
                // 供应商互动行为跟踪 - 供应商未一次回复询盘
                getsellerTimesUnreplyInquiry: function() {
                    sellerTrackingService.getsellerTimesUnreplyInquiry(commonTool.filterParam(paging)).success(function(data) {
                        if (data.page.items != null) {
                            vm.items = data.page.items;
                        } else {
                            vm.items = [];
                        }
                        paging.total = data.page.total;
                        paging.pageSize = data.page.pageSize;
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
                    tools.getsellerTimesUnreplyInquiry();
                },
                checkAll: function(checked) {
                    vm.selectionItme = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {
                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionItme.push(item.inquiryId);
                        }
                    });
                },
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.inquiryId);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                },
                // 添加供应商商机跟进记录
                followBusiness: function(id) {
                    var ids = '';
                    if (commonTool.isEmpty(id)) {
                        vm.allChecked = false;
                        ids = vm.selectionItme.join(',');
                        if (commonTool.isEmpty(ids)) {
                            $rootScope.alertMsgService.setMessage("请先选择处理的记录", 'warning');
                            return;
                        }
                    } else {
                        ids = id;
                    }
                    tools.followBusinessConfirm(ids);
                    vm.selectionItme = [];
                },
                // 添加供应商商机跟进记录 弹出层
                followBusinessConfirm: function(ids) {
                    $scope.ids = ids;
                    $scope.tools = tools;

                    vm.businessDlg = {
                        followStatus: 1,
                        content: ''
                    };

                    vm.followBusinessDlg = ngDialog.open({
                        template: 'followBusinessDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        width: 500,
                        title: "添加供应商商机跟进记录",
                        controller: ['$scope', function($scope) {
                            var ids = $scope.ids;
                            var tools = $scope.tools;

                            $scope.submit = function() {
                                var params = {
                                    'inquriyIds': ids,
                                    'followStatus': vm.businessDlg.followStatus,
                                    'content': vm.businessDlg.content,
                                    'userType': 1,
                                    'sellerId': paging.sellerId
                                };

                                if (commonTool.isEmpty(vm.businessDlg.content)) {
                                    $rootScope.alertMsgService.setMessage('请输入跟进内容', 'warning');
                                    return;
                                }

                                sellerTrackingService.saveBusinessTrace_inquiry(params)
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            tools.getsellerTimesUnreplyInquiry();
                                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                            tools.close();
                                        } else {
                                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                        }
                                    })
                            }

                        }]

                    });
                },
                // 重置弹出层勾选
                resetCheckbox: function() {
                    vm.checkedItems = [];
                    vm.sellerDlg.followContent = '';
                    angular.forEach(vm.followContent, function(item_p) {
                        angular.forEach(item_p, function(item) {
                            item.$checked = false;
                        })
                    });
                },
                // 弹出层勾选
                checkChange: function(status) {
                    vm.checkedItems = [];
                    if (status != undefined) {
                        angular.forEach(vm.followContent[status], function(item) {
                            if (item.$checked === true && item.text != '其他') {
                                vm.checkedItems.push(item.text);
                            }
                            if (item.$checked === true && item.text == '其他') {
                                vm.needNode = false;
                            } else {
                                vm.needNode = true;
                            }
                        });
                    } else {
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
                    }
                },
                // 跟进供应商
                followSeller: function(id) {
                    var ids = '';
                    if (commonTool.isEmpty(id)) {
                        vm.allChecked = false;
                        ids = vm.selectionItme.join(',');
                        if (commonTool.isEmpty(ids)) {
                            $rootScope.alertMsgService.setMessage("请先选择处理的记录", 'warning');
                            return;
                        }
                    } else {
                        ids = id;
                    }
                    tools.followSellerConfirm(ids);
                    vm.selectionItme = [];
                    vm.followContent = sellerTrackingService.getFlolowDlgContent();
                },
                // 跟进供应商 弹出层
                followSellerConfirm: function(ids) {
                    $scope.ids = ids;
                    $scope.tools = tools;

                    vm.sellerDlg = {
                        freeFollowPeriod: 30,
                        followStatus: 0,
                        followContent: '',
                        followSignType: null,
                        followSignWay: null,
                        followSignWayArray: [],
                        remarkContent: ''
                    };
                    vm.checkedItems = [];

                    vm.followSellerDlg = ngDialog.open({
                        template: 'followSellerDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        width: 550,
                        title: "添加供应商跟进记录",
                        controller: ['$scope', function($scope) {
                            var ids = $scope.ids;
                            var tools = $scope.tools;

                            $scope.submit = function() {
                                var params = {
                                    sellerIds: ids,
                                    followStatus: vm.sellerDlg.followStatus,
                                    freeFollowPeriod: vm.sellerDlg.freeFollowPeriod,
                                    remark: vm.sellerDlg.remarkContent
                                };

                                var otherContent = vm.sellerDlg.followContent != '' ? vm.sellerDlg.followContent + ';' : '';
                                if (vm.needNode == false && vm.sellerDlg.followContent == '') {
                                    $rootScope.alertMsgService.setMessage('请输入其他内容', 'warning');
                                    return;
                                }
                                if (vm.checkedItems.length < 1 && vm.sellerDlg.followContent == '') {
                                    $rootScope.alertMsgService.setMessage('请选择原因', 'warning');
                                    return;
                                } else {
                                    if (vm.checkedItems.length > 0) {
                                        params.followContent = vm.checkedItems.join(';') + ';' + otherContent;
                                    } else {
                                        params.followContent = otherContent;
                                    }
                                }

                                sellerTrackingService.addsellerFollowRecord(params)
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            vm.needNode = true;
                                            tools.getsellerFollowDetail();
                                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                            tools.close();
                                        } else {
                                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                        }
                                    })
                            }

                        }]

                    });
                },
                // 关闭弹出层
                close: function() {
                    tools.checkAll(false);
                    vm.needNode = true;
                    ngDialog.closeAll();
                },
                followSignTypeChange: function() {
                    switch (vm.sellerDlg.followSignType) {
                        case 1:
                            vm.sellerDlg.followSignWayArray = method.getFollowSignWayArray();
                            return;
                        case 6:
                            vm.sellerDlg.followSignWayArray = method.getArrayOfContact();
                            return;
                        case 7:
                            vm.sellerDlg.followSignWayArray = method.getArrayOfBuyer();
                            return;
                        default:
                            vm.sellerDlg.followSignWayArray = [];
                            return;
                    }
                },
                followSignTypeArray: method.getFollowSignTypeArray(),
                // 免跟进周期
                freeFollowPeriod: [{
                    "title": "3天内",
                    "key": 7
                }, {
                    "title": "7天内",
                    "key": 7
                }, {
                    "title": "10天内",
                    "key": 10
                }, {
                    "title": "15天内",
                    "key": 15
                }, {
                    "title": "20天内",
                    "key": 20
                }, {
                    "title": "30天内",
                    "key": 30
                }, {
                    "title": "60天内",
                    "key": 60
                }, {
                    "title": "90天内",
                    "key": 90
                }, {
                    "title": "180天内",
                    "key": 180
                }]
            });

            function init_data() {
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
                // 获取供应商详情
                tools.getSellerDetail();
                // 供应商互动行为跟踪 - 供应商跟进状态
                tools.getsellerFollowDetail();
                // 供应商互动行为跟踪 - 采购需求未一次回复列表
                tools.getsellerTimesUnreplyInquiry();
            }

            init_data();
        }
    ])

    // 质量  高：1；中：2；低：3
    .filter('qualityFilter', function() {
        return function(quality) {
            var str = '';
            switch (quality) {
                case 1:
                    str = '高';
                    break;

                case 2:
                    str = '中';
                    break;

                case 3:
                    str = '低';
                    break;
            }
            return str;
        }
    })

});