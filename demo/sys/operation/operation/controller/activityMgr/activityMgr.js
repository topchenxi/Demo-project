define(['../module'], function(ng) {

    ng.factory('activityMgrService', ['$http', 'api', function($http, api) {
        return {
            getActivitiesList: function(params) {
                return $http.get(api.getActivitiesList, {
                    params: params
                })
            },
            getActivitiesDetail: function(params) {
                return $http.get(api.getActivitiesDetail, {
                    params: params
                })
            },
            auditActivity: function(params) {
                return $http.post(api.auditActivity, params);
            },
            getMemPackageList: function(params) {
                return $http.get(api.getMemPackageList, {
                    'params': params
                });
            },
            saveActivityInfo: function(params) {
                return $http.post(api.saveActivityInfo, params);
            },
            getEnrollList: function(params) {
                return $http.get(api.getEnrollList, {
                    params: params
                })
            },
            getOnlineEnrollList: function(params) {
                return $http.get(api.getOnlineEnrollList, {
                    params: params
                })
            },
            getOfflineEnrollList: function(params) {
                return $http.get(api.getOfflineEnrollList, {
                    params: params
                })
            },
            getOfflineSellerDetail: function(params) {
                return $http.get(api.getOfflineSellerDetail, {
                    params: params
                })
            },
            auditApplyOnline: function(params) {
                return $http.post(api.auditApplyOnline, params);
            },
            auditApplyOffline: function(params) {
                return $http.post(api.auditApplyOffline, params);
            }
        }
    }])

    ng.controller('activityListCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'activityMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            activityMgrService,
            commonService
        ) {
            var tools = $scope.tools = {};
            var vm = $scope.vm = {};
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                // 活动名称
                eventTitle: null,
                // 活动日期
                eventTimeStart: null,
                eventTimeEnd: null,
                // 报名日期
                applyTimeStart: null,
                applyTimeEnd: null,
                // 活动类型 1 线上 2线下 
                eventType: null,
                // 不通过 -1 待审核 2 审核通过 3
                status: null
            };

            tools = angular.extend(tools, {
                initTab: function(status) {
                    paging.status = status;
                    this.reset();
                    this.getActivitiesList();
                },
                getActivitiesList: function() {
                    activityMgrService.getActivitiesList(commonTool.filterParam(paging)).success(function(data) {
                        vm.items = data.data.items;
                        paging.total = data.data.total;
                    })
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    this.getActivitiesList();
                },
                search: function() {
                    paging.page = 1;
                    this.getActivitiesList();
                },
                reset: function() {
                    paging.eventTitle = null;
                    paging.eventTimeStart = null;
                    paging.eventTimeEnd = null;
                    paging.applyTimeStart = null;
                    paging.applyTimeEnd = null;
                    paging.eventType = null;
                },
                addActivity: function() {
                    $location.path('/activityMgr/editActivityInfo');
                },
                clipboardSuccess: function(e) {
                    $rootScope.alertMsgService.setMessage("复制成功", 'success');
                    e.clearSelection();
                },
                clipboardError: function(e) {
                    $rootScope.alertMsgService.setMessage("复制失败，请重试", 'warning');
                }

            });

            (function() {
                tools.getActivitiesList();
                vm.pages = commonService.setPageSizeArray(10, 20, 50);
            }())

        }
    ])

    ng.controller('activityDetailCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'activityMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            activityMgrService,
            commonService
        ) {
            var tools = $scope.tools = {};
            var vm = $scope.vm = {};

            var search = $location.search();

            vm.eventTabloidsId = search.eventTabloidsId;

            if (commonTool.isEmpty(vm.eventTabloidsId)) return;

            vm.imgUrl = imgUrl;

            tools = angular.extend(tools, {
                getActivitiesDetail: function() {
                    activityMgrService.getActivitiesDetail({
                        eventTabloidsId: vm.eventTabloidsId
                    }).success(function(data) {
                        vm.activityInfo = data.data.eventDetail;
                        $('.activity-desc').html(vm.activityInfo.eventDesc);
                        vm.auditLogList = data.data.auditLogList.items;
                    })
                },
                toAudit: function(status, eventTabloidsId) {
                    ngDialog.open({
                        template: './controller/seller/dialogTmp/confirmdDlg.html',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var vm = $scope.vm = {
                                hasReson: status == -1,

                                messages: status == -1 ? '请确认是否审核不通过' : '请确认是否审核通过',

                                submitMsg: '确定',

                                cancelMsg: '取消',

                                btnFlag: false,

                                submit: function() {
                                    if (status == -1 && commonTool.isEmpty(vm.reason)) {
                                        $rootScope.alertMsgService.setMessage("请先填写原因", 'warning');
                                        return;
                                    }
                                    var auditParams = {
                                        eventTabloidsId: eventTabloidsId,
                                        status: status,
                                        reason: vm.reason
                                    };
                                    vm.btnFlag = true;
                                    activityMgrService.auditActivity(commonTool.filterParam(auditParams)).success(function(data) {
                                        if (data.status === 'success') {
                                            tools.getActivitiesDetail();
                                            $scope.closeThisDialog();
                                            $rootScope.alertMsgService.setMessage("审核成功", 'warning');
                                        } else {
                                            $rootScope.alertMsgService.setMessage("审核失败", 'warning');
                                            vm.btnFlag = false;
                                        }
                                    })

                                },
                                close: function() {
                                    $scope.closeThisDialog();
                                }
                            };
                        }]
                    })


                }
            });

            (function() {
                tools.getActivitiesDetail();
                vm.pages = commonService.setPageSizeArray(10, 20, 50);
            }())

        }
    ])


    ng.controller('enrollListCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'activityMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            activityMgrService,
            commonService
        ) {
            var tools = $scope.tools = {};
            var vm = $scope.vm = {};
            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                status: 3,
                companyName: null
            };

            tools = angular.extend(tools, {
                getEnrollList: function() {
                    activityMgrService.getEnrollList(commonTool.filterParam(paging))
                        .success(function(data) {
                            vm.items = data.data.items;
                            paging.total = data.data.total;
                        })
                },
                search: function() {
                    paging.page = 1;
                    this.getEnrollList();
                },
                reset: function() {
                    paging.eventTitle = null;
                    paging.eventTimeStart = null;
                    paging.eventTimeEnd = null;
                    paging.applyTimeStart = null;
                    paging.applyTimeEnd = null;
                    paging.eventType = null;
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    this.getEnrollList();
                }
            });
            (function() {
                tools.getEnrollList();
                vm.pages = commonService.setPageSizeArray(10, 20, 50);
            }())

        }
    ])

    ng.controller('editActivityInfoCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'activityMgrService',
        'commonService',
        'Upload',
        'api',
        '$filter',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            activityMgrService,
            commonService,
            Upload,
            api,
            $filter
        ) {
            var tools = $scope.tools = {};
            var vm = $scope.vm = {};

            var activityInfo = $scope.activityInfo = {
                // 活动名称
                eventTitle: null,
                // 活动类型
                eventType: '1',
                // 行业限制
                limitIndustry: null,
                // 套餐限制
                limitPackage: null,
                // 参展限制
                limitExhibition: null,
                // 活动费用状态
                eventExpenseStatus: '1',
                // 活动费用
                eventExpense: null,
                // 活动描述
                eventDesc: null,
                // 是否需要上传图片素材
                isUploadMaterialtemp: '1',
                uploadProductType: '2',
                // 参与活动商家数限制
                limitJoinCount: null,
                // 单用户数量限制
                limitSingleUser: null,
                // 报名时间
                applyTimeStart: null,
                applyTimeEnd: null,
                // 活动时间
                eventTimeStart: null,
                eventTimeEnd: null,
                // 活动地点
                eventAddress: null
            };

            vm.imgUrl = imgUrl;
            var activityformVal;
            vm.materialOfProduct = false;
            vm.materialOfShop = false;

            vm.btnFlag = false;

            var eventTabloidsId = $location.search().eventTabloidsId || '';


            $.validator.addMethod("checkMaterialType", function(value, element) {
                return vm.materialOfProduct || vm.materialOfShop;
            }, "必须填写");

            $.validator.addMethod("checkEventDesc", function(value, element) {
                console.log(activityInfo.eventDesc);
                return !commonTool.isEmpty(activityInfo.eventDesc);
            }, "必须填写");

            tools = angular.extend(tools, {
                getDetailInfo: function() {
                    activityMgrService.getActivitiesDetail({
                        eventTabloidsId: eventTabloidsId
                    }).success(function(data) {
                        if (data.status === 'success') {
                            tools.setInfo(data.data.eventDetail);
                        }
                    })
                },
                setInfo: function(detailInfo) {
                    // 回填数据
                    console.log(detailInfo);

                    var timeKeyArray = "applyTime,applyTimeEndDb,eventTime,eventTimeEndDb".split(','),
                        timeKeyArray_ac = "applyTimeStart,applyTimeEnd,eventTimeStart,eventTimeEnd".split(',');
                    timeKeyArray.forEach((value, index) => {
                        detailInfo[value] && (activityInfo[timeKeyArray_ac[index]] = $filter('date')(detailInfo[value], 'yyyy-MM-dd HH:mm'))
                    });
                    var inputKeyArray = 'eventTitle,eventType,eventExpense,eventDesc,limitJoinCount,limitSingleUser,eventAddress'.split(',');
                    inputKeyArray.forEach((value) => {
                        activityInfo[value] = detailInfo[value];
                    })

                    if (detailInfo.limitIndustry) {
                        var industryIdArray = detailInfo.limitIndustry.split(',');
                        vm.firCategories.forEach((value) => {
                            if (industryIdArray.includes(value.categoryId.toString())) {
                                value.$checked = true;
                            }
                        })
                    }

                    if (detailInfo.limitPackage) {
                        var packageIdArray = detailInfo.limitPackage.split(',');
                        vm.memPackageList.forEach((value) => {
                            if (packageIdArray.includes(value.packageId.toString())) {
                                value.$checked = true;
                            }
                        })
                    }
                    activityInfo.limitExhibition = detailInfo.limitExhibition == 1 ? true : false;
                    activityInfo.eventExpenseStatus = detailInfo.eventExpense != 0 ? '2' : '1';

                    if (detailInfo.uploadTemp) {
                        activityInfo.uploadTemp = detailInfo.uploadTemp;
                        activityInfo.uploadTempName = '没有名字的说';
                    }

                    if (detailInfo.materialType) {
                        vm.materialOfProduct = detailInfo.materialType.indexOf('1') != -1;
                        vm.materialOfShop = detailInfo.materialType.indexOf('2') != -1;
                    }

                },
                getDateTime: function(date) {
                    return (new Date(date)).getTime();
                },
                saveInfo: function() {
                    if (!activityformVal.form()) return;

                    if (commonTool.isEmpty(activityInfo.eventDesc)) {
                        $rootScope.alertMsgService.setMessage("请输入活动描述", 'warning');
                        return;
                    }

                    if (activityInfo.eventType == 2 && (commonTool.isEmpty(activityInfo.eventTimeStart) || commonTool.isEmpty(activityInfo.eventTimeEnd))) {
                        $rootScope.alertMsgService.setMessage("请输入活动时间", 'warning');
                        return;
                    }

                    if (activityInfo.eventTimeStart && activityInfo.eventTimeEnd) {
                        let applyTimeEnd = this.getDateTime(activityInfo.applyTimeEnd),
                            eventTimeEnd = this.getDateTime(activityInfo.eventTimeEnd),
                            nowTime = (new Date()).getTime();
                        if (eventTimeEnd < nowTime) {
                            $rootScope.alertMsgService.setMessage("活动结束时间不能小于当前日期", 'warning');
                            return;
                        }
                        if (applyTimeEnd > eventTimeEnd) {
                            $rootScope.alertMsgService.setMessage("活动结束时间要晚于报名结束时间", 'warning');
                            return;
                        }
                    }



                    vm.btnFlag = true;

                    var materialTypeArray = [];
                    if (vm.materialOfProduct) materialTypeArray.push('1');
                    if (vm.materialOfShop) materialTypeArray.push('2');

                    // 素材类型
                    activityInfo.materialType = materialTypeArray.length ? materialTypeArray.join(',') : null;

                    // 行业限制
                    activityInfo.limitIndustry = this.getCheckItem(vm.firCategories, 'categoryId').join(',');

                    activityInfo.limitIndustry = activityInfo.limitIndustry ? activityInfo.limitIndustry : 0;



                    if (activityInfo.eventType == 2) {
                        activityInfo.limitPackage = null;
                        activityInfo.limitExhibition = null;
                    } else {
                        activityInfo.limitPackage = this.getCheckItem(vm.memPackageList, 'packageId').join(',');
                        activityInfo.limitPackage = activityInfo.limitPackage ? activityInfo.limitPackage : 0;
                        activityInfo.limitExhibition = activityInfo.limitExhibition ? 1 : 0;
                    }

                    if (eventTabloidsId) {
                        activityInfo.eventTabloidsId = eventTabloidsId;
                    }

                    activityMgrService.saveActivityInfo(activityInfo).success(function(data) {
                        if (data.status === 'success') {
                            $rootScope.alertMsgService.setMessage("保存成功", 'success');
                            $location.path('/activityMgr/activityList');
                        } else {
                            $rootScope.alertMsgService.setMessage("保存失败", 'warning');
                            vm.btnFlag = false;
                        }
                    })


                },
                getCheckItem: function(baseArray, param) {
                    var targetArray = [];
                    var array = baseArray;
                    for (var i = 0; i < array.length; i++) {
                        var item = array[i];
                        if (item.$checked) {
                            targetArray.push(item[param]);
                        }
                    }
                    return targetArray;
                },
                checkMaterialType: function(name) {
                    var dom = '#' + name;
                    $(dom).valid();
                },
                uploadImg: function(files) {
                    if (files && files.length > 0) {
                        var file = files[0];
                        if ((!/.*\.(png)|(jpg)|(gif)|(psd)$/.test(file.name))) {
                            $rootScope.alertMsgService.setMessage("请重新选择图片,上传图片支持格式：png,jpg,gif,psd;文件大小不超过2M", 'warning');
                            return false;
                        }
                        Upload.upload({
                            url: api.uploadContract,
                            file: file
                        }).progress(function(evt) {
                            // console.log(evt);
                        }).success(function(data, status, headers, config) {
                            console.log(data.data.url, config.file.name);
                            activityInfo.uploadTemp = data.data.url;
                            activityInfo.uploadTempName = config.file.name;
                        });
                    }
                },
                addValidForm: function() {
                    activityformVal = $('#editActivityform').validate({
                        errorElement: "em",
                        errorClass: "error-explain",
                        validClass: "valid-explain",
                        groups: {
                            gs_apply: "applyTimeStart applyTimeEnd"
                        },
                        rules: {
                            eventTitle: {
                                required: true
                            },
                            eventExpense: {
                                required: true
                            },
                            // eventDesc: {
                            //     checkEventDesc: true
                            // },
                            applyTimeStart: {
                                required: true
                            },
                            applyTimeEnd: {
                                required: true
                            },
                            // eventTimeStart: {
                            //     required: true
                            // },
                            // eventTimeEnd: {
                            //     required: true
                            // },
                            limitJoinCount: {
                                integer: true,
                                min: 1
                            },
                            limitSingleUser: {
                                integer: true,
                                min: 1
                            },
                            materialOfProduct: {
                                checkMaterialType: true
                            },
                            materialOfShop: {
                                checkMaterialType: true
                            }
                        },
                        messages: {
                            limitJoinCount: {
                                integer: '请输入正整数'
                            },
                            limitSingleUser: {
                                integer: '请输入正整数'
                            },
                        }
                    })
                }
            });

            (function() {
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if (data.status !== 'success') return;
                    vm.firCategories = data.data;
                });
                activityMgrService.getMemPackageList({
                    page: 1,
                    pageSize: 1000,
                    status: 1
                }).success(function(data) {
                    if (data.status !== 'success') return;
                    vm.memPackageList = data.page.items;
                    tools.addValidForm();
                });

                if (eventTabloidsId) {
                    tools.getDetailInfo();
                }
            })()

        }
    ])

    ng.controller('onLineListCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'activityMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            activityMgrService,
            commonService
        ) {
            var tools = $scope.tools = {};
            var vm = $scope.vm = {};
            var search = $location.search();

            vm.title = search.title;

            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                eventTabloidsId: search.eventTabloidsId,
                status: 2,
                companyName: ''
            };

            vm.selectionItme = [];
            vm.showOperateFlag = false;


            tools = angular.extend(tools, {
                initTab: function(status) {
                    this.reset();
                    paging.status = status;
                    this.getOnlineEnrollList();
                },
                getOnlineEnrollList: function() {
                    vm.showOperateFlag = false;
                    vm.allChecked = false;
                    activityMgrService.getOnlineEnrollList(commonTool.filterParam(paging))
                        .success(function(data) {
                            vm.items = data.data.items;
                            paging.total = data.data.total;
                        });
                },
                search: function() {
                    paging.page = 1;
                    this.getOnlineEnrollList();
                },
                reset: function() {
                    paging.companyName = null;
                },
                export: function() {
                    // console.log(search.eventTabloidsId);
                    var url = '/oms/eventMaterial/reportMaterial.cf?&eventTabloidsId=' + search.eventTabloidsId;
                    if (!commonTool.isEmpty(paging.companyName)) url += ('&companyName=' + paging.companyName);
                    window.open(url);
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    this.getOnlineEnrollList();
                },
                checkAll: function(checked) {
                    vm.selectionItme = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {
                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionItme.push(item.eventMaterialId);
                        }
                    });
                },
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.eventMaterialId);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                },
                chgAuditStatus: function(status) {
                    var hasSelectEvent = vm.selectionItme.join(',');
                    ngDialog.open({
                        template: './controller/seller/dialogTmp/confirmdDlg.html',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var vm = $scope.vm = {
                                hasReson: status == -1,

                                messages: status == -1 ? '请确认是否审核不通过' : '请确认是否审核通过',

                                submitMsg: '确定',

                                cancelMsg: '取消',

                                btnFlag: false,

                                submit: function() {
                                    if (status == -1 && commonTool.isEmpty(vm.reason)) {
                                        $rootScope.alertMsgService.setMessage("请先填写原因", 'warning');
                                        return;
                                    }
                                    var auditParams = {
                                        eventMaterialIds: hasSelectEvent,
                                        status: status,
                                        reason: vm.reason
                                    };
                                    vm.btnFlag = true;
                                    activityMgrService.auditApplyOnline(commonTool.filterParam(auditParams)).success(function(data) {
                                        if (data.status === 'success') {
                                            tools.getOnlineEnrollList();
                                            $scope.closeThisDialog();
                                            $rootScope.alertMsgService.setMessage("审核成功", 'warning');
                                        } else {
                                            $rootScope.alertMsgService.setMessage("审核失败", 'warning');
                                            vm.btnFlag = false;
                                        }
                                    })

                                },
                                close: function() {
                                    $scope.closeThisDialog();
                                }
                            };
                        }]
                    })
                }
            });

            (function() {
                tools.getOnlineEnrollList();
                vm.pages = commonService.setPageSizeArray(10, 20, 50);
            })();

        }
    ])


    ng.controller('offLineListCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'activityMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            activityMgrService,
            commonService
        ) {
            var tools = $scope.tools = {};
            var vm = $scope.vm = {};
            var search = $location.search();

            vm.title = search.title;

            var paging = $scope.paging = {
                page: 1,
                pageSize: 10,
                eventTabloidsId: search.eventTabloidsId,
                status: 2
            };

            tools = angular.extend(tools, {
                initTab: function(status) {
                    this.reset();
                    paging.status = status;
                    this.getOfflineEnrollList();
                },
                getOfflineEnrollList: function() {
                    activityMgrService.getOfflineEnrollList(commonTool.filterParam(paging))
                        .success(function(data) {
                            vm.items = data.data.items;
                            paging.total = data.data.total;
                        });
                },
                search: function() {
                    paging.page = 1;
                    this.getOfflineEnrollList();
                },
                reset: function() {
                    paging.companyName = null;
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    this.getOfflineEnrollList();
                }
            });

            (function() {
                tools.getOfflineEnrollList();
                vm.pages = commonService.setPageSizeArray(10, 20, 50);
            })()

        }
    ])

    ng.controller('offLineSellerDetailCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'activityMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            activityMgrService,
            commonService
        ) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var search = $location.search();


            tools = $.extend(tools, {
                getOfflineSellerDetail: function() {
                    activityMgrService.getOfflineSellerDetail({
                        eventApplyId: search.eventApplyId
                    }).success(function(data) {
                        vm.sellerInfo = data.data.detail;
                        vm.items = data.data.auditLogList.items;
                    })
                },
                toAudit: function(status) {
                    ngDialog.open({
                        template: './controller/seller/dialogTmp/confirmdDlg.html',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var vm = $scope.vm = {
                                hasReson: status == -1,

                                messages: status == -1 ? '请确认是否审核不通过' : '请确认是否审核通过',

                                submitMsg: '确定',

                                cancelMsg: '取消',

                                btnFlag: false,

                                submit: function() {
                                    if (status == -1 && commonTool.isEmpty(vm.reason)) {
                                        $rootScope.alertMsgService.setMessage("请先填写原因", 'warning');
                                        return;
                                    }
                                    var auditParams = {
                                        eventApplyId: search.eventApplyId,
                                        status: status,
                                        reason: vm.reason
                                    };
                                    vm.btnFlag = true;
                                    activityMgrService.auditApplyOffline(commonTool.filterParam(auditParams)).success(function(data) {
                                        if (data.status === 'success') {
                                            tools.getOfflineSellerDetail();
                                            $scope.closeThisDialog();
                                            $rootScope.alertMsgService.setMessage("审核成功", 'warning');
                                        } else {
                                            $rootScope.alertMsgService.setMessage("审核失败", 'warning');
                                            vm.btnFlag = false;
                                        }
                                    })

                                },
                                close: function() {
                                    $scope.closeThisDialog();
                                }
                            };
                        }]
                    })

                }
            });
            (function() {
                tools.getOfflineSellerDetail();
                vm.pages = commonService.setPageSizeArray(10, 20, 50);

            })()
        }
    ])

    ng.filter('activityStatus', function() {
        return function(status) {
            switch (status) {
                case -1:
                    return '不通过';
                case -2:
                    return '已撤销';
                case 2:
                    return '待审核';
                case 3:
                    return '审核通过';
                default:
                    return '';

            }

        };
    });

    ng.filter('eventExpenseFilter', function() {
        return function(eventExpense) {
            return eventExpense ? eventExpense : '免费';
        };
    });

    ng.filter('eventTypeFilter', function() {
        return function(eventType) {
            return eventType == 1 ? '线上' : '线下';
        };
    });

    ng.filter('activityUrlFilter', function() {
        return function(id) {
            return sellerUrl + '/seller_center/eventstatic/detail.cf?eid=' + id;
        }
    })

})