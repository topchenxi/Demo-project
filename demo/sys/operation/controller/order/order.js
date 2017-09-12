define(['../module'],function(ng){
	ng
    .factory('orderService', ['$http', 'api', function($http, api){
        return {
            getOrderList:function(params){
                return $http.get(api.getOrderList, {
                        'params': params
                    });
            },
            getOrderDetail:function(params){
                return $http.get(api.getOrderDetail,{'params': params});
            },
            getOrderDetailForOffline:function(params){
                return $http.get(api.getOrderDetailForOffline,{'params': params});
            },
            getOrderStatusList:function(){
                return $http.get(api.getOrderStatusList);
            }
        }

    }])
	.controller('OrderListCtrl', ['$scope','$location','orderService','commonService','commonTool', 
        function($scope,$location,orderService,commonService,commonTool){
		var tools = $scope.tools = {};
        var vm = $scope.vm = {};
        var paging =  $scope.paging = {
            'page': 1,
            'pageSize': 10,

            'orderId':"",
            'companyEnName':"",
            'companyName':"",
            /*0:待支付, 1:已支付, 2:待收货, 3:已发货, 4:交易完成, 5:待评价, 6:交易结束, 7:纠纷, 8:待退款, 9:已退款, 10:关闭*/
            'orderStatus':'',
            'startDate':'',
            'endDate':''

        }
        tools.newpagesize = null;
    
        // 1.查询条件初始化
        tools.initCondition = function(isLoad){
            if(isLoad == true){
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
                };
                $scope.open2 = function($event) { // 创建open方法 。 下面默认行为并将opened 设为true
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened1 = false;
                    $scope.opened2 = true;
                };
                // 订单状态
                orderService.getOrderStatusList().success(function(data){
                    vm.orderStatusList= data.data;
                    console.log(vm.orderStatusList)
                });
            }else{
                paging.page=1;

                paging.orderId = "";
                paging.companyEnName = "";
                paging.companyName = "";
                paging.orderStatus = "";
                paging.startDate = "";
                paging.endDate = "";
            }

        }
        // 2.查询订单列表
        tools.getOrderList = function(){
            orderService.getOrderList(commonTool.filterParam(paging)).success(function(data) {
                vm.items = data.page.items;
                var item=null;
                // 加上isShowChildren 默认false
                // 加上detailType 
                    //多个商品拆分子订单:2
                    //单个商品拆分子订单:1
                    //不拆分的:0
                for(var i=0;i<vm.items.length;i++){
                    item = vm.items[i];
                    var isShowChildren = false;
                    var subs = item.orderSubItemList;
                    var detailType=0;   // 默认不拆单,即只有一个子订单
                    if(subs.length>1){
                        //TODO 一期不做订单拆分
                    }
                    vm.items[i].detailType=detailType;
                    vm.items[i].isShowChildren=isShowChildren;
                }
                //console.log(vm.items);
                paging.total = data.page.total;
                //console.log('paging.total',paging.total);
            });
        }
        // 3.列表翻页
        tools.getnewpage = function() {
            if (tools.newpagesize != null) {
                paging.page = vm.newpagesize;
                tools.getOrderList();
                vm.newpagesize = null;
            }
        };
        // 4.打开or折叠子订单
        tools.downUp = function(index){
            vm.items[index].isShowChildren = (!vm.items[index].isShowChildren);
        }

        // 5.关闭订单
        tools.closeOrder = function(){
            console.log("关闭订单先不做");
        }
        // 6.解决纠纷
        tools.solveOrder = function(){
            console.log("解决纠纷先不做");
        }
        // 7.查看订单or子订单详情
        tools.showDetail = function(orderId,childOrderId,payType,detailType){
            console.log("orderId="+orderId+";childOrderId="+childOrderId+";payType="+payType+";detailType="+detailType);
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
                'payType':payType,  //0:普通线上支付 1:线上分期付款 2:线下支付
                'detailType':detailType
            })
        };
        
        tools.initCondition(true);
        tools.getOrderList();


	}])	

	.controller('OrderDetailCtrl', ['$scope','$location','$window','orderService','commonTool','$uibModal',
            function($scope,$location,$window,orderService,commonTool,$uibModal){
        var tools = $scope.tools = {} ;
        var vm = $scope.vm={};
        var param = $scope.param={};
        param.orderId = $location.search().orderId;
        param.childOrderId = $location.search().childOrderId;
        param.payType = $location.search().payType;
        var detailType = $location.search().detailType;
        // 查询详情
        tools.getOrderDetail = function(){
            // 线下
            if(param.payType==2){
                //param.remove('payType');
                orderService.getOrderDetailForOffline(param).success(function(data) {
                    if(data.status=='success'){
                        vm.logistics = data.data.logistics;
                        vm.audits = data.data.audits;   //异议信息
                        vm.seller = data.data.seller;
                        vm.order = data.data.order;
                        vm.orderProducts = data.data.order.orderSubItemList[0].orderProductList;
                        // 分期信息 vm.orderInstalmentDTOs
                        var _instalments = data.data.order.orderInstalmentDTOs;
                        // 支付凭证信息
                        var _vouchers=data.data.order.orderVoucherImgDTOs;
                        /*分期-凭证信息匹配整合*/
                        for(var i=0;i<_instalments.length;i++){
                            var stageNumber = _instalments[i].stageNumber;
                            _instalments[i].vouchers=[];
                            for(var j=0;j<_vouchers.length;j++){
                                if(stageNumber == _vouchers[j].stageNumber){
                                    _instalments[i].vouchers.push(_vouchers[j]);
                                }
                            }
                            // 历史审核记录是否隐藏
                            _instalments[i]._isCollapsed = true;
                        }
                        vm.orderInstalmentDTOs = _instalments;
                        vm._payType = "一次付清";
                        if(vm.orderInstalmentDTOs.length>1){
                            vm._payType = "分期支付";
                        }
                        console.log(vm.orderInstalmentDTOs)
                        // 合同信息
                        vm.contractInfo = {};
                        var t= data.data.order.orderContractDTOs;
                        if(t != null && t.length>0){
                            //console.log(t[0])
                            //最新合同是卖家上传
                            if(!commonTool.isEmpty(t[0].sellerContractName)){
                                vm.contractInfo.name = t[0].sellerContractName;
                                vm.contractInfo.path = t[0].sellerContractPath;
                                vm.contractInfo.time = t[0].sellerUploadTime;
                            }else{
                                vm.contractInfo.name = t[0].buyerContractName;
                                vm.contractInfo.path = t[0].buyerContractPath;
                                vm.contractInfo.time = t[0].buyerUploadTime;
                            }

                        }else{
                            vm.contractInfo = null;
                        }
                       // console.log(vm.contractInfo )

                    }
                });
            }else{
                orderService.getOrderDetail(param).success(function(data) {
                    if(data.status=='success'){
                        vm.order = data.data.order;
                        vm.orderProducts = data.data.order.orderSubItemList[0].orderProductList;
                    }
                });
            }
        }
        tools.preview = function(url){
            window.open(imgUrl+url);
        }
        tools.downLoad = function(url){
            //Upload.
            window.open(imgUrl+url);
        }
        tools.enLarge = function(str_img) {
            //console.log(str_img);
            $scope.str_img = str_img;
            $uibModal.open({
                animation: true,
                templateUrl: 'enlarge.html',
                controller: 'SqEnLargeCtrl',
                size: '',
                scope: $scope,
                resolve: {
                    index: function() {
                        return -1;
                    }
                }
            })
        }
        // 返回
        tools.back = function(){
            $window.history.back();
        }
        tools.getOrderDetail();
	}])
    .controller('SqEnLargeCtrl', ['$scope', '$location', '$uibModalInstance',
        function($scope, $location, $uibModalInstance) {
            $scope.en_img = $scope.str_img;
            $scope.turnBack = function() {
                $uibModalInstance.dismiss('cancel');
            }
        }
    ])
    .filter('subOrderStatus',function(){
        return function(status){
            var statusName = "";
            switch(status){
                case 0: statusName="未确认";break;
                case 1: statusName="已确认";break;
                case 2: statusName="已取消";break;
                case 3: statusName="无效";break;
                case 4: statusName="退货";break;
                default:statusName = status;break;
            }
            return statusName;
        }
    })
    // 分期付款-支付状态 1:通过 0:不通过；2：待审核；3：再次审核 4:未上传
    .filter('payStatus',function(){
        return function(status){
            var statusName = "";
            switch(status){
                case 1: statusName="支付成功";break;
                case 0: statusName="支付审核不通过";break;
                case 2: statusName="支付待审核";break;
                case 3: statusName="支付再次待审核";break;
                case 4: statusName="未支付";break;
                default:statusName = status;break;
            }
            return statusName;
        }
    })
})