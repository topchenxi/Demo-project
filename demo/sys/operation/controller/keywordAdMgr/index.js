define(['../module'], function(ng) {
    ng.factory('kwAdMgrService', ['$http', 'api',
            function($http, api) {
                return {
                    // 获取广告列表
                    getAdList: function(params) {
                        return $http.get(api.getAds, {
                            'params': params
                        });
                    },
                    // 获取行业
                    getAllCategorysOfLevel1: function() {
                        return $http.get(api.getAllCategorysOfLevel1);
                    },
                    // 获取产品列表
                    getProduct: function(params) {
                        return $http.get(api.getAdProducts, {
                            'params': params
                        });
                    },
                    // 保存广告
                    addOrUpdate: function(params) {
                        return $http.get(api.addOrUpdate, {
                            'params': params
                        });
                    },
                    // 获取对应广告位的时间排期表
                    getAdTime: function(params) {
                        return $http.get(api.getAdTime, {
                            'params': params
                        })
                    },
                    // 获取广告详情
                    getAdManagerDetail: function(params) {
                        return $http.get(api.getAdManagerDetail, {
                            'params': params
                        })
                    },
                    // 时间戳转年月日
                    formatDate: function(time) {
                        var d = new Date(time);
                        var year = d.getFullYear();
                        var month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
                        var date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
                        return year + "-" + month + "-" + date;
                    },
                    // 更新状态
                    updateStatus: function(params) {
                        return $http.get(api.updateStatus, {
                            'params': params
                        })
                    },
                    // 获取更新状态
                    getAdAuditRecoed: function(params) {
                        return $http.get(api.getAdAuditRecoed, {
                            'params': params
                        })
                    }

                };
            }
        ])
        // 列表
        .controller('kwAdMgrListCtrl', [
            '$scope', '$rootScope', 'ngDialog',
            '$location', '$uibModal', 'kwAdMgrService',
            'commonService', 'commonTool',
            function($scope, $rootScope, ngDialog,
                $location, $uibModal, kwAdMgrService,
                commonService, commonTool) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    status: null,
                    timeStatus: null,
                    sitType: null,
                    adKeyword: null,
                    productList: null,
                    indusId: null,
                    companyName: null,
                    timeType: 2,
                    beginDateStr: null,
                    endDateStr: null
                };

                vm.selectionItme = [];
                vm.showOperateFlag = false;
                // vm.activeTab = 0;
                tools.activeTab_status = $location.search().status;

                if(tools.activeTab_status){
                    switch(tools.activeTab_status){
                        case '2':
                            vm.activeTab = 1;
                            break;
                        case '3':
                            vm.activeTab = 2;
                            break;
                        case '-1':
                            vm.activeTab = 3;
                            break;
                        default:
                            vm.activeTab = 0;
                            break;
                    }
                }
                paging.status = $location.search().status?$location.search().status:null;
                tools.status = paging.status;
                tools = $.extend(tools, {
                    // 获取列表
                    getAdList: function(isSearchButton) {
                        vm.allChecked = false;
                        vm.showOperateFlag = false;
                        if (isSearchButton) {
                            paging.page = 1;
                        }
                        kwAdMgrService.getAdList(paging).success(function(data) {
                            vm.items = data.data.items;
                            paging.total = data.page.total;
                            paging.pageSize = data.page.pageSize;
                        });
                        tools.getTotal();
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
                    // 搜索
                    search: function() {
                        var reg = /[`~!@#\$%\s\^\&\*\(\)_\+<>\?:"\{\}\.\\\，/;'\[\]]/im;
                        if (reg.test(paging.productList)) {
                            $rootScope.alertMsgService.setMessage("多个产品ID用英文逗号隔开", 'warning');
                            return;
                        }
                        tools.getAdList(true);
                    },
                    // 重置
                    reset: function() {
                        paging.page = 1;
                        paging.pageSize = 10;
                        paging.timeStatus = null;
                        paging.sitType = null;
                        paging.adKeyword = null;
                        paging.productList = null;
                        paging.indusId = null;
                        paging.companyName = null;
                        paging.timeType = 2;
                        paging.beginDateStr = null;
                        paging.endDateStr = null;
                    },
                    checkAll: function(checked) {
                        vm.selectionItme = [];
                        vm.showOperateFlag = checked ? true : false;
                        angular.forEach(vm.items, function(item) {
                            item.$checked = checked;
                            if (true === checked) {
                                vm.selectionItme.push(item.adId);
                            }
                        });
                    },
                    selection: function() {
                        var selectionItme = [];
                        angular.forEach(vm.items, function(item) {
                            if (item.$checked === true) {
                                selectionItme.push(item.adId);
                            }
                        });
                        vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                        vm.selectionItme = selectionItme;
                    },
                    changestatus: function(adId, status) {
                        var adIds = "";
                        if (commonTool.isEmpty(adId)) {
                            vm.allChecked = false;
                            adIds = vm.selectionItme.join(',');
                            if (commonTool.isEmpty(adIds)) {
                                $rootScope.alertMsgService.setMessage("请先选择要审核的广告", 'warning');
                                return;
                            }
                        } else {
                            adIds = adId;
                        }
                        vm.changestatus = status;
                        if (status == -1) {
                            tools.chxstatus(adIds, status);
                        } else {
                            tools.confirm(adIds, status);
                        }
                        vm.selectionItme = [];
                    },
                    // 不通过
                    chxstatus: function(adIds, status) {
                        $scope.adIds = adIds;
                        $scope.tools = tools;
                        vm.adListDlg = ngDialog.open({
                            template: 'adListDlgId',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            controller: ['$scope', '$rootScope', function($scope) {
                                var adIds = $scope.adIds;
                                var tools = $scope.tools;
                                $scope.submit = function() {
                                    var remark = $(".reasonInput").val();
                                    if (remark == null || remark == "" || remark == undefined) {
                                        // alert("请输入审核原因");
                                        $rootScope.alertMsgService.setMessage('请输入审核原因', 'info');
                                        return;
                                    }
                                    var params = {
                                        'adIds': adIds,
                                        'status': -1,
                                        "remark": remark
                                    };
                                    // 未修改
                                    kwAdMgrService.updateStatus(params)
                                        .success(function(data) {
                                            if ('success' === data.status) {
                                                tools.reset();
                                                tools.getAdList();
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
                    confirm: function(adIds, status) {
                        $scope.adIds = adIds;
                        $scope.tools = tools;
                        vm.sellerListDlg = ngDialog.open({
                            template: 'adListDlgId',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            controller: ['$scope', function($scope) {
                                var adIds = $scope.adIds;
                                var tools = $scope.tools;

                                $scope.submit = function() {
                                    var params = {
                                        'adIds': adIds,
                                        'status': status
                                    };

                                    kwAdMgrService.updateStatus(params)
                                        .success(function(data) {
                                            if ('success' === data.status) {
                                                // tools.reset();
                                                tools.getAdList();
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
                    // 新增广告跳转
                    toAddAd: function() {
                        $location.path('/keywordAdMgr/addAd');
                    },
                    // 设置地址
                    setLocation:function(status){
                        var s = null;
                        if(status){
                            s = status;
                        }
                        $location.search({
                            status:s
                        })
                    },
                    // 获取状态的总条数
                    getTotal:function(){
                        // 获取待审核、审核不通过条数
                        var pendingTotalPaging = {
                            page: 1,
                            pageSize: 1,
                            status:2
                        }
                        var notpassTotalPaging = {
                            page: 1,
                            pageSize: 1,
                            status:-1
                        }
                        kwAdMgrService.getAdList(pendingTotalPaging).success(function(data) {
                            vm.pendingTotal = data.page.total;
                        });
                        kwAdMgrService.getAdList(notpassTotalPaging).success(function(data) {
                            vm.notpassTotal = data.page.total;
                        });
                    },

                    // 推荐位置
                    sitType: [{
                        "title": "产品列表",
                        "key": "10"
                    }, {
                        "title": "产品列表右侧",
                        "key": "11"
                    }],
                    // 状态   待投放、投放中、已暂停、已过期
                    timeStatus: [{
                        "title": "待投放",
                        "key": "5"
                    }, {
                        "title": "投放中",
                        "key": "6"
                    }, {
                        "title": "已暂停",
                        "key": "4"
                    }, {
                        "title": "已过期",
                        "key": "7"
                    }],
                    // 
                    timeType: [{
                        "title": "失效时间",
                        "key": 2
                    }, {
                        "title": "起效时间",
                        "key": 1
                    }]

                });

                // 初始化列表
                init_data();

                // 初始化
                function init_data() {
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);

                    // 加载行业列表
                    kwAdMgrService.getAllCategorysOfLevel1().success(function(data) {
                        vm.industryList = data.data;
                    });

                    tools.getAdList();
                }
            }
        ])


    // 新增 修改 广告
    .controller('kwAdMgrAddCtrl', ['$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'kwAdMgrService',
        'commonService', 'commonTool','$filter',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, kwAdMgrService,
            commonService, commonTool,$filter) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {
                sitType: null,
                indusId: null,
                adKeyword: null,
                productId: null,
                sort: 1,
                beginDateStr: null,
                endDateStr: null,
                companyId: null,
                enabledMark: [],
                adId: null,
                price:'0.00',
                applyRemark:null
            };

            $scope.btnFlag = false;
            $scope.today = laydate.now();
            // 弹出层控制
            var vmdlg = $scope.vmdlg = {};
            var toolsdlg = $scope.toolsdlg = {};

            var search = $location.search();
            paging.adId = search.adId;

            var forms = $scope.forms = {};
            forms.addAdform = {}
            tools = $.extend(tools, {
                /**
                 * [保存修改]
                 * @param  {Boolean} isForm     [是否修改form]
                 * @return {[type]}             [description]
                 */
                addOrUpdate: function() {
                    // 是否表单并验证通过
                    if(commonTool.isEmpty(paging.sitType)){
                        $rootScope.alertMsgService.setMessage('请选择位置', 'warning');
                        return;
                    }
                    if(commonTool.isEmpty(paging.indusId)){
                        $rootScope.alertMsgService.setMessage('请选择行业', 'warning');
                        return;
                    }
                    if (commonTool.isEmpty(paging.adKeyword)) {
                        $rootScope.alertMsgService.setMessage('请输入关键字', 'warning');
                        return;
                    }
                    var keyReg = /[,，~^\u4e00-\u9fa5]/im;
                    if (keyReg.test(paging.adKeyword)) {
                        $rootScope.alertMsgService.setMessage("关键字不能包含中文与特殊符号", 'warning');
                        return;
                    }
                    if (commonTool.isEmpty(paging.productId)) {
                        $rootScope.alertMsgService.setMessage('请选择产品', 'warning');
                        return;
                    }
                    if (commonTool.isEmpty(paging.beginDateStr)) {
                        $rootScope.alertMsgService.setMessage('请选择开始时间', 'warning');
                        return;
                    }
                    if (commonTool.isEmpty(paging.endDateStr)) {
                        $rootScope.alertMsgService.setMessage('请选择结束时间', 'warning');
                        return;
                    }
                    if(new Date(paging.beginDateStr).getTime() < new Date(laydate.now()).getTime()){
                        $rootScope.alertMsgService.setMessage("起始日期不能小于今日", 'warning');
                        return;
                    }
                    if(new Date(paging.beginDateStr).getTime() > new Date(paging.endDateStr).getTime()){
                        $rootScope.alertMsgService.setMessage("截止日期不能小于起始日期", 'warning');
                        return;
                    }
                    var priceReg = /^[0-9]+([.]{1}[0-9]{2})?$/;
                    if (!priceReg.test(paging.price)) {
                        $rootScope.alertMsgService.setMessage("请输入正确金额，最多包含两位小数", 'warning');
                        return;
                    }

                    $scope.btnFlag = true;
                    kwAdMgrService.addOrUpdate(paging).success(function(data) {
                        if (data.status == 'success') {
                            $rootScope.alertMsgService.setMessage('操作成功');
                            if(search.adId != null){
                                $location.search('adId',null);
                            }
                            $location.path('/keywordAdMgr/list').search();
                        } else {
                            $scope.btnFlag = false;
                            if(data.message){
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }else{
                                $rootScope.alertMsgService.setMessage('操作失败', 'warning');
                            }
                        }
                    });

                },
                // 选择产品
                selectProduct: function() {
                    toolsdlg.productId = null;
                    ngDialog.open({
                        template: "addProduct.html",
                        title: "产品信息列表",
                        width: 980,
                        scope: $scope,
                        controller: ["$scope", '$rootScope', 'ngDialog', 'commonService', 'commonTool', 'kwAdMgrService', function($scope, $rootScope, ngDialog, commonService, commonTool, kwAdMgrService) {

                            toolsdlg.search = function() {
                                kwAdMgrService.getProduct({
                                    'productId': toolsdlg.productId
                                }).success(function(data) {
                                    vmdlg.data = data.data;
                                });
                            }

                            toolsdlg.selected = function() {
                                paging.productId = vmdlg.data.productId;
                                paging.productLink = vmdlg.data.productUrl;
                                paging.companyId = vmdlg.data.companyId;
                                vmdlg.data = null;
                                tools.getAdTime();
                                tools.close();
                            }

                        }]
                    })
                },
                // 删除已选商品
                delProduct: function() {
                    paging.productId = null;
                    paging.productLink = null;
                },
                // 关闭弹出层
                close: function() {
                    ngDialog.closeAll();
                },
                // 获取产品链接
                getProductLink: function(name, id) {
                    var regex = /^[ `~!@#$%^&*()_+\-=[\]{}\\|;':\"/,.?]*$/g;
                    var rs = "";
                    for (var i = 0; i < name.length; i++) {
                        rs = rs + name.substr(i, 1).replace(regex, '-');
                    }
                    if (rs.substr(rs.length - 1, 1) == '-') {
                        rs = rs.substring(0, rs.length - 1);
                    }
                    rs = 'http://centurycooperation.en.e-cantonfair.com/products/' + rs + '-' + id + '.html';

                    return rs;
                },
                // 获取该关键词的已选排期时间段
                getAdTime: function() {
                    // 新增状态
                    if (paging.adId == undefined) {
                        paging.beginDateStr = null;
                        paging.endDateStr = null;
                    }
                    paging.enabledMark = [];
                    var adTimePaging = {
                        sitType: paging.sitType,
                        adKeyword: paging.adKeyword,
                        sort: paging.sort,
                        productId: paging.productId,
                        adId:paging.adId
                    };
                    kwAdMgrService.getAdTime(adTimePaging).success(function(data) {
                        for (var i = 0; i < data.data.length; i++) {
                            var _tempJson = {};
                            _tempJson.start = kwAdMgrService.formatDate(data.data[i].beginDate);
                            _tempJson.end = kwAdMgrService.formatDate(data.data[i].endDate);
                            _tempJson.text = '售罄';
                            paging.enabledMark.push(_tempJson);
                        }
                    });
                },
                // 推荐位置
                sitType: [{
                    "title": "产品列表",
                    "key": "10"
                }, {
                    "title": "产品列表右侧",
                    "key": "11"
                }],
                // 回填修改内容
                getAdManagerDetail: function(adId) {
                    paging.adId = adId;
                    kwAdMgrService.getAdManagerDetail(paging).success(function(data) {
                        paging.sitType = '' + data.data.sitType;
                        paging.indusId = data.data.indusId;
                        paging.adKeyword = data.data.adKeyword;
                        paging.productId = data.data.productId;
                        paging.sort = data.data.sort;
                        paging.beginDateStr = kwAdMgrService.formatDate(data.data.beginDate);
                        paging.endDateStr = kwAdMgrService.formatDate(data.data.endDate);
                        paging.companyId = data.data.companyId;
                        paging.enabledMark = [];
                        paging.adId = data.data.adId;
                        paging.productLink = data.data.secondLevelDomain;
                        tools.getAdTime();
                        paging.price = data.data.price;
                        paging.applyRemark = data.data.applyRemark;
                        console.log(data);
                    });
                },
                // 清空起止时间
                clearDate: function() {
                    paging.beginDateStr = null;
                    paging.endDateStr = null;
                },
                // 返回列表
                backtolist : function(){
                    history.go(-1);
                },
                priceFilter:function(val){
                    if(val != undefined){
                        var v = val.replace(/[^\d.]/g,"");
                        v = v.replace(/^\./g,"");
                        v = v.replace(/\.{2,}/g,"");
                        v = v.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
                        
                        if(v.indexOf('.') != -1){
                            var v_arr = v.split('.');
                            var v_temp0,v_temp1;
                            if(v_arr[0].length>8){
                                v_temp0 = v_arr[0].substr(0,8);
                            }else{
                                v_temp0 = v_arr[0];
                            }
                            if(v_arr[1].length>2){
                                v_temp1 = v_arr[1].substr(0,2);
                            }else{
                                v_temp1 = v_arr[1]
                            }
                            v = v_temp0 + '.' + v_temp1;
                        }else{
                            if(v.length>8){
                                v = v.substr(0,8);
                            }
                        }
                        paging.price = v;
                    }
                }
            })

            // 初始化列表
            init_data();

            // 初始化
            function init_data() {
                // 加载行业列表
                kwAdMgrService.getAllCategorysOfLevel1().success(function(data) {
                    vm.industryList = data.data;
                });
                // 修改 资料回填
                if (paging.adId != undefined) {
                    tools.getAdManagerDetail(paging.adId);
                }
            }
        }
    ])

    // 查看 广告
    .controller('kwAdMgrDetailCtrl', ['$scope', '$rootScope', 'ngDialog',
        '$location', '$uibModal', 'kwAdMgrService',
        'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, kwAdMgrService,
            commonService, commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {};

            var search = $location.search();
            paging.adId = search.adId;

            tools = $.extend(tools, {

                getAdManagerDetail: function() {
                    kwAdMgrService.getAdManagerDetail(paging).success(function(data) {
                        vm.data = data.data;
                        vm.data.productLink = tools.getProductLink(data.data.productName, data.data.productId);
                    });
                },
                getAdAuditRecoed: function() {
                    kwAdMgrService.getAdAuditRecoed(paging).success(function(data) {
                        vm.updateLog = data.page.items;
                    });
                },
                changestatus: function(adId, status) {
                    vm.changestatus = status;
                    if (status == -1) {
                        tools.chxstatus(adId, status);
                    } else {
                        tools.confirm(adId, status);
                    }

                },
                // 不通过
                chxstatus: function(adId, status) {
                    $scope.adId = adId;
                    $scope.tools = tools;
                    vm.adListDlg = ngDialog.open({
                        template: 'adListDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        controller: ['$scope', '$rootScope', function($scope) {
                            var adId = $scope.adId;
                            var tools = $scope.tools;
                            $scope.submit = function() {
                                var remark = $(".reasonInput").val();
                                if (remark == null || remark == "" || remark == undefined) {
                                    // alert("请输入审核原因");
                                    $rootScope.alertMsgService.setMessage('请输入审核原因', 'info');
                                    return;
                                }
                                var params = {
                                    'adIds': adId,
                                    'status': -1,
                                    "remark": remark
                                };
                                // 未修改
                                kwAdMgrService.updateStatus(params)
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            tools.getAdManagerDetail();
                                            $rootScope.alertMsgService.setMessage('审核操作成功', 'success');
                                            // alert('审核操作成功');
                                            tools.close();
                                        } else {
                                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                        }
                                    })
                            }

                        }]

                    });
                },
                confirm: function(adId, status) {
                    $scope.adId = adId;
                    $scope.tools = tools;
                    console.log(tools);
                    vm.sellerListDlg = ngDialog.open({
                        template: 'adListDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var adId = $scope.adId;
                            var tools = $scope.tools;
                            console.log(tools);
                            $scope.submit = function(status) {
                                var params = {
                                    'adIds': adId,
                                    'status': status
                                };

                                kwAdMgrService.updateStatus(params)
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            // alert("操作成功");
                                            tools.getAdManagerDetail();
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
                // 获取产品链接
                getProductLink: function(name, id) {
                    var regex = /^[ `~!@#$%^&*()_+\-=[\]{}\\|;':\"/,.?]*$/g;
                    var rs = "";
                    for (var i = 0; i < name.length; i++) {
                        rs = rs + name.substr(i, 1).replace(regex, '-');
                    }
                    if (rs.substr(rs.length - 1, 1) == '-') {
                        rs = rs.substring(0, rs.length - 1);
                    }
                    rs = 'http://centurycooperation.en.e-cantonfair.com/products/' + rs + '-' + id + '.html';

                    return rs;
                },
                // 返回列表
                backtolist : function(){
                    history.go(-1);
                }

            });

            // 获取详情
            tools.getAdManagerDetail();
            tools.getAdAuditRecoed();
        }
    ])

    .filter('getProductLink', function() {
        return function(name, id) {
            var regex = /^[ `~!@#$%^&*()_+\-=[\]{}\\|;':\"/,.?]*$/g;
            var rs = "";
            for (var i = 0; i < name.length; i++) {
                rs = rs + name.substr(i, 1).replace(regex, '-');
            }
            if (rs.substr(rs.length - 1, 1) == '-') {
                rs = rs.substring(0, rs.length - 1);
            }
            rs = 'http://centurycooperation.en.e-cantonfair.com/products/' + rs + '-' + id + '.html';

            return rs;
        }
    })

    // 状态分类
    .filter("adState", function() {
        return function(auditStatus, timeStatus) {
            var status = '';
            switch (auditStatus) {
                case 0:
                    status = '新增';
                    break;
                case 1:
                    status = '修改';
                    break;
                case 2:
                    status = '待审核';
                    break;
                case 3:
                    switch (timeStatus) {
                        case 5:
                            status = '待投放';
                            break;
                        case 6:
                            status = '投放中';
                            break;
                        case 7:
                            status = '已过期';
                            break;
                    }
                    break;
                case -1:
                    status = '不通过';
                    break;
                case 4:
                    status = '已暂停';
                    break;
                case -3:
                    status = '已删除';
                    break;
            }

            return status;
        };
    })

    // 获取第一个图片
    .filter('getFirstImg', function() {
        return function(imgList) {
            var imgArr = imgList.split(',');
            return imgArr[0];
        }
    })

    // 推荐位置 filter
    .filter('sitTypeFilter', function() {
        return function(sitType) {
            var rs = '';
            switch (sitType) {
                case 10:
                    rs = '产品列表';
                    break;
                case 11:
                    rs = '产品列表右侧';
                    break;
            }
            return rs;
        }
    })

    // 备注 filter
    .filter('applyRemarkFilter', function() {
        return function(applyRemark) {
            var rs = '无';
            if(applyRemark != null &&  applyRemark != ''){
                rs = applyRemark;
            }
            return rs;
        }
    })
});
