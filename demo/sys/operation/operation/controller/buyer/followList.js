define(['../module'], function(ng) {
    ng.factory('followListService', ['$http', 'api',
        function($http, api) {
            function filterQuickParams(params, status) {
                var keyArray = ['isLocalTime', 'isMobile'],
                    valArray = ['localTime', 'mobile'],
                    array = [];
                for (var i = 0, len = keyArray.length; i < len; i++) {
                    if (params[keyArray[i]]) {
                        array.push(valArray[i]);
                        delete params[keyArray[i]];
                    }
                }
                if (array.length) params.filters = array.join(',');

                if (params.searchType && params.searchTypeValue) {
                    var platSearchArray = ['', 'buyerName', 'companyName', 'email', 'userName', 'userId', 'cfId'],
                        cfecSearchArray = ['', 'email', 'buyerName', 'cfId', 'companyName'],
                        searchArray = status == 1 ? platSearchArray : cfecSearchArray;
                    params[searchArray[+params.searchType]] = params.searchTypeValue;
                }
                delete params.searchType;
                delete params.searchTypeValue;

                return params;
            };

            return {
                getFollowListOfPlat: function(params) {
                    return $http.get(api.getFollowListOfPlat, {
                        'params': filterQuickParams(params, 1)
                    });
                },
                getFollowListOfCfec: function(params) {
                    return $http.get(api.getFollowListOfCfec, {
                        'params': filterQuickParams(params, 2)
                    });
                },
                removeFromList: function(params, type) {
                    var url = type == 1 ? api.removeListOfPlat : api.removeListOfCfec;
                    return $http.post(url, params);
                },
                addFollowRecord: function(params, type) {
                    var url = type == 1 ? api.addFollowRecordOfPlat : api.addFollowRecordOfCfec;
                    return $http.post(url, params);
                }
            };
        }
    ])
    ng.controller('followListCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$location',
        '$uibModal',
        'followListService',
        'buyerService',
        'cfecBuyerService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, followListService, buyerService, cfecBuyerService,
            commonService, commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};

            var paging = $scope.paging = {

                // 排序规则
                order: 'followTime',
                // 快速筛选
                filters: null,
                // 有手机或固话的
                isMobile: null,
                // 当地时间为8:00-21:00的
                isLocalTime: null,

                page: 1,

                pageSize: 10
            }

            /*
               平台采购商:1
               广交会采购商:2
            */
            vm.buyerStatus = 1;
            vm.showOperateFlag = false;
            vm.selectionBuyerIdItem = [];
            vm.selectionCompanyIdItem = [];

            vm.buyerOfPlatInfo = null;
            vm.buyerOfCfecInfo = null;
            // 采购需求
            var purchaseParams = {
                dropdwonType: 5,
                dropdwonValue: null,
                productName: null,
                page: 1,
                pageSize: 5
            };
            // 询盘
            var enquiryParams = {
                ddBuyerType: 5,
                ddBuyerValue: null,
                page: 1,
                pageSize: 5
            };
            // 跟进记录
            var followPlatParams = {
                buyerId: null,

                page: 1,
                pageSize: 5
            };

            // 跟进记录
            var followCfecParams = {
                buyerId: null,

                page: 1,
                pageSize: 5
            };

            vm.isNotifying = false;

            var formValid;

            tools = $.extend(tools, {
                // 总入口，根据buyerStatus判断数据
                getFollowBuyerList: function(status) {

                    var targetStatus = status ? status : vm.buyerStatus;
                    vm.items = [];
                    vm.buyerOfPlatInfo = null;
                    vm.buyerOfCfecInfo = null;
                    switch (targetStatus) {
                        case 1:
                            this.getFollowListOfPlat();
                            break;
                        case 2:
                            this.getFollowListOfCfec();
                            break;
                        default:
                            this.getFollowListOfPlat();
                            break;
                    }
                },
                // 平台采购商
                getFollowListOfPlat: function() {
                    vm.showOperateFlag = false;
                    vm.allChecked = false;
                    followListService.getFollowListOfPlat(commonTool.filterParam(paging)).success(function(data) {
                        vm.items = data.data.items;
                        paging.total = data.data.total;
                    })
                },
                // 广交会采购商
                getFollowListOfCfec: function() {
                    vm.showOperateFlag = false;
                    vm.allChecked = false;
                    followListService.getFollowListOfCfec(commonTool.filterParam(paging)).success(function(data) {
                        vm.items = data.data.items;
                        paging.total = data.data.total;
                        // 使用buyerCompanyId 代替operBuyerCompanyId 与平台采购商统一key
                        if (vm.items && vm.items.length) {
                            for (var i = 0, len = vm.items.length; i < len; i++) {
                                var item = vm.items[i];
                                vm.items[i].buyerCompanyId = item.operBuyerCompanyId;
                                vm.items[i].buyerId = item.operbuyerId;
                            }
                        }
                    })
                },
                search: function() {
                    vm.buyerOfPlatInfo = null;
                    vm.buyerOfCfecInfo = null;
                    paging.page = 1;
                    this.getFollowBuyerList();
                },
                reset: function() {
                    paging.order = 'followTime';
                    paging.filters = null;
                    paging.isMobile = null;
                    paging.isLocalTime = null;
                    paging.searchType = null;
                    paging.searchTypeValue = null;
                    paging.page = 1;
                    paging.pageSize = 10;
                    paging.countryId = null;
                    vm.buyerOfPlatInfo = null;
                    vm.buyerOfCfecInfo = null;
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
                // 从清单移除 type,buyerCompanyId
                // 1 平台采购商
                // 2 广交会采购商
                removeFromListByMuti: function(type) {
                    console.log(type);
                    if (!vm.selectionCompanyIdItem.length) return;
                    console.log(vm.selectionCompanyIdItem);
                    this.removeFromList(type, vm.selectionCompanyIdItem.join(','));
                },
                removeFromList: function(type, buyerCompanyId) {
                    // this.removeFromListReuqest(type, buyerCompanyId);
                    ngDialog.open({
                        template: './controller/buyer/dialogTmp/confirmdDlg.html',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var vm = $scope.vm = {
                                hasReson: false,

                                messages: '请确认是否从清单移除',

                                submitMsg: '确定',

                                cancelMsg: '取消',

                                submit: function() {
                                    tools.removeFromListReuqest(type, buyerCompanyId);
                                    $scope.closeThisDialog();
                                },
                                close: function() {
                                    $scope.closeThisDialog();
                                }
                            };
                        }]
                    })
                },
                removeFromListReuqest: function(type, buyerCompanyId) {
                    var params = {
                        buyerCompanyId: buyerCompanyId
                    };
                    followListService.removeFromList(params, type).success(function(data) {
                        if (data.status !== 'success') return;
                        $rootScope.alertMsgService.setMessage("保存成功", 'success');
                        tools.getFollowBuyerList();
                    }).error(function() {
                        $rootScope.alertMsgService.setMessage("移除失败", 'warning');
                    });
                },
                // 添加跟进记录 type,buyerId
                // 1 平台采购商
                // 2 广交会采购商
                addFollowRecord: function(type, buyerId) {
                    this.addFollowRecordReuqest(type, buyerId);
                },
                addToListByMuti: function(type) {
                    if (!vm.selectionBuyerIdItem.length) return;
                    this.addFollowRecordReuqest(type, vm.selectionBuyerIdItem.join(','));
                },
                addFollowRecordReuqest: function(type, buyerId) {
                    $scope.buyerId = buyerId;
                    $scope.tools = tools;
                    $scope.type = type;
                    $scope.source = type == 1 ? 'followListPalt' : 'followListCfec';
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 900,
                        templateUrl: '/controller/buyer/dialogTmp/followRecordDlg.html',
                        controller: 'insertfollowRcdCtrl'
                    })
                },
                addPlatPurchase: function(userId, buyerId) {
                    $scope.buyerId = buyerId;
                    $scope.publisherId = userId;
                    $scope.newTools = tools;
                    $scope.apSource = 'followList';
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 1200,
                        templateUrl: '/controller/buyer/buyerDetail/addPurchaseTmp.html',
                        controller: 'addpurchaseCtrl',
                        title: "代发采购需求"
                    })


                },
                addCfecPurchase: function(buyerId) {
                    cfecBuyerService.cfecSendProcurement({
                        buyerId: buyerId
                    }).success(function(data) {
                        if (data.status === 'success' && data.type === '200') {
                            $scope.publisherId = data.data;
                            $scope.newTools = tools;
                            $scope.cfecBuyerId = buyerId;
                            $scope.apSource = 'followList';
                            ngDialog.open({
                                appendClassName: "dialog-activeM",
                                scope: $scope,
                                animation: true,
                                width: 1200,
                                templateUrl: '/controller/buyer/buyerDetail/addPurchaseTmp.html',
                                controller: 'addpurchaseCtrl',
                                title: "代发采购需求"
                            })
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                },
                checkAll: function(checked) {
                    vm.selectionBuyerIdItem = [];
                    vm.selectionCompanyIdItem = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {
                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionBuyerIdItem.push(item.buyerId);
                            vm.selectionCompanyIdItem.push(item.buyerCompanyId);
                        }
                    });
                },
                selection: function() {
                    var selectionBuyerIdItem = [];
                    var selectionCompanyIdItem = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionBuyerIdItem.push(item.buyerId);
                            selectionCompanyIdItem.push(item.buyerCompanyId);
                        }
                    });
                    vm.showOperateFlag = selectionBuyerIdItem.length > 0 ? true : false;
                    vm.selectionBuyerIdItem = selectionBuyerIdItem;
                    vm.selectionCompanyIdItem = selectionCompanyIdItem;
                },
                getPaltBuyerInfo: function(buyerId) {
                    vm.isNotifying = false;
                    buyerService.getBuyerDetail(buyerId).success(function(data) {
                        vm.buyerOfPlatInfo = data.data;
                        var categoryArray = [];
                        if (vm.buyerOfPlatInfo.cateList) {
                            for (var i = 0, len = vm.buyerOfPlatInfo.cateList.length; i < len; i++) {
                                categoryArray.push(vm.buyerOfPlatInfo.cateList[i].categoryName);
                            }
                        }

                        vm.buyerOfPlatInfo.categoryStr = categoryArray.length ? categoryArray.join(',') : '';

                        purchaseParams.dropdwonValue = vm.buyerOfPlatInfo.personal.userId;

                        enquiryParams.ddBuyerValue = vm.buyerOfPlatInfo.personal.userId;

                        followPlatParams.buyerId = buyerId;

                        // 采购需求
                        tools.getBuyerPurchaseList();
                        // 询盘
                        tools.getEnquiryList();
                        // 跟进记录
                        tools.getPlatFollowRecordList();

                    })
                },
                initValidateOfPlat: function() {
                    formValid = $('#buyerPlatForm').validate({
                        errorElement: "em",
                        errorClass: "error-explain",
                        validClass: "valid-explain",
                        groups: {
                            gs_mobile: "buyerCountryCode buyerMobile",
                        },
                        rules: {
                            userEmail: {
                                required: true,
                                email: true
                            },
                            firstName: {
                                required: true,
                                enStirng: true
                            },
                            countryId: {
                                required: true
                            },
                            companyName: {
                                required: true,
                                enCode: true
                            },
                            skype: {
                                enCode: true
                            },
                            buyerCountryCode: {
                                number: true
                            },
                            buyerMobile: {
                                number: true
                            },
                            buyerRegion: {
                                number: true
                            },
                            buyerArea: {
                                number: true
                            },
                            buyerTelephone: {
                                number: true
                            }
                        },
                        messages: {

                        }
                    })
                },
                saveFlatBuyerInfo: function() {
                    if (!formValid.form()) return;

                    var buyerInfo = {
                        userId: vm.buyerOfPlatInfo.personal.userId,
                        buyerId: vm.buyerOfPlatInfo.personal.buyerId,
                        companyId: vm.buyerOfPlatInfo.company.companyId,
                        address: vm.buyerOfPlatInfo.personal.address,
                        annualTurnover: vm.buyerOfPlatInfo.purchase && vm.buyerOfPlatInfo.purchase.annualTurnover ? parseInt(vm.buyerOfPlatInfo.purchase.annualTurnover) : null,
                        businessType: vm.buyerOfPlatInfo.purchase && vm.buyerOfPlatInfo.purchase.businessType ? parseInt(vm.buyerOfPlatInfo.purchase.businessType) : null,
                        buyerPhoto: vm.buyerOfPlatInfo.personal.buyerPhoto,
                        businessCooper: vm.buyerOfPlatInfo.company.businessCooper == 1 ? true : false,
                        companyAddress: vm.buyerOfPlatInfo.company.address,
                        companyCountryId: vm.buyerOfPlatInfo.company.countryId,
                        companyDesc: vm.buyerOfPlatInfo.company.companyDesc,
                        companyFoundYear: vm.buyerOfPlatInfo.company.companyFoundYear ? parseInt(vm.buyerOfPlatInfo.company.companyFoundYear) : null,
                        companyLogo: vm.buyerOfPlatInfo.company.companyLogo,
                        companyName: vm.buyerOfPlatInfo.company.companyName,
                        companyType: vm.buyerOfPlatInfo.company.companyType,
                        companyNature: vm.buyerOfPlatInfo.company.companyNature,
                        companyWebsite: vm.buyerOfPlatInfo.company.companyWebsite,
                        companyZipCode: vm.buyerOfPlatInfo.company.zipCode,
                        countryId: vm.buyerOfPlatInfo.personal.countryId,
                        firstName: vm.buyerOfPlatInfo.personal.firstName,
                        gender: vm.buyerOfPlatInfo.personal.gender,
                        productType: null,
                        mobileContry: vm.buyerOfPlatInfo.personal.mobileContry,
                        mobile: vm.buyerOfPlatInfo.personal.mobile,
                        registeredCapital: vm.buyerOfPlatInfo.purchase && vm.buyerOfPlatInfo.purchase && vm.buyerOfPlatInfo.purchase.registeredCapital ? parseInt(vm.buyerOfPlatInfo.purchase.registeredCapital) : null,
                        skype: vm.buyerOfPlatInfo.personal.skype,
                        staffSize: vm.buyerOfPlatInfo.purchase && vm.buyerOfPlatInfo.purchase.staffSize ? parseInt(vm.buyerOfPlatInfo.purchase.staffSize) : null,
                        region: vm.buyerOfPlatInfo.personal.region,
                        area: vm.buyerOfPlatInfo.personal.area,
                        telephone: vm.buyerOfPlatInfo.personal.telephone,
                        userEmail: vm.buyerOfPlatInfo.loginUser.userEmail,
                        yearBuyingAmt: vm.buyerOfPlatInfo.company.yearBuyingAmt ? parseInt(vm.buyerOfPlatInfo.company.yearBuyingAmt) : null,
                        zipCode: vm.buyerOfPlatInfo.personal.zipCode,
                        remark: vm.buyerOfPlatInfo.company.remark,
                        otherExhibition: vm.buyerOfPlatInfo.company.otherExhibition == 1 ? true : false,
                    }

                    buyerInfo.businessCooper = buyerInfo.businessCooper ? 1 : 0;
                    buyerInfo.otherExhibition = buyerInfo.otherExhibition ? 1 : 0;
                    buyerInfo.username = buyerInfo.userEmail;

                    if (buyerInfo.companyCountryId == null) buyerInfo.companyCountryId = 0;


                    buyerService.notifyBuyer(buyerInfo).success(function(data) {
                        if (data.type == '21') {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        } else if (data.type == '6') {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        } else {
                            tools.getPaltBuyerInfo(vm.buyerOfPlatInfo.personal.buyerId);
                            $rootScope.alertMsgService.setMessage("保存成功", 'success');
                            tools.getFollowBuyerList();
                        }
                    })
                },
                getCfecBuyerInfo: function(buyerId) {
                    vm.isNotifying = false;
                    cfecBuyerService.getCfecBuyerDetail({
                        buyerId: buyerId
                    }).success(function(data) {
                        vm.buyerOfCfecInfo = data.data;

                        var categoryArray = [];
                        if (vm.buyerOfCfecInfo.cateList) {
                            for (var i = 0, len = vm.buyerOfCfecInfo.cateList.length; i < len; i++) {
                                categoryArray.push(vm.buyerOfCfecInfo.cateList[i].categoryName);
                            }
                        }

                        vm.buyerOfCfecInfo.categoryStr = categoryArray.length ? categoryArray.join(',') : '';

                        followCfecParams.buyerId = buyerId;

                        tools.getCfecFollowRecordList();
                    })
                },
                initValidateOfCfec: function() {

                    formValid = $('#buyerCfecForm').validate({
                        errorElement: "em",
                        errorClass: "error-explain",
                        validClass: "valid-explain",
                        groups: {
                            gs_mobile: "buyerCountryCode buyerMobile",
                        },
                        rules: {
                            userEmail: {
                                required: true,
                                email: true
                            },
                            firstName: {
                                required: true,
                                enStirng: true
                            },
                            countryId: {
                                required: true
                            },
                            companyName: {
                                required: true,
                                enCode: true
                            },
                            skype: {
                                enCode: true
                            },
                            buyerCountryCode: {
                                number: true
                            },
                            buyerMobile: {
                                number: true
                            },
                            buyerRegion: {
                                number: true
                            },
                            buyerArea: {
                                number: true
                            },
                            buyerTelephone: {
                                number: true
                            }
                        },
                        messages: {

                        }
                    })
                },
                saveCfecBuyerInfo: function() {
                    if (!formValid.form()) return;
                    var buyerInfo = {
                        userId: vm.buyerOfCfecInfo.personal.userId,
                        buyerId: vm.buyerOfCfecInfo.personal.buyerId,
                        companyId: vm.buyerOfCfecInfo.company.companyId,
                        address: vm.buyerOfCfecInfo.personal.address,
                        annualTurnover: vm.buyerOfCfecInfo.purchase && vm.buyerOfCfecInfo.purchase.annualTurnover ? parseInt(vm.buyerOfCfecInfo.purchase.annualTurnover) : null,
                        businessType: vm.buyerOfCfecInfo.purchase && vm.buyerOfCfecInfo.purchase.businessType ? parseInt(vm.buyerOfCfecInfo.purchase.businessType) : null,
                        buyerPhoto: vm.buyerOfCfecInfo.personal.buyerPhoto,
                        companyAddress: vm.buyerOfCfecInfo.company.address,
                        companyCountryId: vm.buyerOfCfecInfo.company.countryId,
                        companyDesc: vm.buyerOfCfecInfo.company.companyDesc,
                        companyFoundYear: vm.buyerOfCfecInfo.company.companyFoundYear ? parseInt(vm.buyerOfCfecInfo.company.companyFoundYear) : null,
                        companyLogo: vm.buyerOfCfecInfo.company.companyLogo,
                        companyName: vm.buyerOfCfecInfo.company.companyName,
                        companyType: vm.buyerOfCfecInfo.company.companyType,
                        companyNature: vm.buyerOfCfecInfo.company.companyNature,
                        companyWebsite: vm.buyerOfCfecInfo.company.companyWebsite,
                        companyZipCode: vm.buyerOfCfecInfo.company.zipCode,
                        countryId: vm.buyerOfCfecInfo.personal.countryId,
                        firstName: vm.buyerOfCfecInfo.personal.firstName,
                        gender: vm.buyerOfCfecInfo.personal.gender,
                        productType: null,
                        mobileContry: vm.buyerOfCfecInfo.personal.mobileContry,
                        mobile: vm.buyerOfCfecInfo.personal.mobile,
                        registeredCapital: vm.buyerOfCfecInfo.purchase && vm.buyerOfCfecInfo.purchase && vm.buyerOfCfecInfo.purchase.registeredCapital ? parseInt(vm.buyerOfCfecInfo.purchase.registeredCapital) : null,
                        skype: vm.buyerOfCfecInfo.personal.skype,
                        staffSize: vm.buyerOfCfecInfo.purchase && vm.buyerOfCfecInfo.purchase.staffSize ? parseInt(vm.buyerOfCfecInfo.purchase.staffSize) : null,
                        region: vm.buyerOfCfecInfo.personal.region,
                        area: vm.buyerOfCfecInfo.personal.area,
                        telephone: vm.buyerOfCfecInfo.personal.telephone,
                        userEmail: vm.buyerOfCfecInfo.personal.email,
                        yearBuyingAmt: vm.buyerOfCfecInfo.company.yearBuyingAmt ? parseInt(vm.buyerOfCfecInfo.company.yearBuyingAmt) : null,
                        zipCode: vm.buyerOfCfecInfo.personal.zipCode,
                        remark: vm.buyerOfCfecInfo.company.remark
                    }
                    if (buyerInfo.companyCountryId == null) buyerInfo.companyCountryId = 0;

                    cfecBuyerService.updateCfecBuyer(buyerInfo).success(function(data) {
                        if (data.type == '20' || data.type == '21' || data.type == '22' || data.type == '23') {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        } else {
                            tools.getCfecBuyerInfo(vm.buyerOfCfecInfo.personal.buyerId);
                            $rootScope.alertMsgService.setMessage("保存成功", 'success');
                            tools.getFollowBuyerList();
                        }
                    })

                },
                getBuyerPurchaseList: function() {
                    buyerService.getbuyerPurchaseList(commonTool.filterParam(purchaseParams)).success(function(data) {
                        vm.buyerOfPlatInfo.buyerPurchaseLsit = data.data.items;
                    })
                },
                getEnquiryList: function() {
                    buyerService.getEnquiryList(commonTool.filterParam(enquiryParams)).success(function(data) {
                        vm.buyerOfPlatInfo.enquiryList = data.data.items;
                    })
                },
                getPlatFollowRecordList: function() {
                    buyerService.getFollowRecordList(commonTool.filterParam(followPlatParams)).success(function(data) {
                        if (!vm.buyerOfPlatInfo) return;
                        vm.buyerOfPlatInfo.followRecordLsit = data.page.items;
                        vm.buyerOfPlatInfo.recordInfo = data.data;
                    })
                },
                getCfecFollowRecordList: function() {
                    cfecBuyerService.cfecFollowRecord(commonTool.filterParam(followCfecParams)).success(function(data) {
                        if (!vm.buyerOfCfecInfo) return;
                        vm.buyerOfCfecInfo.followRecordLsit = data.page.items;
                        vm.buyerOfCfecInfo.recordInfo = data.data;
                    })
                },
                loadMoreData: function(type) {
                    // 1: 采购需求
                    // 2: 询盘
                    // 3: 跟进记录 -- 平台采购商
                    // 4: 跟进记录 -- 广交会采购商
                    switch (type) {
                        case 1:
                            if (!purchaseParams.dropdwonValue) return;
                            purchaseParams.pageSize += 5;
                            this.getBuyerPurchaseList();
                            break;
                        case 2:
                            if (!enquiryParams.ddBuyerValue) return;
                            enquiryParams.pageSize += 5;
                            this.getEnquiryList();
                            break;
                        case 3:
                            if (!followPlatParams.buyerId) return;
                            followPlatParams.pageSize += 5;
                            this.getPlatFollowRecordList();
                            break;
                        case 4:
                            if (!followCfecParams.buyerId) return;
                            followCfecParams.pageSize += 5;
                            this.getCfecFollowRecordList();
                            break;

                        default:
                            // statements_def
                            break;
                    }
                }
            });

            (function() {

                tools.getFollowBuyerList();

                vm.pages = commonService.setPageSizeArray(10, 30, 50);

                commonService.getCountries().success(function(data) {
                    vm.countryArray = data.data;
                });

                commonService.getCountries().success(function(data) {
                    if ('success' == data.status) {
                        tools.countries = data.data;
                    }
                });

            }())
        }
    ])

    ng.controller('insertfollowRcdCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'followListService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            followListService, commonTool) {
            var vm = $scope.vm = {},
                tools = $scope.tools,
                type = $scope.type,
                source = $scope.source;

            var recordInfo = $scope.recordInfo = {
                buyerIds: $scope.buyerId,
                // 跟进标识
                flag: '1',
                // 跟进级别
                followBuyerLevel: 3,
                // 跟进内容
                followContent: null,
                // 跟进状态 1（可跟进），0,（免跟进）
                isFollowed: '1',
                // 从跟进清单移除 1（是），0,（否）
                unFollowing: '1',
            };

            console.log(type);

            tools = angular.extend(tools, {
                submitDlg: function() {
                    // ngDialog.closeAll();
                    followListService.addFollowRecord(recordInfo, type).success(function(data) {
                        if (data.status === 'success') {
                            $rootScope.alertMsgService.setMessage('添加成功', 'success');
                            ngDialog.closeAll();
                            tools.actionAfterSubmit();
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }

                    })
                },
                actionAfterSubmit: function() {
                    switch (source) {
                        case 'followListPalt':
                            // 跟进清单 -- 平台采购商
                            tools.getFollowListOfPlat();
                            break;
                        case 'followListCfec':
                            // 跟进清单 -- 广交会采购商
                            tools.getFollowListOfCfec();
                            break;
                        case 'platBuyerDetail':
                            // 详情 -- 平台采购商
                            tools.getFollowRecordList();
                            break;
                        case 'cfecBuyerDetail':
                            // 详情 -- 广交会采购商
                            tools.cfecFollowRecord();
                            break;
                        case 'purchaseReply':
                            // 采购需求未二次回复列表
                            tools.getPurchaseReplyList();
                            break;
                        case 'inquiryReply':
                            // 询盘未二次回复列表
                            tools.getInquiryReplyList();
                            break;
                        case 'myFollowHistoryPalt':
                            // 我的跟进历史 -- 平台采购商
                            tools.getHistoryPlatBuyer();
                            break;
                        case 'myFollowHistoryCfec':
                            // 我的跟进历史 -- 广交会采购商
                            tools.getHistoryCfecBuyer();
                            break;
                        default:
                            break;
                    }
                },
                closeDlg: function() {
                    ngDialog.closeAll();
                },
                init: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                // 最近跟进标识
                initFollowSign: function() {
                    return [new this.init('Not a Buyer', 1), new this.init('Bounce Email', 2), new this.init('Buying Lead', 3), new this.init('Phone Call Connected', 4), new this.init('Phone Call Disconnected', 5), new this.init('Not speak English', 6), new this.init('Whatsapp', 7), new this.init('Wechat', 8), new this.init('Skype', 9), new this.init('SNS', 10), new this.init('Email', 11), new this.init('No Instant Messenger', 12), new this.init('Others', 13)];
                },
                // 跟进优先级
                getPriorityArray: function() {
                    return [new this.init(1, 1), new this.init(2, 2), new this.init(3, 3), new this.init(4, 4), new this.init(5, 5)];
                }
            });

            (function() {
                vm.followSignArray = tools.initFollowSign();
                vm.priorityArray = tools.getPriorityArray();
            }())

        }
    ])
});
