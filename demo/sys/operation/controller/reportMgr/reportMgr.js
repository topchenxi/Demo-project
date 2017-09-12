define(['../module'], function(ng) {
    ng
        .factory('reportService', ['$http', 'api',
            function($http, api) {
                return {
                    getCompanyNature: function() {
                        var url = api.getCompanyNature;
                        return $http.get(url);
                    },
                    // 是否有数据
                    hasData: function(params, url) {
                        return $http.get(url, {
                            'params': params
                        });
                    },
                    // 卖家注册 --查询or导出
                    getSellerRegList: function(params, isExport) {
                        var url = api.getSellerRegList;
                        if (isExport) {
                            url = api.expSellerRegList;
                            return $http({
                                method: 'post',
                                url: url,
                                params: params,
                                responseType: 'arraybuffer'
                            });
                        } else {
                            return $http.get(url, {
                                'params': params
                            });
                        }
                    },
                    // 卖家登陆 --查询or导出
                    getSellerLoginList: function(params, isExport) {
                        var url = api.getSellerLoginList;
                        if (isExport) {
                            url = api.expSellerLoginList;
                            //return $http.post(url, params,{responseType: 'arraybuffer'});
                            return $http({
                                method: 'post',
                                url: url,
                                params: params,
                                responseType: 'arraybuffer'
                            });
                        } else {
                            return $http.get(url, {
                                'params': params
                            });
                        }
                    },
                    // 卖家商品 --查询or导出
                    getSellerProductList: function(params, isExport) {
                        var url = api.getSellerProductList;
                        if (isExport) {
                            url = api.expSellerProductList;
                            // return $http.post(url, params,{responseType: 'arraybuffer'});
                            return $http({
                                method: 'post',
                                url: url,
                                params: params,
                                responseType: 'arraybuffer'
                            });
                        } else {
                            return $http.get(url, {
                                'params': params
                            });
                        }

                    },
                    // 买家注册 --查询or导出
                    getBuyerRegList: function(params, isExport) {
                        var url = api.getBuyerRegList;
                        if (isExport) {
                            url = api.expBuyerRegList;
                            //return $http.post(url, params,{responseType: 'arraybuffer'});
                            return $http({
                                method: 'post',
                                url: url,
                                params: params,
                                responseType: 'arraybuffer'
                            });
                        } else {
                            return $http.get(url, {
                                'params': params
                            });
                        }
                    },
                    // 买家登陆 --查询or导出
                    getBuyerLoginList: function(params, isExport) {
                        var url = api.getBuyerLoginList;
                        if (isExport) {
                            url = api.expBuyerLoginList;
                            //return $http.post(url, params,{responseType: 'arraybuffer'});
                            return $http({
                                method: 'post',
                                url: url,
                                params: params,
                                responseType: 'arraybuffer'
                            });
                        } else {
                            return $http.get(url, {
                                'params': params
                            });
                        }
                    }
                }
            }
        ])
        .controller('ReportSellerRegCtrl', [
            '$scope', '$rootScope', 'reportService', 'commonTool',
            'commonService', 'api',
            function($scope, $rootScope, reportService, commonTool, commonService, api) {
                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                var paging = $scope.paging = {

                    sellerId: "", //卖家ID
                    shopName: "", // 卖家店铺名称
                    userName: "", //联系人姓名
                    gender: "", //性别
                    bizEntity: "", //公司负责人姓名
                    registerStartAmount: "", //公司注册资金起始金额
                    registerEndAmount: "", //公司注册资金结束金额
                    provinceCode: "", //省份代码
                    cityCode: "", //城市代码
                    startTime: "", //注册时间起始时间
                    endTime: "", //注册时间结束时间
                    favProductId: "", //二级类目
                    favProductLevelId: "", //一级级类目

                    page: 1,
                    pageSize: 10
                };
                // 定义"发布时间:起始时间"控件
                var start = {
                    elem: '#startTime',
                    choose: function(data) {
                        end.min = data;
                        end.start = data;
                        paging.startTime = data;
                    },
                    clear: function() {
                        paging.startTime = null;
                    }
                };
                // 定义"发布时间:截止时间"控件
                var end = {
                    elem: '#endTime',
                    choose: function(data) {
                        start.max = data;
                        paging.endTime = data;
                    },
                    clear: function() {
                        paging.endTime = null;
                    }
                };
                // 转到第几页
                tools = $.extend(tools, {
                    newpagesize: null,
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        tools.getList();
                    },
                    // 点击"发布时间:起始时间"输入框事件
                    initStartDate: function() {
                        laydate(start);
                    },
                    // 点击"发布时间:起始时间"输入框事件
                    initEndDate: function() {
                        laydate(end);
                    },
                    initCondition: function(isLoad) {
                        if (isLoad == true) {
                            vm.pages = commonService.setPageSizeArray(10, 30, 50);
                            commonService.getProvince().success(function(data) {
                                if (data.status == 'success') {
                                    vm.provinceList = data.data.provinceList;
                                    localStorage.provinceList = JSON.stringify(data.data);
                                }
                            });
                            commonService.getAllCategorysOfLevel1().success(function(data) {
                                if (data.status == 'success') {
                                    vm.categorys1List = data.data;
                                }
                            });
                        } else {
                            $('#startTime').val(" ");
                            $('#endTime').val(" ");
                            paging.page = 1;
                            paging.sellerId = "";
                            paging.shopName = "";
                            paging.userName = "";
                            paging.gender = "";
                            paging.bizEntity = "";
                            paging.registerStartAmount = "";
                            paging.registerEndAmount = "";
                            paging.provinceCode = "";
                            paging.cityCode = "";
                            paging.startTime = "";
                            paging.endTime = "";
                            paging.favProductId = ""; // 二级类目
                            paging.favProductLevelId = ""; // 一级类目
                        }
                    },
                    changeProvince: function() {
                        paging.cityCode = "";
                        if (commonTool.isEmpty(paging.provinceCode)) {
                            vm.cityList = "";
                        } else {
                            commonService.getCity(paging.provinceCode).success(function(data) {
                                if (data.status == 'success') {
                                    vm.cityList = data.data;
                                }
                            })
                        }
                    },
                    changeCategroy: function() {
                        paging.favProductId = "";
                        if (commonTool.isEmpty(paging.favProductLevelId)) {
                            vm.categorys2List = "";
                        } else {
                            commonService.getCategoryChildren({
                                'parentId': paging.favProductLevelId
                            }).success(function(data) {
                                if ('success' == data.status) {
                                    vm.categorys2List = data.data;
                                } else {
                                    $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                }
                            })
                        }
                    },
                    getList: function() {
                        reportService.getSellerRegList(commonTool.filterParam(paging), false).success(function(data) {
                            if ('success' == data.status) {
                                vm.items = data.data.items;
                                paging.total = data.data.total;
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    },
                    // 导出
                    exportData: function() {
                        var pg = commonTool.filterParam(paging);

                        if (!commonTool.checkExportParam(pg)) {
                            $rootScope.alertMsgService.setMessage("查询条件不能为空", 'warning')
                            return;
                        }
                        reportService.hasData(pg, api.chkSellerRegister).success(function(rs) {
                            if (rs.data === false) {
                                $rootScope.alertMsgService.setMessage("没有符合条件的数据!", 'warning')
                            } else {
                                reportService.getSellerRegList(pg, true).success(function(data) {
                                    var blob = new Blob([data], {
                                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    });
                                    var objectUrl = URL.createObjectURL(blob);
                                    window.open(objectUrl);
                                });
                            }
                        })
                    }
                });
                tools.initCondition(true);
                tools.getList();
            }
        ])
        .controller('ReportSellerLoginCtrl', [
            '$scope', '$rootScope', 'reportService', 'commonTool',
            'commonService', 'api',
            function($scope, $rootScope, reportService, commonTool, commonService, api) {
                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                var paging = $scope.paging = {
                    'page': 1,
                    'pageSize': 10,
                    'sellerId': "", //卖家ID
                    'shopName': "", // 卖家店铺名称
                    "provinceCode": "", //省份代码
                    "cityCode": "", //城市代码
                    "startTime": "", //登陆时间起始时间
                    "endTime": "", //登陆时间结束时间
                    "loginType": null
                };

                // 定义"发布时间:起始时间"控件
                var start = {
                    elem: '#startTime',
                    choose: function(data) {
                        end.min = data;
                        end.start = data;
                        paging.startTime = data;
                    },
                    clear: function() {
                        paging.startTime = null;
                    }
                };
                // 定义"发布时间:截止时间"控件
                var end = {
                    elem: '#endTime',
                    choose: function(data) {
                        start.max = data;
                        paging.endTime = data;
                    },
                    clear: function() {
                        paging.endTime = null;
                    }
                };
                // 转到第几页
                tools = $.extend(tools, {
                    newpagesize: null,
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        tools.getList();
                    },
                    // 点击"发布时间:起始时间"输入框事件
                    initStartDate: function() {
                        laydate(start);
                    },
                    // 点击"发布时间:起始时间"输入框事件
                    initEndDate: function() {
                        laydate(end);
                    },
                    initCondition: function(isLoad) {
                        if (isLoad == true) {
                            vm.pages = commonService.setPageSizeArray(10, 30, 50);
                            commonService.getProvince().success(function(data) {
                                if (data.status == 'success') {
                                    vm.provinceList = data.data.provinceList;
                                    localStorage.provinceList = JSON.stringify(data.data);
                                }
                            })
                        } else {
                            paging.page = 1;
                            paging.sellerId = "";
                            paging.shopName = "";
                            paging.provinceCode = "";
                            paging.cityCode = "";
                            paging.startTime = "";
                            paging.endTime = "";
                            $('#startTime').val('');
                            $('#endTime').val('');
                        }
                    },
                    // 省市联动
                    changeProvince: function() {
                        paging.cityCode = "";
                        if (commonTool.isEmpty(paging.provinceCode)) {
                            vm.cityList = "";
                        } else {
                            commonService.getCity(paging.provinceCode).success(function(data) {
                                if (data.status == 'success') {
                                    vm.cityList = data.data;
                                }
                            })
                        }
                    },
                    // 查询列表
                    getList: function() {
                        reportService.getSellerLoginList(commonTool.filterParam(paging), false).success(function(data) {
                            if ('success' == data.status) {
                                vm.items = data.data.items;
                                paging.total = data.data.total;
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    },
                    exportData: function() {
                        var pg = commonTool.filterParam(paging);
                        if (!commonTool.checkExportParam(pg)) {
                            $rootScope.alertMsgService.setMessage("查询条件不能为空", 'warning')
                            return;
                        }
                        reportService.hasData(pg, api.chkSellerLogin).success(function(rs) {
                            if (rs.data === false) {
                                $rootScope.alertMsgService.setMessage("没有符合条件的数据!", 'warning')
                            } else {
                                reportService.getSellerLoginList(pg, true).success(function(data) {
                                    //console.log(data);
                                    var blob = new Blob([data], {
                                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    });
                                    var objectUrl = URL.createObjectURL(blob);
                                    window.open(objectUrl);
                                });
                            }
                        })
                    },
                    loginTypeList: [{
                            loginType: 0,
                            loginTypeName: 'PC端'
                        },
                        {
                            loginType: 1,
                            loginTypeName: '微信端'
                        }
                    ]
                });
                tools.initCondition(true);
                tools.getList();
            }
        ])
        .controller('ReportSellerProductCtrl', [
            '$scope', '$rootScope', 'reportService', 'commonTool',
            'commonService', 'api',
            function($scope, $rootScope, reportService, commonTool, commonService, api) {
                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                var paging = $scope.paging = {
                    'page': 1,
                    'pageSize': 10,
                    'sellerId': "", //卖家ID
                    'shopName': "", // 卖家店铺名称
                    "productName": "", // 商品名
                    "productStatus": "", //商品状态
                    "categoryId": "", //一级类目
                    "category2Id": "", // 二级类目
                    "uploadStart": "", //上传时间
                    "uploadEnd": "", //
                    "updateStart": "", //修改时间
                    "updateEnd": "" //

                };
                // 转到第几页
                // 定义"商品上传时间:起始时间"控件
                var uploadStart = {
                    elem: '#uploadStart',
                    choose: function(data) {
                        uploadEnd.min = data;
                        uploadEnd.start = data;
                        paging.uploadStart = data;
                    },
                    clear: function() {
                        paging.uploadStart = null;
                    }
                };
                // 定义"商品上传时间:截止时间"控件
                var uploadEnd = {
                    elem: '#uploadEnd',
                    choose: function(data) {
                        uploadStart.max = data;
                        paging.uploadEnd = data;
                    },
                    clear: function() {
                        paging.uploadEnd = null;
                    }
                };

                // 定义"最后更新时间:起始时间"控件
                var updateStart = {
                    elem: '#updateStart',
                    choose: function(data) {
                        updateEnd.min = data;
                        updateEnd.start = data;
                        paging.updateStart = data;
                    },
                    clear: function() {
                        paging.updateStart = null;
                    }
                };
                // 定义"最后更新时间:截止时间"控件
                var updateEnd = {
                    elem: '#updateEnd',
                    choose: function(data) {
                        updateStart.max = data;
                        paging.updateEnd = data;
                    },
                    clear: function() {
                        paging.updateEnd = null;
                    }
                };

                tools = $.extend(tools, {
                    newpagesize: null,
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        tools.getList();
                    },
                    initUploadStart: function() {
                        laydate(uploadStart);
                    },
                    initUploadEnd: function() {
                        laydate(uploadEnd);
                    },
                    initUpdateStart: function() {
                        laydate(updateStart);
                    },
                    initUpdateEnd: function() {
                        laydate(updateEnd);
                    },
                    initCondition: function(isLoad) {
                        if (isLoad == true) {
                            // 设置页码
                            vm.pages = commonService.setPageSizeArray(10, 30, 50);

                            // 一级类目
                            commonService.getAllCategorysOfLevel1().success(function(data) {
                                if (data.status == 'success') {
                                    vm.categorys1List = data.data;
                                }
                            })
                        } else {
                            paging.page = 1;
                            paging.sellerId = "";
                            paging.shopName = "";
                            paging.productName = "";
                            paging.productStatus = "";
                            paging.categoryId = "";
                            paging.category2Id = "";
                            paging.uploadStart = "";
                            paging.uploadEnd = "";
                            paging.updateStart = "";
                            paging.updateEnd = "";
                            $('#uploadStart').val('');
                            $('#uploadEnd').val('');
                            $('#updateStart').val('');
                            $('#updateEnd').val('');

                        }

                    },
                    // 一二级类目联动
                    changeCategroy: function() {
                        paging.category2Id = "";
                        if (commonTool.isEmpty(paging.categoryId)) {
                            vm.categorys2List = "";
                        } else {
                            commonService.getCategoryChildren({
                                'parentId': paging.categoryId
                            }).success(function(data) {
                                if (data.status == 'success') {
                                    vm.categorys2List = data.data;
                                }
                            })
                        }
                    },
                    // 查询列表
                    getList: function() {
                        reportService.getSellerProductList(commonTool.filterParam(paging), false).success(function(data) {
                            if ('success' == data.status) {
                                vm.items = data.data.items;
                                paging.total = data.data.total;
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    },
                    exportData: function() {
                        var pg = commonTool.filterParam(paging);
                        if (!commonTool.checkExportParam(pg)) {
                            $rootScope.alertMsgService.setMessage("查询条件不能为空", 'warning')
                            return;
                        }
                        reportService.hasData(pg, api.chkSellerProduct).success(function(rs) {
                            if (rs.data === false) {
                                $rootScope.alertMsgService.setMessage("没有符合条件的数据!", 'warning')
                            } else {
                                reportService.getSellerProductList(pg, true).success(function(data) {
                                    //console.log(data);
                                    var blob = new Blob([data], {
                                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    });
                                    var objectUrl = URL.createObjectURL(blob);
                                    window.open(objectUrl);
                                });
                            }
                        })
                    }
                });
                tools.initCondition(true);
                tools.getList();
            }
        ])
        .controller('ReportBuyerRegCtrl', [
            '$scope', '$rootScope', 'reportService', 'commonTool',
            'commonService', 'api',
            function($scope, $rootScope, reportService, commonTool, commonService, api) {
                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                var paging = $scope.paging = {
                    'page': 1,
                    'pageSize': 10,
                    'buyerId': "", //买家ID
                    'buyerName': "", // 买家姓名
                    "gender": "", //性别
                    "companyNature": "", //买家性质
                    "countryId": "", //国家
                    "districtId": "", //地区
                    "startTime": "", //注册时间
                    "endTime": ""

                };

                // 定义"发布时间:起始时间"控件
                var start = {
                    elem: '#startTime',
                    choose: function(data) {
                        end.min = data;
                        end.start = data;
                        paging.startTime = data;
                    },
                    clear: function() {
                        paging.startTime = null;
                    }
                };
                // 定义"发布时间:截止时间"控件
                var end = {
                    elem: '#endTime',
                    choose: function(data) {
                        start.max = data;
                        paging.endTime = data;
                    },
                    clear: function() {
                        paging.endTime = null;
                    }
                };
                // 转到第几页
                tools = $.extend(tools, {
                    newpagesize: null,
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        tools.getList();
                    },
                    // 点击"发布时间:起始时间"输入框事件
                    initStartDate: function() {
                        laydate(start);
                    },
                    // 点击"发布时间:起始时间"输入框事件
                    initEndDate: function() {
                        laydate(end);
                    },
                    initCondition: function(isLoad) {
                        if (isLoad == true) {
                            // 设置页码
                            vm.pages = commonService.setPageSizeArray(10, 30, 50);
                            reportService.getCompanyNature().success(function(data) {
                                if (data.status == 'success') {
                                    vm.companyNatureList = data.data;
                                }
                            });
                            // 1.加载地区,如果缓存里有,从缓存中读取
                            if (commonTool.isEmpty(localStorage) || commonTool.isEmpty(localStorage.districtList)) {
                                // 缓存中没有
                                commonService.getDistrictArea().success(function(data) {
                                    if (data.status == 'success') {
                                        vm.areaList = data.data.districtList.items;
                                        localStorage.districtList = JSON.stringify(data.data.districtList.items);
                                    }
                                });
                            } else {
                                vm.areaList = JSON.parse(localStorage.districtList);
                            }

                        } else {
                            paging.page = 1;
                            paging.buyerId = "";
                            paging.buyerName = "";
                            paging.gender = "";
                            paging.companyNature = "";
                            paging.countryId = "";
                            paging.districtId = "";
                            paging.startTime = "";
                            paging.endTime = "";
                            $('#startTime').val();
                            $('#endTime').val();
                        }
                    },
                    // 查询列表
                    getList: function() {
                        reportService.getBuyerRegList(commonTool.filterParam(paging), false).success(function(data) {
                            if ('success' == data.status) {
                                vm.items = data.data.items;
                                paging.total = data.data.total;
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    },
                    // 导出
                    exportData: function() {
                        var pg = commonTool.filterParam(paging);
                        if (!commonTool.checkExportParam(pg)) {
                            $rootScope.alertMsgService.setMessage("查询条件不能为空", 'warning')
                            return;
                        }
                        reportService.hasData(pg, api.chkBuyerRegister).success(function(rs) {
                            if (rs.data === false) {
                                $rootScope.alertMsgService.setMessage("没有符合条件的数据!", 'warning')
                            } else {
                                reportService.getBuyerRegList(pg, true).success(function(data) {
                                    //console.log(data);
                                    var blob = new Blob([data], {
                                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    });
                                    var objectUrl = URL.createObjectURL(blob);
                                    window.open(objectUrl);
                                });
                            }
                        })
                    },
                    // 地区国家联动
                    changeDistrict: function() {
                        paging.countryId = "";
                        vm.countryList = [];
                        if (!commonTool.isEmpty(paging.districtId)) {
                            if (commonTool.isEmpty(vm.countryTemp)) {
                                // 国家,如果缓存里有,从缓存中读取
                                if (commonTool.isEmpty(localStorage) || commonTool.isEmpty(localStorage.countryList)) {
                                    // 缓存中没有
                                    commonService.getCountries().success(function(data) {
                                        if (data.status == 'success') {
                                            vm.countryTemp = data.data;
                                            for (var i = 0; i < vm.countryTemp.length; i++) {
                                                var t = vm.countryTemp[i];
                                                if (t.tradeAreaId == paging.districtId) {
                                                    vm.countryList.push(t);
                                                }
                                            }
                                            localStorage.countryList = JSON.stringify(data.data);
                                        }
                                    })
                                } else {
                                    vm.countryTemp = JSON.parse(localStorage.countryList);
                                    for (var i = 0; i < vm.countryTemp.length; i++) {
                                        var t = vm.countryTemp[i];
                                        if (t.tradeAreaId == paging.districtId) {
                                            vm.countryList.push(t);
                                        }
                                    }
                                }
                            } else {
                                for (var i = 0; i < vm.countryTemp.length; i++) {
                                    var t = vm.countryTemp[i];
                                    if (t.tradeAreaId == paging.districtId) {
                                        vm.countryList.push(t);
                                    }
                                }
                            }
                        }
                    }
                });
                tools.initCondition(true);
                tools.getList();
            }
        ])
        .controller('ReportBuyerLoginCtrl', ['$scope', '$rootScope', 'reportService', 'commonTool', 'commonService', 'api',
            function($scope, $rootScope, reportService, commonTool, commonService, api) {
                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                var paging = $scope.paging = {
                    'page': 1,
                    'pageSize': 10,
                    'buyerId': "", //买家ID
                    'buyerName': "", // 买家姓名
                    "companyNature": "", //买家性质
                    "countryId": "", //国家
                    "districtId": "", //地区
                    "createStart": "", //注册时间
                    "createEnd": "",
                    "loginStart": "", //登陆
                    "loginEnd": ""

                };
                // 转到第几页
                tools.newpagesize = null;
                // 转到第几页
                // 定义"注册时间:起始时间"控件
                var createStart = {
                    elem: '#createStart',
                    choose: function(data) {
                        createEnd.min = data;
                        createEnd.start = data;
                        paging.createStart = data;
                    },
                    clear: function() {
                        paging.createStart = null;
                    }
                };
                // 定义"注册时间:截止时间"控件
                var createEnd = {
                    elem: '#createEnd',
                    choose: function(data) {
                        createStart.max = data;
                        paging.createEnd = data;
                    },
                    clear: function() {
                        paging.createEnd = null;
                    }
                };

                // 定义"登录时间:起始时间"控件
                var loginStart = {
                    elem: '#loginStart',
                    choose: function(data) {
                        loginEnd.min = data;
                        loginEnd.start = data;
                        paging.loginStart = data;
                    },
                    clear: function() {
                        paging.loginStart = null;
                    }
                };
                // 定义"登录时间:截止时间"控件
                var loginEnd = {
                    elem: '#loginEnd',
                    choose: function(data) {
                        loginStart.max = data;
                        paging.loginEnd = data;
                    },
                    clear: function() {
                        paging.loginEnd = null;
                    }
                };

                tools = $.extend(tools, {
                    newpagesize: null,
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        tools.getList();
                    },
                    initCreateStartDate: function() {
                        laydate(createStart);
                    },
                    initCreateEndDate: function() {
                        laydate(createEnd);
                    },
                    initLoginStartDate: function() {
                        laydate(loginStart);
                    },
                    initLoginEndDate: function() {
                        laydate(loginEnd);
                    },
                    initCondition: function(isLoad) {
                        if (isLoad == true) {
                            vm.pages = commonService.setPageSizeArray(10, 30, 50);
                            reportService.getCompanyNature().success(function(data) {
                                if (data.status == 'success') {
                                    vm.companyNatureList = data.data;
                                }
                            });
                            if (commonTool.isEmpty(localStorage) || commonTool.isEmpty(localStorage.districtList)) {
                                commonService.getDistrictArea().success(function(data) {
                                    if (data.status == 'success') {
                                        vm.areaList = data.data.districtList.items;
                                        localStorage.districtList = JSON.stringify(data.data.districtList.items);
                                    }
                                });
                            } else {
                                vm.areaList = JSON.parse(localStorage.districtList);
                            }
                        } else {
                            paging.page = 1;
                            paging.buyerId = "";
                            paging.buyerName = "";
                            paging.companyNature = "";
                            paging.countryId = "";
                            paging.districtId = "";
                            paging.createStart = "";
                            paging.createEnd = "";
                            paging.loginStart = "";
                            paging.loginEnd = "";
                            $('#createStart').val('');
                            $('#createEnd').val('');
                            $('#loginStart').val('');
                            $('#loginEnd').val('');
                        }
                    },
                    changeDistrict: function() {
                        paging.countryId = "";
                        vm.countryList = [];
                        if (!commonTool.isEmpty(paging.districtId)) {
                            if (commonTool.isEmpty(vm.countryTemp)) {
                                // 国家,如果缓存里有,从缓存中读取
                                if (commonTool.isEmpty(localStorage) || commonTool.isEmpty(localStorage.countryList)) {
                                    // 缓存中没有,因为是异步请求,所以for不能抽出来
                                    commonService.getCountries().success(function(data) {
                                        if (data.status == 'success') {
                                            vm.countryTemp = data.data;
                                            for (var i = 0; i < vm.countryTemp.length; i++) {
                                                var t = vm.countryTemp[i];
                                                if (t.tradeAreaId == paging.districtId) {
                                                    vm.countryList.push(t);
                                                }
                                            }
                                            localStorage.countryList = JSON.stringify(data.data);
                                        }
                                    })
                                } else {
                                    vm.countryTemp = JSON.parse(localStorage.countryList);
                                    for (var i = 0; i < vm.countryTemp.length; i++) {
                                        var t = vm.countryTemp[i];
                                        if (t.tradeAreaId == paging.districtId) {
                                            vm.countryList.push(t);
                                        }
                                    }
                                }
                            } else {
                                for (var i = 0; i < vm.countryTemp.length; i++) {
                                    var t = vm.countryTemp[i];
                                    if (t.tradeAreaId == paging.districtId) {
                                        vm.countryList.push(t);
                                    }
                                }
                            }

                        }
                    },
                    // 查询列表
                    getList: function() {
                        reportService.getBuyerLoginList(commonTool.filterParam(paging), false).success(function(data) {
                            if ('success' == data.status) {
                                vm.items = data.data.items;
                                paging.total = data.data.total;
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    },
                    // 导出
                    exportData: function() {
                        var pg = commonTool.filterParam(paging);
                        if (!commonTool.checkExportParam(pg)) {
                            $rootScope.alertMsgService.setMessage("查询条件不能为空", 'warning')
                            return;
                        }
                        reportService.hasData(pg, api.chkBuyerLogin).success(function(rs) {
                            if (rs.data === false) {
                                $rootScope.alertMsgService.setMessage("没有符合条件的数据!", 'warning')
                            } else {
                                reportService.getBuyerLoginList(pg, true).success(function(data) {
                                    //console.log(data);
                                    var blob = new Blob([data], {
                                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    });
                                    var objectUrl = URL.createObjectURL(blob);
                                    window.open(objectUrl);
                                });
                            }
                        })
                    }
                })
                tools.initCondition(true);
                tools.getList();
            }
        ])
        .filter('gender', function() {
            return function(status) {
                switch (status) {
                    case 2:
                        return "女";
                    case 1:
                        return "男";
                    default:
                        return "";
                }
            }
        })
        .filter('productStatus', function() {
            return function(status) {
                switch (status) {
                    case -3:
                        return "删除";
                    case -1:
                        return "审核不通过";
                    case 0:
                        return "数据不完整";
                    case 2:
                        return "待审核";
                    case 3:
                        return "审核通过";
                    case -21:
                        return "审核通过(下架)";
                    case 21:
                        return "审核通过(上架)";
                    default:
                        return "";
                }
            }
        })
})