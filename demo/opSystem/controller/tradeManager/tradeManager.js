/**
 * Created by Lenovo on 2015/7/20.
 */

define(['../module'],function(ng){
    ng
        //交易管理
        .controller('tradeManagerCtrl',['$scope', '$rootScope','$location','classifyService','$http',
            function($scope, $rootScope,$location,classifyService,$http){
                // 产品数据
                var vm = $scope.vm = {};

                // 页面其他数据，方法
                var tools = $scope.tools = {};

                var paging = $scope.paging = {
                    //状态 -新增：0 ; 修改：1 ; 审核中（待审核）: 2 ; 审核通过：3 ; 审核不通过：-1 ;
                    //上线：9 ; 下线：10 ; 删除：-3 ; 商机异常（待审核）：-4 ; 商机异常（审核不通过）：-5 ;
                    'auditStatus': 2,
                    'page': 1,
                    'pageSize': 10,

                    /*搜索参数*/
                    'companyName': null, //公司名称
                    'startDate': null,
                    'endDate': null
                };
                paging.total = 30;
                /*日期控件相关*/
                $scope.maxDate = new Date();

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                tools.pages = [{
                    "pageSize": 10,
                    "pagename": "显示10条"
                }, {
                    "pageSize": 20,
                    "pagename": "显示20条"
                }, {
                    "pageSize": 30,
                    "pagename": "显示30条"
                }];

                $scope.clear = function() { //当运行clear的时候将dt置为空
                    $scope.company.establishYear = null;
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
                    $scope.opened2 = true;
                    $scope.opened1 = false;
                };

                $scope.disabled = function(date, mode) {
                    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
                };

                tools.search = function() {
                    console.log(paging.companyName);
                    console.log(paging.startDate);
                    console.log(paging.endDate);
                    tools.getSellerIdentity();
                };
            }])

        //消费类——渠道流入资金
        .controller('consumePiplineCtrl',['$scope', '$rootScope','$location','classifyService','$http',
            function($scope, $rootScope,$location,classifyService,$http){
                // 页面其他数据，方法
                var tools = $scope.tools = {};

                /*日期控件相关*/
                $scope.maxDate = new Date();

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                tools.pages = [{
                    "pageSize": 10,
                    "pagename": "显示10条"
                }, {
                    "pageSize": 20,
                    "pagename": "显示20条"
                }, {
                    "pageSize": 30,
                    "pagename": "显示30条"
                }];

                $scope.clear = function() { //当运行clear的时候将dt置为空
                    $scope.company.establishYear = null;
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
                    $scope.opened2 = true;
                    $scope.opened1 = false;
                };

                $scope.disabled = function(date, mode) {
                    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
                };

                tools.search = function() {

                    console.log(paging.companyName);
                    console.log(paging.startDate);
                    console.log(paging.endDate);
                    tools.getSellerIdentity();
                };
            }])

        //消费类——卖家虚拟账户流入资金
        .controller('consumeSellerCtrl',['$scope', '$rootScope','$location','classifyService','$http',
            function($scope, $rootScope,$location,classifyService,$http){
                // 页面其他数据，方法
                var tools = $scope.tools = {};

                /*日期控件相关*/
                $scope.maxDate = new Date();

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                tools.pages = [{
                    "pageSize": 10,
                    "pagename": "显示10条"
                }, {
                    "pageSize": 20,
                    "pagename": "显示20条"
                }, {
                    "pageSize": 30,
                    "pagename": "显示30条"
                }];

                $scope.clear = function() { //当运行clear的时候将dt置为空
                    $scope.company.establishYear = null;
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
                    $scope.opened2 = true;
                    $scope.opened1 = false;
                };

                $scope.disabled = function(date, mode) {
                    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
                };

                tools.search = function() {

                    console.log(paging.companyName);
                    console.log(paging.startDate);
                    console.log(paging.endDate);
                    tools.getSellerIdentity();
                };
            }])

        //提现——卖家虚拟账户资金申请
        .controller('withdrawSellerApplyCtrl',['$scope', '$rootScope','$location','classifyService','$http',
            function($scope, $rootScope,$location,classifyService,$http){
                // 页面其他数据，方法
                var tools = $scope.tools = {};

                /*日期控件相关*/
                $scope.maxDate = new Date();

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                tools.pages = [{
                    "pageSize": 10,
                    "pagename": "显示10条"
                }, {
                    "pageSize": 20,
                    "pagename": "显示20条"
                }, {
                    "pageSize": 30,
                    "pagename": "显示30条"
                }];

                $scope.clear = function() { //当运行clear的时候将dt置为空
                    $scope.company.establishYear = null;
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
                    $scope.opened2 = true;
                    $scope.opened1 = false;
                };

                $scope.disabled = function(date, mode) {
                    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
                };

                tools.search = function() {

                    console.log(paging.companyName);
                    console.log(paging.startDate);
                    console.log(paging.endDate);
                    tools.getSellerIdentity();
                };
            }])

        //提现——待打款给卖家资金
        .controller('withdrawPaySellerCtrl',['$scope', '$rootScope','$location','classifyService','$http',
            function($scope, $rootScope,$location,classifyService,$http){
                // 页面其他数据，方法
                var tools = $scope.tools = {};

                /*日期控件相关*/
                $scope.maxDate = new Date();

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                tools.pages = [{
                    "pageSize": 10,
                    "pagename": "显示10条"
                }, {
                    "pageSize": 20,
                    "pagename": "显示20条"
                }, {
                    "pageSize": 30,
                    "pagename": "显示30条"
                }];

                $scope.clear = function() { //当运行clear的时候将dt置为空
                    $scope.company.establishYear = null;
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
                    $scope.opened2 = true;
                    $scope.opened1 = false;
                };

                $scope.disabled = function(date, mode) {
                    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
                };

                tools.search = function() {

                    console.log(paging.companyName);
                    console.log(paging.startDate);
                    console.log(paging.endDate);
                    tools.getSellerIdentity();
                };
            }])

        //提现——待打款给买家资金
        .controller('withdrawPayBuyerCtrl',['$scope', '$rootScope','$location','classifyService','$http',
            function($scope, $rootScope,$location,classifyService,$http){
                // 页面其他数据，方法
                var tools = $scope.tools = {};

                /*日期控件相关*/
                $scope.maxDate = new Date();

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                tools.pages = [{
                    "pageSize": 10,
                    "pagename": "显示10条"
                }, {
                    "pageSize": 20,
                    "pagename": "显示20条"
                }, {
                    "pageSize": 30,
                    "pagename": "显示30条"
                }];

                $scope.clear = function() { //当运行clear的时候将dt置为空
                    $scope.company.establishYear = null;
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
                    $scope.opened2 = true;
                    $scope.opened1 = false;
                };

                $scope.disabled = function(date, mode) {
                    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
                };

                tools.search = function() {

                    console.log(paging.companyName);
                    console.log(paging.startDate);
                    console.log(paging.endDate);
                    tools.getSellerIdentity();
                };
            }])

        //退款——卖家虚拟账户退款记录
        .controller('refundSellerCtrl',['$scope', '$rootScope','$location','classifyService','$http',
            function($scope, $rootScope,$location,classifyService,$http){
                // 页面其他数据，方法
                var tools = $scope.tools = {};

                /*日期控件相关*/
                $scope.maxDate = new Date();

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                tools.pages = [{
                    "pageSize": 10,
                    "pagename": "显示10条"
                }, {
                    "pageSize": 20,
                    "pagename": "显示20条"
                }, {
                    "pageSize": 30,
                    "pagename": "显示30条"
                }];

                $scope.clear = function() { //当运行clear的时候将dt置为空
                    $scope.company.establishYear = null;
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
                    $scope.opened2 = true;
                    $scope.opened1 = false;
                };

                $scope.disabled = function(date, mode) {
                    return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
                };

                tools.search = function() {

                    console.log(paging.companyName);
                    console.log(paging.startDate);
                    console.log(paging.endDate);
                    tools.getSellerIdentity();
                };
            }])
});