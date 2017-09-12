define(['../module'], function(ng) {
    ng.factory('edmService', ['$http', 'api',
            function($http, api) {
                return {
                    // 获取EDM推广计划列表
                    getedmList: function(params) {
                        return $http.get(api.getEdm, {
                            'params': params
                        });
                    },
                    // EDM推广计划详情
                    getEdmDetail: function(params) {
                        return $http.get(api.getEdmDetail, {
                            'params': params
                        });
                    },
                    // EDM推广计划详情审核记录
                    getPromotionmailchecklist: function(params) {
                        return $http.get(api.getPromotionmailchecklist, {
                            'params': params
                        });
                    },
                    // 获取发票列表
                    getInvoiceList: function(params, isExport) {
                        var url = api.getEdmInvoice;
                        if (isExport) {
                            url = api.invoiceReport;
                            return $http({
                                method: 'post',
                                url: url,
                                params: params,
                                responseType: 'arraybuffer'
                            });
                        } else {
                            return $http.get(url, {
                                'params': params
                            });
                        }
                    },
                    // 获取资金流水列表
                    getFundsFlowList: function(params, isExport) {
                        var url = api.getEdmFundsFlow;
                        if (isExport) {
                            url = api.rechargeReport;
                            return $http({
                                method: 'post',
                                url: url,
                                params: params,
                                responseType: 'arraybuffer'
                            });
                        } else {
                            return $http.get(url, {
                                'params': params
                            });
                        }
                    },
                    // 确认或者批量确认资金流水
                    confirmEdmFundsFlow: function(params) {
                        return $http.get(api.confirmEdmFundsFlow, {
                            'params': params
                        })
                    },
                    // 消费记录列表
                    getComsumeRecordList: function(params) {
                        return $http.get(api.comsumeRecordList, {
                            'params': params
                        })
                    },
                    // 消费记录 -- 报价
                    getQuoteEquityList: function(params) {
                        return $http.get(api.getQuoteEquityList, {
                            'params': params
                        })
                    },
                    // 获取所有套餐
                    getMemPackageList: function(params) {
                        return $http.get(api.getMemPackageList, {
                            'params': params
                        })
                    },
                    // 获取消费记录详细
                    getComsumeRecordDetail: function(params) {
                        return $http.get(api.getComsumeRecordDetail, {
                            'params': params
                        })
                    },
                    // 更新状态
                    updateStatus: function(params) {
                        return $http.get(api.updateEdmStatus, {
                            'params': params
                        })
                    },
                    // 更新发票状态
                    updateInvoiceStatus: function(params) {
                        return $http.get(api.updateInvoiceStatus, {
                            'params': params
                        })
                    },
                    // 更新邮件发送状态
                    updateMailSendStatus: function(params) {
                        return $http.get(api.updateMailSendStatus, {
                            'params': params
                        })
                    },
                    // 更新报告发送状态
                    updateReportStatus: function(params) {
                        return $http.get(api.updateReportStatus, {
                            'params': params
                        })
                    }
                };
            }
        ])
        // 列表
        .controller('edmListCtrl', [
            '$scope', '$rootScope', 'ngDialog',
            '$location', '$uibModal', 'edmService',
            'commonService', 'commonTool',
            function($scope, $rootScope, ngDialog,
                $location, $uibModal, edmService,
                commonService, commonTool) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    companyEnName: null,
                    companyName: null,
                    packageId: null,
                    sKey: null,
                    sValue: null,
                    sendTimeEndStr: null,
                    sendTimeStartStr: null,
                    sendStatus: null,
                    reportStatus: null
                };

                tools = $.extend(tools, {
                    // 获取列表
                    getedmList: function(isSearchButton) {
                        if (isSearchButton) {
                            paging.page = 1;
                        }
                        edmService.getedmList(commonTool.filterParam(paging)).success(function(data) {
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
                        tools.getedmList();
                    },
                    // 重置
                    reset: function() {
                        paging.page = 1;
                        paging.pageSize = 10;
                        paging.companyEnName = null;
                        paging.companyName = null;
                        paging.packageId = null;
                        paging.sKey = null;
                        paging.sValue = null;
                        paging.sendTimeEndStr = null;
                        paging.sendTimeStartStr = null;
                        paging.sendStatus = null;
                        paging.reportStatus = null;
                    },
                    changestatus: function(promotionMailId, type) {
                        var promotionMailIds = "";
                        if (commonTool.isEmpty(promotionMailId)) {
                            promotionMailIds = vm.selectionItme.join(',');
                            if (commonTool.isEmpty(promotionMailIds)) {
                                $rootScope.alertMsgService.setMessage("请先选择要标识的记录", 'warning');
                                return;
                            }
                        } else {
                            promotionMailIds = promotionMailId;
                        }
                        if (type == 0) {
                            vm.typeStr = '已发送邮件';
                        } else {
                            vm.typeStr = '已发送报告';
                        }
                        tools.confirm(promotionMailIds, type);
                    },
                    confirm: function(ids, type) {
                        $scope.ids = ids;
                        $scope.tools = tools;
                        vm.sellerListDlg = ngDialog.open({
                            template: 'edmDlgId',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            controller: ['$scope', function($scope) {
                                var ids = $scope.ids;
                                var tools = $scope.tools;

                                $scope.submit = function() {
                                    var params = {
                                        'promotionMailId': ids
                                    };
                                    // type 0 标识已发送邮件  ;   type 1 标识已发送报告
                                    if (type == 0) {
                                        edmService.updateMailSendStatus(commonTool.filterParam(params))
                                            .success(function(data) {
                                                if ('success' === data.status) {
                                                    tools.getedmList();
                                                    $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                                    tools.close();
                                                } else {
                                                    $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                                }
                                            })
                                    } else {
                                        edmService.updateReportStatus(commonTool.filterParam(params))
                                            .success(function(data) {
                                                if ('success' === data.status) {
                                                    tools.getedmList();
                                                    $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                                    tools.close();
                                                } else {
                                                    $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                                }
                                            })
                                    }
                                }

                            }]

                        });
                    },
                    // 关闭弹出层
                    close: function() {
                        ngDialog.closeAll();
                    },
                    // 邮件发送状态 0 未发送  1  已发送  
                    sendStatus: [{
                        "title": "未发送",
                        "key": 0
                    }, {
                        "title": "已发送",
                        "key": 1
                    }],
                    // 报告状态 1未申请，2未发送，3已发送
                    reportStatus: [{
                        "title": "未申请",
                        "key": 1
                    }, {
                        "title": "未发送",
                        "key": 2
                    }, {
                        "title": "已发送",
                        "key": 3
                    }],
                    // 搜索类型  1，公司中文名；2，公司英文名}
                    sKey: [{
                        "title": "公司中文名",
                        "key": 1
                    }, {
                        "title": "公司英文名",
                        "key": 2
                    }]

                });

                // 初始化列表
                init_data();

                // 初始化
                function init_data() {
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);

                    edmService.getMemPackageList({ page: 1, pageSize: 1000, status: 1 }).success(function(rs) {
                        vm.packageList = rs.page.items;
                    });

                    tools.getedmList();
                }


                $scope.onSuccess = function(e) {
                    $rootScope.alertMsgService.setMessage("内容复制成功", 'success');
                    e.clearSelection();
                };

                $scope.onError = function(e) {
                    $rootScope.alertMsgService.setMessage("复制失败，请重试", 'warning');
                }
            }
        ])

    // 详情
    .controller('edmDetailCtrl', ['$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'edmService',
        'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, edmService,
            commonService, commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {
                promotionMailId: null
            };
            var search = $location.search();
            paging.promotionMailId = $scope.paging.promotionMailId = search.promotionMailId;

            tools = $.extend(tools, {
                // 获取详情
                getEdmDetail: function(isSearchButton) {
                    edmService.getEdmDetail(commonTool.filterParam(paging)).success(function(data) {
                        if (data.data != null) {
                            vm.data = data.data;
                            vm.status = data.data.status;
                        } else {
                            vm.data = {};
                        }
                    });
                },
                // 获取详情审核记录
                getPromotionmailchecklist: function() {
                    edmService.getPromotionmailchecklist(commonTool.filterParam(paging)).success(function(data) {

                        if (data.data != null) {
                            vm.items = data.data;
                        } else {
                            vm.items = [];
                        }
                    });
                },
                changestatus: function(promotionMailId, status) {
                    var promotionMailIds = "";
                    if (commonTool.isEmpty(promotionMailId)) {
                        vm.allChecked = false;
                        promotionMailIds = vm.selectionItme.join(',');
                        if (commonTool.isEmpty(promotionMailIds)) {
                            $rootScope.alertMsgService.setMessage("请先选择要审核的记录", 'warning');
                            return;
                        }
                    } else {
                        promotionMailIds = promotionMailId;
                    }
                    vm.changestatus = status;
                    if (status == 4) {
                        tools.chxstatus(promotionMailIds, status);
                    } else {
                        tools.confirm(promotionMailIds, status);
                    }
                },
                // 不通过
                chxstatus: function(ids, status) {
                    $scope.ids = ids;
                    $scope.tools = tools;
                    vm.sellerListDlg = ngDialog.open({
                        template: 'edmDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        controller: ['$scope', '$rootScope', function($scope) {
                            var ids = $scope.ids;
                            var tools = $scope.tools;
                            $scope.submit = function() {
                                var remark = $(".reasonInput").val();
                                if (remark == null || remark == "" || remark == undefined) {
                                    // alert("请输入审核原因");
                                    $rootScope.alertMsgService.setMessage('请输入审核原因', 'info');
                                    return;
                                }
                                var params = {
                                    'promotionMailId': ids,
                                    'status': status,
                                    "content": remark
                                };

                                edmService.updateStatus(commonTool.filterParam(params))
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            tools.getEdmDetail();
                                            tools.getPromotionmailchecklist();
                                            $rootScope.alertMsgService.setMessage('审核操作成功', 'success');
                                            tools.close();
                                        } else {
                                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                        }
                                    })
                            }

                        }]

                    });
                },
                confirm: function(ids, status) {
                    $scope.ids = ids;
                    $scope.tools = tools;
                    vm.sellerListDlg = ngDialog.open({
                        template: 'edmDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var ids = $scope.ids;
                            var tools = $scope.tools;

                            $scope.submit = function() {
                                var params = {
                                    'promotionMailId': ids,
                                    'status': status
                                };

                                edmService.updateStatus(commonTool.filterParam(params))
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            tools.getEdmDetail();
                                            tools.getPromotionmailchecklist();
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
                    ngDialog.closeAll();
                }

            });

            // 初始化列表
            init_data();

            // 初始化
            function init_data() {
                vm.pages = commonService.setPageSizeArray(10, 30, 50);

                tools.getEdmDetail();
                tools.getPromotionmailchecklist();
            }

        }
    ])

    // 消费记录列表
    .controller('edmComsumeRecordListCtrl', ['$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'edmService',
        'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, edmService,
            commonService, commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                accountType: null,
                accountTypeValue: null,
                startTime: null,
                endTime: null,
                packageId: null
            };


            tools = $.extend(tools, {
                // 获取列表
                getComsumeRecordList: function(isSearchButton) {
                    if (isSearchButton) {
                        paging.page = 1;
                    }
                    edmService.getComsumeRecordList(commonTool.filterParam(paging)).success(function(data) {
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
                    tools.getComsumeRecordList();
                },
                // 重置
                reset: function() {
                    paging.page = 1;
                    paging.pageSize = 10;
                    paging.accountType = null;
                    paging.accountTypeValue = null;
                    paging.startTime = null;
                    paging.endTime = null;
                    paging.packageId = null;
                },
                // 搜索类型 1:公司中文名 2:公司英文名 3:账号 4:邮箱
                accountType: [{
                    "title": "公司中文名",
                    "key": 1
                }, {
                    "title": "公司英文名",
                    "key": 2
                }, {
                    "title": "帐号",
                    "key": 3
                }, {
                    "title": "邮箱",
                    "key": 4
                }]
            });

            // 初始化列表
            init_data();

            // 初始化
            function init_data() {
                vm.pages = commonService.setPageSizeArray(10, 30, 50);

                edmService.getMemPackageList({ page: 1, pageSize: 1000, status: 1 }).success(function(rs) {
                    vm.packageList = rs.page.items;
                });

                tools.getComsumeRecordList();
            }

        }
    ])

    // 消费记录详细
    .controller('edmComsumeRecordDetailCtrl', ['$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'edmService',
        'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, edmService,
            commonService, commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                userId: null
            };
            var search = $location.search();
            paging.userId = search.userId;

            var quotePaging = $scope.quotePaging = {
                page: 1,
                pageSize: 10,
                consumType: 1,
                recordType: 2,
                userId: search.userId
            };



            tools = $.extend(tools, {
                getQuoteEquityList: function() {
                    edmService.getQuoteEquityList(commonTool.filterParam(quotePaging)).success(function(data) {
                        console.log(data);
                        if (data.status === 'success') {
                            vm.quoteItems = data.data.items;
                            quotePaging.total = data.data.total;
                        }
                    });
                },
                // 获取消费记录详细
                getComsumeRecordDetail: function() {
                    edmService.getComsumeRecordDetail(commonTool.filterParam(paging)).success(function(data) {
                        if (data.data != null) {
                            vm.data = data.data;
                        } else {
                            vm.data = {};
                        }
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
                    tools.getComsumeRecordDetail();
                },
                getQuotenewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    tools.getQuoteEquityList();
                }
            });

            // 初始化列表
            init_data();

            // 初始化
            function init_data() {
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
                tools.getComsumeRecordDetail();
                tools.getQuoteEquityList();
            }


        }
    ])

    // 发票申请记录列表
    .controller('invoiceRecordListCtrl', ['$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'edmService',
        'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, edmService,
            commonService, commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                companyName: null,
                startTime: null,
                endTime: null,
                handleStatus: null
            };

            vm.selectionItme = [];
            vm.showOperateFlag = false;

            tools = $.extend(tools, {
                // 获取列表
                getInvoiceList: function(isSearchButton) {
                    vm.allChecked = false;
                    vm.showOperateFlag = false;
                    if (isSearchButton) {
                        paging.page = 1;
                    }
                    edmService.getInvoiceList(commonTool.filterParam(paging), false).success(function(data) {
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
                    tools.getAdList();
                },
                // 重置
                reset: function() {
                    paging.page = 1;
                    paging.pageSize = 10;
                    paging.companyName = null;
                    paging.startTime = null;
                    paging.endTime = null;
                    paging.handleStatus = null;
                },
                checkAll: function(checked) {
                    vm.selectionItme = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {
                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionItme.push(item.userInvoiceId);
                        }
                    });
                },
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.userInvoiceId);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                },
                changestatus: function(userInvoiceId) {
                    var userInvoiceIds = "";
                    if (commonTool.isEmpty(userInvoiceId)) {
                        vm.allChecked = false;
                        userInvoiceIds = vm.selectionItme.join(',');
                        if (commonTool.isEmpty(userInvoiceIds)) {
                            $rootScope.alertMsgService.setMessage("请先选择要处理的发票记录", 'warning');
                            return;
                        }
                    } else {
                        userInvoiceIds = userInvoiceId;
                    }
                    tools.confirm(userInvoiceIds);
                    vm.selectionItme = [];
                },
                confirm: function(userInvoiceIds) {
                    $scope.userInvoiceIds = userInvoiceIds;
                    $scope.tools = tools;
                    vm.sellerListDlg = ngDialog.open({
                        template: 'edmDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var userInvoiceIds = $scope.userInvoiceIds;
                            var tools = $scope.tools;

                            $scope.submit = function() {
                                var params = {
                                    'userInvoiceIds': userInvoiceIds
                                };

                                edmService.updateInvoiceStatus(commonTool.filterParam(params))
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            // tools.reset();
                                            tools.getInvoiceList();
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
                    ngDialog.closeAll();
                },
                // 导出Excel
                exportData: function() {
                    var pg = commonTool.filterParam(paging);
                    pg.page = null;
                    pg.pageSize = null;
                    pg.getExcel = 1;

                    // if (!commonTool.checkExportParam(pg)) {
                    //     $rootScope.alertMsgService.setMessage("查询条件不能为空", 'warning')
                    //     return;
                    // }
                    edmService.getInvoiceList(pg, true).success(function(data) {
                        var blob = new Blob([data], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        });
                        var objectUrl = URL.createObjectURL(blob);
                        window.open(objectUrl);
                    });
                },
                // 推荐位置
                handleStatus: [{
                    "title": "已处理",
                    "key": 1
                }, {
                    "title": "待处理",
                    "key": 0
                }]
            });

            // 初始化列表
            init_data();

            // 初始化
            function init_data() {
                vm.pages = commonService.setPageSizeArray(10, 30, 50);

                tools.getInvoiceList();
            }

        }
    ])

    // EDM资金流水列表 OK
    .controller('fundRecordListCtrl', ['$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'edmService',
        'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, edmService,
            commonService, commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                accountType: null,
                accountTypeValue: null,
                checkStatus: null,
                startTime: null,
                endTime: null,
                invoiceStatus: null,
                tradeMoney: null,
                rechargeType: null
            };
            // 总金额
            paging.totalMomey = 0;

            vm.selectionItme = [];
            vm.showOperateFlag = false;

            tools = $.extend(tools, {
                // 获取列表
                getFundsFlowList: function(isSearchButton) {
                    vm.allChecked = false;
                    vm.showOperateFlag = false;
                    if (isSearchButton) {
                        paging.page = 1;
                    }
                    edmService.getFundsFlowList(commonTool.filterParam(paging), false).success(function(data) {
                        vm.items = data.page.items;
                        paging.total = data.page.total;
                        paging.pageSize = data.page.pageSize;
                        vm.totalMomey = data.data;
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
                    tools.getFundsFlowList();
                },
                // 重置
                reset: function() {
                    paging.page = 1;
                    paging.pageSize = 10;
                    paging.accountType = null;
                    paging.accountTypeValue = null;
                    paging.checkStatus = null;
                    paging.startTime = null;
                    paging.endTime = null;
                    paging.invoiceStatus = null;
                    paging.tradeMoney = null;
                    paging.totalMomey = 0;
                    paging.rechargeType = null;
                },
                checkAll: function(checked) {
                    vm.selectionItme = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {
                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionItme.push(item.userRechargeId);
                        }
                    });
                },
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.userRechargeId);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                },
                confirmEdmFundsFlow: function(id) {
                    var userRechargeIds = "";
                    if (commonTool.isEmpty(id)) {
                        vm.allChecked = false;
                        userRechargeIds = vm.selectionItme.join(',');
                        console.log(userRechargeIds);
                        if (commonTool.isEmpty(userRechargeIds)) {
                            $rootScope.alertMsgService.setMessage("请先选择要确认的流水记录", 'warning');
                            return;
                        }
                    } else {
                        userRechargeIds = id;
                    }
                    tools.confirm(userRechargeIds);
                    vm.selectionItme = [];
                },
                confirm: function(ids) {
                    $scope.userRechargeIds = ids;
                    $scope.tools = tools;
                    vm.sellerListDlg = ngDialog.open({
                        template: 'userRechargeDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var userRechargeIds = $scope.userRechargeIds;
                            var tools = $scope.tools;

                            $scope.submit = function() {
                                var params = {
                                    'userRechargeIds': userRechargeIds
                                };

                                edmService.confirmEdmFundsFlow(commonTool.filterParam(params))
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            tools.getFundsFlowList();
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
                    ngDialog.closeAll();
                },
                // 导出Excel
                exportData: function() {
                    var pg = commonTool.filterParam(paging);
                    pg.page = null;
                    pg.pageSize = null;
                    pg.totalMomey = null;
                    pg.getExcel = 1;
                    // if (!commonTool.checkExportParam(pg)) {
                    //     $rootScope.alertMsgService.setMessage("查询条件不能为空", 'warning')
                    //     return;
                    // }
                    edmService.getFundsFlowList(pg, true).success(function(data) {
                        var blob = new Blob([data], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        });
                        var objectUrl = URL.createObjectURL(blob);
                        window.open(objectUrl);
                    });
                },
                // 推荐位置
                tradeMoney: [{
                        "title": 1000,
                        "key": 1000
                    }, {
                        "title": 2000,
                        "key": 2000
                    }, {
                        "title": 5000,
                        "key": 5000
                    }, {
                        "title": 8000,
                        "key": 8000
                    }

                ],
                checkStatus: [{
                    "title": "已确认",
                    "key": 1
                }, {
                    "title": "未确认",
                    "key": 0
                }],
                // 2:未申请 1:已开发票 0:已申请-未开发票
                invoiceStatus: [{
                    "title": "未申请",
                    "key": 2
                }, {
                    "title": "已开发票",
                    "key": 1
                }, {
                    "title": "已申请-未开发票",
                    "key": 0
                }],
                // 1:公司中文名 2:公司英文名 3:账号 4:邮箱
                accountType: [{
                    "title": "公司中文名",
                    "key": 1
                }, {
                    "title": "公司英文名",
                    "key": 2
                }, {
                    "title": "帐号",
                    "key": 3
                }, {
                    "title": "邮箱",
                    "key": 4
                }]
            });

            // 初始化列表
            init_data();

            // 初始化
            function init_data() {
                vm.pages = commonService.setPageSizeArray(10, 30, 50);

                tools.getFundsFlowList();
            }

        }
    ])

    // 对账状态 Filter 对账状态：0 未确认, 1 已确认
    .filter('checkStatusFilter', function() {
        return function(checkStatus) {
            var checkStatusStr = '';
            switch (checkStatus) {
                case 0:
                    checkStatusStr = '未确认';
                    break;

                case 1:
                    checkStatusStr = '已确认';
                    break;
            }
            return checkStatusStr;
        }
    })

    // 发票状态 Filter  2:未申请 1:已开发票 0:已申请-未开发票
    .filter('invoiceStatusFilter', function() {
        return function(invoiceStatus) {
            var invoiceStatusStr = '';
            switch (invoiceStatus) {
                case 2:
                    invoiceStatusStr = '未申请';
                    break;

                case 1:
                    invoiceStatusStr = '已开发票';
                    break;

                case 0:
                    invoiceStatusStr = '已申请-未开发票';
                    break;
            }
            return invoiceStatusStr;
        }
    })

    // 发票申请处理状态 0 待处理, 1 已处理
    .filter('handleStatusFilter', function() {
        return function(handleStatus) {
            var handleStatusStr = '';
            switch (handleStatus) {
                case 0:
                    handleStatusStr = '待处理';
                    break;

                case 1:
                    handleStatusStr = '已处理';
                    break;

            }
            return handleStatusStr;
        }
    })

    //  充值消费明细 类型 记录类型 1:系统赠送 2:充值 3:冻结 4:消费 5:取消冻结   
    .filter('recordTypeFilter', function() {
        return function(recordType) {
            var recordTypeStr = '';
            switch (recordType) {
                case 1:
                    recordTypeStr = '系统赠送';
                    break;

                case 2:
                    recordTypeStr = '充值';
                    break;

                case 3:
                    recordTypeStr = '冻结';
                    break;

                case 4:
                    recordTypeStr = '消费';
                    break;

                case 5:
                    recordTypeStr = '取消冻结';
                    break;

            }
            return recordTypeStr;
        }
    })

    // EDM 推广审核状态  状态1，未提交；2，待审核；3，审核通过；4审核不通过
    .filter('statusFilter', function() {
        return function(status) {
            var statusStr = '';
            switch (status) {
                case 1:
                    statusStr = '未提交';
                    break;

                case 2:
                    statusStr = '待审核';
                    break;

                case 3:
                    statusStr = '审核通过';
                    break;

                case 4:
                    statusStr = '审核不通过';
                    break;

            }
            return statusStr;
        }
    })

    // 邮件发送状态 0未发送，1已发送 
    .filter('sendStatusFilter', function() {
        return function(sendStatus) {
            var sendStatusStr = '';
            switch (sendStatus) {
                case 0:
                    sendStatusStr = '未发送';
                    break;

                case 1:
                    sendStatusStr = '已发送';
                    break;
            }
            return sendStatusStr;
        }
    })

    // 报告状态  1未申请，2未发送，3已发送
    .filter('reportStatusFilter', function() {
        return function(reportStatus) {
            var reportStatusStr = '';
            switch (reportStatus) {
                case 1:
                    reportStatusStr = '未申请';
                    break;

                case 2:
                    reportStatusStr = '已申请-未发送';
                    break;

                case 3:
                    reportStatusStr = '已发送';
                    break;
            }
            return reportStatusStr;
        }
    })

    // 过滤空套餐名
    .filter('packageNameFilter', function() {
            return function(packageName) {
                var packageNameStr = packageName;
                if (packageName == null) {
                    packageNameStr = '无';
                }
                return packageNameStr;
            }
        })
        // 资金来源
        .filter('rechargeTypeFilter', function() {
            return function(rechargeType) {
                switch (rechargeType) {
                    case 0:
                        return '买家通';
                    case 1:
                        return '商机市场';
                    default:
                        return '';

                }
            }
        })
});
