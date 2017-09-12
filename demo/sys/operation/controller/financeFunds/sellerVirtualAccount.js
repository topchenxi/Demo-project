define(['../module'],function(ng){
    ng
        .factory('sellerVAccountService', ['$http', 'api', function($http, api){
            return {
                // 查询卖家虚拟账户列表
                getSellerVAcountList:function(params){
                    return $http.get(api.getSellerVAcountList, {
                        'params': params
                    });
                },
                // 查询卖家虚拟账户详情列表
                getSellerVAcountMain:function(param){
                    return $http.get(api.getSellerVAcountMain,{'params':param});
                },
                // 银行入账流水-汇款-查询条件
                getTTPaging:function(){
                    var paging = {};
                    paging.page=1;
                    paging.pageSize=10;
                    paging.remCur=""; // 交易币种
                    paging.revCur="";   // 入账币种
                    paging.remMode = "";    // 支付方式
                    paging.remType="";  // 支付种类
                    paging.remName="";  //汇款人
                    paging.outRef = ""; //业务编号
                    paging.txnStartTimes="";    //交易时间-start txn_date
                    paging.txnEndTimes="";  //交易时间-end
                    return paging;
                },
                // 银行入账流水-汇款
                getTTLogList:function(params){
                    return $http.get(api.getTTLogList, {
                        'params': params
                    });
                },
                getTTLogDetail:function(outRef){
                    return $http.get(api.getTTLogDetail,{'params':{'outRef':outRef}});
                },
                exportTTLogList:function(params){
                    return $http({method: 'post',url:api.exportTTLogList,params:params, responseType: 'arraybuffer'});
                },
                // 银行入账流水-信用证-查询参数
                getLCPaging:function(){
                    var paging = {};
                    paging.page=1;
                    paging.pageSize=10;
                    paging.lcCcy=""; // 支付币种
                    paging.issueBkNmAdd="";   // 支付渠道
                    paging.lcForm = "";    // 支付种类
                    paging.lcNo="";  // 信用证号码
                    paging.advStartTimes="";  //交易时间-起
                    paging.advEndTimes = ""; //交易时间-end
                    paging.issueStartTime="";    //开证时间-start
                    paging.issueEndTime="";  //开证时间-end
                    return paging;
                },
                // 银行入账流水-信用证
                getLCLogList:function(params){
                    return $http.get(api.getLCLogList, {
                        'params': params
                    });
                },
                getLCLogDetail:function(creditId){
                    return $http.get(api.getLCLogDetail,{'params':{'creditId':creditId}});
                },
                exportLCLogList:function(params){
                    return $http({method: 'post',url:api.exportLCLogList,params:params, responseType: 'arraybuffer'});
                }
            }

        }])
        .controller('SellerVirtualAccountCtrl', ['$scope','$location','$uibModal','sellerVAccountService','commonService','commonTool',
            function($scope,$location,$uibModal,service,commonService,commonTool){
                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                var paging =  $scope.paging = {
                    'page': 1,
                    'pageSize': 10,
                    'companyName':"", // 公司名称
                    'virtualAcount':"" ,    // 虚拟账户
                    "minAmount":"" ,   //账户余额-最小
                    "maxAmount":"",   //账户余额-最大
                    "currency":"USD" //交易币种
                };
                // 设置页码
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
                // 转到第几页
                tools.newpagesize = null;
                //console.log(122)
                // 1.查询条件初始化
                tools.initCondition = function(){
                        paging.page=1;
                        paging.pageSize=10;
                        paging.companyName="";
                        paging.virtualAcount="";
                        paging.minAmount = "";
                        paging.maxAmount="";
                        paging.currency="USD";

                };
                // 2.查询列表
                tools.getList = function(){
                    service.getSellerVAcountList(commonTool.filterParam(paging)).success(function(data) {
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
                        tools.newpagesize = null;
                    }
                };

                // 4.详情
                tools.toDetail= function(index){
                    var item = vm.items[index];
                    $location.path('/financeFunds/sellerVAccountDetail').search({
                        'sellerId': item.sellerId,
                        /*'companyName':item.companyName,
                        'virtualAcount':item.virtualAcount,*/
                        'isBack':1
                    });
                }



                tools.getList();

            }])
        .controller('SellerVAccountDetailCtrl', ['$rootScope','$scope','$window','$location','sellerVAccountService','commonService','commonTool',
            function($rootScope,$scope,$window,$location,service,commonService,commonTool){
                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                vm.info = $location.search();
                var paging =  $scope.paging = {
                    'page': 1,
                    'pageSize': 10,
                    'sellerId':$location.search().sellerId,
                    'type':"", // 公司名称
                    'currency':"" ,    // 虚拟账户
                    "startTime":"" ,   //账户余额-最小
                    "endTime":""   //账户余额-最大
                };
                // 转到第几页
                tools.newpagesize = null;
                // 1.查询条件初始化
                tools.initCondition = function(isLoad){
                    if(isLoad){
                        if(vm.info.isBack==0){
                            //$rootScope.showheader = false;
                            $rootScope.showmenus();
                        }
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
                    }else{
                        paging.page=1;
                        paging.pageSize=10;
                        paging.type="";
                        paging.currency="";
                        paging.startTime = "";
                        paging.endTime="";
                    }
                };
                // 2.查询列表
                tools.getList = function(){
                    //console.log(paging);
                    service.getSellerVAcountMain(commonTool.filterParam(paging)).success(function(data) {
                        if(data.status=='success'){
                            vm.mainInfo = data.data.VirtualAmount;
                            vm.companyName = data.data.companyName;
                            vm.email = data.data.email;
                            vm.items = data.data.pages.items;
                        }
                        paging.total = data.data.pages.total;
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
                tools.back=function(){
                    $window.history.back();
                }

                tools.initCondition(true);
                tools.getList();
            }])
        // 银行入账流水-信用证LC
        .controller('BankInCreditCtrl', ['$scope','$location','$controller','sellerVAccountService','commonTool',
            function($scope,$location,$controller,service,commonTool){
                // 继承
                $controller('baseListController', { $scope: $scope });
                var tools = $scope.tools;
                var vm = $scope.vm;
                var paging =  $scope.paging = service.getLCPaging();

                // 1.查询条件初始化
                tools.initCondition = function(isLoad){
                    if(isLoad){
                        tools.baseInit({'datePicker':4})
                    }else{
                        paging = $scope.paging = service.getLCPaging();
                    }
                };

                // 2.查询列表
                tools.getList = function(){
                    service.getLCLogList(commonTool.filterParam(paging)).success(function(data) {
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
                        tools.newpagesize = null;
                    }
                };

                // 4.详情
                tools.toDetail= function(creditId){
                    $location.path('/financeFunds/bankInCreditDetail').search({
                        'creditId': creditId
                    });
                }
                // 导出excel
                tools.exportData= function(){
                    service.exportLCLogList(commonTool.filterParam(paging)).success(function(data){
                        var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                        var objectUrl = URL.createObjectURL(blob);
                        window.open(objectUrl);
                    });
                }
                tools.initCondition(true);
                tools.getList();

            }])
        // 信用证LC--详情
        .controller('BankInCreditDetailCtrl', ['$scope','$window', '$location', 'sellerVAccountService',
            function($scope,$window, $location, service) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};

                var creditId = $location.search().creditId;
                // 获取买家详情
                tools.getLCLogDetail = function() {
                    service.getLCLogDetail(creditId).success(function(data) {
                        if ('success' == data.status) {
                            vm.item = data.data;
                        } else {
                            alert(data.message);
                        }
                    })
                };
                tools.getLCLogDetail();
                // 跳转买家列表页面
                tools.getback = function() {
                    //$location.path('/financeFunds/bankInCredit')
                    $window.history.back();

                };
            }
        ])
        // 汇款-TT
        .controller('BankInRemitCtrl', ['$scope','$location','$controller','sellerVAccountService','commonService','commonTool',
            function($scope,$location,$controller,service,commonService,commonTool){
                // 继承
                $controller('baseListController', { $scope: $scope });
                var tools = $scope.tools;
                var vm = $scope.vm;
                var paging =  $scope.paging = service.getTTPaging();
                // 转到第几页
                tools.newpagesize = null;
                // 1.查询条件初始化
                tools.initCondition = function(isLoad){
                    if(isLoad){
                        tools.baseInit({'datePicker':2})
                    }else{
                        paging =  $scope.paging = service.getTTPaging();
                    }
                };
                // 2.查询列表
                tools.getList = function(){
                    service.getTTLogList(commonTool.filterParam(paging)).success(function(data) {
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
                // 4.详情
                tools.toDetail= function(outRef){
                    $location.path('/financeFunds/bankInRemitDetail').search({
                        'outRef': outRef
                    });
                }
                // 导出excel
                tools.exportData= function(){
                    service.exportTTLogList(commonTool.filterParam(paging)).success(function(data){
                        var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                        var objectUrl = URL.createObjectURL(blob);
                        window.open(objectUrl);
                    });
                }
                tools.initCondition(true);
                tools.getList();

        }])
        // 汇款TT--详情
        .controller('BankInRemitDetailCtrl', ['$scope','$window', '$location', 'sellerVAccountService',
            function($scope,$window, $location, service) {

                var vm = $scope.vm = {};
                var tools = $scope.tools = {};

                var outRef = $location.search().outRef;
                // 获取买家详情
                tools.getTTLogDetail = function() {
                    service.getTTLogDetail(outRef).success(function(data) {
                        if ('success' == data.status) {
                            vm.item = data.data;
                        } else {
                            alert(data.message);
                        }
                    })
                };
                tools.getTTLogDetail();
                // 跳转买家列表页面
                tools.getback = function() {
                    $window.history.back();
                };
            }
        ])
        .filter('capitalType',function(){
            return function (status) {
                var statusName = "";
                //资金类型,0:流入;1:流出
                switch(status){
                    case 0: statusName="流入";break;
                    case 1: statusName="流出";break;
                    default :break;
                }
                return statusName;
            }
        })
        .filter('tradeType',function(){
            return function (status) {
                var statusName = "";
                //交易类型 0:卖家提现,1:卖家充值,2:投广告,3:消费
                switch(status){
                    case 0: statusName="卖家提现";break;
                    case 1: statusName="卖家充值";break;
                    case 2: statusName="投广告";break;
                    case 3: statusName="消费";break;
                    default :break;
                }
                return statusName;
            }
        })
        // 汇款方式
        .filter('remitMode',function(){
            return function (status) {
                var statusName = "";
                //汇款方式，1：电汇，2：票汇
                switch(status){
                    case 2: statusName="汇款(D/D)";break;
                    case 1: statusName="电汇(T/T)";break;
                    default :break;
                }
                return statusName;
            }
        })
        // 汇款种类
        .filter('remitType',function(){
            return function (status) {
                var statusName = "";
                //1：国外汇款，2：国内汇款
                switch(status){
                    case 2: statusName="国内汇款";break;
                    case 1: statusName="国外汇款";break;
                    default :break;
                }
                return statusName;
            }
        })
})