        /**
         * Created by LeeBoo on 2015/7/14.
         */
        define(['../module', 'jquery'], function(ng, $) {
            ng
                .factory('classifyService', ['$http', 'api', function($http, api) {
                    return {
                        //人民币和外币账号添加和修改审核接口
                        getRMBAccount: function(params) {
                            return $http.get(api.RMBAccount, {
                                'params': params
                            });
                        },

                        //人民币和外币账号添加和修改详情审核接口
                        getRMBDetail: function(params) {
                            return $http.get(api.RMBDetail, {
                                'params': params
                            });
                        },

                        //人民币和外币审核不通过弹出窗接口
                        postRMBDetail: function(params) {
                            return $http.post(api.postRMBDetail, params);
                        },

                        //虚拟账号接口
                        getFictitiousAccount: function(params) {
                            return $http.get(api.fictitiousAccount, {
                                'params': params
                            });
                        },

                        //虚拟账号详情接口
                        getFictitiousDetail: function(params) {
                            return $http.get(api.fictitiousAccountDetail, {
                                'params': params
                            });
                        }
                    };
                }])

            //人民币审核页面
            .controller('RMBAccountCtrl', ['$scope', '$rootScope', '$location', 'classifyService', '$http',
                function($scope, $rootScope, $location, classifyService, $http) {

                    var vm = $scope.vm = {};
                    var tools = $scope.tools = {};
                    tools.hideButton = false;
                    tools.color1 = {
                        background: '#e04d2c',
                        color: 'white'
                    };
                    tools.color2 = {};
                    tools.color3 = {};
                    var paging = $scope.paging = {
                        'page': 1,
                        'pageSize': 10,
                        //国内银行1海外银行0
                        'bankType': 1,
                        //审核状态
                        'status': 0,
                        //绑定0修改1
                       // 'auditType': 0,
                        //搜索参数
                        'companyName': null,
                        'name': null,
                        //审核不通过原因
                        'remark': null
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

                    //手动输入页码跳转页面
                    tools.getnewpage = function() {

                        if (tools.newpagesize == null) {
                            alert("页码不存在！")
                        } else {
                            paging.page = tools.newpagesize;
                            tools.getNextPage();
                            tools.newpagesize = null;
                        }
                    };
                    //页面切换
                    tools.getclassifyList = function() {
                        classifyService.getClassifyList(paging)
                            .success(function(data) {
                                if ('success' === data.status) {
                                    vm.items = data.data;
                                    paging.total = data.page.total;
                                }
                            })
                    };

                    tools.getNextPage = function() {
                        classifyService.getRMBAccount(paging)
                            .success(function(data) {
                                vm.items = data.data.items;
                                paging.total = data.data.total;
                            });
                    };

                    tools.getNextPage();

                    tools.showBuyerDetail = function(auditId, flag) {
                        $location.path('/sellerAccount/RMBDetail').search({
                            'auditId': auditId,
                            'flag': flag
                        });
                    };

                    //搜索数据
                    vm.searchMsg = function() {
                        if (paging.name == '') {
                            paging.name = null;
                        }
                        if (paging.companyName == '') {
                            paging.companyName = null;
                        }
                        paging.total = 0;
                        classifyService.getRMBAccount(paging)
                            .success(function(data) {
                                vm.items = data.data.items;
                                paging.total = data.page.total;
                            });
                    };

                    vm.change1 = function() {
                        tools.color1 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.color2 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color3 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.hideButton = false;
                        //请求数据
                        paging.status = 0;
                        delete paging.total;
                        tools.getNextPage();

                        $('.j-opera').show();
                    };
                    vm.change2 = function() {
                        tools.color1 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color2 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.color3 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.hideButton = true;
                        //请求数据
                        paging.status = 1;
                        delete paging.total;
                        tools.getNextPage();

                        $('.j-opera').hide();
                    };
                    vm.change3 = function() {
                        tools.color1 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color2 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color3 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.hideButton = true;
                        //请求数据
                        paging.status = -1;
                        delete paging.total;
                        tools.getNextPage();

                        $('.j-opera').hide();
                    };
                }
            ])

            //人民币审核详情页面
            .controller('RMBDetailCtrl', ['$scope', '$rootScope', '$location', '$http', 'classifyService', '$uibModal', 'api',
                function($scope, $rootScope, $location, $http, classifyService, $uibModal, $api) {
                    var tools = $scope.tools = {};
                    //获取参数
                    var search = $location.search();
                    //得到id,flag
                    var id = parseInt(search.id);
                    var vm = $scope.vm = {};
                    //userType,bankType,auditId,bankCardId
                    var params = {
                        'auditId': $location.search().auditId
                    };

                    //审核通过传递对象
                    var pass = {
                        'auditId': $location.search().auditId,
                        'status': 1,
                        'remark': null,
						'bankType':1
                    };


                    //请求点击条目的详细信息
                    tools.apply = function() {
                        classifyService.getRMBDetail(params)
                            .success(function(data) {
                                vm.user = data.data.user;
                                vm.bankCardHCA = data.data.bankCardHCA;
                                vm.bcAudit = data.data.bcAudit;
                                var flag = vm.bcAudit.status;
                                if (flag == 0) {
                                    vm.bcAudit.status = "待审核";
                                } else if (flag == 1) {
                                    vm.bcAudit.status = "审核通过";
                                } else if (flag == -1) {
                                    vm.bcAudit.status = "审核不通过";
                                } else {
                                    vm.bcAudit.status = null;
                                }
                            });
                    };

                    tools.apply();
                    var flag = parseInt(search.flag);
                    if (flag) {
                        $('.j-btn').hide();
                    }

                    //添加审核不通过原因  remark=xx
                    $scope.reasonAdds = function() {
                        $scope.tools = tools;
                        $uibModal.open({
                            animation: true,
                            templateUrl: './controller/sellerAccount/remark.html',
                            controller: 'RMBPopCtrl',
                            size: '',
                            scope: $scope,
                            resolve: {
                                index: function() {
                                    return params.auditId;
                                }
                            }
                        })
                    };

                    //审核通过确认
                    $scope.pass = function() {
                        if (!confirm("确认审核通过？")) {
                           // console.log(111);
                            return;
                        } 
						
                        classifyService.postRMBDetail(pass)
                            .success(function() {
                                //console.log('success!');
                                tools.apply();
                                $('.j-btn').hide();
                            });
                    };
                    tools.back = function() {
                        $location.path('/sellerAccount/RMBAccount');
                    };

                    $scope.enLarge = function(str_img) {
                        console.log(str_img);
                        $scope.str_img = str_img;
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'enlarge.html',
                            controller: 'EnLargeCtrl',
                            size: '',
                            scope: $scope,
                            resolve: {
                                index: function() {
                                    return -1;
                                }
                            }
                        })
                    }
                }
            ])

            //人民币审核详情弹出窗
            .controller('RMBPopCtrl', ['$scope', '$rootScope', '$location', 'classifyService', '$http', 'index', '$uibModalInstance',
                function($scope, $rootScope, $location, classifyService, $http, index, $uibModalInstance) {
                    var tools = $scope.tools;
                    var vm = $scope.vm = {};
                    var params = $scope.params = {
                        'auditId': index,
                        'status': -1,
                        'remark': null,
						'bankType':1
                    };
                    vm.length = 100;
                    var pass = {
                        'auditId': index
                    };

                    $scope.popMenu = function() {
                        if (params.remark == null) {
                            alert("原因不能为空！");
                            return;
                        }
                        if (params.remark.length > 100) {
                            alert("长度不能超过100");
                            return;
                        }
                        classifyService.postRMBDetail(params)
                            .success(function() {
                                console.log('success!');
                                tools.apply();
                                $('.j-btn').hide();
                                $uibModalInstance.close();
                            });
                    };

                    $scope.back = function() {
                        $uibModalInstance.close();
                    }

                    $scope.clear = function() {
                        params.remark = null;
                        vm.length = 100;
                    };
                    $scope.ChangeLength = function() {
                        vm.length = 100 - params.remark.length;
                        if (vm.length <= 0) {
                            vm.length = 0;
                        }
                    };
                }
            ])

            //虚拟账号页面
            .controller('fictitiousAccountCtrl', ['$scope', '$rootScope', '$location', 'classifyService', '$http',
                function($scope, $rootScope, $location, classifyService, $http) {

                    var vm = $scope.vm = {};
                    var tools = $scope.tools = {};
                    var paging = $scope.paging = {
                        'page': 1,
                        'pageSize': 10,
                        'currency': null,
                        'companyName': null,
                        'email': null,
                        'minAmount': null,
                        'maxAmount': null
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

                    //手动输入页码跳转页面
                    tools.getnewpage = function() {
                        if (tools.newpagesize == null) {
                            alert("页码不存在！")
                        } else {
                            paging.page = tools.newpagesize;
                            tools.getNextPage();
                            tools.newpagesize = null;
                        }
                    };
                    //页面切换
                    tools.getNextPage = function() {
                        classifyService.getFictitiousAccount(paging)
                            .success(function(data) {
                                if ('success' === data.status) {
                                    vm.items = data.data.items;
                                    paging.total = data.page.total;
                                }
                            });
                    };

                    tools.getNextPage();

                    tools.showBuyerDetail = function(sellerId, companyName, email) {
                        console.log(sellerId, companyName, email);
                        $location.path('/sellerAccount/fictitiousDetail').search({
                            'sellerId': sellerId,
                            'companyName': companyName,
                            'email': email
                        })
                    };

                    //搜索数据
                    vm.searchMsg = function() {
                        if (paging.email == '') {
                            paging.email = null;
                        }
                        if (paging.companyName == '') {
                            paging.companyName = null;
                        }
                        if (paging.currency == '') {
                            paging.currency = null;
                        }
                        if (paging.minAmount == '') {
                            paging.minAmount = null;
                        }
                        if (paging.maxAmount == '') {
                            paging.maxAmount = null;
                        }
                        //console.log(paging);
                        paging.total = 0;
                        classifyService.getFictitiousAccount(paging)
                            .success(function(data) {
                                if ('success' === data.status) {
                                    console.log(data.data);
                                    vm.items = data.data.items;
                                    paging.total = data.page.total;
                                }
                            });
                    };
                }
            ])

            //虚拟账号详情页面
            .controller('fictitiousDetailCtrl', ['$scope', '$rootScope', '$location', '$http', 'classifyService', 'api',
                function($scope, $rootScope, $location, $http, classifyService, $api) {

                    var vm = $scope.vm = {};
                    var tools = $scope.tools = {};
                    //获取参数
                    var search = $location.search();
                    console.log(search);
                    //得到sellerId,companyName,email
                    var sellerId = parseInt(search.sellerId);
                    var companyName = parseInt(search.companyName);
                    var email = parseInt(search.email);
                    //搜索请求数据条件
                    var paging = {
                        'page': 1,
                        'pageSize': 10,
                        'currency': null,
                        'fundsType': null,
                        'dateStart': null,
                        'dateEnd': null,
                        'companyName': null
                    };
                    //初始化页面请求数据条件
                    var params = {
                        'page': 1,
                        'pageSize': 10,
                        'sellerId': sellerId,
                        'companyName': companyName,
                        'email': email
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

                    /*日期控件相关*/
                    $scope.maxDate = new Date();

                    $scope.dateOptions = {
                        formatYear: 'yy',
                        startingDay: 1
                    };

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

                    //请求点击条目的详细信息
                    classifyService.getFictitiousDetail(params)
                        .success(function(data) {
                            if ('success' == data.status) {
                                vm.virtualAmountList = data.data.virtualAmountList;
                                vm.virtualAccountDetial = data.data.virtualAccountDetial.items;
                                paging.total = data.data.virtualAccountDetial.total;
                                console.log(vm.virtualAmountList);
                                console.log(vm.virtualAccountDetial);
                            }
                        });

                    //手动输入页码跳转页面
                    tools.getnewpage = function() {
                        if (tools.newpagesize == null) {
                            alert("页码不存在！")
                        } else {
                            paging.page = tools.newpagesize;
                            tools.getNextPage();
                            tools.newpagesize = null;
                        }
                    };

                    tools.getNextPage = function() {
                        classifyService.getFictitiousDetail(paging)
                            .success(function(data) {
                                if ('success' === data.status) {
                                    vm.virtualAccountDetial = data.data.virtualAccountDetial.items;
                                    paging.total = data.page.total;
                                }
                            });
                    };
                }
            ])

            //外币审核页面
            .controller('ForeignAccountCtrl', ['$scope', '$rootScope', '$location', 'classifyService', '$http', 'api',
                function($scope, $rootScope, $location, classifyService, $http, $api) {
                    var vm = $scope.vm = {};
                    var tools = $scope.tools = {};
                    tools.hideButton = false;
                    tools.color1 = {
                        background: '#e04d2c',
                        color: 'white'
                    };
                    tools.color2 = {};
                    tools.color3 = {};
                    var paging = $scope.paging = {
                        'page': 1,
                        'pageSize': 10,
                        //国内银行1海外银行0
                        'bankType': 0,
                        //审核状态
                        'status': 0,
                        //绑定0修改1
                        //'auditType': 0,
                        //搜索参数
                        'name': null,
                        'companyName': null,
                        //审核不通过原因
                        'remark': null
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

                    //手动输入页码跳转页面
                    tools.getnewpage = function() {

                        if (tools.newpagesize == null) {
                            alert("页码不存在！")
                        } else {
                            //paging.page = tools.newpagesize;
                            //tools.getSellerIdentity();
                            //tools.newpagesize = null;
                            paging.page = tools.newpagesize;
                            tools.getNextPage();
                            tools.newpagesize = null;
                        }
                    };
                    //页面切换
                    tools.getclassifyList = function() {
                        classifyService.getClassifyList(paging)
                            .success(function(data) {
                                if ('success' === data.status) {
                                    vm.items = data.data;
                                    paging.total = data.page.total;
                                }
                            })
                    };

                    tools.getNextPage = function() {
                        classifyService.getRMBAccount(paging)
                            .success(function(data) {
                                vm.items = data.data.items;
                                paging.total = data.data.total;
                            });
                    };

                    tools.getNextPage();

                    tools.showBuyerDetail = function(auditId, flag) {
                        $location.path('/sellerAccount/ForeignDetail').search({
                            'auditId': auditId,
                            'flag': flag
                        });
                    };

                    //搜索数据
                    vm.searchMsg = function() {
                        if (paging.companyName == '') {
                            paging.companyName = null;
                        }
                        if (paging.name == '') {
                            paging.name = null;
                        }
                        classifyService.getRMBAccount(paging)
                            .success(function(data) {
                                vm.items = data.data.items;
                                paging.total = data.page.total;
                            });
                    };

                    vm.change1 = function() {
                        tools.color1 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.color2 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color3 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.hideButton = false;
                        //请求数据
                        paging.status = 0;
                        delete paging.total;
                        tools.getNextPage();

                    };

                    vm.change2 = function() {
                        tools.color1 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color2 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.color3 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.hideButton = true;
                        //请求数据
                        paging.status = 1;
                        delete paging.total;
                        tools.getNextPage();

                    };
                    vm.change3 = function() {
                        tools.color1 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color2 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color3 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.hideButton = true;
                        //请求数据
                        paging.status = -1;
                        delete paging.total;
                        tools.getNextPage();
                    };

                }
            ])

            //外币审核详情页面
            .controller('ForeignDetailCtrl', ['$scope', '$rootScope', '$location', '$http', 'classifyService', '$uibModal', 'api',
                function($scope, $rootScope, $location, $http, classifyService, $uibModal, $api) {

                    var tools = $scope.tools = {};
                    //获取参数
                    var search = $location.search();
                    //得到id,flag
                    var id = parseInt(search.id);
                    var vm = $scope.vm = {};
                    //userType,bankType,auditId,bankCardId
                    var params = {
                        'auditId': $location.search().auditId
                    };

                    //审核通过传递对象
                    var pass = {
                        'auditId': $location.search().auditId,
                        'status': 1,
                        'remark': null,
						'bankType':0
                    };
                    //请求点击条目的详细信息
                    tools.apply = function() {
                        classifyService.getRMBDetail(params)
                            .success(function(data) {
                                vm.user = data.data.user;
                                vm.bankCardFCA = data.data.bankCardFCA;
                                vm.bcAudit = data.data.bcAudit;
                                var flag = vm.bcAudit.status;
                                if (flag == 0) {
                                    vm.bcAudit.status = "待审核";
                                } else if (flag == 1) {
                                    vm.bcAudit.status = "审核通过";
                                } else if (flag == -1) {
                                    vm.bcAudit.status = "审核不通过";
                                } else {
                                    vm.bcAudit.status = null;
                                }
                            });
                    };
                    tools.apply();

                    //添加审核不通过原因  remark=xx
                    $scope.reasonAdds = function() {
                        $scope.tools = tools;
                        $uibModal.open({
                            animation: true,
                            templateUrl: './controller/sellerAccount/remark.html',
                            controller: 'ForeignPopCtrl',
                            size: '',
                            scope: $scope,
                            resolve: {
                                index: function() {
                                    return params.auditId;
                                }
                            }
                        })
                    };

                    //审核通过确认
                    $scope.pass = function() {
                        if (confirm("确认审核通过？")) {
                            console.log(111);
                        } else {
                            console.log(222);
                        }
                        classifyService.postRMBDetail(pass)
                            .success(function() {
                                console.log('success!');
                                tools.apply();
                                $('.j-btn').hide();
                            });
                    };
                    $scope.enLarge = function(str_img) {
                        console.log(str_img);
                        $scope.str_img = str_img;
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'enlarge.html',
                            controller: 'EnLargeCtrl',
                            size: '',
                            scope: $scope,
                            resolve: {
                                index: function() {
                                    return -1;
                                }
                            }
                        })
                    }

                    var flag = parseInt(search.flag);
                    if (flag) {
                        $('.j-btn').hide();
                    }

                    tools.back = function() {
                        $location.path('/sellerAccount/ForeignAccount');
                    }
                }
            ])

            //外币审核详情弹出窗
            .controller('ForeignPopCtrl', ['$scope', '$rootScope', '$location', 'classifyService', '$http', 'index', '$uibModalInstance',
                function($scope, $rootScope, $location, classifyService, $http, index, $uibModalInstance) {
                    var tools = $scope.tools;
                    var vm = $scope.vm = {};
                    vm.length = 100;
                    var params = $scope.params = {
                        'auditId': index,
                        'status': -1,
                        'remark': null,
						'bankType':0
                    };
                    var pass = {
                        'auditId': index
                    };
                    //审核不通过
                    $scope.popMenu = function() {
                        if (params.remark == null) {
                            alert("原因不能为空！");
                            return;
                        }
                        if (params.remark.length > 100) {
                            alert("长度不能超过100");
                            return;
                        }
                        classifyService.postRMBDetail(params)
                            .success(function() {
                               // console.log('success!');
                                tools.apply();
                                $('.j-btn').hide();
                                $uibModalInstance.close();
                            });
                    };

                    $scope.back = function() {
                        $uibModalInstance.close();
                    }

                    $scope.clear = function() {
                        params.remark = null;
                        vm.length = 100;
                    };
                    $scope.ChangeLength = function() {
                        vm.length = 100 - params.remark.length;
                        if (vm.length <= 0) {
                            vm.length = 0;
                        }
                    };
                }
            ])

            //人民币修改审核页面
            .controller('RMBChangeCtrl', ['$scope', '$rootScope', '$location', 'classifyService', '$http', 'api',
                function($scope, $rootScope, $location, classifyService, $http, $api) {

                    var vm = $scope.vm = {};
                    var tools = $scope.tools = {};
                    tools.hideButton = false;
                    tools.color1 = {
                        background: '#e04d2c',
                        color: 'white'
                    };
                    tools.color2 = {};
                    tools.color3 = {};
                    var paging = $scope.paging = {
                        'page': 1,
                        'pageSize': 10,
                        //国内银行1海外银行0
                        'bankType': 1,
                        //审核状态
                        'status': 0,
                        //绑定0修改1
                        'auditType': 1,
                        //搜索参数
                        'companyName': null,
                        'name': null,
                        //审核不通过原因
                        'remark': null
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

                    //手动输入页码跳转页面
                    tools.getnewpage = function() {

                        if (tools.newpagesize == null) {
                            alert("页码不存在！")
                        } else {
                            paging.page = tools.newpagesize;
                            tools.getNextPage();
                            tools.newpagesize = null;
                        }
                    };
                    //页面切换
                    tools.getclassifyList = function() {
                        classifyService.getClassifyList(paging)
                            .success(function(data) {
                                if ('success' === data.status) {
                                    vm.items = data.data;
                                    paging.total = data.page.total;
                                }
                            })
                    };

                    tools.getNextPage = function() {
                        classifyService.getRMBAccount(paging)
                            .success(function(data) {
                                vm.items = data.data.items;
                                paging.total = data.data.total;
                            });
                    };

                    tools.getNextPage();

                    tools.showBuyerDetail = function(auditId, flag) {
                        $location.path('/sellerAccount/RMBChangeDetail').search({
                            'auditId': auditId,
                            'flag': flag
                        });
                    };

                    //搜索数据
                    vm.searchMsg = function() {
                        if (paging.name == '') {
                            paging.name = null;
                        }
                        if (paging.companyName == '') {
                            paging.companyName = null;
                        }
                        paging.total = 0;
                        classifyService.getRMBAccount(paging)
                            .success(function(data) {
                                vm.items = data.data.items;
                                paging.total = data.page.total;
                            });
                    };

                    vm.change1 = function() {
                        tools.color1 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.color2 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color3 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.hideButton = false;
                        //请求数据
                        paging.status = 0;
                        delete paging.total;
                        tools.getNextPage();
                    };

                    vm.change2 = function() {
                        tools.color1 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color2 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.color3 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.hideButton = true;
                        //请求数据
                        paging.status = 1;
                        delete paging.total;
                        tools.getNextPage();
                    };
                    vm.change3 = function() {
                        tools.color1 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color2 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color3 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.hideButton = true;
                        //请求数据
                        paging.status = -1;
                        delete paging.total;
                        tools.getNextPage();
                    };
                }
            ])

            //人民币修改审核详情页面
            .controller('RMBChangeDetailCtrl', ['$scope', '$rootScope', '$location', '$http', 'classifyService', 'api', '$uibModal',
                function($scope, $rootScope, $location, $http, classifyService, $api, $uibModal) {
                    var tools = $scope.tools = {};
                    //获取参数
                    var search = $location.search();
                    //得到id,flag
                    var id = parseInt(search.id);
                    var vm = $scope.vm = {};
                    //userType,bankType,auditId,bankCardId
                    var params = {
                        'auditId': $location.search().auditId
                    };

                    //审核通过传递对象
                    var pass = {
                        'auditId': $location.search().auditId,
                        'status': 1,
                        'remark': null
                    };
                    //请求点击条目的详细信息
                    tools.apply = function() {
                        classifyService.getRMBDetail(params)
                            .success(function(data) {
                                vm.user = data.data.user;
                                vm.bankCardHCA = data.data.bankCardHCA;
                                vm.bcAudit = data.data.bcAudit;
                                var flag = vm.bcAudit.status;
                                if (flag == 0) {
                                    vm.bcAudit.status = "待审核";
                                } else if (flag == 1) {
                                    vm.bcAudit.status = "审核通过";
                                } else if (flag == -1) {
                                    vm.bcAudit.status = "审核不通过";
                                } else {
                                    vm.bcAudit.status = null;
                                }
                            });
                    };

                    tools.apply();

                    $scope.enLarge = function(str_img) {
                        console.log(str_img);
                        $scope.str_img = str_img;
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'enlarge.html',
                            controller: 'EnLargeCtrl',
                            size: '',
                            scope: $scope,
                            resolve: {
                                index: function() {
                                    return -1;
                                }
                            }
                        })
                    }

                    var flag = parseInt(search.flag);
                    if (flag) {
                        $('.j-btn').hide();
                    }

                    //添加审核不通过原因  remark=xx
                    $scope.reasonAdds = function() {
                        $scope.tools = tools;
                        $uibModal.open({
                            animation: true,
                            templateUrl: './controller/sellerAccount/remark.html',
                            controller: 'RMBDetailPopCtrl',
                            size: '',
                            scope: $scope,
                            resolve: {
                                index: function() {
                                    return params.auditId;
                                }
                            }
                        })
                    };

                    //审核通过确认
                    $scope.pass = function() {
                        if (confirm("确认审核通过？")) {
                            console.log(111);
                        } else {
                            console.log(222);
                        }
                        classifyService.postRMBDetail(pass)
                            .success(function() {
                                console.log('success!');
                                tools.apply();
                                $('.j-btn').hide();
                            });
                    };

                    tools.back = function() {
                        $location.path('/sellerAccount/RMBChange');
                    };
                }
            ])

            //人民币修改审核详情弹出窗
            .controller('RMBDetailPopCtrl', ['$scope', '$rootScope', '$location', 'classifyService', '$http', 'index', '$uibModalInstance',
                function($scope, $rootScope, $location, classifyService, $http, index, $uibModalInstance) {
                    var tools = $scope.tools;
                    var vm = $scope.vm = {};
                    vm.length = 100;
                    var params = $scope.params = {
                        'auditId': index,
                        'status': -1,
                        'remark': null
                    };

                    var pass = {
                        'auditId': index
                    };

                    //审核不通过
                    $scope.popMenu = function() {
                        if (params.remark == null) {
                            alert("原因不能为空！");
                            return;
                        }
                        if (params.remark.length > 100) {
                            alert("长度不能超过100");
                            return;
                        }
                        classifyService.postRMBDetail(params)
                            .success(function() {
                                console.log('success!');
                                tools.apply();
                                $('.j-btn').hide();
                                $uibModalInstance.close();
                            });
                    };

                    $scope.back = function() {
                        $uibModalInstance.close();
                    }

                    $scope.clear = function() {
                        params.remark = null;
                        vm.length = 100;
                    };
                    $scope.ChangeLength = function() {
                        vm.length = 100 - params.remark.length;
                        if (vm.length <= 0) {
                            vm.length = 0;
                        }
                    };
                }
            ])

            //外币修改审核页面
            .controller('ForeignChangeCtrl', ['$scope', '$rootScope', '$location', 'classifyService', '$http', 'api',
                function($scope, $rootScope, $location, classifyService, $http, $api) {

                    var vm = $scope.vm = {};
                    var tools = $scope.tools = {};
                    tools.hideButton = false;
                    tools.color1 = {
                        background: '#e04d2c',
                        color: 'white'
                    };
                    tools.color2 = {};
                    tools.color3 = {};
                    var paging = $scope.paging = {
                        'page': 1,
                        'pageSize': 10,
                        //国内银行1海外银行0
                        'bankType': 0,
                        //审核状态
                        'status': 0,
                        //绑定0修改1
                        'auditType': 1,
                        //搜索参数
                        'companyName': null,
                        'name': null,
                        //审核不通过原因
                        'remark': null
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

                    //手动输入页码跳转页面
                    tools.getnewpage = function() {

                        if (tools.newpagesize == null) {
                            alert("页码不存在！")
                        } else {
                            //paging.page = tools.newpagesize;
                            //tools.getSellerIdentity();
                            //tools.newpagesize = null;
                            paging.page = tools.newpagesize;
                            tools.getNextPage();
                            tools.newpagesize = null;
                        }
                    };
                    //页面切换
                    tools.getclassifyList = function() {
                        classifyService.getClassifyList(paging)
                            .success(function(data) {
                                if ('success' === data.status) {
                                    vm.items = data.data;
                                    paging.total = data.page.total;
                                }
                            })
                    };

                    tools.getNextPage = function() {
                        classifyService.getRMBAccount(paging)
                            .success(function(data) {
                                vm.items = data.data.items;
                                paging.total = data.data.total;
                            });
                    };

                    tools.getNextPage();

                    tools.showBuyerDetail = function(auditId, flag) {
                        $location.path('/sellerAccount/ForeignChangeDetail').search({
                            'auditId': auditId,
                            'flag': flag
                        });
                    };

                    //搜索数据
                    vm.searchMsg = function() {
                        if (paging.name == '') {
                            paging.name = null;
                        }
                        if (paging.companyName == '') {
                            paging.companyName = null;
                        }
                        paging.total = 0;
                        classifyService.getRMBAccount(paging)
                            .success(function(data) {
                                vm.items = data.data.items;
                                paging.total = data.page.total;
                            });
                    };

                    vm.change1 = function() {
                        tools.color1 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.color2 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color3 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.hideButton = false;
                        //请求数据
                        paging.status = 0;
                        delete paging.total;
                        tools.getNextPage();
                    };

                    vm.change2 = function() {
                        tools.color1 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color2 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.color3 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.hideButton = true;
                        //请求数据
                        paging.status = 1;
                        delete paging.total;
                        tools.getNextPage();
                    };
                    vm.change3 = function() {
                        tools.color1 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color2 = {
                            background: 'white',
                            color: 'black'
                        };
                        tools.color3 = {
                            background: '#e04d2c',
                            color: 'white'
                        };
                        tools.hideButton = true;
                        //请求数据
                        paging.status = -1;
                        delete paging.total;
                        tools.getNextPage();
                    };
                }
            ])

            //外币修改审核详情页面
            .controller('ForeignChangeDetailCtrl', ['$scope', '$rootScope', '$location', 'classifyService', '$http', 'api', '$uibModal',
                function($scope, $rootScope, $location, classifyService, $http, $api, $uibModal) {
                    var tools = $scope.tools = {};
                    //获取参数
                    var search = $location.search();
                    //得到id,flag
                    var id = parseInt(search.id);
                    var vm = $scope.vm = {};
                    //userType,bankType,auditId,bankCardId
                    var params = {
                        'auditId': $location.search().auditId
                    };

                    //审核通过传递对象
                    var pass = {
                        'auditId': $location.search().auditId,
                        'status': 1,
                        'remark': null
                    };
                    //请求点击条目的详细信息
                    tools.apply = function() {
                        classifyService.getRMBDetail(params)
                            .success(function(data) {
                                vm.user = data.data.user;
                                vm.bankCardFCA = data.data.bankCardFCA;
                                vm.bcAudit = data.data.bcAudit;
                                console.log(vm.bcAudit);
                                var flag = vm.bcAudit.status;
                                if (flag == 0) {
                                    vm.bcAudit.status = "待审核";
                                } else if (flag == 1) {
                                    vm.bcAudit.status = "审核通过";
                                } else if (flag == -1) {
                                    vm.bcAudit.status = "审核不通过";
                                } else {
                                    vm.bcAudit.status = null;
                                }
                            });
                    };



                    tools.apply();


                    $scope.enLarge = function(str_img) {
                        console.log(str_img);
                        $scope.str_img = str_img;
                        $uibModal.open({
                            animation: true,
                            templateUrl: 'enlarge.html',
                            controller: 'EnLargeCtrl',
                            size: '',
                            scope: $scope,
                            resolve: {
                                index: function() {
                                    return -1;
                                }
                            }
                        })


                    }


                    var flag = parseInt(search.flag);
                    if (flag) {
                        $('.j-btn').hide();
                    }

                    //添加审核不通过原因  remark=xx
                    $scope.reasonAdds = function() {
                        $scope.tools = tools;
                        $uibModal.open({
                            animation: true,
                            templateUrl: './controller/sellerAccount/remark.html',
                            controller: 'ForeignDetailPopCtrl',
                            size: '',
                            scope: $scope,
                            resolve: {
                                index: function() {
                                    return params.auditId;
                                }
                            }
                        })
                    };

                    //审核通过确认
                    $scope.pass = function() {
                        if (confirm("确认审核通过？")) {
                            console.log(111);
                        } else {
                            console.log(222);
                        }
                        classifyService.postRMBDetail(pass)
                            .success(function() {
                                console.log('success!');
                                tools.apply();
                                $('.j-btn').hide();
                            });
                    };

                    tools.back = function() {
                        $location.path('/sellerAccount/ForeignChange');
                    };
                }
            ])

            .controller('EnLargeCtrl', ['$scope', '$location',
                function($scope, $location) {
                    $scope.en_img = $scope.str_img;
                }
            ])

            //外币修改审核详情弹出窗
            .controller('ForeignDetailPopCtrl', ['$scope', '$rootScope', '$location', 'classifyService', '$http', 'index', '$uibModalInstance',
                function($scope, $rootScope, $location, classifyService, $http, index, $uibModalInstance) {
                    var tools = $scope.tools;
                    var vm = $scope.vm = {};
                    vm.length = 100;
                    var params = $scope.params = {
                        'auditId': index,
                        'status': -1,
                        'remark': null
                    };
                    var pass = {
                        'auditId': index
                    };
                    //审核不通过
                    $scope.popMenu = function(param) {
                        if (params.remark == null) {
                            alert("原因不能为空！");
                            return;
                        }
                        if (params.remark.length > 100) {
                            alert("长度不能超过100");
                            return;
                        }
                        classifyService.postRMBDetail(params)
                            .success(function() {
                                console.log('success!');
                                tools.apply();
                                $('.j-btn').hide();
                                $uibModalInstance.close();
                            });
                    };
                    $scope.back = function() {
                        $uibModalInstance.close();
                    }

                    $scope.clear = function() {
                        params.remark = null;
                        vm.length = 100;
                    };
                    $scope.ChangeLength = function() {
                        vm.length = 100 - params.remark.length;
                        if (vm.length <= 0) {
                            vm.length = 0;
                        }
                    };
                }
            ])
        });