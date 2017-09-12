define(['../module'], function(ng) {
    ng.factory('shopDiagnosisService', ['$http', 'api',
            function($http, api) {
                return {
                    // 会员套餐类型
                    getMemPackageList: function(params) {
                        return $http.get(api.getMemPackageList, { 'params': params });
                    },
                    // 获取店铺诊断列表
                    getDiagnosisList: function(params) {
                        return $http.get(api.getDiagnosisList, {
                            'params': params
                        });
                    },
                    // 跟新店铺诊断评分
                    updateDiagnosisScore: function(params) {
                        return $http.get(api.updateDiagnosisScore, {
                            'params': params
                        });
                    }
                };
            }
        ])
        // 列表
        .controller('shopDiagnosisCtrl', [
            '$scope', '$rootScope', 'ngDialog',
            '$location', '$uibModal', 'shopDiagnosisService',
            'commonService', 'commonTool',
            function($scope, $rootScope, ngDialog,
                $location, $uibModal, shopDiagnosisService,
                commonService, commonTool) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    packageId:null,
                    companyName:null
                };

                tools = $.extend(tools, {
                    // 获取列表
                    getDiagnosisList: function(isSearchButton) {
                        if (isSearchButton) {
                            paging.page = 1;
                        }
                        shopDiagnosisService.getDiagnosisList(commonTool.filterParam(paging)).success(function(data) {
                            if(data.page.items != null){
                                vm.items = data.page.items;
                            }else{
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
                        tools.getDiagnosisList();
                    },
                    // 重置
                    reset: function() {
                        paging.page = 1;
                        paging.pageSize = 10;
                        paging.packageId = null;
                        paging.companyName = null;
                    },
                    // 关闭弹出层
                    close: function() {
                        ngDialog.closeAll();
                    },
                    // 修改评分
                    modifyLayer:function(id){
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
                        tools.modifyLayerSubmit(ids);
                        vm.selectionItme = [];
                    },
                    modifyLayerSubmit:function(ids){
                        $scope.ids = ids;
                        $scope.tools = tools;

                        vm.modifyDlg = ngDialog.open({
                            template: 'modifyDlgId',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            width: 500,
                            title: "修改评分",
                            controller: ['$scope', function($scope) {
                                var ids = $scope.ids;
                                var tools = $scope.tools;

                                $scope.submit = function() {
                                    var params = {
                                        'sellerId': ids,
                                        'shopScore': vm.shopScore,
                                        'productScore': vm.productScore
                                    };
                                    if(vm.shopScore < 0 || vm.shopScore > 100){
                                        $rootScope.alertMsgService.setMessage('店铺评分只能输入0-100', 'warning');
                                        return;
                                    }
                                    if(vm.productScore < 0 || vm.productScore > 100){
                                        $rootScope.alertMsgService.setMessage('商品评分只能输入0-100', 'warning');
                                        return;
                                    }

                                    shopDiagnosisService.updateDiagnosisScore(params)
                                        .success(function(data) {
                                            if ('success' === data.status) {
                                                tools.getDiagnosisList();
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
                    // 扣分
                    deductionLayer:function(id){
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
                        tools.deductionLayerSubmit(ids);
                        vm.selectionItme = [];
                    },
                    deductionLayerSubmit:function(ids){
                        $scope.ids = ids;
                        $scope.tools = tools;

                        vm.remark = 0;
                        vm.violationRemark = '';

                        vm.deductionDlg = ngDialog.open({
                            template: 'deductionDlgId',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            width: 500,
                            title: "扣分",
                            controller: ['$scope', function($scope) {
                                var ids = $scope.ids;
                                var tools = $scope.tools;

                                $scope.submit = function() {
                                    var params = {
                                        'sellerId': ids,
                                        'remark': vm.remark,
                                        'violationRemark': vm.violationRemark
                                    };

                                    if(vm.remark < 0){
                                        $rootScope.alertMsgService.setMessage('扣除金额不能小于0', 'warning');
                                        return;
                                    }

                                    if(vm.violationRemark.length < 1){
                                        $rootScope.alertMsgService.setMessage('扣分原因不能为空', 'warning');
                                        return;
                                    }

                                    shopDiagnosisService.updateDiagnosisScore(params)
                                        .success(function(data) {
                                            if ('success' === data.status) {
                                                tools.getDiagnosisList();
                                                $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                                tools.close();
                                            } else {
                                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                            }
                                        })
                                }

                            }]

                        });
                    }

                });

                // 初始化列表
                init_data();

                // 初始化
                function init_data() {
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);

                    shopDiagnosisService.getMemPackageList({ page: 1, pageSize: 1000, status: 1 }).success(function(rs) {
                        vm.packageList = rs.page.items;
                    });

                    tools.getDiagnosisList();
                }

            }
        ])

        
});
