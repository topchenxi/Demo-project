define(['../module'], function(ng) {
    ng.factory('exhibitionService', ['$http', 'api',
            function($http, api) {
                return {
                    // 获取届数
                    getArrayOfCfecTimes: function() {
                        return $http.get(api.getArrayOfCfecTimes);
                    },
                    // 获取列表
                    getExhibitionList: function(params) {
                        return $http.get(api.getExhibitionList, {
                            'params': params
                        });
                    },
                    // 获取供应商
                    getSeller: function(params) {
                        return $http.get(api.getSellerList, {
                            'params': params
                        })
                    },
                    // 保存绑定展会通
                    saveBindExhibition: function(params) {
                        return $http.get(api.saveBindExhibition, {
                            'params': params
                        })
                    },
                    // 获取详情
                    getExhibitionDetail: function(params) {
                        return $http.get(api.getExhibitionDetail, {
                            'params': params
                        })
                    },
                    // 展会通消息审核列表
                    getExhibitionMsgList: function(params) {
                        return $http.get(api.getExhibitionMsgList, {
                            'params': params
                        })
                    },
                    // 展会通消息审核详情
                    getExhibitionMsgDetail: function(params) {
                        return $http.get(api.getExhibitionMsgDetail, {
                            'params': params
                        })
                    },
                    updatePlanAuditStatus: function(params) {
                        return $http.get(api.updatePlanAuditStatus, {
                            'params': params
                        })
                    },
                    // 审核不通过原因
                    getChkReasons: function() {
                        var chkReasons = [];
                        // 可跟进
                        chkReasons[0] = { "key": "带有敏感词", "value": 1 };
                        chkReasons[1] = { "key": "内容侵犯版权或知识权、含有人身攻击或恶意的评论或政治、宗教讨论", "value": 2 };
                        chkReasons[2] = { "key": "内容不符", "value": 3 };
                        return chkReasons;
                    },
                    // 校验Ibeacon唯一性
                    getIsHasIbeaconId: function(params) {
                        return $http.get(api.getIsHasIbeaconId, {
                            'params': params
                        })
                    }

                };
            }
        ])
        // 绑定展会通列表
        .controller('sellerBindExhibitionListCtrl', [
            '$scope', '$rootScope', 'ngDialog',
            '$location', '$uibModal', 'exhibitionService',
            'commonService', 'commonTool',
            function($scope, $rootScope, ngDialog,
                $location, $uibModal, exhibitionService,
                commonService, commonTool) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    companyType: null,
                    companyName: null,
                    fairNo: null
                };

                tools = $.extend(tools, {
                    getExhibitionList: function() {
                        exhibitionService.getExhibitionList(paging).success(function(data) {
                            vm.items = data.page.items;
                            paging.total = data.page.total;
                            paging.pageSize = data.page.pageSize;
                        });
                    },
                    reset: function() {
                        paging.page = 1;
                        paging.pageSize = 10;
                        paging.companyType = null;
                        paging.companyName = null;
                        paging.fairNo = null;
                    },
                    getArrayOfCfecTimes: function() {
                        exhibitionService.getArrayOfCfecTimes().success(function(data) {
                            vm.cfecTimesArray = data.data.sessionList;
                        })
                    },
                    delExhibition: function(promotionId) {
                        $scope.ids = promotionId;
                        $scope.tools = tools;
                        vm.delExhibitionDlg = ngDialog.open({
                            template: 'delExhibitionDlgId',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            controller: ['$scope', function($scope) {
                                var ids = $scope.ids;
                                var tools = $scope.tools;

                                $scope.submit = function() {
                                    var params = {
                                        promotionId: ids,
                                        status: 0
                                    };
                                    exhibitionService.saveBindExhibition(params).success(function(data) {
                                        tools.getExhibitionList();
                                        $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                        tools.close();
                                    })
                                }

                            }]

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
                        tools.getExhibitionList();
                    },
                    // 关闭弹出层
                    close: function() {
                        ngDialog.closeAll();
                    }
                });

                var method = {
                    key: "",
                    value: "",
                    myObject: function(key, value) {
                        this.key = key;
                        this.value = value;
                    },
                    getSearchTypeArray: function() {
                        return [new this.myObject('公司中文名称', '11'), new this.myObject('公司英文名称', '10')];
                    }
                };

                (function() {
                    vm.pages = commonService.setPageSizeArray(10, 50, 100);
                    vm.searchTypeArray = method.getSearchTypeArray();
                    tools.getArrayOfCfecTimes();
                    tools.getExhibitionList();
                }());
            }
        ])

    // 绑定展会通
    .controller('sellerBindExhibitionCtrl', ['$scope', '$rootScope', 'ngDialog',
            '$location', '$uibModal', 'exhibitionService',
            'commonService', 'commonTool',
            function($scope, $rootScope, ngDialog,
                $location, $uibModal, exhibitionService,
                commonService, commonTool) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var search = $location.search();
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    companyId: null,
                    sellerId: null,
                    fairNo: null,
                    status: null, // 状态（0：删除 1：有效）
                    level: '10', // 版本等级（10：初级版 20：中级版 30：高级版）
                    ibeaconId: null
                };
                // type 0 查看 1 编辑
                vm.type = search.type;
                if (search.type == 1) {
                    paging.promotionId = search.promotionId;
                }
                // 弹出层控制
                var vmdlg = $scope.vmdlg = {};
                var toolsdlg = $scope.toolsdlg = {};
                var pagingdlg = $scope.pagingdlg = {
                    page: 1,
                    pageSize: 10
                }

                var forms = $scope.forms = {};
                forms.bindform = {}

                tools = $.extend(tools, {
                    // 添加供应商
                    selectSeller: function() {
                        toolsdlg.productId = null;
                        ngDialog.open({
                            template: "addSeller.html",
                            title: "添加供应商",
                            width: 980,
                            scope: $scope,
                            controller: ["$scope", '$rootScope', 'ngDialog', 'commonService', 'commonTool', 'exhibitionService', function($scope, $rootScope, ngDialog, commonService, commonTool, exhibitionService) {

                                toolsdlg.search = function() {
                                    if (toolsdlg.qKey != 'sellerId') {
                                        pagingdlg.qKey = toolsdlg.qKey;
                                        pagingdlg.qValue = toolsdlg.qValue;
                                        pagingdlg.sellerId = null;
                                    } else {
                                        var regex = /[0-9]+/g;
                                        pagingdlg.qKey = null;
                                        pagingdlg.qValue = null;
                                        pagingdlg.page = null;
                                        pagingdlg.pageSize = null;
                                        if (regex.test(toolsdlg.qValue)) {
                                            pagingdlg.sellerId = toolsdlg.qValue;
                                        } else {
                                            pagingdlg.sellerId = null;
                                            $rootScope.alertMsgService.setMessage('供应商ID只能输入数字', 'warning');
                                            return;
                                        }
                                    }

                                    toolsdlg.getSellerList();

                                }

                                // 获取供应商列表
                                toolsdlg.getSellerList = function() {
                                    exhibitionService.getSeller(commonTool.filterParam(pagingdlg)).success(function(data) {
                                        vmdlg.data = data.data;
                                        vmdlg.total = data.page.total;
                                        pagingdlg.total = data.page.total;
                                        pagingdlg.pageSize = data.page.pageSize;
                                    });
                                }

                                toolsdlg.selected = function(companyId, sellerId, companyName, companyEnName) {
                                        paging.companyId = companyId;
                                        paging.sellerId = sellerId;
                                        paging.companyName = companyName;
                                        paging.companyEnName = companyEnName;
                                        vmdlg.data = null;
                                        toolsdlg.close();
                                    }
                                    // 分页
                                toolsdlg.getnewpage = function(type) {
                                    if (type == 1) {
                                        pagingdlg.page = toolsdlg.newpagesize;
                                        tools.newpagesize = null;
                                    } else if (type == 0) {
                                        pagingdlg.page = 1;
                                    }
                                    toolsdlg.getSellerList();
                                }

                                // 关闭
                                toolsdlg.close = function() {
                                    $scope.closeThisDialog();
                                }

                            }]
                        })
                    },
                    saveBindExhibition: function() {
                        if (commonTool.isEmpty(paging.sellerId)) {
                            $rootScope.alertMsgService.setMessage('请选择供应商', 'warning');
                            return;
                        }
                        if (commonTool.isEmpty(paging.fairNo)) {
                            $rootScope.alertMsgService.setMessage('请选择广交会届数', 'warning');
                            return;
                        }
                        // if(commonTool.isEmpty(paging.ibeaconId)){
                        //     $rootScope.alertMsgService.setMessage('请输入ibeaconId', 'warning');
                        //     return;
                        // }
                        // if(!(/(\d{1,5})/.test(paging.ibeaconId) && paging.ibeaconId >=1 && paging.ibeaconId <= 65535)){
                        //     $rootScope.alertMsgService.setMessage('ibeaconId只允许输入1-65535之间的字符', 'warning');
                        //     return;
                        // }
                        exhibitionService.saveBindExhibition(paging).success(function(data) {
                            if (data.status == 'success') {
                                $rootScope.alertMsgService.setMessage('提交成功', 'success');
                                window.location.href = '/#/seller/bindExhibitionList';
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })

                        // exhibitionService.getIsHasIbeaconId({ibeaconId:paging.ibeaconId}).success(function(data){
                        //     if(data.data == 1){
                        //         $rootScope.alertMsgService.setMessage('该ibeaconId已被绑定，请重新输入', 'warning');
                        //         return;
                        //     }else{
                        //         exhibitionService.saveBindExhibition(paging).success(function(data){
                        //             if(data.status == 'success'){
                        //                 $rootScope.alertMsgService.setMessage('提交成功', 'success');
                        //                 window.location.href='/#/seller/bindExhibitionList';
                        //             }else{
                        //                 $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        //             }
                        //         })
                        //     }
                        // })
                    },
                    getArrayOfCfecTimes: function() {
                        exhibitionService.getArrayOfCfecTimes().success(function(data) {
                            vm.cfecTimesArray = data.data.sessionList;
                        })
                    },
                    // 获取详情
                    getExhibitionDetail: function(promotionId) {
                        exhibitionService.getExhibitionDetail(commonTool.filterParam({ promotionId: promotionId })).success(function(data) {
                            paging.companyId = data.data.companyId;
                            paging.sellerId = data.data.sellerId;
                            paging.fairNo = data.data.fairNo;
                            paging.status = data.data.status;
                            paging.level = data.data.level.toString();
                            paging.ibeaconId = data.data.ibeaconId;
                            paging.companyName = data.data.companyCName;
                            paging.companyEnName = data.data.companyEName;
                        });
                    }
                });

                var method = {
                    key: "",
                    value: "",
                    myObject: function(key, value) {
                        this.key = key;
                        this.value = value;
                    },
                    getSearchTypeArray: function() {
                        return [new this.myObject('公司中文名称', 'companyName'), new this.myObject('公司英文名称', 'companyEnName'), new this.myObject('供应商ID', 'sellerId')];
                    }
                };

                (function() {
                    // 编辑状态
                    if (search.type == 1) {
                        tools.getExhibitionDetail(paging.promotionId);
                    }

                    vm.popSearchTypeArray = method.getSearchTypeArray();
                    vm.pages = commonService.setPageSizeArray(10, 50, 100);
                    tools.getArrayOfCfecTimes();


                }());

            }
        ])
        // 绑定展会通 详情
        .controller('sellerBindExhibitionDetailCtrl', ['$scope', '$rootScope', 'ngDialog',
            '$location', '$uibModal', 'exhibitionService',
            'commonService', 'commonTool',
            function($scope, $rootScope, ngDialog,
                $location, $uibModal, exhibitionService,
                commonService, commonTool) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var search = $location.search();
                var paging = $scope.paging = {
                    promotionId: search.promotionId
                };


                tools = $.extend(tools, {
                    // 获取详情
                    getExhibitionDetail: function() {
                        exhibitionService.getExhibitionDetail(commonTool.filterParam(paging)).success(function(data) {
                            vm.data = data.data;
                        });
                    }
                });

                (function() {
                    vm.pages = commonService.setPageSizeArray(10, 50, 100);
                    tools.getExhibitionDetail();
                }());

            }
        ])

    // 展会通 消息审核列表
    .controller('sellerExhibitionMsgListCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'exhibitionService',
        'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, exhibitionService,
            commonService, commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                status: 10,
                companyType: null,
                companyName: null,
                createTimeBegin: null,
                createTimeEnd: null
            };

            tools = $.extend(tools, {
                getExhibitionMsgList: function() {
                    exhibitionService.getExhibitionMsgList(paging).success(function(data) {
                        vm.items = data.page.items;
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
                    tools.getExhibitionMsgList();
                },
                reset: function() {
                    paging.page = 1;
                    paging.pageSize = 10;
                    // paging.status = null;
                    paging.companyType = null;
                    paging.companyName = null;
                    paging.createTimeBegin = null;
                    paging.createTimeEnd = null;
                },
                delExhibition: function(planId) {
                    $scope.ids = planId;
                    $scope.tools = tools;
                    vm.delExhibitionDlg = ngDialog.open({
                        template: 'delExhibitionDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var ids = $scope.ids;
                            var tools = $scope.tools;

                            $scope.submit = function() {
                                var params = {
                                    planId: ids,
                                    status: 0
                                };
                                exhibitionService.updatePlanAuditStatus(params).success(function(data) {
                                    tools.getExhibitionMsgList();
                                    $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                    tools.close();
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

            var method = {
                key: "",
                value: "",
                myObject: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                getSearchTypeArray: function() {
                    return [new this.myObject('公司中文名称', '11'), new this.myObject('公司英文名称', '10')];
                }
            };

            (function() {
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
                vm.searchTypeArray = method.getSearchTypeArray();
                tools.getExhibitionMsgList();
            }());
        }
    ])

    // 展会通 消息审核 详情
    .controller('sellerExhibitionMsgDetailCtrl', ['$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'exhibitionService',
        'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, exhibitionService,
            commonService, commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var search = $location.search();
            var paging = $scope.paging = {
                planId: search.planId
            };

            tools = $.extend(tools, {
                // 获取详情
                getExhibitionMsgDetail: function() {
                    exhibitionService.getExhibitionMsgDetail(commonTool.filterParam(paging)).success(function(data) {
                        vm.data = data.data;
                    });
                },
                // 弹出层勾选
                checkChange: function(status) {
                    vm.checkedItems_key = [];
                    vm.checkedItems_value = [];
                    angular.forEach(vm.getChkReasons, function(item) {
                        if (item.$checked === true) {
                            vm.checkedItems_key.push(item.key);
                            vm.checkedItems_value.push(item.value);
                        }
                    });
                },
                changestatus: function(planId, status) {
                    $scope.ids = planId;
                    $scope.status = status;
                    $scope.tools = tools;
                    vm.getChkReasons = exhibitionService.getChkReasons();
                    vm.exhibitionDlg = {
                        status: status
                    };
                    vm.statusExhibitionDlg = ngDialog.open({
                        template: 'statusExhibitionDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        width: status == 30 ? '600' : '450',
                        controller: ['$scope', function($scope) {
                            var ids = $scope.ids;
                            var status = $scope.status;
                            var tools = $scope.tools;

                            $scope.submit = function() {
                                var params = {
                                    planId: ids,
                                    status: status
                                };
                                if (status == 30) {
                                    params.unpassType = null;
                                    params.unpassReason = '';
                                    if (vm.checkedItems_key.length) {
                                        params.unpassType = vm.checkedItems_value.join(',');
                                        var _temp = vm.checkedItems_key.join(',');
                                        params.unpassReason += _temp;
                                    }
                                    if (vm.exhibitionDlg.unpassReason != undefined && vm.exhibitionDlg.unpassReason != '') {
                                        params.unpassType += ',4';
                                        params.unpassReason += (',' + vm.exhibitionDlg.unpassReason);
                                    }

                                }

                                exhibitionService.updatePlanAuditStatus(params).success(function(data) {
                                    tools.getExhibitionMsgDetail();
                                    $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                    tools.close();
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

            (function() {
                vm.pages = commonService.setPageSizeArray(10, 50, 100);
                tools.getExhibitionMsgDetail();
            }());

        }
    ])

    // 展会通版本
    .filter("exhibitionLevelFilter", function() {
        // 版本等级（10：初级版 20：中级版 30：高级版）
        return function(level) {
            switch (level) {
                case 10:
                    return '展会通初级版';
                case 20:
                    return '展会通中级版';
                case 30:
                    return '展会通高级版';
            }
        };
    })

    // 展会通推送类型
    .filter("exhibitionSendTypeFilter", function() {
        // 版本等级（10：定距推送   20：定向推送）
        return function(sendType) {
            switch (sendType) {
                case 10:
                    return '定距推送';
                case 20:
                    return '定向推送';
            }
        };
    })

    // 展会通推送状态
    .filter("exhibitionStatusFilter", function() {
        // （10：待审核   （20：审核通过   21：开启    22：暂停）   30：审核不通过   0：删除）
        return function(status) {
            switch (status) {
                case 10:
                    return '待审核';
                case 20:
                    return '审核通过';
                case 21:
                    return '开启';
                case 22:
                    return '暂停';
                case 30:
                    return '审核不通过';
                case 0:
                    return '删除';
            }
        };
    })

    // 推送范围
    .filter("exhibitionSendRangeFilter", function() {
        // 推送距离（10：近   20：中    30：远）
        return function(status) {
            switch (status) {
                case 10:
                    return '近';
                case 20:
                    return '中';
                case 30:
                    return '远';
            }
        };
    });
});