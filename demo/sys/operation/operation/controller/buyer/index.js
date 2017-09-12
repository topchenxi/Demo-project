define(['../module'], function(ng) {
    ng.factory('buyerService', ['$http', 'api',
        function($http, api) {
            return {
                getBuyerList: function(params) {
                    if (params.searchType != null && params.searchTypeValue) {

                    } else {
                        params.searchType = null;
                        params.searchTypeValue = null;
                    }
                    return $http.get(api.getBuyers, {
                        'params': params
                    });
                },
                getBuyerDetail: function(buyerId) {
                    return $http.get(api.getBuyerDetail, {
                        'params': {
                            'buyerId': buyerId
                        }
                    });
                },
                chgBuyerAudit: function(params) {
                    return $http.post(api.chgBuyerAudit, params);
                },
                notifyBuyer: function(params) {
                    return $http.post(api.notifyBuyer, params);
                },
                getFollowRecordList: function(params) {
                    return $http.get(api.followRecord, {
                        'params': params
                    });
                },
                updateFollowLevel: function(params) {
                    return $http.post(api.followUpdate, params);
                },
                addFollowRecord: function(params) {
                    return $http.post(api.followAdd, params);
                },
                getBuyerSourceType: function() {
                    return $http.post(api.getBuyerSourceType);
                },
                getbuyerPurchaseList: function(params) {
                    return $http.get(api.getPurchaseList, {
                        'params': params
                    });
                },
                getEnquiryList: function(params) {
                    return $http.get(api.getInquiryList, {
                        'params': params
                    });
                },
                // 禁用启用采购商
                buyerforbidden: function(params) {
                    return $http.post(api.buyerforbidden, params);
                },
                // 禁用启用采购商
                chxTestAccountStatus: function(params) {
                    return $http.post(api.chxTestBuyerStatus, params);
                },
                // 获取采购商修改密码链接
                getResetPasswordLink: function(params) {
                    return $http.get(api.getResetPasswordLink, {
                        'params': params
                    })
                },
                // 新增标签记录
                saveMarkInfo: function(params) {
                    return $http.get(api.saveMarkInfo, {
                        'params': params
                    })
                },
                delMarkInfo: function(params) {
                    return $http.post(api.delMarkInfo, params);
                }
            };
        }
    ])
    ng.controller('BuyerListCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$location',
        '$uibModal',
        'buyerService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog,
            $location, $uibModal, buyerService,
            commonService, commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {

                page: 1,
                pageSize: 10,

                auditStatus: -10,
                countryId: null,
                email: null,
                searchType: null,
                searchTypeValue: null,
                source: null,
                businessCooper: null,
                startTime: null,
                endTime: null,
                loginStartDate: null,
                loginEndDate: null
            };
            vm.selectionItme = [];
            vm.showOperateFlag = false;
            tools.auditStatus = paging.auditStatus;
            tools = $.extend(tools, {
                getBuyerList: function() {
                    vm.allChecked = false;
                    vm.showOperateFlag = false;
                    buyerService.getBuyerList(commonTool.filterParam(paging)).success(function(data) {
                        vm.items = data.data.items;
                        paging.total = data.page.total;
                        paging.pageSize = data.page.pageSize;
                    });
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    tools.getBuyerList();
                },
                search: function() {
                    paging.page = 1;
                    tools.getBuyerList(true);
                },
                reset: function() {
                    paging = $scope.paging = {
                        page: 1,
                        pageSize: 10,
                        auditStatus: tools.auditStatus,
                        countryId: null,
                        email: null,
                        searchType: null,
                        searchTypeValue: null,
                        source: null,
                        businessCooper: null,
                        otherExhibition: null,
                        startTime: null,
                        endTime: null,
                        sourceFourType: null,
                        loginStartDate: null,
                        loginEndDate: null
                    };
                },
                checkAll: function(checked) {
                    vm.selectionItme = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {
                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionItme.push(item.buyerId);
                        }
                    });
                },
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.buyerId);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                },
                confirm: function(buyerId, auditStatus) {
                    $scope.buyerId = buyerId;
                    $scope.tools = tools;
                    $scope.type = 'list';
                    $scope.status = auditStatus;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'confirm.html',
                        controller: 'buyerConfirmCtrl'
                    })
                },
                chgAuditStatus: function(itemId, auditStatus) {
                    var buyerIds = "";
                    if (commonTool.isEmpty(itemId)) {
                        vm.allChecked = false;
                        buyerIds = vm.selectionItme.join(',');
                        if (commonTool.isEmpty(buyerIds)) {
                            $rootScope.alertMsgService.setMessage("请先选择要审核的买家", 'warning');
                            return;
                        }
                    } else {
                        buyerIds = itemId;
                    }
                    var params = {
                        "buyerIds": buyerIds,
                        "auditStatus": auditStatus
                    };
                    tools.confirm(params.buyerIds, params.auditStatus);
                    vm.selectionItme = [];
                },
                // 关闭弹出层
                close: function() {
                    ngDialog.closeAll();
                },
                // 禁用/启用
                forbiddenConfirm: function(buyerIds, status) {
                    $scope.buyerIds = buyerIds;
                    $scope.tools = tools;
                    vm.forbiddenStatus = status;
                    vm.buyerListDlg = ngDialog.open({
                        template: 'buyerListDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        controller: ['$scope', '$rootScope', function($scope) {
                            var buyerIds = $scope.buyerIds;
                            var tools = $scope.tools;
                            $scope.submit = function() {
                                var params = {};
                                params.buyerIds = buyerIds;
                                params.status = status;
                                if (status == 0) {
                                    // 禁止
                                    var remark = $(".reasonInput").val();
                                    if (remark == null || remark == "" || remark == undefined) {
                                        $rootScope.alertMsgService.setMessage('请输入禁止原因', 'info');
                                        return;
                                    }
                                    params.reason = remark;
                                }
                                buyerService.buyerforbidden(params)
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            tools.getBuyerList();
                                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                            tools.close();
                                        } else {
                                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                        }
                                    })
                            }

                        }]

                    });
                },
                getSecondSource: function() {
                    console.log(paging.source);
                    if (commonTool.isEmpty(paging.source)) {
                        tools.secondSourceArray = [];
                        return;
                    }
                    var tmpObj = {
                        sourceType: 1,
                        source: paging.source
                    };
                    commonService.getSecondSourceType(tmpObj).success(function(data) {
                        console.log(data);
                        if ('success' === data.status) {
                            tools.secondSourceArray = data.data;
                        } else {
                            console.log('error');
                        }
                    })
                },
                // 重置密码
                resetPassword: function(id) {
                    buyerService.getResetPasswordLink({ buyerId: id }).success(function(data) {
                        vm.resetPswLink = data.data;
                        vm.resetPswDlg = ngDialog.open({
                            template: 'resetPswDlgId',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            width: 550,
                            title: "采购商重置密码",
                            controller: ['$scope', function($scope) {
                                var tools = $scope.tools;
                            }]

                        });
                    });
                },
                clipboardSuccess: function(e) {
                    $rootScope.alertMsgService.setMessage("内容复制成功", 'success');
                    e.clearSelection();
                },
                clipboardError: function(e) {
                    $rootScope.alertMsgService.setMessage("复制失败，请重试", 'warning');
                }
            });

            var method = {
                key: '',
                value: '',
                init: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                getSearchTypeArray: function() {
                    return [new this.init('采购商姓名', 0), new this.init('公司名称', 1), new this.init('邮箱', 2), new this.init('用户名', 3), new this.init('用户ID', 4), new this.init('广交会ID', 5), ];
                },
                getBusinessCooperArray: function() {
                    return [new this.init('是', 1), new this.init('否', 0)];
                },
                getOtherExhibitionArray: function() {
                    return [new this.init('是', 1), new this.init('否', 0)];
                },
                getValidArray: function() {
                    return [new this.init('是', 0), new this.init('否', 1)];
                }
            }
            init_data();

            function init_data() {
                vm.pages = commonService.setPageSizeArray(10, 30, 50, '100');

                commonService.getCountries().success(function(data) {
                    if ('success' == data.status) {
                        tools.countries = data.data;
                    }
                });

                buyerService.getBuyerSourceType().success(function(data) {
                    if ('success' == data.status) {
                        tools.sourceType = data.data;
                    }
                })

                tools.searchType = method.getSearchTypeArray();
                tools.businessCooper = method.getBusinessCooperArray();
                tools.otherExhibitionArray = method.getOtherExhibitionArray();
                tools.validArray = method.getValidArray();
                tools.secondSourceArray = [];
                tools.getBuyerList();
            }



        }
    ])
    ng.controller('buyerConfirmCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'buyerService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            buyerService, commonTool) {
            var vm = $scope.vm = {},
                tools = $scope.tools,
                buyerId = $scope.buyerId,
                type = $scope.type,
                status = $scope.status;
            vm.status = status;
            tools = $.extend(tools, {
                submit: function() {
                    if (vm.status == -1 && commonTool.isEmpty(vm.reason)) {
                        $rootScope.alertMsgService.setMessage('请先填写审核原因', 'warning');
                        return;
                    }
                    var params = {
                        buyerIds: buyerId,
                        auditStatus: vm.status
                    }
                    if (vm.status == -1) params.reason = vm.reason;
                    buyerService.chgBuyerAudit(params).success(function(data) {
                        if ('success' == data.status) {
                            ngDialog.closeAll();
                            if (type == 'list') {
                                tools.getBuyerList(false);
                            } else {
                                tools.getBuyerDetail();
                            }
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                },
                close: function() {
                    ngDialog.closeAll();
                }
            });

        }
    ])

    ng.controller('BuyerDetailCtrl', [
        '$scope', '$rootScope', 'ngDialog', '$location',
        'buyerService', 'commonService', 'Upload', 'api', 'commonTool',
        function($scope, $rootScope, ngDialog, $location, buyerService, commonService, Upload, api, commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var search = $location.search();
            tools.buyerId = parseInt(search.buyerId);
            vm.isNotify = false;
            var linkTab = search.tab ? search.tab : 0;
            var buyerInfo = $scope.buyerInfo = {};

            $rootScope.categoryArray = [];

            vm.activeTab = 2;

            var addbuyerformVal;

            var followpaging = $scope.followpaging = {
                buyerId: tools.buyerId,

                page: 1,
                pageSize: 10
            };

            $rootScope = $.extend($rootScope, {
                // 基本信息
                baseInfoTemplate: "/controller/buyer/buyerDetail/baseInfo.html",
                // 采购需求
                purchaseInfoTemplate: "/controller/buyer/buyerDetail/purchaseInfo.html",
                // 询盘
                inquiryInfoTemplate: "/controller/buyer/buyerDetail/inquiryInfo.html",
                // 跟进记录
                followRecordTemplate: "/controller/buyer/buyerDetail/followRecord.html"
            });

            var buyerPurchase;


            tools = $.extend(tools, {
                getBuyerDetail: function() {
                    buyerService.getBuyerDetail(tools.buyerId).success(function(data) {
                        if ('success' == data.status) {
                            vm.item = data.data;
                            vm.activeTab = parseInt(linkTab);
                            if (vm.activeTab == 3) {
                                tools.toFollowRecord();
                            }

                            buyerPurchase = $scope.buyerPurchase = {
                                dropdwonType: 5,
                                dropdwonValue: vm.item.personal.userId,
                                productName: null,
                                page: 1,
                                pageSize: 10
                            };
                            if (vm.activeTab == 1) {
                                tools.toBuyerPurchaseList();
                            }
                            buyerInfo = $.extend(buyerInfo, {
                                userId: vm.item.personal.userId,
                                buyerId: vm.item.personal.buyerId,
                                companyId: vm.item.company.companyId,
                                address: vm.item.personal.address,
                                annualTurnover: vm.item.purchase && vm.item.purchase.annualTurnover ? parseInt(vm.item.purchase.annualTurnover) : null,
                                businessType: vm.item.purchase && vm.item.purchase.businessType ? parseInt(vm.item.purchase.businessType) : null,
                                buyerPhoto: vm.item.personal.buyerPhoto,
                                businessCooper: vm.item.company.businessCooper == 1 ? true : false,
                                companyAddress: vm.item.company.address,
                                companyCountryId: vm.item.company.countryId,
                                companyDesc: vm.item.company.companyDesc,
                                companyFoundYear: vm.item.company.companyFoundYear ? parseInt(vm.item.company.companyFoundYear) : null,
                                companyLogo: vm.item.company.companyLogo,
                                companyName: vm.item.company.companyName,
                                companyType: vm.item.company.companyType,
                                companyNature: vm.item.company.companyNature,
                                companyWebsite: vm.item.company.companyWebsite,
                                companyZipCode: vm.item.company.zipCode,
                                countryId: vm.item.personal.countryId,
                                firstName: vm.item.personal.firstName,
                                gender: vm.item.personal.gender,
                                productType: null,
                                mobileContry: vm.item.personal.mobileContry,
                                mobile: vm.item.personal.mobile,
                                registeredCapital: vm.item.purchase && vm.item.purchase && vm.item.purchase.registeredCapital ? parseInt(vm.item.purchase.registeredCapital) : null,
                                skype: vm.item.personal.skype,
                                staffSize: vm.item.purchase && vm.item.purchase.staffSize ? parseInt(vm.item.purchase.staffSize) : null,
                                region: vm.item.personal.region,
                                area: vm.item.personal.area,
                                telephone: vm.item.personal.telephone,
                                userEmail: vm.item.loginUser.userEmail,
                                yearBuyingAmt: vm.item.company.yearBuyingAmt ? parseInt(vm.item.company.yearBuyingAmt) : null,
                                zipCode: vm.item.personal.zipCode,
                                remark: vm.item.company.remark,
                                otherExhibition: vm.item.company.otherExhibition == 1 ? true : false,
                            })
                            $rootScope.categoryArray = [];

                            if (vm.item.cateList) {
                                for (var i = 0, len = vm.item.cateList.length; i < len; i++) {
                                    $rootScope.categoryArray.push(vm.item.cateList[i]);
                                }
                            }
                            vm.companyTypeArray = method.getCompanyTypeArray();
                            if (vm.item.company.companyType) {

                                for (var i = 0, len = vm.companyTypeArray.length; i < len; i++) {
                                    if (vm.item.company.companyType.indexOf(vm.companyTypeArray[i].value) >= 0) {
                                        vm.companyTypeArray[i].flag = true;
                                    }

                                }
                            }
                            vm.companyNatureArray = method.getCompanyNatureArray();
                            if (vm.item.company.companyNature) {

                                for (var i = 0, len = vm.companyNatureArray.length; i < len; i++) {
                                    if (vm.item.company.companyNature.indexOf(vm.companyNatureArray[i].value) >= 0) {
                                        vm.companyNatureArray[i].flag = true;
                                    }

                                }
                            }

                            // 访厂记录/成交记录
                            vm.visitList = [];
                            vm.dealList = [];
                            if (vm.item.buyerVisitList.length > 0) {
                                for (var i = 0; i < vm.item.buyerVisitList.length; i++) {
                                    var _tempItem = vm.item.buyerVisitList[i];
                                    if (_tempItem.visitType == 0) {
                                        vm.visitList.push(_tempItem);
                                    } else {
                                        vm.dealList.push(_tempItem);
                                    }
                                }
                                console.log(vm.visitList);
                            }
                        }
                    })
                },
                setTestAccount: function(status) {
                    $scope.buyerId = tools.buyerId;
                    $scope.userId = vm.item.loginUser.userId;
                    $scope.tools = tools;
                    $scope.status = status;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        templateUrl: 'confirmTest.html',
                        controller: 'testBuyerConfirmCtrl'
                    })
                },
                confirm: function(buyerId, auditStatus) {
                    $scope.buyerId = buyerId;
                    $scope.tools = tools;
                    $scope.type = 'detail';
                    $scope.status = auditStatus;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        templateUrl: 'confirm.html',
                        controller: 'buyerConfirmCtrl'
                    })
                },
                uploadImg: function(files, attrName) {
                    if (files && files.length > 0) {
                        var file = files[0];
                        if ((!/.*\.(png)|(jpg)|(gif)$/.test(file.name)) || file.size > 2 * 1024 * 1024) {
                            $rootScope.alertMsgService.setMessage("请重新选择图片,上传图片支持格式：png,jpg,gif;文件大小不超过2M", 'warning');
                            return false;
                        }
                        Upload.upload({
                            url: api.uploadContract,
                            file: file,
                            attrName: attrName

                        }).progress(function(evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        }).success(function(data, status, headers, config) {
                            buyerInfo[config.attrName] = data.data.url;
                        });
                    }

                },
                chxNotifyStatus: function(status) {
                    vm.isNotify = status;
                    if (!status) {
                        tools.getBuyerDetail();
                    } else {
                        addbuyerformVal = $('#addbuyerform').validate({
                            errorElement: "em",
                            errorClass: "error-explain",
                            validClass: "valid-explain",
                            groups: {
                                gs_mobel: "buyerCountryCode buyerMobile",
                                gs_tel: "buyerRegion buyerArea buyerTelephone",
                                gs_follow: "followSignType followSignWay"
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
                                address: {
                                    enCode: true
                                },
                                countryId: {
                                    required: true
                                },
                                companyName: {
                                    required: true,
                                    enCode: true
                                },
                                zipCode: {
                                    enNumberCode: true
                                },
                                companyZipCode: {
                                    enNumberCode: true
                                },
                                skype: {
                                    enCode: true
                                },
                                companyDesc: {
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
                    }
                },
                saveInfo: function() {
                    if (!addbuyerformVal.form()) return;

                    buyerInfo.companyNature = method.getValInArray('companyNatureVal').join(',');

                    if (commonTool.isEmpty(buyerInfo.companyNature)) buyerInfo.companyNature = null;

                    buyerInfo.companyType = method.getValInArray('companyTypeVal').join(',');

                    if (commonTool.isEmpty(buyerInfo.companyType)) buyerInfo.companyType = null;

                    var tmpCateArr = [];
                    angular.forEach($rootScope.categoryArray, function(item) {
                        tmpCateArr.push(item.categoryId);
                    });

                    buyerInfo.productType = $rootScope.categoryArray.length > 0 ? tmpCateArr.join(',') : null;

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
                            vm.isNotify = false;
                            tools.getBuyerDetail();
                            $rootScope.alertMsgService.setMessage("保存成功", 'success');
                        }

                    })
                },
                showPanel: function() {
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 660,
                        templateUrl: 'showPanelBuyer.html',
                        controller: 'showPanelCtrl',
                        title: "选择类目"
                    })
                },
                showUpdateRecord: function(item) {
                    $scope.updateRecordItem = item;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 660,
                        templateUrl: 'updateRecord.html',
                        controller: 'updateRecordlCtrl',
                        title: "修改前信息"
                    })
                },
                addpurchase: function() {
                    $scope.publisherId = vm.item.personal.userId;
                    $scope.newTools = tools;
                    $scope.apSource = 'buyerDetail';
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
                toFollowRecord: function() {
                    vm.followPages = commonService.setPageSizeArray(10, 30, 50);
                    vm.followFlag = true;
                    tools.getFollowRecordList();
                },
                getFollowRecordList: function() {
                    buyerService.getFollowRecordList(followpaging).success(function(data) {
                        vm.recordInfo = data.data;
                        vm.followRecordLsit = data.page.items;
                        followpaging.total = data.page.total;
                    })
                },
                getnewpageByFollow: function(type) {
                    if (type == 1) {
                        followpaging.page = tools.newfollowpagesize;
                        tools.newfollowpagesize = null;
                    } else if (type == 0) {
                        followpaging.page = 1;
                    }
                    tools.getFollowRecordList();
                },
                addFollowRecord: function() {
                    $scope.buyerId = parseInt(search.buyerId);
                    $scope.tools = tools;
                    $scope.type = 1;
                    $scope.source = 'platBuyerDetail';
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 900,
                        templateUrl: '/controller/buyer/dialogTmp/followRecordDlg.html',
                        controller: 'insertfollowRcdCtrl'
                    })

                },
                toBuyerPurchaseList: function() {
                    vm.buyerPurchasePages = commonService.setPageSizeArray(10, 30, 50);
                    tools.getBuyerPurchaseList();
                },
                getBuyerPurchaseList: function() {
                    buyerService.getbuyerPurchaseList(buyerPurchase).success(function(data) {
                        vm.buyerPurchaseLsit = data.data.items;
                        buyerPurchase.total = data.data.total;

                    })
                },
                resetBuyerPurchase: function() {
                    buyerPurchase.productName = null;
                },
                getpageByBuyerPurchase: function(type) {
                    if (type == 1) {
                        buyerPurchase.page = tools.newBuyerPurchasePage;
                        tools.newBuyerPurchasePage = null;
                    } else if (type == 0) {
                        buyerPurchase.page = 1;
                    }
                    tools.getBuyerPurchaseList();
                },
                // 关闭弹出层
                close: function() {
                    ngDialog.closeAll();
                },
                // 禁用/启用
                forbiddenConfirm: function(buyerIds, status) {
                    $scope.buyerIds = buyerIds;
                    $scope.tools = tools;
                    vm.forbiddenStatus = status;
                    vm.buyerListDlg = ngDialog.open({
                        template: 'buyerListDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        controller: ['$scope', '$rootScope', function($scope) {
                            var buyerIds = $scope.buyerIds;
                            var tools = $scope.tools;
                            $scope.submit = function() {
                                var params = {};
                                params.buyerIds = buyerIds;
                                params.status = status;
                                if (status == 0) {
                                    // 禁止
                                    var remark = $(".reasonInput").val();
                                    if (remark == null || remark == "" || remark == undefined) {
                                        $rootScope.alertMsgService.setMessage('请输入禁止原因', 'info');
                                        return;
                                    }
                                    params.reason = remark;
                                }
                                buyerService.buyerforbidden(params)
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            tools.getBuyerDetail();
                                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                            tools.close();
                                        } else {
                                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                        }
                                    })
                            }

                        }]

                    });
                },
                // 人工验证
                manualValidation: function(type) {
                    var mvDlg = $scope.mvDlg = {};
                    mvDlg.check = null;
                    mvDlg.type = type;
                    if (type == 'email') {
                        mvDlg.text = '邮箱是采购商使用中的邮箱';
                    } else {
                        mvDlg.text = '手机号码是采购商使用中的号码';
                    }
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        templateUrl: 'manualValidation.html',
                        controller: ['$scope', function($scope) {
                            $scope.submit = function() {
                                if ($scope.mvDlg.check != null) {
                                    var params = {
                                        buyerId: tools.buyerId
                                    };
                                    params[$scope.mvDlg.type + 'Validation'] = $scope.mvDlg.check;

                                    buyerService.saveMarkInfo(params).success(function(data) {
                                        if ('success' == data.status) {
                                            tools.getBuyerDetail();
                                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                            tools.close();
                                        } else {
                                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                            tools.close();
                                        }
                                    })
                                } else {
                                    tools.close();
                                }

                            }

                        }]
                    })
                },
                delMarkInfo: function(visitRecordId) {
                    console.log(visitRecordId);
                    if (!visitRecordId) return;
                    buyerService.delMarkInfo({
                        'visitRecordId': visitRecordId
                    }).success(function(data) {
                        console.log(data);
                        tools.getBuyerDetail();
                    })
                },
                // 增加拜访记录/交易记录
                addRecordLayer: function(type) {
                    var arDlg = $scope.arDlg = {};
                    var wid = 760;
                    arDlg.type = type;
                    if (type == 'factory') {
                        arDlg.visitRecord = [{
                            visitType: 0,
                            dealTime: null,
                            visitFactoryName: null
                        }];
                    } else {
                        wid = 840;
                        arDlg.dealRecord = [{
                            visitType: 1,
                            dealTime: null,
                            dealAmount: null,
                            sellerName: null
                        }];
                    }

                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: wid,
                        templateUrl: 'addRecord.html',
                        controller: ['$scope', function($scope) {
                            $scope.submit = function() {
                                var params = {
                                    buyerId: tools.buyerId,
                                    uploadStr: null
                                };



                                var _tempArr = arDlg.type == 'factory' ? arDlg.visitRecord : arDlg.dealRecord;

                                for (let i = 0, len = _tempArr.length; i < len; i++) {
                                    let item = _tempArr[i];
                                    console.log(item);
                                    if (item.visitType == 1) {
                                        // 成交记录
                                        if (commonTool.isEmpty(item.dealTime)) {
                                            $rootScope.alertMsgService.setMessage('请填写成交日期', 'warning');
                                            return;
                                        }
                                        if (commonTool.isEmpty(item.dealAmount)) {
                                            $rootScope.alertMsgService.setMessage('请填写金额', 'warning');
                                            return;
                                        }
                                        let dealAmount = Number(item.dealAmount);
                                        if (dealAmount < 0 || dealAmount > 999999999) {
                                            $rootScope.alertMsgService.setMessage('金额范围控制在0~999999999', 'warning');
                                            return;
                                        }
                                        if (commonTool.isEmpty(item.sellerName)) {
                                            $rootScope.alertMsgService.setMessage('请填写供应商公司名称', 'warning');
                                            return;
                                        }
                                    } else {
                                        // 拜访工厂
                                        if (commonTool.isEmpty(item.dealTime)) {
                                            $rootScope.alertMsgService.setMessage('请填写访厂日期', 'warning');
                                            return;
                                        }
                                        if (commonTool.isEmpty(item.visitFactoryName)) {
                                            $rootScope.alertMsgService.setMessage('请填写拜访的工厂名称', 'warning');
                                            return;
                                        }
                                    }
                                }
                                for (var i = 0; i < _tempArr.length; i++) {
                                    delete _tempArr[i]['$$hashKey'];
                                }

                                params.uploadStr = JSON.stringify(_tempArr);

                                buyerService.saveMarkInfo(params).success(function(data) {
                                    if ('success' == data.status) {
                                        tools.getBuyerDetail();
                                        $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                        tools.close();
                                    } else {
                                        $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                        tools.close();
                                    }
                                })

                            }
                        }]
                    })
                },
                // 增加记录
                addRecord: function(attrName) {
                    // 数据模板
                    var tpl = {
                        visitRecord: {
                            visitType: 0,
                            dealTime: null,
                            visitFactoryName: null
                        },
                        dealRecord: {
                            visitType: 1,
                            dealTime: null,
                            dealAmount: null,
                            sellerName: null
                        }
                    }
                    var dataTpl = $.extend(true, {}, tpl[attrName]);
                    $scope.arDlg[attrName].push(dataTpl);
                },
                // 删除记录
                delRecord: function(attrName, i) {
                    $scope.arDlg[attrName].splice(i, 1);
                }
            });
            tools.getBuyerDetail();
            tools.chgAuditStatus = function(buyerId, auditStatus) {
                tools.confirm(buyerId, auditStatus);
            };

            var method = {
                key: "",
                value: "",
                myObject: function(key, value) {
                    this.key = key;
                    this.value = value;
                    this.flag = false;
                },
                getCompanyFoundYearArray: function() {
                    var currentYear = (new Date()).getFullYear();
                    var tmpArr = [];
                    for (var i = 1960; i <= currentYear; i++) {
                        tmpArr.push(new this.myObject(i, i));
                    }
                    return tmpArr;
                },
                getCompanyNatureArray: function() {
                    var tmpArr = [new this.myObject('制造商及大批发商', 101001), new this.myObject('中小批发商群体', 101002), new this.myObject('小零售商群体', 101003), new this.myObject('小贸易商群体', 101004), new this.myObject('其它群体', 101999)];
                    return tmpArr;
                },
                getCompanyTypeArray: function() {
                    var tmpArr = [new this.myObject('采购办事处', 100001), new this.myObject('制造商', 100002), new this.myObject('贸易公司', 100003), new this.myObject('批发商/经销商', 100004), new this.myObject('零售商', 100005), new this.myObject('经纪人/顾问委员会', 100006), new this.myObject('政府及机构', 100007), new this.myObject('其他', 100999)];
                    return tmpArr;
                },
                getYearBuyingAmtArray: function() {
                    var tmpArr = [new this.myObject('100万美元以下', 102001), new this.myObject('100-1000万美元', 102002), new this.myObject('1000-5000万美元', 102003), new this.myObject('5000万美元-1亿美元', 102004), new this.myObject('1亿美元或以上', 102005)];
                    return tmpArr;
                },
                getStaffSizeArray: function() {
                    var tmpArr = [new this.myObject('任意', 104000), new this.myObject('小于100', 104001), new this.myObject('100-499', 104002), new this.myObject('500-999', 104003), new this.myObject('1000-5000', 104004), new this.myObject('5000或以上', 104005)];
                    return tmpArr;
                },
                getRegisteredCapitalArray: function() {
                    var tmpArr = [new this.myObject('任意', 105000), new this.myObject('小于100万美元', 105001), new this.myObject('100-500万美元', 105002), new this.myObject('500-2000万美元', 105003), new this.myObject('2000-5000万美元', 105004), new this.myObject('5000万-1亿美元', 105005), new this.myObject('1-10亿美元', 105006), new this.myObject('10亿美元或以上', 105007)];
                    return tmpArr;
                },
                getAnnualTurnoverArray: function() {
                    var tmpArr = [new this.myObject('任意', 103000), new this.myObject('小于100万美元', 103001), new this.myObject('100-1000万美元', 103002), new this.myObject('1000-5000万美元', 103003), new this.myObject('5000万美元-1亿美元', 103004), new this.myObject('1亿美元或以上', 103005)];
                    return tmpArr;
                },
                getValInArray: function(name) {
                    var jqObj = 'input[name="' + name + '"]:checked';
                    var tmpArr = [];
                    $(jqObj).each(function(index, el) {
                        tmpArr.push($(el).val());
                    });
                    return tmpArr;
                }
            };

            init_data();

            function init_data() {
                commonService.getCountries().success(function(data) {
                    vm.countryArray = data.data;
                })
                vm.companyFoundYearArray = method.getCompanyFoundYearArray();
                vm.yearBuyingAmtArray = method.getYearBuyingAmtArray();
                vm.staffSizeArray = method.getStaffSizeArray();
                vm.registeredCapitalArray = method.getRegisteredCapitalArray();
                vm.annualTurnoverArray = method.getAnnualTurnoverArray();
                vm.businessTypeArray = method.getCompanyTypeArray();
            }

            /**************************************************
                                  询盘
             **************************************************/

            var enquiryTools = $scope.enquiryTools = {};
            var enquiryInfo = $scope.enquiryInfo = {
                ddBuyerType: 5,

                page: 1,
                pageSize: 10
            };


            enquiryTools = $.extend(enquiryTools, {

                toInquiry: function() {
                    init_inquiry();
                },
                getEnquiryList: function() {
                    console.log(enquiryInfo);
                    buyerService.getEnquiryList(commonTool.filterParam(enquiryInfo)).success(function(data) {
                        if (!commonTool.isEmpty(data.data)) {
                            enquiryTools.enquiryList = data.data.items;
                            enquiryInfo.total = data.data.total;
                        }

                    })
                },
                search: function() {

                },
                reset: function() {

                },
                getnewpage: function(type) {
                    if (type == 1) {
                        enquiryInfo.page = enquiryTools.newpagesize;
                        enquiryTools.newpagesize = null;
                    } else if (type == 0) {
                        enquiryInfo.page = 1;
                    }
                    enquiryTools.getEnquiryList();
                }
            })

            function init_inquiry() {

                enquiryInfo.ddBuyerValue = vm.item.personal.userId;

                enquiryTools.pages = commonService.setPageSizeArray(10, 30, 50);
                enquiryTools.getEnquiryList();
            }

        }
    ])

    ng.controller('testBuyerConfirmCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'buyerService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            buyerService, commonTool) {
            var vm = $scope.vm = {},
                tools = $scope.tools,
                buyerId = $scope.buyerId,
                userId = $scope.userId,
                status = $scope.status;
            vm.status = status;
            tools = $.extend(tools, {
                submit: function() {
                    var params = {
                        userId: userId,
                        buyerId: buyerId,
                        isTestAccount: status
                    };
                    buyerService.chxTestAccountStatus(params).success(function(data) {
                        if ('success' == data.status) {
                            ngDialog.closeAll();
                            $rootScope.alertMsgService.setMessage('修改成功', 'success');
                            tools.getBuyerDetail();
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                },
                close: function() {
                    ngDialog.closeAll();
                }
            });

        }
    ])

    ng.controller('updateRecordlCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'buyerService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            buyerService, commonTool) {
            var updateItem = $scope.updateRecordItem;
            if (!commonTool.isEmpty(updateItem.staffSize)) {
                var staffSizeArray = {
                    '104000': '任意',
                    '104001': '小于100',
                    '104002': '100-499',
                    '104003': '500-999',
                    '104004': '1000-5000',
                    '104005': '5000或以上'
                };
                updateItem.staffSize = staffSizeArray[updateItem.staffSize];
            }
            if (!commonTool.isEmpty(updateItem.registeredCapital)) {
                var registeredCapitalArray = {
                    '105000': '任意',
                    '105001': '小于100万美元',
                    '105002': '100-500万美元',
                    '105003': '500-2000万美元',
                    '105004': '2000-5000万美元',
                    '105005': '5000万-1亿美元',
                    '105006': '1-10亿美元',
                    '105007': '10亿美元或以上'
                };
                updateItem.registeredCapital = registeredCapitalArray[updateItem.registeredCapital];
            }
            if (!commonTool.isEmpty(updateItem.annualTurnover)) {
                var annualTurnoverArray = {
                    '103000': '任意',
                    '103001': '小于100万美元',
                    '103002': '100-1000万美元',
                    '103003': '1000-5000万美元',
                    '103004': '5000万美元-1亿美元',
                    '103005': '1亿美元或以上'
                };
                updateItem.annualTurnover = annualTurnoverArray[updateItem.annualTurnover];
            }

            var businessTypeArray = {
                '100001': '采购办事处',
                '100002': '制造商',
                '100003': '贸易公司',
                '100004': '批发商/经销商',
                '100005': '零售商',
                '100006': '经纪人/顾问委员会',
                '100007': '政府及机构',
                '100999': '其他'
            };

            var companyNatureArray = {
                '101001': '制造商及大批发商',
                '101002': '中小批发商群体',
                '101003': '小零售商群体',
                '101004': '小贸易商群体',
                '101999': '其它群体'
            };
            if (!commonTool.isEmpty(updateItem.businessType)) {
                updateItem.businessType = businessTypeArray[updateItem.businessType];
            }
            if (!commonTool.isEmpty(updateItem.companyNature)) {
                var tmpArr = [];
                for (var i in companyNatureArray) {
                    if (updateItem.companyNature.indexOf(i) >= 0) {
                        tmpArr.push(companyNatureArray[i]);
                    }
                }
                updateItem.companyNature = tmpArr.join(',');
            }
            if (!commonTool.isEmpty(updateItem.companyType)) {
                var tmpArr = [];
                for (var i in businessTypeArray) {
                    if (updateItem.companyType.indexOf(i) >= 0) {
                        tmpArr.push(businessTypeArray[i]);
                    }
                }
                updateItem.companyType = tmpArr.join(',');
            }
            if (updateItem.businessCooper != null) {
                updateItem.businessCooper = updateItem.businessCooper == 1 ? '是' : '否';
            }
            if (updateItem.otherExhibition != null) {
                updateItem.otherExhibition = updateItem.otherExhibition == 1 ? '是' : '否';
            }
            if (!commonTool.isEmpty(updateItem.yearBuyingAmt)) {

                var yearBuyingAmtArray = {
                    '102001': '100万美元以下',
                    '102002': '100-1000万美元',
                    '102003': '1000-5000万美元',
                    '102004': '5000万美元-1亿美元',
                    '102005': '1亿美元或以上'
                };

                updateItem.yearBuyingAmt = yearBuyingAmtArray[updateItem.yearBuyingAmt];
            }



        }
    ])

    ng.controller('addFollowRecordCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'buyerService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            buyerService, commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};


        }
    ])

    ng.controller('addLabelRecordCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'buyerService', 'commonTool', 'commonService',
        function($scope, $rootScope, ngDialog,
            buyerService, commonTool, commonService) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var vmdlg = $scope.vmdlg = {};
            var toolsdlg = $scope.toolsdlg = {};
            var pagingdlg = $scope.pagingdlg = {
                page: 1,
                pageSize: 10,
                auditStatus: -10
            }
            var paging = $scope.paging = {
                // page: 1,
                // pageSize: 10,
                buyerId: null,
                emailValidation: null,
                mobileValidation: null,
                uploadStr: null
            };

            vm.visitRecord = [{
                visitType: 0,
                dealTime: null,
                visitFactoryName: null
            }];
            vm.dealRecord = [{
                visitType: 1,
                dealTime: null,
                dealAmount: null,
                sellerName: null
            }];

            var forms = $scope.forms = {};
            forms.addform = {};

            var method = {
                key: '',
                value: '',
                init: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                getSearchTypeArray: function() {
                    return [new this.init('采购商姓名', 0), new this.init('公司名称', 1), new this.init('邮箱', 2), new this.init('用户名', 3), new this.init('用户ID', 4), new this.init('广交会ID', 5), ];
                }
            }

            // 数据模板
            var tpl = {
                visitRecord: {
                    visitType: 0,
                    dealTime: null,
                    visitFactoryName: null
                },
                dealRecord: {
                    visitType: 1,
                    dealTime: null,
                    dealAmount: null,
                    sellerName: null
                }
            }

            tools = $.extend(tools, {
                // 添加采购
                selectBuyer: function() {
                    ngDialog.open({
                        template: "addBuyer.html",
                        title: "添加采购商",
                        width: 980,
                        scope: $scope,
                        controller: ["$scope", '$rootScope', 'ngDialog', 'commonService', 'commonTool', 'buyerService', function($scope, $rootScope, ngDialog, commonService, commonTool, buyerService) {

                            pagingdlg.searchType = null;
                            pagingdlg.searchTypeValue = null;
                            pagingdlg.total = null;
                            pagingdlg.pageSize = 10;
                            vm.pages = commonService.setPageSizeArray(10, 30, 50);
                            toolsdlg.search = function() {
                                var regex = /^[0-9]*[1-9][0-9]*$/;
                                pagingdlg.searchType = toolsdlg.searchType;
                                if ((pagingdlg.searchType == 4 || pagingdlg.searchType == 5) && !commonTool.isEmpty(toolsdlg.searchTypeValue) && !regex.test(toolsdlg.searchTypeValue)) {
                                    $rootScope.alertMsgService.setMessage('用户ID、广交会ID只能输入正整数', 'warning');
                                    return;
                                } else {
                                    pagingdlg.searchTypeValue = toolsdlg.searchTypeValue;
                                }

                                toolsdlg.getBuyerList();
                            }

                            // 获取采购商列表
                            toolsdlg.getBuyerList = function() {
                                buyerService.getBuyerList(commonTool.filterParam(pagingdlg)).success(function(data) {
                                    vmdlg.data = data.data;
                                    vmdlg.total = data.page.total;
                                    pagingdlg.total = data.page.total;
                                    pagingdlg.pageSize = data.page.pageSize;
                                });
                            };

                            toolsdlg.selected = function(item) {
                                // console.log(item);
                                // 传参
                                paging.buyerId = item.buyerId;
                                buyerService.getBuyerDetail(item.buyerId).success(function(data) {
                                    if (data.status === 'success' && data.data.loginUser) {
                                        vm.mobileValidation = data.data.loginUser.mobileValidation;
                                        vm.emailValidation = data.data.loginUser.emailValidation;
                                    }
                                });

                                console.log(vm.mobileValidation, vm.emailValidation);
                                // 展示
                                vm.buyerId = item.buyerId;
                                vm.email = item.email;
                                vm.mobile = item.mobile;
                                vm.firstName = item.firstName;

                                vmdlg.data = null;
                                toolsdlg.close();
                            };
                            // 分页
                            toolsdlg.getnewpage = function(type) {
                                if (type == 1) {
                                    pagingdlg.page = toolsdlg.newpagesize;
                                    tools.newpagesize = null;
                                } else if (type == 0) {
                                    pagingdlg.page = 1;
                                }
                                toolsdlg.getBuyerList();
                            }

                            // 关闭
                            toolsdlg.close = function() {
                                $scope.closeThisDialog();
                            }

                        }]
                    })
                },
                // 增加记录
                addRecord: function(attrName) {
                    var dataTpl = $.extend(true, {}, tpl[attrName]);
                    vm[attrName].push(dataTpl);
                },
                // 删除记录
                delRecord: function(attrName, i) {
                    vm[attrName].splice(i, 1);
                },
                // 保存
                saveLabelRecord: function() {
                    if (commonTool.isEmpty(paging.buyerId)) {
                        $rootScope.alertMsgService.setMessage('请选择采购商', 'warning');
                        return;
                    }
                    if (vm.visitRecord.length > 0 || vm.dealRecord.length > 0) {
                        var _tempArr = vm.visitRecord.concat(vm.dealRecord);
                        for (let i = 0, len = _tempArr.length; i < len; i++) {
                            let item = _tempArr[i];
                            console.log(item);
                            if (item.visitType == 1) {
                                // 成交记录
                                if (commonTool.isEmpty(item.dealTime)) {
                                    $rootScope.alertMsgService.setMessage('请填写成交日期', 'warning');
                                    return;
                                }
                                if (commonTool.isEmpty(item.dealAmount)) {
                                    $rootScope.alertMsgService.setMessage('请填写金额', 'warning');
                                    return;
                                }
                                let dealAmount = Number(item.dealAmount);
                                if (dealAmount < 0 || dealAmount > 999999999) {
                                    $rootScope.alertMsgService.setMessage('金额范围控制在0~999999999', 'warning');
                                    return;
                                }
                                if (commonTool.isEmpty(item.sellerName)) {
                                    $rootScope.alertMsgService.setMessage('请填写供应商公司名称', 'warning');
                                    return;
                                }
                            } else {
                                // 拜访工厂
                                if (commonTool.isEmpty(item.dealTime)) {
                                    $rootScope.alertMsgService.setMessage('请填写访厂日期', 'warning');
                                    return;
                                }
                                if (commonTool.isEmpty(item.visitFactoryName)) {
                                    $rootScope.alertMsgService.setMessage('请填写拜访的工厂名称', 'warning');
                                    return;
                                }
                            }
                        }
                        for (var i = 0; i < _tempArr.length; i++) {
                            delete _tempArr[i]['$$hashKey'];
                        }
                        paging.uploadStr = encodeURIComponent(JSON.stringify(_tempArr));
                    }
                    buyerService.saveMarkInfo(commonTool.filterParam(paging)).success(function(data) {
                        if ('success' == data.status) {
                            $rootScope.alertMsgService.setMessage("保存成功", 'success', function() {
                                window.location.href = '/#/buyer/list';
                            });
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    });
                }
            });

            (function() {
                vm.popSearchTypeArray = method.getSearchTypeArray();
                vm.pages = commonService.setPageSizeArray(10, 30, 50);
            }());
        }
    ])

    ng.filter('checkBuyerStatus', function() {
        return function(status) {
            switch (status) {
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

    ng.filter("getBuyerCategoryName", function() {
        return function(item) {
            if (item.length == 0) return;
            var tmpArr = [];
            for (var i = 0; i < item.length; i++) {
                tmpArr.push(item[i].categoryName);
            }
            return tmpArr.join(',');
        };
    })

    ng.filter('chxKey', function() {
        return function(key) {
            var obj = {
                userEmail: '邮箱',
                firstName: '姓名',
                gender: '性别',
                buyerPhoto: "头像",
                countryName: '国籍',
                address: '地址',
                zipCode: '邮编',
                mobile: '手机',
                telephone: '固话',
                skype: 'Skype',
                companyName: '公司名称',
                companyLogo: '公司logo',
                companyCountryName: '公司国家',
                companyAddress: '公司地址',
                companyZipCode: '邮编',
                companyDesc: '公司简介',
                companyWebsite: '公司网址',
                companyFoundYear: '成立年份',
                companyNature: '采购商性质',
                companyType: '采购商类型',
                yearBuyingAmt: '年采购量',
                businessCooper: '商务合作采购商',
                productType: '采购产品分类',
                staffSize: '期望供应商的人员规模',
                registeredCapital: '期望供应商的注册资金',
                annualTurnover: '期望供应商的年营业额',
                businessType: '期望供应商的公司类型',
                otherExhibition: '其他展会采购商',
                remark: '备注'
            }
            return obj[key];
        }
    })

    ng.filter("checkFollowSign", function() {
        return function(followSignType, followSignWay) {

            if (followSignType == null || followSignType == '') return;

            var messages = '';

            var followSignTypeArray = [
                '', '有效买家', "Can't Find Key Person",
                'No English', 'Not Import from China',
                'Service Refused', 'Fail to Contact',
                'Not Buyer', 'Blick List'
            ];

            messages = followSignTypeArray[followSignType];

            if (followSignWay == null || followSignWay == '') return messages;

            var followSignWayArray1 = [
                '', 'Transfer', 'Find Key Person',
                'LeadExpress', 'Inquiry', 'E-mail Inquiry',
                'Online Chat', 'Success Case'
            ];
            var followSignWayArray2 = [
                '', '首次联系无人接听', '首次联系打不通',
                'Wrong Number', 'Wrong Email', 'Wrong Email &amp; Number'
            ];
            var followSignWayArray3 = [
                '', 'Personal Customer', 'Mainland Manufacturer',
                'Advertisement', 'Cheater', 'Not Buyer-Other'
            ];

            switch (followSignType) {
                case 1:
                    return messages + '>' + followSignWayArray1[followSignWay];
                case 6:
                    return messages + '>' + followSignWayArray2[followSignWay];
                case 7:
                    return messages + '>' + followSignWayArray3[followSignWay];
                default:
                    return messages;
            }


        };
    })

    ng.filter("auditchaseState", function() {
        return function(auditStatus) {
            var status = '';
            switch (auditStatus) {
                case 0:
                    status = '新增';
                    break;
                case 1:
                    status = '修改';
                    break;
                case 2:
                    status = '待审核';
                    break;
                case 3:
                    status = '通过';
                    break;
                case -1:
                    status = '不通过';
                    break;
            }
            return status;
        };
    })

    // 邮箱/手机验证状态
    ng.filter("validationFilter", function() {
        return function(validationStatus) {
            var status = '';
            switch (validationStatus) {
                case 0:
                    status = '未验证';
                    break;
                case 1:
                    status = '已验证';
                    break;
                case 2:
                    status = '人工验证';
                    break;
            }
            return status;
        };
    })

    ng.filter("emailStatusFilter", function() {
        return function(emailValidationSecond) {
            var status = '待处理';
            switch (emailValidationSecond) {
                case -1:
                    status = '待处理';
                    break;
                case 0:
                    status = '有效';
                    break;
                case 1:
                    status = '硬退';
                    break;
                case 2:
                    status = '软退';
                    break;
            }
            return status;
        };
    })

});
