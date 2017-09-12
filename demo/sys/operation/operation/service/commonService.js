define(['angular'], function(angular) {
    'use strict';
    var comm = angular.module('comm', []);
    comm.factory('commonService', [
            '$http',
            'api',
            'commonTool',
            function($http, api, commonTool) {
                return {
                    getDistrictArea: function() {
                        return $http.get(api.getDistrictArea);
                    },
                    getCountries: function(params) {
                        return $http.get(api.getCountryCode, {
                            'params': params
                        });
                    },
                    getCountriesArray: function() {
                        this.getCountries().success(function(data) {
                            console.log(data.data);
                        })
                    },
                    // 省
                    getProvince: function() {
                        return $http.get(api.getProvince);
                    },
                    // 市
                    getCity: function(proviceId) {
                        return $http.get(api.getCity, {
                            'params': {
                                'districtSplit': '20,' + proviceId
                            }
                        });
                    },
                    // 所有一级类目
                    getAllCategorysOfLevel1: function() {
                        return $http.get(api.getAllCategorysOfLevel1);
                    },
                    // 获取行业列表
                    getIndustrys: function() {
                        return $http.get(api.getIndustrys);
                    },
                    // 获取行业下分类列表
                    getCategorysByIndusId: function(params) {
                        return $http.get(api.getCategorysByIndusId, {
                            'params': params
                        });
                    },
                    // 非一级类目
                    getCategoryChildren: function(param) {
                        return $http.get(api.GoodgetChildCategory, {
                            'params': param
                        });
                    },
                    // 搜索类目
                    searchCategories: function(param) {
                        return $http.get(api.searchCategories, {
                            'params': param
                        });
                    },
                    // 所有套餐
                    getAllSellerPackage: function() {
                        return $http.get(api.getAllSellerPackage);
                    },
                    // 获取二级来源
                    // sourceType代表来源类型
                    // 1采购商，2供应商，3采购需求，4询盘
                    // source 为来源下拉框选择的值type2的值
                    getSecondSourceType: function(param) {
                        return $http.get(api.getSecondSourceType, {
                            'params': param
                        });
                    },
                    // 通过分组名查字典表 keys='group1,group2'
                    getDictItems: function(keys) {
                        var prm = {
                            'keys': keys
                        };
                        return $http.get(api.getDictItems, {
                            'params': prm
                        });
                    },
                    // 设置页码
                    setPageSizeArray: function() {

                        if (!arguments.length) return [];

                        var pageSizeArray = [];

                        function initPageSizeObj(pageSize, pagename) {
                            this.pageSize = pageSize;
                            this.pagename = pagename;
                        };
                        for (var i = 0, len = arguments.length; i < len; i++) {
                            var item = arguments[i];
                            if (isNaN(item)) return [];
                            pageSizeArray.push(new initPageSizeObj(item, "显示" + item + "条"));
                        }
                        return pageSizeArray;
                    },
                    // 跟进人
                    getFollowPeople: function() {
                        var params = {
                            groupId: 282,
                            page: 1,
                            pageSize: 100
                        };
                        return $http.get(api.getFollowUserList, {
                            'params': params
                        });
                    },
                    getListClass: function() {
                        let defaultOptions = {
                            'page': 1,
                            'pageSize': 10
                        };
                        class List {
                            constructor(defaultPaging) {
                                this.defaultPaging = defaultPaging;
                                this.paging = Object.assign(defaultOptions, defaultPaging);
                                this.list = [];
                                this.pagesParams = "10,30,50";
                                this.initDefault();
                            }
                            initDefault() {
                                this.pages = this.setPageSizeArray();
                                this.getList();
                            }
                            getList() {
                                // TODO
                            }
                            search() {
                                this.paging.page = 1;
                                this.getList();
                            }
                            reset() {
                                this.paging = Object.assign({}, this.defaultPaging);
                            }
                            getnewpage(type) {
                                if (type == 1) {
                                    this.paging.page = this.newPage;
                                    this.newPage = null;
                                } else if (type == 0) {
                                    this.paging.page = 1;
                                }
                                this.getList();
                            }
                            setPageSizeArray() {
                                if (!this.pagesParams) return [];
                                class PageSize {
                                    constructor(pageSize) {
                                        this.pageSize = pageSize;
                                        this.pageSizeName = `显示${pageSize}条`;
                                    }
                                }
                                let [paramsArray, ...pageSizeArray] = [this.pagesParams.split(',')];
                                paramsArray.forEach(value => pageSizeArray.push(new PageSize(Number(value))));
                                return pageSizeArray
                            }
                            // 获取国家列表
                            setCountriesList(params) {
                                let lstorage = commonTool.lstorage();
                                let countriesList = lstorage.getItem('countriesList');
                                this.countriesList = [];
                                if (countriesList) {
                                    this.countriesList = JSON.parse(countriesList);
                                } else {
                                    let self = this;
                                    $http.get(api.getCountryCode, { 'params': params }).success(function(data) {
                                        if (data.status === 'success') {
                                            self.countriesList = data.data;
                                            lstorage.setItem('countriesList', data.data);
                                        }
                                    })
                                }
                            }
                            // 获取一级类目
                            setFirCategoriesList() {
                                let lstorage = commonTool.lstorage();
                                let firCategoriesList = lstorage.getItem('firCategoriesList');
                                this.firCategoriesList = [];
                                if (firCategoriesList) {
                                    this.firCategoriesList = JSON.parse(firCategoriesList);
                                } else {
                                    let self = this;
                                    $http.get(api.getAllCategorysOfLevel1).success(function(data) {
                                        if (data.status === 'success') {
                                            self.firCategoriesList = data.data;
                                            lstorage.setItem('firCategoriesList', data.data);
                                        }
                                    })
                                }
                            }

                        }

                        return List;
                    }
                }

            }
        ])
        .controller('baseListController', ['$scope', 'commonService', 'commonTool',
            function($scope, commonService, commonTool) {
                //主要存控制器的方法
                var tools = $scope.tools = {};
                // 主要存控制器的数据
                var vm = $scope.vm = {};
                var paging = {};
                vm.config = {
                    // 设置每页多少条的下拉框
                    pageSizeArray: true,
                    // 初始化多少个时间选择器[页面变量定义从1开始]
                    datePicker: 0
                };
                // 分页-转到第几页
                tools.newpagesize = null;

                tools = angular.extend(tools, {
                    /*页面日期控件,分页条数*/
                    baseInit: function(_config) {
                        var config = angular.extend({}, vm.config, _config);
                        if (config.pageSizeArray) vm.pages = commonService.setPageSizeArray(10, 30, 50);
                        if (config.datePicker > 0) {
                            var count = config.datePicker;
                            /*初始化日期控件相关*/
                            $scope.dateOptions = {
                                formatYear: 'yy',
                                startingDay: 1
                            };
                            for (var i = 1; i <= count; i++) {
                                (function(i) {
                                    $scope["open" + i] = function($event) { // 创建open方法 。 下面默认行为并将opened 设为true
                                        $event.preventDefault();
                                        $event.stopPropagation();
                                        for (var j = 1; j <= count; j++) {
                                            $scope["opened" + j] = (j == i ? true : false);
                                        }
                                    };
                                })(i)
                            }
                        }
                    },
                    baseGetContries: function() {
                        if (!commonTool.isEmpty(localStorage) && !commonTool.isEmpty(localStorage.countryList))
                            return JSON.parse(localStorage.countryList);
                        commonService.getCountries().success(function(data) {
                            if (data.status !== 'success') return;
                            localStorage.countryList = JSON.stringify(data.data);
                            return data.data;
                        })
                    },
                    baseGetProvinces: function() {
                        if (!commonTool.isEmpty(localStorage) && !commonTool.isEmpty(localStorage.provinceList))
                            return JSON.parse(localStorage.provinceList);
                        commonService.getProvince().success(function(data) {
                            if (data.status !== 'success') return;
                            localStorage.provinceList = JSON.stringify(data.data.provinceList);
                            return data.data.provinceList;
                        })
                    }
                });

            }
        ])


});