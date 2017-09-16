/**
 *
 * @authors huangqinxian@cf-ec.com
 * @date    2016-07-12 16:48:03
 * @version 1.0
 */

define(['../module'], function(ng) {
    ng.factory('followManageService', [
        '$http',
        'api',
        function($http, api) {
            return {
                getBuyerSourceType: function(param) {
                    return $http.get(api.getBuyerSourceType, {
                        'params': param
                    });
                },
                /**
                 * [getFollowBuyerList 获取采购商]
                 * @param  {[int]} status [采购商状态]
                 * 平台采购商   -- 未分配(未跟进) : 1 
                 * 平台采购商   -- 已分配(已跟进) : 2 
                 * 广交会采购商 -- 未分配(未跟进) : 3 
                 * 广交会采购商 -- 已分配(已跟进) : 4 
                 * @param  {[objec]} paging [搜索参数]
                 * @return [接口返回对象]
                 */
                getFollowBuyerList: function(status, paging) {
                    var params = {};
                    var requestApi = '';
                    switch (status) {
                        case 1:
                            params = {
                                // 审核状态
                                // auditStatus: paging.auditStatus,
                                // 商务合作采购商
                                // businessCooper: paging.businessCooper,
                                // 其他展会采购商
                                // otherExhibition: paging.otherExhibition,
                                // 公司区域
                                tradeAreaId: paging.tradeAreaId,
                                // 公司国家
                                countryId: paging.countryId,
                                // 开始时间（创建时间）
                                fromDate: paging.fromDate ? paging.fromDate : null,
                                // 结束时间（创建时间）
                                toDate: paging.toDate ? paging.toDate : null,
                                // 来源
                                source: paging.source,
                                // 细分来源
                                sourceFourType: paging.sourceFourType,
                                // 采购一级分类
                                parentcategoryId: paging.parentcategoryId,
                                // 采购二级分类
                                categoryId: paging.categoryId,
                                //是否有手机或固话
                                hasMobile: paging.hasMobile ? paging.hasMobile : null,
                                hasEmail: paging.hasEmail ? paging.hasEmail : null

                            };
                            requestApi = api.getBuyerPlatUnassigned;
                            break;
                        case 2:
                            params = {
                                // 审核状态
                                auditStatus: paging.auditStatus,
                                // 商务合作采购商
                                businessCooper: paging.businessCooper,
                                // 其他展会采购商
                                otherExhibition: paging.otherExhibition,
                                // 公司区域
                                tradeAreaId: paging.tradeAreaId,
                                // 公司国家
                                countryId: paging.countryId,
                                // 开始时间（创建时间）
                                fromDate: paging.fromDate ? paging.fromDate : null,
                                // 结束时间（创建时间）
                                toDate: paging.toDate ? paging.toDate : null,
                                // 来源
                                source: paging.source,
                                // 细分来源
                                sourceFourType: paging.sourceFourType,
                                // 采购一级分类
                                parentcategoryId: paging.parentcategoryId,
                                // 采购二级分类
                                categoryId: paging.categoryId,
                                // 跟进人id
                                follower: paging.follower,

                                page: paging.page,
                                pageSize: paging.pageSize,
                                //是否有手机或固话
                                hasMobile: paging.hasMobile ? paging.hasMobile : null,
                                hasEmail: paging.hasEmail ? paging.hasEmail : null

                            };
                            requestApi = api.getBuyerPlatAssigned;
                            break;
                        case 3:
                            params = {
                                // 公司区域
                                tradeAreaId: paging.tradeAreaId,
                                // 公司国家
                                countryId: paging.countryId,
                                // 与会届数
                                boothNo: paging.boothNo,
                                // 采购一级分类
                                parentcategoryId: paging.parentcategoryId,
                                // 采购二级分类
                                categoryId: paging.categoryId,
                                //是否有手机或固话
                                hasMobile: paging.hasMobilethird ? paging.hasMobilethird : null,
                                hasEmail: paging.hasEmailthird ? paging.hasEmailthird : null
                            };
                            requestApi = api.getBuyerCfecUnassigned;
                            break;
                        case 4:
                            params = {
                                // 公司区域
                                tradeAreaId: paging.tradeAreaId,
                                // 公司国家
                                countryId: paging.countryId,
                                // 与会届数
                                boothNo: paging.boothNo,
                                // 跟进人
                                follower: paging.follower,
                                // 采购一级分类
                                parentcategoryId: paging.parentcategoryId,
                                // 采购二级分类
                                categoryId: paging.categoryId,
                                // 分页
                                page: paging.page,
                                pageSize: paging.pageSize,
                                //是否有手机或固话
                                hasMobile: paging.hasMobilethird ? paging.hasMobilethird : null,
                                hasEmail: paging.hasEmailthird ? paging.hasEmailthird : null
                            }
                            requestApi = api.getBuyerCfecAssigned;
                            break;
                        default:
                            break;
                    }
                    if (paging.accountType && paging.accountTypeValue) {
                        var str = 'username';
                        switch (paging.accountType) {
                            case '1':
                                str = 'buyerName'
                                break;
                            case '2':
                                str = 'email'
                                break;
                            case '3':
                                str = 'username'
                                break;
                            case '4':
                                str = 'userId'
                                break;
                            case '5':
                                str = 'cantonfairId'
                                break;
                            case '6':
                                str = 'companyName'
                                break;
                            case '7':
                                str = 'name'
                                break;
                            default:
                                str = 'username'
                                break;
                        }
                        params[str] = paging.accountTypeValue;
                    }
                    return $http.get(requestApi, {
                        'params': params
                    });
                },
                // 批量分配
                batchSaveFollowBuyer: function(status, params) {

                    var requestApi = status == 1 ? api.saveBuyerPlatFollower : api.saveBuyerCfecFollower;

                    return $http.post(requestApi, params);

                },
                // 更新公司跟进人
                updateFollowBuyer: function(status, params) {
                    var requestApi = status == 2 ? api.batchUpdateBuyerPlatFollower : api.batchUpdateBuyerCfecFollower;
                    return $http.post(requestApi, params);
                },
                // 删除公司跟进人
                delFollowBuyer: function(status, params) {
                    var requestApi = status == 2 ? api.delBuyerPlatFollower : api.delBuyerCfecFollower;
                    return $http.post(requestApi, params);
                }

            };
        }
    ])
    ng.controller('followManageCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$uibModal',
        'followManageService',
        'commonService',
        'commonTool',
        function(
            $scope,
            $rootScope,
            ngDialog,
            $uibModal,
            followManageService,
            commonService,
            commonTool
        ) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {

                page: 1,
                pageSize: 10
            };

            /**
             * 平台采购商   -- 未分配(未跟进) : 1 
             * 平台采购商   -- 已分配(已跟进) : 2 
             * 广交会采购商 -- 未分配(未跟进) : 3 
             * 广交会采购商 -- 已分配(已跟进) : 4 
             * @type {Number}
             **/

            vm.followMgStatus = 1;
            vm.showOperateFlag = false;
            vm.allChecked = false;
            vm.selectionItme = [];

            vm.batchFlag = false;

            tools = $.extend(tools, {
                initTab: function(status) {
                    vm.followMgStatus = status;


                    this.getFollowBuyerList(true);

                },
                getFollowBuyerList: function(flag) {
                    vm.items = null;
                    if (flag) {
                        this.reset();
                    }
                    if (vm.followMgStatus == 1) {
                        vm.plotItems = null;
                        followManageService.getFollowBuyerList(vm.followMgStatus, commonTool.filterParam(paging)).success(function(data) {
                            vm.plotItems = data.data;
                        })

                    } else if (vm.followMgStatus == 3) {
                        vm.cfecItems = null;
                        followManageService.getFollowBuyerList(vm.followMgStatus, commonTool.filterParam(paging)).success(function(data) {
                            vm.cfecItems = data.data;
                        })
                    } else if (vm.followMgStatus == 2) {
                        vm.items = null;
                        followManageService.getFollowBuyerList(vm.followMgStatus, commonTool.filterParam(paging)).success(function(data) {
                            vm.items = data.data.items;
                            paging.total = data.data.total;
                            paging.pageSize = data.data.pageSize;

                        })
                    } else {
                        vm.items = null;
                        followManageService.getFollowBuyerList(vm.followMgStatus, commonTool.filterParam(paging)).success(function(data) {
                            vm.items = data.data.items;
                            if (!commonTool.isEmpty(vm.items) && vm.items.length > 0) {
                                for (var i = 0; i < vm.items.length; i++) {
                                    var item = vm.items[i];
                                    if (commonTool.isEmpty(item.companyId)) {
                                        vm.items[i].companyId = item.operBuyerCompanyId;
                                    }
                                }
                            }

                            paging.total = data.data.total;
                            paging.pageSize = data.data.pageSize;

                        })
                    }


                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    this.getFollowBuyerList();
                },
                search: function() {
                    vm.batchFlag = true;
                    paging.page = 1;
                    this.getFollowBuyerList();
                },
                reset: function() {
                    paging.accountType = null;
                    paging.accountTypeValue = null;
                    paging.source = null;
                    paging.sourceFourType = null;
                    paging.auditStatus = null;
                    paging.businessCooper = null;
                    paging.otherExhibition = null;
                    paging.countryId = null;
                    paging.categoryId = null;
                    paging.fromDate = null;
                    paging.toDate = null;
                    paging.boothNo = null;
                    paging.parentcategoryId = null;
                    paging.tradeAreaId = null;
                    paging.follower = null;
                    vm.secondSourceArray = [];
                    vm.secLevelCate = [];
                    vm.showOperateFlag = false;
                    vm.allChecked = false;
                    vm.selectionItme = [];
                    vm.batchFlag = false;
                    paging.hasMobile = null;
                    paging.hasEmail = null;
                    paging.hasMobilethird = null;
                    paging.hasEmailthird = null;
                },
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
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.companyId);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                },
                getSecondSource: function() {
                    if (commonTool.isEmpty(paging.source)) {
                        vm.secondSourceArray = [];
                        return;
                    }
                    var tmpObj = {
                        sourceType: 1,
                        source: paging.source
                    };
                    commonService.getSecondSourceType(tmpObj).success(function(data) {
                        if ('success' === data.status) {
                            vm.secondSourceArray = data.data;
                        } else {
                            console.log('error');
                        }
                    })
                },
                chxCategotyById: function() {

                    // this.getFollowBuyerList();
                    vm.batchFlag = false;
                    if (commonTool.isEmpty(paging.parentcategoryId) || paging.parentcategoryId == -1) {
                        vm.secLevelCate = [];
                        return;
                    }
                    commonService.getCategoryChildren({
                        parentId: paging.parentcategoryId
                    }).success(function(data) {
                        if ('success' == data.status) {
                            vm.secLevelCate = data.data;
                        }
                    })

                },
                chxTradeAreaById: function() {
                    if (paging.tradeAreaId == null || paging.tradeAreaId == -1) {
                        vm.secLevelCate = [];
                        return;
                    }
                    commonService.getCountries({
                        'tradeAreaId': paging.tradeAreaId
                    }).success(function(data) {
                        if ('success' == data.status) {

                            vm.countries = data.data;
                        }
                    });
                },
                batchSaveFollowBuyer: function(amount, status) {
                    $scope.amount = amount;
                    $scope.status = status;
                    $scope.params = paging;
                    $scope.tools = tools;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'batchSaveBuyer.html',
                        controller: 'batchSaveBuyerCtrl'
                    })
                },
                chxFollowBuyerByAll: function() {
                    tools.chxStatusByNotify(vm.selectionItme.join(','));
                },
                chxFollowBuyer: function(companyId) {
                    tools.chxStatusByNotify(companyId);
                },
                chxStatusByNotify: function(companyIds) {
                    $scope.tools = tools;
                    $scope.status = vm.followMgStatus;
                    $scope.companyIds = companyIds;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'chxStatusByNotify.html',
                        controller: 'chxFollowStatusCtrl'
                    })
                },
            });

            var method = {
                key: "",
                value: "",
                myObject: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                getSearchTypeArray: function() {
                    return [new this.myObject('采购商姓名', '1'), new this.myObject('邮箱', '2'), new this.myObject('用户名', '3'), new this.myObject('用户ID', '4'), new this.myObject('广交会ID', '5'), new this.myObject('公司名称', '6'), ];
                },
                getCfecSearchTypeArray: function() {
                    return [new this.myObject('邮箱', '2'), new this.myObject('采购商姓名', '7'), new this.myObject('广交会ID', '5'), new this.myObject('公司名称', '6'), ];
                },
                getCooperationArray: function() {
                    return [new this.myObject('是', 1), new this.myObject('否', 0)];
                },
                getAuditStatusArray: function() {
                    return [new this.myObject('新增', 0), new this.myObject('待审核', 2), new this.myObject('审核通过', 3), new this.myObject('审核不通过', -1)];
                },
                getOtherExhibitionArray: function() {
                    var tmpArr = [new this.myObject('是', 1), new this.myObject('否', 0)];
                    return tmpArr;
                },
                getArrayOfCfecTimes: function() {
                    return [new this.myObject('120', 120), new this.myObject('119', 119), new this.myObject('118', 118), new this.myObject('117', 117), new this.myObject('116', 116), new this.myObject('115', 115), new this.myObject('114', 114), new this.myObject('114以前', 113), ];
                }
            };

            (function() {
                vm.secLevelCate = [];

                vm.pages = commonService.setPageSizeArray(10, 50, 100);
                vm.searchTypeArray = method.getSearchTypeArray();
                vm.cooperationArray = method.getCooperationArray();
                vm.auditStatusArray = method.getAuditStatusArray();
                vm.cfecSearchTypeArray = method.getCfecSearchTypeArray();
                vm.otherExhibitionArray = method.getOtherExhibitionArray();
                vm.cfecTimesArray = method.getArrayOfCfecTimes();
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if ('success' == data.status) {
                        vm.firstLevelCate = data.data;
                        var obj = {
                            categoryName: '无',
                            categoryId: '-1'
                        };
                        vm.firstLevelCate.unshift(obj);
                    }
                });
                var params = {
                    valid: 1
                };
                commonService.getFollowPeople(params).success(function(data) {
                    if ('success' === data.status) {
                        vm.followPeopleArray = data.page.items;
                    }
                });
                followManageService.getBuyerSourceType().success(function(data) {
                    if ('success' === data.status) {
                        vm.sourceArray = data.data;
                    }
                });
                commonService.getCountries().success(function(data) {
                    if ('success' == data.status) {
                        vm.countries = data.data;
                    }
                });
                commonService.getDistrictArea().success(function(data) {
                    if ('success' == data.status) {
                        var obj = {
                            tradeAreaCnName: '无',
                            tradeAreaId: '-1'
                        };
                        vm.districtList = data.data.districtList.items;
                        vm.districtList.unshift(obj);
                    }
                });
            }());
        }
    ])

    ng.controller('batchSaveBuyerCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        'followManageService',
        'commonService',
        'commonTool',
        function(
            $scope,
            $rootScope,
            ngDialog,
            followManageService,
            commonService,
            commonTool) {
            var vm = $scope.vm = {},
                amount = $scope.amount,
                status = $scope.status,
                paging = $scope.paging,
                tools = $scope.tools;

            vm.amount = amount;

            $scope.btnFlag = false;

            function Distribute(followerUserId, number) {
                this.followerUserId = followerUserId;
                this.number = number;
                this.getParsmsStr = function() {
                    return this.followerUserId + '@' + this.number;
                }
                return this;
            }


            vm.follower = null;
            vm.chxType = 1;
            // 正整数
            var reg = /^[0-9]*[1-9][0-9]*$/;

            tools = $.extend(tools, {
                submit: function() {
                    var flag = this.checkList();
                    if (!flag) return;
                    var resultStr = this.getResultStr();
                    var params = this.getResultParsms(status, paging, resultStr);
                    $scope.btnFlag = true;
                    followManageService.batchSaveFollowBuyer(status, params).success(function(data) {
                        if (data.status === 'success') {
                            ngDialog.closeAll();
                            $rootScope.alertMsgService.setMessage("分配成功", 'success');
                            tools.getFollowBuyerList();
                        } else {
                            $scope.btnFlag = false;
                        }

                    })
                },
                close: function() {
                    ngDialog.closeAll();
                },
                getResultStr: function() {
                    var tmpArr = [];
                    for (var i = 0; i < vm.distributeList.length; i++) {
                        var item = vm.distributeList[i];
                        tmpArr.push(item.getParsmsStr());
                    }
                    return tmpArr.join(',');
                },
                getResultParsms: function(status, paging, resultStr) {
                    var params = {};
                    switch (status) {
                        case 1:
                            params = {
                                // 审核状态
                                auditStatus: paging.auditStatus,
                                // 商务合作采购商
                                businessCooper: paging.businessCooper,
                                // 其他展会采购商
                                otherExhibition: paging.otherExhibition,
                                // 公司区域
                                tradeAreaId: paging.tradeAreaId,
                                // 公司国家
                                countryId: paging.countryId,
                                // 开始时间（创建时间）
                                fromDate: paging.fromDate ? paging.fromDate : null,
                                // 结束时间（创建时间）
                                toDate: paging.toDate ? paging.toDate : null,
                                // 来源
                                source: paging.source,
                                // 细分来源
                                sourceFourType: paging.sourceFourType,
                                // 采购产品分类
                                parentcategoryId: paging.parentcategoryId,
                                // 采购产品分类
                                categoryId: paging.categoryId,
                                hasMobile: paging.hasMobile,
                                hasEmail: paging.hasEmail
                            };
                            break;
                        case 3:
                            params = {
                                // 公司区域
                                tradeAreaId: paging.tradeAreaId,
                                // 公司国家
                                countryId: paging.countryId,
                                // 与会届数
                                boothNo: paging.boothNo,
                                // 采购产品分类
                                parentcategoryId: paging.parentcategoryId,
                                // 采购产品分类
                                categoryId: paging.categoryId,
                                hasMobile: paging.hasMobilethird,
                                hasEmail: paging.hasEmailthird
                            };
                            break;
                        default:
                            break;
                    }


                    var str = 'username';
                    switch (paging.accountType) {
                        case '1':
                            str = 'buyerName'
                            break;
                        case '2':
                            str = 'email'
                            break;
                        case '3':
                            str = 'username'
                            break;
                        case '4':
                            str = 'userId'
                            break;
                        case '5':
                            str = 'cantonfairId'
                            break;
                        case '6':
                            str = 'companyName'
                            break;
                        case '7':
                            str = 'name'
                            break;
                        default:
                            str = 'username'
                            break;
                    }
                    params[str] = paging.accountTypeValue;
                    params.followers = resultStr;
                    return commonTool.filterParam(params);
                },
                addDistribute: function() {
                    if (vm.distributeList.length >= vm.followPeopleArray.length) return;
                    var length = vm.distributeList.length;
                    vm.distributeList.push(new Distribute(vm.followPeopleArray[0].userId, null));
                    // this.getRemainderAmount();
                },
                delDistribute: function(index) {
                    if (vm.distributeList.length <= 0) return;
                    vm.distributeList.splice(index, 1);
                    // this.getRemainderAmount();
                },
                isInteger: function(value) {
                    var reg = /^[0-9]*[1-9][0-9]*$/;
                    return reg.test(value);
                },
                isRepeat: function(array) {
                    var tmpArr = [];
                    var tmpObj = {};
                    for (var i = 0; i < array.length; i++) {
                        if (!tmpObj[array[i]]) {
                            tmpArr.push(array[i]);
                            tmpObj[array[i]] = 1;
                        } else {
                            return true;
                        }
                    }
                    return false;
                },
                getRemainderAmount: function() {
                    var tmpTotal = 0;
                    for (var i = 0; i < vm.distributeList.length - 1; i++) {
                        var item = vm.distributeList[i];
                        if (this.isInteger(item.number)) {
                            tmpTotal += item.number;
                        }
                    }

                    var remainder = amount - tmpTotal;
                    if (remainder < 0) {
                        $rootScope.alertMsgService.setMessage("分配数量总和不能大于分配总数", 'warning');
                        return;
                    }
                    vm.distributeList[vm.distributeList.length - 1].number = remainder;

                },
                chxNumber: function(item) {
                    return;
                    if (commonTool.isEmpty(item.followerUserId)) {
                        $rootScope.alertMsgService.setMessage("请先选择要分配跟进人", 'warning');
                        return false;
                    }
                    if (!this.isInteger(item.number)) {
                        $rootScope.alertMsgService.setMessage("分配数量必需为正整数", 'warning');
                        return;
                    }
                    this.getRemainderAmount();
                },
                showWarnMsg: function(message) {
                    $rootScope.alertMsgService.setMessage(message, 'warning');
                    return false;
                },
                checkList: function() {
                    var total = 0;
                    var followerUserIdArray = [];
                    if (vm.distributeList.length <= 0) return this.showWarnMsg("请先选择要分配跟进人");
                    for (var i = 0; i < vm.distributeList.length; i++) {
                        var item = vm.distributeList[i];
                        if (commonTool.isEmpty(item.followerUserId)) return this.showWarnMsg("请先选择要分配跟进人");
                        if (commonTool.isEmpty(item.number)) return this.showWarnMsg("请先填写分配数量");
                        if (!this.isInteger(item.number)) return this.showWarnMsg("分配数量必需为正整数");
                        total += parseInt(item.number);
                        followerUserIdArray.push(item.followerUserId);
                    }
                    if (total > amount) return this.showWarnMsg("分配数量总和不能大于查询结果数");
                    if (this.isRepeat(followerUserIdArray)) return this.showWarnMsg("不能重复选择跟进人");
                    return true;
                }
            });



            init_data();

            function init_data() {
                var params = {
                    valid: 1
                };
                commonService.getFollowPeople(params).success(function(data) {
                    if ('success' == data.status) {
                        vm.followPeopleArray = data.page.items;
                        vm.distributeList = [];
                    }
                });
            }

        }
    ])

    ng.controller('chxFollowStatusCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        'followManageService',
        'commonService',
        'commonTool',
        function(
            $scope,
            $rootScope,
            ngDialog,
            followManageService,
            commonService,
            commonTool) {
            var vm = $scope.vm = {},
                tools = $scope.tools,
                companyIds = $scope.companyIds,
                status = $scope.status;
            vm.follower = null;
            vm.chxType = 2;

            tools = $.extend(tools, {
                submit: function() {
                    if (vm.chxType == 2 && commonTool.isEmpty(vm.follower)) {
                        $rootScope.alertMsgService.setMessage('请先选择跟进人', 'warning');
                        return;
                    }
                    // 1是删除
                    if (vm.chxType == 1) {
                        var params = {
                            companyIds: companyIds
                        };
                        followManageService.delFollowBuyer(status, commonTool.filterParam(params)).success(function(data) {
                            if (data.status === 'success') {
                                $rootScope.alertMsgService.setMessage("删除成功", 'success');
                                ngDialog.closeAll();
                                tools.getFollowBuyerList();
                            }
                        })
                    } else {
                        var params = {
                            companyIds: companyIds,
                            followerUserId: vm.follower
                        };
                        followManageService.updateFollowBuyer(status, params).success(function(data) {
                            if (data.status === 'success') {
                                $rootScope.alertMsgService.setMessage("修改成功", 'success');
                                ngDialog.closeAll();
                                tools.getFollowBuyerList();
                            }
                        })
                    }
                },
                close: function() {
                    ngDialog.closeAll();
                }
            });

            init_data();

            function init_data() {
                var params = {
                    valid: 1
                };
                commonService.getFollowPeople(params).success(function(data) {
                    if ('success' == data.status) {
                        vm.followPeopleArray = data.page.items;
                    }
                });
            }

        }
    ])

    ng.filter('checkFollowBuyerStatus', function() {
        return function(status) {
            switch (status) {
                case 0:
                    return '新增';
                case 2:
                    return '待审核';
                case 3:
                    return '审核通过';
                case -1:
                    return '审核不通过';
                default:
                    return "";
            }
        }
    })

});