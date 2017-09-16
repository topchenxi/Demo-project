define(['../module'], function(ng) {
    ng.factory('eShopService', ['$http', 'api', function($http, api) {
        return {
            // e店通开通列表
            getEShopList: function(params) {
                return $http.get(api.getEShopList, {
                    params: params
                });
            },
            // 获取e店通信息
            getEShopDetail: function(params) {
                return $http.get(api.getEShopDetail, {
                    params: params
                });
            },
            // e店通（添加/保存）
            saveEShopInfo: function(params) {
                return $http.post(api.saveEShopInfo, params);
            },
            // 删除e店通
            delEShopInfo: function(params) {
                return $http.post(api.delEShopInfo, params);
            },
            // 审核
            chxEShopStatus: function(params) {
                return $http.post(api.chxEShopStatus, params);
            },
            // 获取公司当前套餐
            getCurrentPackage: function(params) {
                return $http.get(api.getCurrentPackage, {
                    params: params
                });
            },
            // 获取e店通操作日志
            getEShopLog: function(params) {
                return $http.get(api.getEShopLog, {
                    params: params
                });
            }
        }
    }])

    ng.controller('eShopCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'eShopService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            eShopService,
            commonService
        ) {
            var tools = $scope.tools = {};
            var vm = $scope.vm = {};
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                companyName: null,
                status: null
            };
            tools = angular.extend(tools, {
                initTab: function(status) {
                    paging.status = status;
                    this.reset();
                    this.getEShopList();
                },
                getEShopList: function() {
                    eShopService.getEShopList(commonTool.filterParam(paging)).success(function(data) {
                        console.log(data);
                        vm.items = data.page.items;
                        paging.total = data.page.total;
                    })
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    tools.getEShopList();
                },
                addEShop: function() {
                    $location.path('/seller/addEShop');
                },
                toNotify: function(eshopId) {
                    $location.path('/seller/addEShop').search({
                        eshopId: eshopId
                    })
                },
                toDel: function(eshopId) {
                    ngDialog.open({
                        template: './controller/seller/dialogTmp/confirmdDlg.html',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var vm = $scope.vm = {
                                hasReson: false,

                                messages: '请确认是否删除',

                                submitMsg: '确定',

                                cancelMsg: '取消',

                                submit: function() {
                                    console.log(eshopId);
                                    var delParams = {
                                        eshopId: eshopId
                                    };
                                    eShopService.delEShopInfo(commonTool.filterParam(delParams)).success(function(data) {
                                        if (data.status === 'success') {
                                            tools.getEShopList();
                                            $scope.closeThisDialog();
                                            $rootScope.alertMsgService.setMessage("删除成功", 'warning');
                                        } else {
                                            $rootScope.alertMsgService.setMessage("删除失败", 'warning');
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
                search: function() {
                    paging.page = 1;
                    this.getEShopList();
                },
                reset: function() {
                    paging.page = 1;
                    paging.companyName = null;
                }
            });

            (function() {
                tools.getEShopList();
                vm.pages = commonService.setPageSizeArray(10, 20, 50);
            }())
        }
    ])

    ng.controller('eShopAuditCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'eShopService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            eShopService,
            commonService
        ) {
            var tools = $scope.tools = {};
            var vm = $scope.vm = {};
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                companyName: null,
                status: null
            };
            tools = angular.extend(tools, {
                initTab: function(status) {
                    paging.status = status;
                    this.reset();
                    this.getEShopList();
                },
                getEShopList: function() {
                    eShopService.getEShopList(commonTool.filterParam(paging)).success(function(data) {
                        vm.items = data.page.items;
                        paging.total = data.page.total;
                    })
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    tools.getEShopList();
                },
                chxStatus: function(eshopId, status) {

                    ngDialog.open({
                        template: './controller/seller/dialogTmp/confirmdDlg.html',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var vm = $scope.vm = {
                                hasReson: status == 1 ? false : true,

                                messages: '请确认是否审核' + (status == 1 ? '' : '不') + '通过',

                                submitMsg: '确定',

                                cancelMsg: '取消',

                                submit: function() {
                                    if (status == 2 && !vm.reason) {
                                        $rootScope.alertMsgService.setMessage("请先输入原因", 'warning');
                                        return;
                                    }
                                    var params = {
                                        eshopId: eshopId,
                                        auditUnpassReason: vm.reason,
                                        status: status
                                    };
                                    eShopService.chxEShopStatus(commonTool.filterParam(params)).success(function(data) {
                                        if (data.status === 'success') {
                                            tools.getEShopList();
                                            $scope.closeThisDialog();
                                            $rootScope.alertMsgService.setMessage("审核成功", 'warning');
                                        } else {
                                            $rootScope.alertMsgService.setMessage("审核失败", 'warning');
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
                search: function() {
                    paging.page = 1;
                    this.getEShopList();
                },
                reset: function() {
                    paging.page = 1;
                    paging.companyName = null;
                }
            });

            (function() {
                tools.getEShopList();
                vm.pages = commonService.setPageSizeArray(10, 20, 50);
            }())
        }
    ])

    ng.controller('addEShopCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'ngDialog',
        'commonTool',
        'eShopService',
        function(
            $scope,
            $rootScope,
            $location,
            ngDialog,
            commonTool,
            eShopService
        ) {
            var tools = $scope.tools = {},
                vm = $scope.vm = {},
                search = $location.search(),
                eShopInfo = $scope.eShopInfo = {
                    // eshopId
                    eshopId: search.eshopId ? search.eshopId : null,
                    // 供应商
                    companyId: null,
                    // 技术服务费
                    serviceFee: null,
                    // 保证金
                    deposit: null,
                    // 开通时间
                    effectiveTimeStr: null
                };

            vm.hasCheckSeller = null;

            Date.prototype.format = function(formatStr) {
                console.log(this);
                var str = formatStr;
                str = str.replace(/yyyy|YYYY/, this.getFullYear());
                str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
                str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
                str = str.replace(/M/g, (this.getMonth() + 1));
                str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
                str = str.replace(/d|D/g, this.getDate());
                return str;
            }

            tools = angular.extend(tools, {
                getEShopDetail: function(eshopId) {
                    eShopService.getEShopDetail({
                        eshopId: eshopId
                    }).success(function(data) {
                        vm.hasCheckSeller = {};
                        var item = data.data;
                        vm.hasCheckSeller.companyName = item.companyName;
                        vm.hasCheckSeller.companyEnName = item.companyEnName;
                        vm.hasCheckSeller.companyId = item.companyId;
                        eShopInfo.serviceFee = item.serviceFee;
                        eShopInfo.deposit = item.deposit;
                        eShopInfo.effectiveTimeStr = new Date(item.effectiveTime).format('yyyy-MM-dd');
                        tools.getCurrentPackage(vm.hasCheckSeller.companyId);

                    })
                },
                save: function() {
                    console.log(eShopInfo);
                    if (this.formIsEmpty()) return;
                    eShopInfo.companyId = vm.hasCheckSeller.companyId;
                    eShopService.saveEShopInfo(commonTool.filterParam(eShopInfo)).success(function(data) {
                        if (data.status !== 'success') return;
                        window.location.href = '/#/seller/eShop';
                    })
                },
                formIsEmpty: function() {
                    if (!vm.hasCheckSeller) {
                        this.sendWaringMessage("请先选择供应商");
                        return true;
                    }
                    if (!eShopInfo.serviceFee) {
                        this.sendWaringMessage("请先填写技术服务费");
                        return true;
                    }
                    if (!eShopInfo.deposit) {
                        this.sendWaringMessage("请先填写保证金");
                        return true;
                    }
                    if (!eShopInfo.effectiveTimeStr) {
                        this.sendWaringMessage("请先填写开通时间");
                        return true;
                    }
                    return false;
                },
                sendWaringMessage: function(message) {
                    $rootScope.alertMsgService.setMessage(message, 'warning');
                },
                back: function() {
                    $location.path('/seller/eShop');
                },
                selectSeller: function() {
                    ngDialog.openConfirm({
                        template: './controller/seller/dialogTmp/selectSeller.html',
                        controller: 'selectSellerCtrl',
                        width: 900,
                        title: '选择供应商',
                        scope: $scope
                    }).then(function(yes) {
                        console.log(vm.hasCheckSeller);
                        tools.getCurrentPackage(vm.hasCheckSeller.companyId);
                    }, function(no) {

                    });
                },
                getCurrentPackage: function(companyId) {
                    console.log(companyId);
                    eShopService.getCurrentPackage({
                        companyId: companyId
                    }).success(function(data) {
                        vm.hasCheckSeller.packageInfo = data.data;
                    })
                }
            });

            (function() {
                if (eShopInfo.eshopId) tools.getEShopDetail(eShopInfo.eshopId);
            }())
        }
    ])


    ng.controller('eShopDetailCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'ngDialog',
        'commonTool',
        'eShopService',
        function(
            $scope,
            $rootScope,
            $location,
            ngDialog,
            commonTool,
            eShopService
        ) {
            var tools = $scope.tools = {};
            var vm = $scope.vm = {};
            var search = $location.search();

            var eshopId = search.eshopId;
            console.log(eshopId);
            var paging = $scope.paging = {
                eshopId: eshopId,
                page: 1,
                pageSize: 10
            };
            tools = angular.extend(tools, {
                getEShopDetail: function() {
                    eShopService.getEShopDetail({
                        eshopId: eshopId
                    }).success(function(data) {
                        console.log(data);
                        if (data.status !== 'success') return;
                        vm.item = data.data;
                    })
                },
                getEShopLog: function() {
                    eShopService.getEShopLog({
                        eshopId: eshopId
                    }).success(function(data) {
                        console.log(data);
                        if (data.status !== 'success') return;
                        vm.logList = data.data;
                    })
                },
                chxStatus: function(eshopId, status) {

                    ngDialog.open({
                        template: './controller/seller/dialogTmp/confirmdDlg.html',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var vm = $scope.vm = {
                                hasReson: status == 1 ? false : true,

                                messages: '请确认是否审核' + (status == 1 ? '' : '不') + '通过',

                                submitMsg: '确定',

                                cancelMsg: '取消',

                                submit: function() {
                                    if (status == 2 && !vm.reason) {
                                        $rootScope.alertMsgService.setMessage("请先输入原因", 'warning');
                                        return;
                                    }
                                    var params = {
                                        eshopId: eshopId,
                                        auditUnpassReason: vm.reason,
                                        status: status
                                    };
                                    $scope.closeThisDialog();
                                    eShopService.chxEShopStatus(commonTool.filterParam(params)).success(function(data) {
                                        if (data.status === 'success') {
                                            tools.getEShopDetail();
                                            tools.getEShopLog();
                                            $rootScope.alertMsgService.setMessage("审核成功", 'warning');
                                        } else {
                                            $rootScope.alertMsgService.setMessage("审核失败", 'warning');
                                        }
                                    })

                                },
                                close: function() {
                                    $scope.closeThisDialog();
                                }
                            };
                        }]
                    })
                }
            });

            (function() {
                tools.getEShopDetail();
                tools.getEShopLog();
            }())
        }
    ])

    ng.controller('selectSellerCtrl', [
        '$scope',
        'commonService',
        'exhibitionService',
        'commonTool',
        function(
            $scope,
            commonService,
            exhibitionService,
            commonTool
        ) {
            var tools = $scope.tools;
            var vm = $scope.vm;
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,

                qkey: null,
                qValue: null
            };
            tools = angular.extend(tools, {
                getSellerList: function() {
                    exhibitionService.getSeller(commonTool.filterParam(paging)).success(function(data) {
                        console.log(data);
                        vm.items = data.data.items;
                        paging.total = data.page.total;
                    })
                },
                search: function() {
                    paging.page = 1;
                    tools.getSellerList();
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    this.getSellerList();
                },
                selected: function(item) {
                    console.log(item);
                    $scope.confirm();
                    vm.hasCheckSeller = item;
                }
            });

            (function() {
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
                tools.getSellerList();
            }())
        }
    ])

    ng.filter('eShopAuditStatus', function() {
        return function(status) {
            switch (status) {
                case 0:
                    return '待审核';
                case 1:
                    return '审核通过'
                case 2:
                    return '审核不通过'
                default:
                    return '';
                    break;
            }
        }
    })
})
