define(['../module'], function(ng) {
    ng.factory('myfollowService', ['$http', 'api',
        function($http, api) {
            // 合并快速筛选 条件
            function filterQuickParams(params) {
                var keyArray = ['isFollowed', 'isFollowing', 'isLocalTime', 'isMobile', 'isNoFollow'],
                    valArray = ['follower', 'following', 'localTime', 'mobile', 'noFollow'],
                    array = [];
                for (var i = 0, len = keyArray.length; i < len; i++) {
                    if (params[keyArray[i]]) {
                        array.push(valArray[i]);
                        delete params[keyArray[i]];
                    }
                }
                if (array.length) params.filters = array.join(',');
                return params;
            };

            return {
                getMyFollowOfPlatform: function(params) {
                    // return $http.get(api.getMyFollowOfPlatform, {
                    //     'params': filterQuickParams(params)
                    // });
                    return $.ajax({
                        url: api.getMyFollowOfPlatform,
                        type: 'GET',
                        dataType: 'json',
                        data: filterQuickParams(params),
                        async: false
                    })
                },
                getMyFollowOfCantonfair: function(params) {
                    // return $http.get(api.getMyFollowOfCantonfair, {
                    //     'params': filterQuickParams(params)
                    // });
                    return $.ajax({
                        url: api.getMyFollowOfCantonfair,
                        type: 'GET',
                        dataType: 'json',
                        data: filterQuickParams(params),
                        async: false
                    })
                },
                addToList: function(params, type) {
                    var url = type == 1 ? api.addListOfPlat : api.addListOfCfec;
                    return $http.post(url, params);
                }
            };
        }
    ])
    ng.controller('myfollowCtrl', [
        '$scope',
        '$rootScope',
        '$uibModal',
        'myfollowService',
        'commonService',
        'commonTool',
        function(
            $scope,
            $rootScope,
            $uibModal,
            myfollowService,
            commonService,
            commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {
                // 搜索类型: 1:采购商姓名 2:邮箱 3:用户名 4:用户ID 5:广交会Id
                accountType: null,
                // accountType对应的值
                accountTypeValue: null,
                // 国家Id
                countryId: null,
                // 跟进优先级
                followBuyerLevel: null,
                // 最后一次跟进时间
                startTime: null,
                // 最后一次跟进时间
                endTime: null,
                // 分配时间
                assignStartTime: null,
                // 分配时间
                assignEndTime: null,
                // 一级类目
                oneCategory: null,
                // 二级类目
                twoCategory: null,
                // 与会届数
                time: null,
                // 最近跟进标识
                flag: null,
                // 分页
                page: 1,
                pageSize: 10,
                // 可选值：follower,following,mobile,localTime.
                // 多个值用“,”分隔;分别代表：剔除免跟进，加入清单，手机，时间
                filters: null,
                // 剔除免跟进采购商
                isFollowed: 1,
                // 没加入跟进清单的
                isFollowing: 1,
                // 有手机或固话的
                isMobile: null,
                // 当地时间为8:00-21:00的
                isLocalTime: null,
                // 我未跟进的
                isNoFollow: 1
            };
            /*
                平台采购商  :1
                广交会采购商:2
             */
            vm.buyerStatus = 1;

            vm.selectionItme = [];
            vm.showOperateFlag = false;

            tools = angular.extend(tools, {
                // 总入口 根据buyerStatus判断请求数据
                getFollowBuyerList: function(status) {
                    vm.showOperateFlag = false;
                    var targetStatus = status ? status : vm.buyerStatus;
                    vm.items = [];
                    switch (targetStatus) {
                        case 1:
                            this.getMyFollowOfPlatform();
                            break;
                        case 2:
                            this.getMyFollowOfCantonfair();
                            break;
                        default:
                            this.getMyFollowOfPlatform();
                            break;
                    }
                },
                // 平台采购商
                getMyFollowOfPlatform: function() {
                    myfollowService.getMyFollowOfPlatform(commonTool.filterParam(paging)).success(function(data) {
                        vm.items = data.page.items;
                        paging.total = data.page.total;
                    })
                },
                // 广交会采购商
                getMyFollowOfCantonfair: function() {
                    myfollowService.getMyFollowOfCantonfair(commonTool.filterParam(paging)).success(function(data) {
                        vm.items = data.page.items;
                        paging.total = data.page.total;
                    })
                },
                // 搜索
                search: function() {
                    paging.page = 1;
                    this.getFollowBuyerList();
                },
                keyup: function($event) {
                    if ($event.keyCode == 13) {
                        this.search();
                    }
                },
                // 重置
                reset: function() {
                    paging.accountType = null;
                    paging.accountTypeValue = null;
                    paging.countryId = null;
                    paging.followBuyerLevel = null;
                    paging.startTime = null;
                    paging.endTime = null;
                    paging.assignStartTime = null;
                    paging.assignEndTime = null;
                    paging.oneCategory = null;
                    paging.twoCategory = null;
                    paging.time = null;
                    paging.flag = null;
                    paging.page = 1;
                    paging.filters = null;

                    paging.isFollowed = 1;
                    paging.isFollowing = 1;
                    paging.isMobile = null;
                    paging.isLocalTime = null;

                    vm.allChecked = false;
                    vm.selectionItme = [];
                },
                exportExcel: function() {

                    var url = vm.buyerStatus == 1 ? '/oms/buyer/follow/exportExcel.cf' : '/oms/buyer/cantonfair/exportExcel.cf';

                    window.open(url);
                },
                // 获取二级类目
                chxCategotyById: function() {
                    if (commonTool.isEmpty(paging.oneCategory) || paging.oneCategory == -1) {
                        vm.secLevelCate = [];
                        return;
                    }
                    commonService.getCategoryChildren({
                        parentId: paging.oneCategory
                    }).success(function(data) {
                        if ('success' == data.status) {
                            vm.secLevelCate = data.data;
                        }
                    })
                },
                // 分页
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    this.getFollowBuyerList();
                },
                // 加入跟进清单
                addToList: function(type, companyId) {
                    this.addListRequest(companyId, type);

                },
                // 加入跟进清单
                addToListByMuti: function(type) {
                    var buyerCompanyIds = "";
                    vm.allChecked = false;
                    buyerCompanyIds = vm.selectionItme.join(',');
                    if (commonTool.isEmpty(buyerCompanyIds)) {
                        $rootScope.alertMsgService.setMessage("请先选择要审核的买家", 'warning');
                        return;
                    }
                    this.addListRequest(buyerCompanyIds, type);
                    vm.selectionItme = [];
                    vm.showOperateFlag = false;
                },
                // 加入跟进清单 -- 请求
                addListRequest: function(buyerCompanyIds, type) {
                    var params = {
                        buyerCompanyIds: buyerCompanyIds
                    };
                    myfollowService.addToList(params, type).success(function(data) {
                        if (data.status !== 'success') return;
                        $rootScope.alertMsgService.setMessage("保存成功", 'success');
                        tools.getFollowBuyerList();
                    })

                },
                // 全选
                checkAll: function(checked) {
                    vm.selectionItme = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {
                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionItme.push(item.companyId);
                        }
                    });
                },
                // 单选
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.companyId);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                }
            });

            var method = {
                init: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                // 最近跟进标识
                initFollowSign: function() {
                    return [new this.init('Not a Buyer', 1), new this.init('Bounce Email', 2), new this.init('Buying Lead', 3), new this.init('Phone Call Connected', 4), new this.init('Phone Call Disconnected', 5), new this.init('Not speak English', 6), new this.init('Whatsapp', 7), new this.init('Wechat', 8), new this.init('Skype', 9), new this.init('SNS', 10), new this.init('Email', 11), new this.init('No Instant Messenger', 12), new this.init('Others', 13)];
                },
                // 搜索类型
                getSearchTypeArray: function() {
                    return [new this.init('采购商姓名', '1'), new this.init('邮箱', '2'), new this.init('用户名', '3'), new this.init('用户ID', '4'), new this.init('广交会ID', '5'), new this.init('公司名称', '6')];
                },
                // 搜索类型
                getSearchTypeArrayConfair: function() {
                    return [new this.init('邮箱', '1'), new this.init('采购商姓名', '2'), new this.init('广交会ID', '3'), new this.init('公司名称', '4')];
                },
                // 跟进优先级
                getPriorityArray: function() {
                    return [new this.init(1, 1), new this.init(2, 2), new this.init(3, 3), new this.init(4, 4), new this.init(5, 5)];
                },
                // 与会届数
                getArrayOfCfecTimes: function() {
                    return [new this.init('120', 120), new this.init('119', 119), new this.init('118', 118), new this.init('117', 117), new this.init('116', 116), new this.init('115', 115), new this.init('114', 114), new this.init('114以前', 113), ];
                }
            };


            (function() {
                tools.getFollowBuyerList();
                // 分页
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
                // 最近跟进标识
                vm.followSignArray = method.initFollowSign();
                // 搜索类型 - 平台采购商
                vm.searchTypeArray = method.getSearchTypeArray();
                // 搜索类型 - 广交会采购商
                vm.searchTypeArrayConfair = method.getSearchTypeArrayConfair();
                // 跟进优先级
                vm.priorityArray = method.getPriorityArray();
                // 与会届数
                vm.cfecTimesArray = method.getArrayOfCfecTimes();
                // 国家列表
                commonService.getCountries().success(function(data) {
                    if ('success' === data.status) {
                        tools.countries = data.data;
                    }
                });
                // 一级分类
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if ('success' === data.status) {
                        vm.firstLevelCate = data.data;
                        var obj = {
                            categoryName: '无',
                            categoryId: '-1'
                        };
                        vm.firstLevelCate.unshift(obj);
                    }
                })
            }())
        }
    ])
});
