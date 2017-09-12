define(['../module'], function(ng) {
    ng.factory('goodsService', ['$http', 'api',
        function($http, api) {
            return {
                getProducts: function(params) {
                    return $http.get(api.getProducts, {
                        'params': params
                    });
                },
                getProductDetail: function(productId, sellerId) {
                    return $http.get(api.getProductDetail, {
                        'params': {
                            'productId': productId,
                            'sellerId': sellerId
                        }
                    });
                },
                chgProductStatus: function(params) {
                    return $http.post(api.chgProductStatus, params);
                },
                GoodgetIndustry: function() {
                    return $http.get(api.GoodgetIndustry);
                },
                GoodgetCategory: function(params) {
                    return $http.get(api.GoodgetCategory, {
                        'params': params
                    });
                },
                getUnpassReasons: function() {
                    return $http.get(api.getProUnpassReasons);
                },
                getMemPackageList: function(params) {
                    return $http.get(api.getMemPackageList, {
                        'params': params
                    });
                },
                getSellerDetail: function(sellerId) {
                    return $http.get(api.getSellerDetail, {
                        params: {
                            sellerId: sellerId
                        }
                    })
                }
            }

        }
    ])

    //商品列表
    .controller('ListCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        '$controller', '$location',
        'goodsService', 'commonService', 'commonTool',
        function(
            $scope, $rootScope, ngDialog,
            $controller, $location, goodsService,
            commonService, commonTool) {
            // 参数
            var vm = $scope.vm = {};
            // 方法
            var tools = $scope.tools = {};
            // 搜索参数
            var paging = $scope.paging = {
                "page": 1,
                "pageSize": 10,

                "status": 99,
                "indusId": null,
                "categoryId": null,
                "productName": null,
                "isOnline": null,
                "companyName": null,
                "userName": null,

                supplierType: "",
                isSensitiveWord: null,
                isCorpId: null

            };

            // 当前商品状态
            vm.currentState = null;
            // 多选
            vm.selectionItme = [];
            // 控制是否显示操作按钮
            vm.showOperateFlag = false;

            tools = $.extend(tools, {
                // 获取商品列表
                getProducts: function() {
                    vm.showOperateFlag = false;
                    vm.allChecked = false;
                    goodsService.getProducts(paging).success(function(data) {
                        vm.items = data.data.items;
                        paging.total = data.page.total;
                    });
                },
                getnewpage: function(type) {
                    if (type == 1) { // 跳转到第几页
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) { // 每页显示多少条切换时
                        paging.page = 1;
                    }
                    tools.getProducts();
                },
                // 搜索产品
                search: function() {
                    // if (commonTool.isEmpty(tools.type) == 1 && commonTool.isEmpty(tools.searchValue) == 0) {
                    //     $rootScope.alertMsgService.setMessage('请先选择搜索类型', 'warning');
                    //     return;
                    // }

                    paging.companyName = null;
                    paging.userName = null;

                    if (tools.type == 1) {
                        paging.companyName = tools.searchValue;
                    } else if (tools.type == 2) {
                        paging.userName = tools.searchValue;
                    }
                    tools.getProducts();
                },
                // 重置
                reset: function() {
                    paging.status = 99;
                    paging.indusId = null;
                    paging.categoryId = null;
                    paging.supplierType = '';
                    paging.isCorpId = false;
                    paging.isSensitiveWord = false;
                    paging.productName = null;
                    paging.companyName = null;
                    paging.userName = null;
                    paging.isNormalProduct = null;
                    paging.packageId = null;

                    vm.productStatus = null;

                    tools.type = null;
                    tools.searchValue = null;
                },
                // 由行业查询一级类目
                getIndustry: function() {
                    paging.categoryId = null;
                    if (commonTool.isEmpty(paging.indusId)) return;
                    var params = {
                        indusId: paging.indusId
                    }
                    goodsService.GoodgetCategory(params).success(function(data) {
                        vm.categoryList = data.data;
                    });
                },
                // 产品状态
                getProductsByStatus: function(productStatus) {
                    paging.isNormalProduct = 0;
                    paging.isOnline = null;
                    switch (productStatus) {
                        case "1":
                            paging.status = 3;
                            paging.isNormalProduct = 1;
                            break;
                        case "2":
                            paging.status = 2;
                            break;
                        case "3":
                            paging.status = -1;
                            break;
                        case "4":
                            paging.status = 3;
                            paging.isOnline = 1;
                            break;
                        case "5":
                            paging.status = 3;
                            paging.isOnline = -1;
                            break;
                        case "6":
                            paging.status = -3;
                            break;
                        case "7":
                            paging.status = 3;
                            break;
                        default:
                            paging.status = 99;
                            break;
                    }
                    tools.getProducts();
                },
                // 获取商品详情
                getDetail: function(productId, sellerId, productType) {

                },
                // 多选
                checkAll: function(checked) {
                    vm.selectionItme = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {
                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionItme.push(item.productId);
                        }
                    });
                },
                // 单选
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.productId);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                },
                // 修改商品状态（多个）
                chgAuditStatus: function(status, isOnline) {
                    // vm.allChecked = false;
                    // 数组转字符串
                    var productIds = vm.selectionItme.join(',');
                    // 判断商品id是否空
                    if (commonTool.isEmpty(productIds)) {
                        $rootScope.alertMsgService.setMessage('请先选择要操作的商品!', 'warning');
                        return;
                    }
                    // 控制弹窗，-1为审核不通过
                    status == -1 ? tools.chxstatus(productIds) : tools.confirm(productIds, status, isOnline);
                    // 清空数组
                    // vm.selectionItme = [];
                },
                // 修改商品状态（单个）
                chgOneStatus: function(status, productId, isOnline) {
                    status == -1 ? tools.chxstatus(productId) : tools.confirm(productId, status, isOnline);
                },
                // 修改状态
                chxstatus: function(productId) {
                    $scope.productId = productId;
                    $scope.tools = tools;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'makesure.html',
                        controller: 'MakeSureCtrl1'
                    })
                },
                // 确认
                confirm: function(productId, status, isOnline) {
                    $scope.productId = productId;
                    $scope.status = status;
                    $scope.isOnline = isOnline;
                    $scope.tools = tools;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        templateUrl: 'confirm.html',
                        controller: 'GoodConfirmCtrl'
                    })
                },
                onKeyUpEnter: function(e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) this.search();
                }
            });

            // 初始页面
            init_data();

            function init_data() {
                // 加载行业列表
                goodsService.GoodgetIndustry().success(function(data) {
                    vm.industryList = data.data;
                });
                // 页码
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
                // 搜索：供应商类型
                vm.searchtypes = [
                    new Supplier(1, "供应商公司名称"),
                    new Supplier(2, "供应商账号")
                ];
                goodsService.getMemPackageList({
                    page: 1,
                    pageSize: 1000,
                    status: 1
                }).success(function(rs) {
                    vm.packageList = rs.page.items;
                });
                // 获取商品列表
                tools.getProducts();
            }

            function Supplier(type, name) {
                this.type = type;
                this.name = name;
            }

        }
    ])

    // 商品列表-确认控制器-不通过
    .controller('MakeSureCtrl1', [
        '$scope', '$rootScope', 'ngDialog',
        '$controller', '$location', 'goodsService',
        'commonService', 'commonTool',
        function(
            $scope, $rootScope, ngDialog,
            $controller, $location, goodsService,
            commonService, commonTool) {

            var productId = $scope.productId;
            var tools = $scope.tools;
            var forms = $scope.forms = {};
            var confirm = $scope.confirm = {}
            tools.btnFlag = false;
            var isDetailPage = $scope.isDetailPage;
            // 获取不通过的原因列表
            goodsService.getUnpassReasons().success(function(rs) {
                if (rs.status == 'success') {
                    $scope.items = rs.data;
                }
            })

            $scope.submit = function() {

                if (forms.unPassFrom.$invalid) {
                    $rootScope.alertMsgService.setMessage('请选择原因', 'warning');
                    return;
                }
                tools.btnFlag = true;
                confirm.status = -1;
                confirm.productIds = productId;

                goodsService.chgProductStatus(confirm).success(function(data) {
                    if ('success' == data.status) {
                        isDetailPage ? tools.getProductDetail() : tools.getProducts();
                        $rootScope.alertMsgService.setMessage('操作成功', 'success');
                        ngDialog.closeAll();
                    } else {
                        $rootScope.alertMsgService.setMessage(data.message, 'warning');
                    }
                });
            }

            $scope.close = function() {
                ngDialog.closeAll();
            }

        }
    ])


    // 商品修改状态确定控制器

    .controller('GoodConfirmCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        '$controller', '$location', 'goodsService',
        'commonService', 'commonTool',
        function(
            $scope, $rootScope, ngDialog,
            $controller, $location, goodsService,
            commonService, commonTool) {

            var productId = $scope.productId;
            var tools = $scope.tools;
            var status = $scope.status;
            var isOnline = $scope.isOnline;
            var isDetailPage = $scope.isDetailPage;
            tools.btnFlag = false;
            if (status == 3 && isOnline == 1) {
                $scope.message = '确定要上架吗？ '
            } else if (status == 3 && isOnline == -1) {
                $scope.message = '确定要下架吗？ '
            } else if (status == 3) {
                $scope.message = '确定要审核通过吗？ '
            } else if (status == -3) {
                $scope.message = '确定要删除吗？ '
            } else {
                $scope.message = '确定修改吗？ '
            }

            $scope.submit = function() {
                tools.btnFlag = true;
                if (isOnline == 1 || isOnline == -1) {
                    var params = {
                        productIds: productId,
                        status: status,
                        isOnline: isOnline
                    }
                } else {
                    var params = {
                        productIds: productId,
                        status: status
                    }
                }
                goodsService.chgProductStatus(params).success(function(data) {
                    if ('success' == data.status) {
                        isDetailPage ? tools.getProductDetail() : tools.getProducts();
                        $rootScope.alertMsgService.setMessage('操作成功', 'success');
                        ngDialog.closeAll();
                    } else {
                        $rootScope.alertMsgService.setMessage(data.message, 'warning');
                    }
                });
            }

            $scope.close = function() {
                ngDialog.closeAll();
            }

        }
    ])


    // 议价商品详情控制器
    .controller('BarginDetailCtrl', [
        '$scope',
        'ngDialog',
        '$controller',
        '$location',
        'goodsService',
        'commonTool',
        function(
            $scope, ngDialog, $controller,
            $location, goodsService, commonTool) {
            //获取参数
            var search = $location.search();

            var tools = $scope.tools = {};
            var vm = $scope.vm = {};

            tools = $.extend(tools, {
                // 商品id
                productId: parseInt(search.productId),
                // 卖家id
                sellerId: parseInt(search.sellerId),

                chgAuditStatus: function(status, isOnline) {
                    status == -1 ? tools.chxstatus(tools.productId) : tools.confirm(tools.productId, status, isOnline);
                },
                confirm: function(productId, status, isOnline) {
                    $scope.productId = productId;
                    $scope.status = status;
                    $scope.isOnline = isOnline;
                    $scope.isDetailPage = true;
                    $scope.tools = tools;
                    vm.dialog = ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        templateUrl: 'confirm.html',
                        controller: 'GoodConfirmCtrl'

                    })
                },
                chxstatus: function(productId) {
                    $scope.productId = productId;
                    $scope.tools = tools;
                    $scope.isDetailPage = true;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'makesure.html',
                        controller: 'MakeSureCtrl1'
                    })
                },
                getProductDetail: function() {
                    goodsService.getProductDetail(tools.productId, tools.sellerId).success(function(data) {
                        if ('success' == data.status) {
                            vm.item = data.data;

                            $('#description').html(vm.item.productDetail.detailDescription);
                            $('#descriptionForWap').html(vm.item.productDetail.detailDescriptionForWap);
                            //基本属性
                            tools.init_baseProps(vm.item.baseProps);

                            //商品规格
                            if (vm.item.specProps != null) {
                                for (var i = 0; i < vm.item.specProps.length; i++) {
                                    vm.item.specProps[i].str = '';
                                    for (var j = 0; j < vm.item.specProps[i].propertyValues.length; j++) {
                                        vm.item.specProps[i].str += vm.item.specProps[i].propertyValues[j].propertyValueCn;
                                        if (j < vm.item.specProps[i].propertyValues.length - 1) {
                                            vm.item.specProps[i].str += ',';
                                        }
                                    }
                                }
                            }
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                },
                init_baseProps: function(data) {
                    if (data == null) return;
                    for (var i = 0; i < vm.item.baseProps.length; i++) {
                        vm.item.baseProps[i].str = '';
                        for (var j = 0; j < vm.item.baseProps[i].propertyValues.length; j++) {
                            vm.item.baseProps[i].str += ',' + vm.item.baseProps[i].propertyValues[j].propertyValueCn;
                        }

                        // 自定义属性值
                        if (vm.item.definePropValList != null) {
                            for (var k = 0, lk = vm.item.definePropValList.length; k < lk; k++) {
                                if (vm.item.definePropValList[k].propertyId == vm.item.baseProps[i].propertyId) {
                                    vm.item.baseProps[i].str += ',' + vm.item.definePropValList[k].definePropertyValueEn;
                                }
                            }
                        }
                        vm.item.baseProps[i].str = vm.item.baseProps[i].str.substring(1);
                    }
                },
                enLarge: function(str_img) {
                    $scope.str_img = str_img;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 600,
                        templateUrl: 'enlarge.html',
                        controller: 'goodEnLargeCtrl'
                    })
                },
                // 按钮组滚动固定头部
                scroll_fixed: function() {
                    if ($('.cfec-scroll-fixed').length) {
                        var top = $('.cfec-scroll-fixed').parent().offset().top - $('.cfec-scroll-fixed').height() - 20;
                        var h = $('.cfec-scroll-fixed').height();
                        var temp = '<div id="cfec-scroll-fixed-temp" style="height:' + h + 'px"></div>';

                        $(window).on('scroll', function() {
                            if ($(window).scrollTop() >= top) {
                                $('.cfec-scroll-fixed').css('width', $(window).width() - $('.oms-left-side').width());
                                $('.cfec-scroll-fixed').addClass('cfec-fixed-style');
                                if ($('#cfec-scroll-fixed-temp').length < 1) {
                                    $('.cfec-scroll-fixed').after(temp);
                                }
                            } else {
                                $('.cfec-scroll-fixed').css('width', 'auto');
                                $('.cfec-scroll-fixed').removeClass('cfec-fixed-style');
                                if ($('#cfec-scroll-fixed-temp').length) {
                                    $('#cfec-scroll-fixed-temp').remove();
                                }
                            }
                        })
                    }
                }



            })


            $('#functionId20').addClass('active');
            tools.getProductDetail();
            tools.scroll_fixed();
        }
    ])

    // 商品详情预览
    .controller('goodsPreviewCtrl', [
            '$scope',
            '$rootScope',
            'ngDialog',
            '$controller',
            '$location',
            'goodsService',
            'commonTool',
            function(
                $scope, $rootScope, ngDialog, $controller,
                $location, goodsService, commonTool) {
                //获取参数
                var search = $location.search();

                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                vm.imgFocusIndex = 0;

                $rootScope = $.extend($rootScope, {
                    // WAP样式文件
                    wapPreviewStyleTpl: "/controller/goods/wapPreviewStyle.html"
                });

                tools = $.extend(tools, {
                    // 商品id
                    productId: parseInt(search.productId),
                    // 卖家id
                    sellerId: parseInt(search.sellerId),

                    chgAuditStatus: function(status, isOnline) {
                        status == -1 ? tools.chxstatus(tools.productId) : tools.confirm(tools.productId, status, isOnline);
                    },
                    confirm: function(productId, status, isOnline) {
                        $scope.productId = productId;
                        $scope.status = status;
                        $scope.isOnline = isOnline;
                        $scope.isDetailPage = true;
                        $scope.tools = tools;
                        vm.dialog = ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            templateUrl: 'confirm.html',
                            controller: 'GoodConfirmCtrl'

                        })
                    },
                    chxstatus: function(productId) {
                        $scope.productId = productId;
                        $scope.tools = tools;
                        $scope.isDetailPage = true;
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 500,
                            templateUrl: 'makesure.html',
                            controller: 'MakeSureCtrl1'
                        })
                    },
                    getProductDetail: function() {
                        goodsService.getProductDetail(tools.productId, tools.sellerId).success(function(data) {
                            if ('success' == data.status) {
                                vm.item = data.data;

                                if ($('#pcDesc').length) {
                                    $('#pcDesc').html(vm.item.productDetail.detailDescription);
                                }
                                if ($('#wapDesc').length) {
                                    $('#wapDesc').html(vm.item.productDetail.detailDescriptionForWap);
                                }

                                //基本属性
                                tools.init_baseProps(vm.item.baseProps);

                                //商品规格
                                if (vm.item.specProps != null) {
                                    for (var i = 0; i < vm.item.specProps.length; i++) {
                                        vm.item.specProps[i].str = '';
                                        for (var j = 0; j < vm.item.specProps[i].propertyValues.length; j++) {
                                            vm.item.specProps[i].str += vm.item.specProps[i].propertyValues[j].propertyValueEn;
                                            if (j < vm.item.specProps[i].propertyValues.length - 1) {
                                                vm.item.specProps[i].str += ',';
                                            }
                                        }
                                    }
                                }
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    },
                    getSellerDetail: function() {
                        goodsService.getSellerDetail(tools.sellerId).success(function(data) {
                            if ('success' == data.status) {
                                vm.seller = data.data;
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    },
                    init_baseProps: function(data) {
                        if (data == null) return;
                        for (var i = 0; i < vm.item.baseProps.length; i++) {
                            vm.item.baseProps[i].str = '';
                            for (var j = 0; j < vm.item.baseProps[i].propertyValues.length; j++) {
                                vm.item.baseProps[i].str += ',' + vm.item.baseProps[i].propertyValues[j].propertyValueEn;
                            }

                            // 自定义属性值
                            if (vm.item.definePropValList != null) {
                                for (var k = 0, lk = vm.item.definePropValList.length; k < lk; k++) {
                                    if (vm.item.definePropValList[k].propertyId == vm.item.baseProps[i].propertyId) {
                                        vm.item.baseProps[i].str += ',' + vm.item.definePropValList[k].definePropertyValueEn;
                                    }
                                }
                            }
                            vm.item.baseProps[i].str = vm.item.baseProps[i].str.substring(1);
                        }
                    },
                    enLarge: function(str_img) {
                        $scope.str_img = str_img;
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 600,
                            templateUrl: 'enlarge.html',
                            controller: 'goodEnLargeCtrl'
                        })
                    },
                    // 按钮组滚动固定头部
                    scroll_fixed: function() {
                        if ($('.cfec-scroll-fixed').length) {
                            var top = $('.cfec-scroll-fixed').parent().offset().top - $('.cfec-scroll-fixed').height() - 20;
                            var h = $('.cfec-scroll-fixed').height();
                            var temp = '<div id="cfec-scroll-fixed-temp" style="height:' + h + 'px"></div>';

                            $(window).on('scroll', function() {
                                if ($(window).scrollTop() >= top) {
                                    $('.cfec-scroll-fixed').css('width', $(window).width() - $('.oms-left-side').width());
                                    $('.cfec-scroll-fixed').addClass('cfec-fixed-style');
                                    if ($('#cfec-scroll-fixed-temp').length < 1) {
                                        $('.cfec-scroll-fixed').after(temp);
                                    }
                                } else {
                                    $('.cfec-scroll-fixed').css('width', 'auto');
                                    $('.cfec-scroll-fixed').removeClass('cfec-fixed-style');
                                    if ($('#cfec-scroll-fixed-temp').length) {
                                        $('#cfec-scroll-fixed-temp').remove();
                                    }
                                }
                            })
                        }
                    }



                })


                $('#functionId20').addClass('active');
                tools.getProductDetail();
                tools.getSellerDetail();
                tools.scroll_fixed();
            }
        ])
        .controller('goodEnLargeCtrl', [
            '$scope',
            '$location',
            'ngDialog',
            function($scope, $location, ngDialog) {
                $scope.en_img = $scope.str_img;
                $scope.turnBack = function() {
                    ngDialog.closeAll()
                }
            }
        ]).filter('setProductStatus', function() {
            return function(params, status, isOnline, isNormalProduct) {
                switch (status) {
                    case 2:
                        return '待审核 ';
                    case 3:
                        switch (isOnline) {
                            case 1:
                                switch (isNormalProduct) {
                                    case 1:
                                        return '上架(橱窗) ';
                                    case 0:
                                        return '上架 ';
                                    default:
                                        return '上架 ';
                                }
                            case -1:
                                switch (isNormalProduct) {
                                    case 1:
                                        return '下架(橱窗) ';
                                    case 0:
                                        return '下架 ';
                                    default:
                                        return '下架 ';
                                }
                            default:
                                return '审核通过 ';
                        }
                    case -1:
                        return '审核不通过 ';
                    case -3:
                        return '删除 ';
                    case 5:
                        return '采集库 ';
                    default:
                        return '未知';
                }
            };
        })



})