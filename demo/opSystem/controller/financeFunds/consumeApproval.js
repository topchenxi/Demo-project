define(['../module'],function(ng){
    ng
        .factory('financeApprService', ['$http', 'api', function($http, api){
            return {
                // 查询消费列表
                getList:function(params){
                    return $http.get(api.getComsumeApprList, {
                        'params': params
                    });
                },
                // 是否一次性全额付款
                isFullPayment:function(param){
                    return $http.post(api.isFullPayment,param);
                },
                // 消费审批-分期的
                audit:function(param){
                    return $http.post(api.updateOrderPayStatus,param);
                },
                // 消费审批-一次性全额付款
                auditFullPayment:function(param){
                    return $http.post(api.updateFullPaymentStatus,param);
                },
                // 消费核实
                financeConfirm:function(param){
                    return $http.post(api.fullPaymentComplete,param);
                },
                // 消费审批-详情
                getConsumeApprovalDetail:function(params){
                    return $http.get(api.getComsumeApprDetail, {
                        'params': params
                    });
                },
                // 查询提现列表
                getWithdrawCashList:function(params){
                    return $http.get(api.getWithdrawCashList, {
                        'params': params
                    });
                },
                getWithdrawCashDetail:function(params){
                    return $http.get(api.getWithdrawCashDetail, {
                        'params': params
                    });
                },
                //  查当前保存的汇率
                getExchangeRate:function(){
                    return $http.get(api.getExchangeRate);
                },
                // 设置汇率
                setExchangeRate:function(param){
                    return $http.post(api.setExchangeRate,param);
                },
                // 提现审批
                updateWithdrawCashStatus:function(param){
                    return $http.post(api.updateWithdrawCashStatus,param);
                },
                // 提现-确认付款 withdrawConfirmPay
                withdrawConfirmPay:function(param){
                    return $http.post(api.withdrawConfirmPay,param);
                },
                // 获取支付方式
                getPayMethod:function(){
                    return $http.get(api.getPayMethod);
                },
                // 获取审核人
                getAuditPerson:function(){
                    return $http.get(api.getAuditPerson);
                }

            }

        }])
        .controller('ConsumeApprovalCtrl', ['$scope','$window','$location','$uibModal','financeApprService','orderService','commonService','commonTool',
            function($scope,$window,$location,$uibModal,service,orderService,commonService,commonTool){
                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                var paging =  $scope.paging = {
                    'page': 1,
                    'pageSize': 10,
                    'orderId':"", // 订单编号
                    'buyerName':"" ,    // 买家账号
                    "sellerName":"" ,   //卖家账号
                    "startTimes":"", //生成时间
                    "endTimes":"", //生成时间
                    "auditStart":"",    //审核时间
                    "auditEnd":"",  //审核时间
                    "currency":"",  //交易币种
                    "fundStatus":"",    //审核状态
                    "auditUserId":"",   //审核人
                    "payType":""    //支付方式
                };
                // 转到第几页
                tools.newpagesize = null;

                // 1.查询条件初始化
                tools.initCondition = function(isOnload){
                   if(isOnload){
                       // 加载审核人
                       service.getAuditPerson().success(function(data){
                           vm.auditPerson = data.data;
                       });

                       // 加载支付方式
                       service.getPayMethod().success(function(data){
                           vm.payType= data.data;
                       });
                       // 设置页码
                       vm.pages = commonService.setPageSizeArray(10, 30, 50);
                       /*日期控件相关*/
                       $scope.dateOptions = {
                           formatYear: 'yy',
                           startingDay: 1
                       };
                       $scope.open1 = function($event) { // 创建open方法 。 下面默认行为并将opened 设为true
                           $event.preventDefault();
                           $event.stopPropagation();
                           $scope.opened1 = true;
                           $scope.opened2 = false;
                           $scope.opened3 = false;
                           $scope.opened4 = false;
                       };
                       $scope.open2 = function($event) { // 创建open方法 。 下面默认行为并将opened 设为true
                           $event.preventDefault();
                           $event.stopPropagation();
                           $scope.opened2 = true;
                           $scope.opened1 = false;
                           $scope.opened3 = false;
                           $scope.opened4 = false;
                       };
                       $scope.open3 = function($event) { // 创建open方法 。 下面默认行为并将opened 设为true
                           $event.preventDefault();
                           $event.stopPropagation();
                           $scope.opened2 = false;
                           $scope.opened1 = false;
                           $scope.opened3 = true;
                           $scope.opened4 = false;
                       };
                       $scope.open4 = function($event) { // 创建open方法 。 下面默认行为并将opened 设为true
                           $event.preventDefault();
                           $event.stopPropagation();
                           $scope.opened2 = false;
                           $scope.opened1 = false;
                           $scope.opened3 = false;
                           $scope.opened4 = true;
                       };
                   }else{
                       //console.log("resssss")
                       paging.page=1;
                       paging.pageSize=10;
                       paging.orderId="";
                       paging.buyerName="";
                       paging.sellerName = "";
                       paging.startTimes="";
                       paging.endTimes="";
                       paging.auditStart="";
                       paging.auditEnd="";
                       paging.currency="";
                       paging.fundStatus="";
                       paging.auditUserId="";
                       paging.payType="";
                    }
                };
                // 2.查询列表
                tools.getList = function(){
                    service.getList(commonTool.filterParam(paging)).success(function(data) {
                        if(data.status=='success'){
                            vm.items = data.data.items;
                        }
                        paging.total = data.data.total;
                    });
                };
                // 3.列表翻页
                tools.getnewpage = function() {
                    if (tools.newpagesize != null) {
                        paging.page = tools.newpagesize;
                        tools.getList();
                        vm.newpagesize = null;
                    }
                };
                // 在显示订单详情前,查询订单相关信息
                tools.beforeShowDetail = function(orderId,childOrderId){
                    orderService.getOrderList({'page':1,'pageSize':1,'orderId':orderId}).success(function(data) {

                        var item=data.page.items[0];
                        // 加上isShowChildren 默认false
                        // 加上detailType
                        //多个商品拆分子订单:2
                        //单个商品拆分子订单:1
                        //不拆分的:0

                        //var isShowChildren = false;
                        var subs = item.orderSubItemList;
                        var detailType=0;   // 默认不拆单,即只有一个子订单
                        if(subs.length>1){
                            //console.log('这个订单有一个以上子订单哟');
                            //TODO 一期不做订单拆分
                        }
                       var detailType=detailType;
                       var orderType = item.orderType;
                        tools.showDetail(orderId,childOrderId,orderType,detailType);
                    });
                }
                // 查看订单详情
                tools.showDetail = function(orderId,childOrderId,payType,detailType){
                    var toPath = "";
                    if(payType==2){
                        toPath = "/order/offlineOrderDetail";
                    }else if(detailType == 0){
                        toPath = "/order/orderDetail";
                    }else if(detailType == 1){
                        toPath = "/order/detailOne";
                    }else if(detailType == 2){
                        toPath = "/order/detailMany";
                    }
                    //console.log("toPath=",toPath);
                    $location.path(toPath).search({
                        'orderId':orderId,
                        'childOrderId':childOrderId,
                        'payType':payType,  //订单类型:0:普通线上支付 1:线上分期付款 2:线下支付
                        'detailType':detailType
                    })
                };
                // 查看历史
                tools.toHistory = function(capitalTurnoverId){
                    $window.open('/#/financeFunds/consumeHistory?instalmentId='+capitalTurnoverId)
                }

                // 审核
                tools.financeAudit = function(id,subsId,instalmentId){
                    var uibModalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'financeAudit.html',
                        controller: 'FinanceAuditCtrl',
                        resolve: {
                            item: function () {
                                return {"orderId":id,"fundId":subsId,"instalmentId":instalmentId};
                            }
                        }
                    });
                    uibModalInstance.result.then(function(rs){
                            tools.getList();
                        }
                    );
                };

                // 核实
                tools.financeConfirm = function(id,subsId,instalmentId){
                    var uibModalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'financeConfirm.html',
                        controller: 'FinanceConfirmCtrl',
                        resolve: {
                            item: function () {
                                return {"orderId":id,"fundId":subsId,"instalmentId":instalmentId};
                            }
                        }
                    });
                    uibModalInstance.result.then(function(rs){
                            tools.getList();
                        }
                    );
                }

                tools.initCondition(true);
                tools.getList();

            }])
        .controller('FinanceAuditCtrl', ['$scope','$uibModalInstance','financeApprService','commonTool','item',
            function($scope,$uibModalInstance,service,commonTool,item){
            var vm = $scope.vm={};
            var func = $scope.func ={};
            vm.item= item;
            vm.item.status = 0;    //不通过
            // 一次还是分期付款
            func.isFullPayment=function(){
                service.isFullPayment({'orderId':vm.item.orderId}).success(function(data) {
                    if(data.status=='success'){
                        // 全额付款 1
                        vm.isFullPay = data.data;
                    }
                });
            }
            func.save = function(isValid){
                if(vm.item.status == 1){
                    vm.item.reason = "";
                }else if(isValid == false){
                    // 审核结果为不通过时,一定要原因
                    return;
                }
                var rs = null;
                if(vm.isFullPay == 1){
                    rs = service.auditFullPayment(vm.item)
                }else {
                    rs = service.audit(vm.item)
                }
                rs.success(function (data) {
                    if (data.status == 'success') {
                        alert("保存成功");
                        $uibModalInstance.close();
                    } else {
                        if (commonTool.isEmpty(data.message)) {
                            alert("保存失败");
                        } else {
                            alert(data.message);
                        }
                    }
                });
            }

            func.cancel = function(){
                $uibModalInstance.dismiss('cancel');
            }

            func.isFullPayment();
        }])
        .controller('FinanceConfirmCtrl', ['$scope','$uibModalInstance','financeApprService','item',
            function($scope,$uibModalInstance,service,item){
                var vm = $scope.vm={};
                var func = $scope.func ={};
                vm.item= item;

                func.confirm = function(){
                    service.financeConfirm(vm.item).success(function(data) {
                        if(data.status=='success'){
                            alert("核实成功");
                            $uibModalInstance.close();;
                        }else{
                            alert( "核实失败");
                        }
                    });
                }

                func.cancel = function(){
                    $uibModalInstance.dismiss('cancel');
                }
            }])
        // 查看提现历史详情
        .controller('ConsumeHistoryCtrl',['$scope','$rootScope','$location','financeApprService',
            function($scope,$rootScope,$location,financeApprService){

                var instalmentId = $location.search().instalmentId;
                //$rootScope.showheader = false;
                $rootScope.showmenus();
                vm = $scope.vm={};
                vm.isBack = false;
                vm.param={};
                vm.param.instalmentId = instalmentId;
                financeApprService.getConsumeApprovalDetail(vm.param).success(function(data){
                    vm.logDTO = data.data.orderInfo;
                    vm.logList = data.data.list;
                })
            }])
        .controller('WithdrawApprovalCtrl', ['$scope','$window','$location','$uibModal','financeApprService','commonService','commonTool',
            function($scope,$window,$location,$uibModal,service,commonService,commonTool){
                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                var paging =  $scope.paging = {
                    'page': 1,
                    'pageSize': 10,
                    "capitalTurnoverId":"",
                    'tranNo':"", // 交易流水
                    'sellerName':"" ,    // 卖家账号
                    "tranCur":"" ,   //交易币种
                    "withdrawCur":"",   //提现币种
                    "auditStatus":"",   //操作状态
                    "auditBy":"" ,   //审核人
                    "startTimes":"", //生成时间
                    "endTimes":"", //生成时间
                    "auditStart":"",    //审核时间
                    "auditEnd":""  //审核时间
                };
                // 转到第几页
                tools.newpagesize = null;

                // 1.查询条件初始化
                tools.initCondition = function(isOnload){
                    if(isOnload){
                        // 加载审核人
                        service.getAuditPerson().success(function(data){
                            vm.auditPerson = data.data;
                        });

                        // 加载支付方式
                        service.getPayMethod().success(function(data){
                            vm.payType= data.data;
                        });
                        // 设置页码
                        vm.pages = commonService.setPageSizeArray(10, 30, 50);
                        /*日期控件相关*/
                        $scope.dateOptions = {
                            formatYear: 'yy',
                            startingDay: 1
                        };
                        $scope.open1 = function($event) { // 创建open方法 。 下面默认行为并将opened 设为true
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.opened1 = true;
                            $scope.opened2 = false;
                            $scope.opened3 = false;
                            $scope.opened4 = false;
                        };
                        $scope.open2 = function($event) { // 创建open方法 。 下面默认行为并将opened 设为true
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.opened2 = true;
                            $scope.opened1 = false;
                            $scope.opened3 = false;
                            $scope.opened4 = false;
                        };
                        $scope.open3 = function($event) { // 创建open方法 。 下面默认行为并将opened 设为true
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.opened2 = false;
                            $scope.opened1 = false;
                            $scope.opened3 = true;
                            $scope.opened4 = false;
                        };
                        $scope.open4 = function($event) { // 创建open方法 。 下面默认行为并将opened 设为true
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.opened2 = false;
                            $scope.opened1 = false;
                            $scope.opened3 = false;
                            $scope.opened4 = true;
                        };
                    }else{
                        paging.page=1;
                        paging.pageSize=10;
                        paging.capitalTurnoverId="";
                        paging.tranNo="";
                        paging.sellerName="";
                        paging.tranCur = "";
                        paging.withdrawCur="";
                        paging.auditStatus="";
                        paging.auditBy="";
                        paging.startTimes="";
                        paging.endTimes="";
                        paging.auditStart="";
                        paging.auditEnd="";
                    }
                };
                // 2.查询列表
                tools.getList = function(){
                    service.getWithdrawCashList(commonTool.filterParam(paging)).success(function(data) {
                        if(data.status=='success'){
                            vm.items = data.data.items;
                        }
                        paging.total = data.data.total;
                    });
                };
                // 3.列表翻页
                tools.getnewpage = function() {
                    if (tools.newpagesize != null) {
                        paging.page = tools.newpagesize;
                        tools.getList();
                        vm.newpagesize = null;
                    }
                };
                // 设置汇率
                tools.setRate = function(){
                    var uibModalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'setExchangeRate.html',
                        controller: 'SetExchangeRateCtrl'

                    });
                    uibModalInstance.result.then(function(rs){
                            tools.getList();
                        }
                    );
                }
                // 审核
                tools.financeAudit = function(capitalTurnoverId,payLogActionId){
                   // console.log('eee'+capitalTurnoverId);
                    var uibModalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'financeWithdrawAudit.html',
                        controller: 'WithdrawAuditCtrl',
                        resolve: {
                            item: function () {
                                return {"capitalTurnoverId":capitalTurnoverId,"payLogActionId":payLogActionId};
                            }
                        }
                    });
                    uibModalInstance.result.then(function(rs){
                            tools.getList();
                        }
                    );
                };
                // 确认付款
                tools.confirmPay = function(index){
                    var temp = vm.items[index];
                    var uibModalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'financePayConfirm.html',
                        controller: 'WithdrawConfirmCtrl',//确认打款
                        resolve: {
                            item: function () {
                                return {"capitalTurnoverId":temp.capitalTurnoverId,
                                "payLogActionId":temp.payLogActionId,
                                "withdrawCurrency":temp.currency==temp.toCurrency?null:temp.toCurrency
                                //交易币==提现币种时,传null,不等时传交易币种
                                };
                            }
                        }
                    });
                    uibModalInstance.result.then(function(rs){
                            tools.getList();
                        }
                    );
                }
                // 查看历史
                tools.toHistory = function(capitalTurnoverId){
                    $window.open('/#/financeFunds/withdrawHistory?capitalTurnoverId='+capitalTurnoverId)
                }
                // 查看卖家虚拟帐户
                tools.toSellerVAccountDetail = function(sellerId){
                    $window.open('/#/financeFunds/sellerVAccountDetail?sellerId='+sellerId+"&isBack=0")
                }
                tools.initCondition(true);
                tools.getList();

            }])
        .controller('SetExchangeRateCtrl', ['$scope','$uibModalInstance','financeApprService','commonTool',
            function($scope,$uibModalInstance,service,commonTool){
                var vm = $scope.vm={};
                vm.item = {};
                var func = $scope.func ={};
                func.getRate = function(){
                    service.getExchangeRate().success(function(data) {
                        if(data.status=='success'){
                            vm.oldRate = data.data;
                            vm.item.us2cny = data.data;
                        }
                    });
                }
                func.save = function(isValid){
                    if(!isValid){
                        return;
                    }else if(vm.item == vm.oldRate){
                        alert( "保存成功");
                    }else{
                        service.setExchangeRate(vm.item).success(function(data) {
                            if(data.status=='success'){
                                alert("保存成功");
                                $uibModalInstance.close();;
                            }else{
                                alert( "保存失败");
                            }
                        });
                    }
                }

                func.cancel = function(){
                    $uibModalInstance.dismiss('cancel');
                }
                func.getRate();
            }])
        .controller('WithdrawAuditCtrl', ['$scope','$uibModalInstance','financeApprService','commonTool','item',
            function($scope,$uibModalInstance,service,commonTool,item){
                //console.log('000000');
                var vm = $scope.vm={};
                var func = $scope.func ={};
                //console.log(item);
                vm.item= item;
                vm.item.status = 2;    // 1:审核通过 0:待审核 2:审核不通过 3:提现成功
                func.save = function(isValid){
                    if(vm.item.status == 1){
                        vm.item.reason = "";
                    }else if(isValid == false){
                        // 审核结果为不通过时,一定要原因
                        return;
                    }
                    service.updateWithdrawCashStatus(vm.item).success(function(data) {
                        if(data.status=='success'){
                            alert("保存成功");
                            $uibModalInstance.close();;
                        }else{
                            alert( "保存失败");
                        }
                    });
                }

                func.cancel = function(){
                    $uibModalInstance.dismiss('cancel');
                }
            }])
        // 提款申请--确认付款
        .controller('WithdrawConfirmCtrl', ['$scope','$uibModalInstance','financeApprService','commonTool','item',
            function($scope,$uibModalInstance,service,commonTool,item){
                var vm = $scope.vm={};
                var func = $scope.func ={};
                vm.item= item;
                vm.withdrawCurrency =item.withdrawCurrency;// 提现币种和交易币种[USD]一致时,不显示实际金额信息
                func.save = function(isValid){
                    if(isValid == false){
                        return;
                    }
                   // console.log(vm.item);

                    service.withdrawConfirmPay(vm.item).success(function(data) {
                        if(data.status=='success'){
                            alert("保存成功");
                            $uibModalInstance.close();;
                        }else{
                            alert( "保存失败");
                        }
                    });
                }

                func.cancel = function(){
                    $uibModalInstance.dismiss('cancel');
                }
            }])
        // 查看提现历史详情
        .controller('WithdrawHistoryCtrl',['$scope','$rootScope','$location','financeApprService',
                function($scope,$rootScope,$location,financeApprService){
           //console.log(2333);
            var capitalTurnoverId = $location.search().capitalTurnoverId;
            //$rootScope.showheader = false;
            $rootScope.showmenus();
            vm = $scope.vm={};
            vm.param={};
            vm.param.capitalTurnoverId = capitalTurnoverId;
            financeApprService.getWithdrawCashDetail(vm.param).success(function(data){
                vm.logDTO = data.data.UserCapitalTurnoverLogDTO;
                vm.logList = data.data.list;
            })
        }])
        .filter('financeAuditType',function(){
            return function (status) {
                var statusName = "";
                switch(status){
                    case 0: statusName="不通过";break;
                    case 1: statusName="通过";break;
                    case 2: statusName="待审核";break;
                    case 3: statusName="待再次审核";break;
                    case 8: statusName="待交易完成";break;
                    case 9: statusName="待核实";break;
                    default :break;
                }
                return statusName;
            }
        })
        .filter('withdrawnAuditType',function(){
            return function (status) {
                var statusName = "";
                //1:审核通过 0:待审核 2:审核不通过 3:提现成功
                switch(status){
                    case 0: statusName="待审核";break;
                    case 1: statusName="审核通过";break;
                    case 2: statusName="审核不通过";break;
                    case 3: statusName="提现成功";break;
                    default :break;
                }
                return statusName;
            }
        })

})