define(['../module'],function(ng){
	ng
    .factory('logistService', ['$http', 'api', function($http, api){
        return {
            getPaging:function(){
                var page = {};
                page.page = 1;
                page.pageSize = 10;
                page.companyName = "";  //公司名
                page.shippingNo = "";   //物流订单号
                page.orderNo  = ""; //订单号
                page.countryId ="";   //国家
                page.province="";   //省
                page.city="";   //市
                page.cooperatorName=""; //物流供应商
                page.dateStart="";  //开始时间
                page.dateEnd = "";  //结束时间
                return page;
            },
            getLogistList:function(params){
                return $http.get(api.getLogistList, {
                        'params': params
                    });
            },
            getLogistDetail:function(params){
                return $http.get(api.getLogistDetail,{'params': params});
            }
            ,exportLogistList:function(params){
                return $http({method: 'post',url:api.exportLogistList,params:params, responseType: 'arraybuffer'});
            }

        }
    }])
	.controller('LogistListCtrl', ['$scope','$location','$controller','logistService','commonService','commonTool',
        function($scope,$location,$controller,service,commonService,commonTool){
        // 继承
            $controller('baseListController', { $scope: $scope });
            var tools = $scope.tools;
            var vm = $scope.vm;
            var paging =  $scope.paging = service.getPaging();
            // 转到第几页
            tools.newpagesize = null;

            // 1.查询条件初始化
        tools.initCondition = function(isOnload){
            if(isOnload){
                tools.baseInit({'datePicker':2})
               // 加载国家
                vm.countryList = tools.baseGetContries();
               // 加载省
                vm.provinceList = tools.baseGetProvinces();
                //console.log(vm.provinceList[0])
            }else{
                paging =  $scope.paging = service.getPaging();
            }
        };
        //2. 省市联动
        tools.changeProvince = function(){
            paging.city="";
            if(commonTool.isEmpty(paging.province)){
                vm.cityList = "";
            }else{
                commonService.getCity(paging.province).success(function(data){
                    if(data.status =='success'){
                        vm.cityList= data.data;
                    }
                })
            }
        }
        // 3.查询列表
        tools.getList = function(){
            service.getLogistList(commonTool.filterParam(paging)).success(function(data) {
            	if(data.status=='success'){
            		vm.items = data.page.items;
            	}
                paging.total = data.page.total;
            });
        };
        // 4.导出
        tools.exportData = function(){
            service.exportLogistList(commonTool.filterParam(paging),true).success(function(data){
                var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                var objectUrl = URL.createObjectURL(blob);
                window.open(objectUrl);
            });
        }
        // 5.列表翻页
        tools.getnewpage = function() {
            if (tools.newpagesize != null) {
                paging.page = tools.newpagesize;
                tools.getList();
                tools.newpagesize = null;
            }
        };
        // 6.查看详情
        tools.toshowDetail = function(orderNo,shippingId){
            var type=1;

            // 空运
            if(type==1){
                $location.path('/logistics/logistDetail').search({
                    'orderNo':orderNo,
                    "shippingId":shippingId
                })
            }
            /*
            else{
                // 海运
                $location.path('/logistics/logistDetailBoat').search({
                    'id':id
                })
            }*/

        };

        tools.initCondition(true);
        tools.getList();

	}])
	.controller('LogistDetailCtrl', ['$scope','$location','$window','$controller','logistService','orderService','commonTool',
            function($scope,$location,$window,$controller,service,orderService,commonTool){
        // 继承
        $controller('baseDetailController', { $scope: $scope });
        var tools = $scope.tools;
        var vm = $scope.vm={};
        var param = $location.search();
        // 查询详情
        tools.getDetail = function(){
            service.getLogistDetail(param).success(function(data) {
                if(data.status=='success'){
                    vm.item = data.data;
                }
            });
        }
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

        // 返回
        tools.back = function(){
            $window.history.back();
        }
        tools.getDetail();
	}])
        .filter('transStatus',function(){
            return function (status) {
                var statusName = "";
                switch(status){
                    case 0: statusName="草稿";break;
                    case 1: statusName="生效";break;
                    default :break;
                }
                return statusName;
            }
        })
  
})