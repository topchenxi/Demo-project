/**
 *
 * @authors huangqinxian@cf-ec.com
 * @date    2016-11-16 18:10:03
 * @version 1.0
 */

define(['../module'], function(ng) {
    ng.factory('cfecBuyerService', ['$http', 'api',
        function($http, api) {
            return {
                getCfecBuyerDetail: function(params) {
                    return $http.get(api.getCfecBuyerDetail, {
                        'params': params
                    });
                },
                cfecFollowRecord: function(params) {
                    return $http.get(api.cfecFollowRecord, {
                        'params': params
                    });
                },
                cfecFollowAdd: function(params) {
                    return $http.post(api.cfecFollowAdd, params);
                },
                updateCfecBuyer: function(params) {
                    return $http.post(api.updateCfecBuyer, params);
                },
                cfecSendProcurement: function(params) {
                    return $http.get(api.cfecSendProcurement, {
                        'params': params
                    });
                }
            };
        }
    ])
    ng.controller('cfecBuyerDetailCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$controller',
        '$location',
        '$uibModal',
        'cfecBuyerService',
        'commonService',
        'commonTool',
        'Upload',
        'api',
        function($scope, $rootScope, ngDialog, $controller, $location, $uibModal, cfecBuyerService, commonService, commonTool, Upload, api) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var search = $location.search();

            vm.buyerId = parseInt(search.buyerId);
            vm.isNotify = false;
            var buyerInfo = $scope.buyerInfo = {};

            var followpaging = $scope.followpaging = {
                buyerId: vm.buyerId,

                page: 1,
                pageSize: 10
            };
            $rootScope.categoryArray = [];

            $rootScope = $.extend($rootScope, {
                // 基本信息
                cfecBuyerBaseInfo: "/controller/buyer/buyerDetail/cfecBuyerBaseInfo.html",
                cfecBuyerFollowRecord: "/controller/buyer/buyerDetail/cfecBuyerFollowRecord.html",
                cfecBuyerUpdateRecord: "/controller/buyer/buyerDetail/cfecBuyerUpdateRecord.html",
            });

            tools = $.extend(tools, {
                getCfecBuyerDetail: function() {

                    if (commonTool.isEmpty(vm.buyerId)) return;

                    var params = {
                        buyerId: vm.buyerId
                    };

                    cfecBuyerService.getCfecBuyerDetail(params).success(function(data) {
                        vm.item = data.data;

                        buyerInfo = $.extend(buyerInfo, {
                            userId: vm.item.personal.userId,
                            buyerId: vm.item.personal.buyerId,
                            companyId: vm.item.company.companyId,
                            address: vm.item.personal.address,
                            annualTurnover: vm.item.purchase && vm.item.purchase.annualTurnover ? parseInt(vm.item.purchase.annualTurnover) : null,
                            businessType: vm.item.purchase && vm.item.purchase.businessType ? parseInt(vm.item.purchase.businessType) : null,
                            buyerPhoto: vm.item.personal.buyerPhoto,
                            // businessCooper: vm.item.company.businessCooper == 1 ? true : false,
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
                            userEmail: vm.item.personal.email,
                            yearBuyingAmt: vm.item.company.yearBuyingAmt ? parseInt(vm.item.company.yearBuyingAmt) : null,
                            zipCode: vm.item.personal.zipCode,
                            remark: vm.item.company.remark,
                            // otherExhibition: vm.item.company.otherExhibition == 1 ? true : false,
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
                        this.getCfecBuyerDetail();
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

                    // buyerInfo.businessCooper = buyerInfo.businessCooper ? 1 : 0;
                    // buyerInfo.otherExhibition = buyerInfo.otherExhibition ? 1 : 0;
                    // buyerInfo.username = buyerInfo.userEmail;

                    if (buyerInfo.companyCountryId == null) buyerInfo.companyCountryId = 0;

                    cfecBuyerService.updateCfecBuyer(buyerInfo).success(function(data) {
                        if (data.type == '20' || data.type == '21' || data.type == '22' || data.type == '23') {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        } else {
                            vm.isNotify = false;
                            tools.getCfecBuyerDetail();
                            $rootScope.alertMsgService.setMessage("保存成功", 'success');
                        }

                    })
                },
                cfecFollowRecord: function() {
                    cfecBuyerService.cfecFollowRecord(followpaging).success(function(data) {
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
                    tools.cfecFollowRecord();
                },
                addFollowRecord: function() {

                    $scope.buyerId = parseInt(search.buyerId);
                    $scope.tools = tools;
                    $scope.type = 2;
                    $scope.source = 'cfecBuyerDetail';
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 900,
                        templateUrl: '/controller/buyer/dialogTmp/followRecordDlg.html',
                        controller: 'insertfollowRcdCtrl'
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
                    if (item.hasOwnProperty('businessCooper')) {
                        delete item['businessCooper'];
                    }
                    if (item.hasOwnProperty('otherExhibition')) {
                        delete item['otherExhibition'];
                    }
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
                toBuyerDetail: function() {

                    if (commonTool.isEmpty(vm.item.personal.userId)) return;

                    window.location.href = "/#/buyer/detail?buyerId=" + vm.item.personal.userId;
                },
                sendProcurement: function() {
                    var params = {
                        buyerId: vm.buyerId
                    };
                    cfecBuyerService.cfecSendProcurement(params).success(function(data) {
                        if (data.status === 'success' && data.type === '200') {
                            $scope.publisherId = data.data;
                            $scope.newTools = tools;
                            $scope.cfecBuyerId = vm.buyerId;
                            $scope.apSource = 'cfecBuyerDetail';
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
                }
            });

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
                vm.followPages = commonService.setPageSizeArray(10, 30, 50);
            }

            (function() {
                tools.getCfecBuyerDetail();
                tools.cfecFollowRecord();
            }())

        }
    ])

    ng.controller('addCfecFollowRecordCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'cfecBuyerService', 'commonTool',
        function($scope, $rootScope, ngDialog,
            cfecBuyerService, commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools;


            var followRecord = $scope.followRecord = {
                buyerId: $scope.buyerId,
                followBuyerLevel: $scope.followBuyerLevel,
                followContent: null,
                followSignType: 1,
                followSignWay: 1,
            };
            tools = $.extend(tools, {
                submit: function() {
                    if (commonTool.isEmpty(followRecord.followContent)) {
                        $rootScope.alertMsgService.setMessage('跟进内容不能为空', 'warning');
                        return;
                    }
                    cfecBuyerService.cfecFollowAdd(followRecord).success(function(data) {
                        tools.cfecFollowRecord();
                        ngDialog.closeAll();
                    })
                },
                close: function() {
                    ngDialog.closeAll();
                },
                followSignTypeChange: function() {
                    switch (followRecord.followSignType) {
                        case 1:
                            vm.followSignWayArray = method.getFollowSignWayArray();
                            return;
                        case 6:
                            vm.followSignWayArray = method.getArrayOfContact();
                            return;
                        case 7:
                            vm.followSignWayArray = method.getArrayOfBuyer();
                            return;
                        default:
                            vm.followSignWayArray = [];
                            return;
                    }
                }
            });
            var method = {
                key: "",
                value: "",
                myObject: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                getFollowSignTypeArray: function() {
                    var tmpArr = [new this.myObject('有效买家', 1), new this.myObject("Can't Find Key Person", 2), new this.myObject('No English', 3), new this.myObject('Not Import from China', 4), new this.myObject('Service Refused', 5), new this.myObject('Fail to Contact', 6), new this.myObject('Not Buyer', 7), new this.myObject('Blick List', 8)];
                    return tmpArr;
                },
                getFollowSignWayArray: function() {
                    var tmpArr = [new this.myObject('Transfer', 1), new this.myObject('Find Key Person', 2), new this.myObject('LeadExpress', 3), new this.myObject('Inquiry', 4), new this.myObject('E-mail Inquiry', 5), new this.myObject('Online Chat', 6), new this.myObject('Success Case', 7)];
                    return tmpArr;
                },
                getArrayOfContact: function() {
                    var tmpArr = [new this.myObject('首次联系无人接听', 1), new this.myObject('首次联系打不通', 2), new this.myObject('Wrong Number', 3), new this.myObject('Wrong Email', 4), new this.myObject('Wrong Email &amp; Number', 5)];
                    return tmpArr;
                },
                getArrayOfBuyer: function() {
                    var tmpArr = [new this.myObject('Personal Customer', 1), new this.myObject('Mainland Manufacturer', 2), new this.myObject('Advertisement', 3), new this.myObject('Cheater', 4), new this.myObject('Not Buyer-Other', 5)];
                    return tmpArr;
                }
            };

            init_data();

            function init_data() {
                vm.followSignTypeArray = method.getFollowSignTypeArray();
                vm.followSignWayArray = method.getFollowSignWayArray();
            }


        }
    ])

});
