define(['../module'], function(ng) {

    ng.
    factory('memberService', ['$http', 'api', function($http, api) {
            return {
                /* 套餐设置 */
                getMemPackageList: function(params) {
                    return $http.get(api.getMemPackageList, { 'params': params });
                },
                addPackageList: function(params) {
                    return $http.get(api.addPackageList, { 'params': params });
                },
                getMemPackageDetail: function(packageId) {
                    return $http.get(api.getMemPackageDetail, { 'params': { 'packageId': packageId } });
                },
                updateMemPackage: function(params) {
                    return $http.post(api.updateMemPackage, params);
                },
                getPackageLevels: function() {
                    return $http.get(api.getPackageLevels);
                },
                getNewPackage: function() {
                    return {
                        windownNum: '5',
                        childAccountNum: '3',
                        secondDomain: '0',
                        companyVideo: '0',
                        replyInquiry: '0',
                        matchProcurementRequire: '0',
                        channelTwoLevelPage: '0',
                        recommendChannelDisplay: '0',
                        journalRecommend: '0',
                        logoIdentify: '0',
                        certificateDisplay: '0',
                        generationService: '0',
                        exclusiveService: '0'
                    }
                },
                getPackageSaveForm: function(viewForm) {
                    if (viewForm.windownNum == -1) {
                        viewForm.windownNum = viewForm.windownNumDef;
                    }
                    if (viewForm.childAccountNum == -1) {
                        viewForm.childAccountNum = viewForm.childAccountNumDef;
                    }
                    if (viewForm.channelTwoLevelPage == -1) {
                        viewForm.channelTwoLevelPage = viewForm.channelTwoLevelPageDef;
                    }
                    if (viewForm.recommendChannelDisplay == -1) {
                        viewForm.recommendChannelDisplay = viewForm.recommendChannelDisplayDef;
                    }
                    if (viewForm.dailyFreeQuoteNum == -1) {
                        viewForm.dailyFreeQuoteNum = viewForm.dailyFreeQuoteNumDef;
                    }
                    return viewForm;

                },
                getPackageViewForm: function(saveFrom) {
                    var isInArray = function(temp, arr) {
                        var flag = false;
                        for (var i = arr.length - 1; i >= 0; i--) {
                            if (temp == arr[i]) {
                                flag = true;
                                break;
                            }
                        }
                        return flag;
                    }
                    if (!isInArray(saveFrom.windownNum, [5, 15, 30])) {
                        saveFrom.windownNumDef = saveFrom.windownNum;
                        saveFrom.windownNum = -1;
                    }
                    if (!isInArray(saveFrom.childAccountNum, [3, 5, 8])) {
                        saveFrom.childAccountNumDef = saveFrom.childAccountNum;
                        saveFrom.childAccountNum = -1;
                    }
                    if (!isInArray(saveFrom.channelTwoLevelPage, [0, 1, 2])) {
                        saveFrom.channelTwoLevelPageDef = saveFrom.channelTwoLevelPage;
                        saveFrom.channelTwoLevelPage = -1;
                    }
                    if (!isInArray(saveFrom.recommendChannelDisplay, [0, 1, 2])) {
                        saveFrom.recommendChannelDisplayDef = saveFrom.recommendChannelDisplay;
                        saveFrom.recommendChannelDisplay = -1;
                    }
                    if (!isInArray(saveFrom.dailyFreeQuoteNum, [10, 15, 20])) {
                        saveFrom.dailyFreeQuoteNumDef = saveFrom.dailyFreeQuoteNum;
                        saveFrom.dailyFreeQuoteNum = -1;
                    }

                    return saveFrom;
                },

                /* 会员套餐开通 */
                getFreeMemList: function(params) {
                    return $http.get(api.getFreeMemList, { 'params': params });
                },
                getFreeMemCount: function() {
                    return $http.get(api.getFreeMemCount);
                },
                fmSetPackage: function(params) {
                    return $http.post(api.fmSetPackage, params);
                },
                // 在约
                getContMemCount: function() {
                    return $http.get(api.getContMemCount);
                },
                getContMemList: function(params) {
                    return $http.get(api.getContMemList, { 'params': params });
                },
                contMemSetPackage: function(params) {
                    return $http.post(api.contMemSetPackage, params);
                },
                contMemRenewPackage: function(params) {
                    return $http.post(api.contMemRenewPackage, params);
                },
                contMemDetail: function(packageRecordId) {
                    return $http.get(api.contMemDetail, { 'params': { 'packageRecordId': packageRecordId } });
                },
                getOneMoreYear: function(curDate) {
                    var tempDate = angular.copy(curDate);
                    // 当前为2月29时
                    if (tempDate.getMonth() === 1 && tempDate.getDate() === 29) {
                        tempDate.setDate(28);
                    }
                    tempDate.setFullYear(tempDate.getFullYear() + 1);
                    return tempDate;
                },
                formLocal2UTC: function(date) {
                    // 2016-05-04T16:00:00.000Z
                    return date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate() + 'T' + date.getUTCHours() + ':' + date.getUTCMinutes() + ":00.000Z";
                }



            }
        }])
        .controller('MemberUserListCtrl', ['$scope', '$rootScope', '$controller', 'ngDialog', 'commonService', 'commonTool', 'memberService',
            function($scope, $rootScope, $controller, ngDialog, commonService, commonTool, service) {

                $controller('baseListController', { '$scope': $scope });
                var tools = $scope.tools; // 继承父控制器的
                var vm = $scope.vm; // 继承父控制器的
                vm.dialogData = {};
                var forms = $scope.forms = {};

                // 普通会员列表的查询条件
                var paging = {};


                // 定义"申请时间:起始时间"控件
                var start = {
                    elem: '#timeBegin',
                    choose: function(data) {
                        end.min = data;
                        end.start = data;
                        paging.timeBegin = data;
                    },
                    clear: function() {
                        paging.timeBegin = null;
                    }
                };
                // 定义"申请时间:截止时间"控件
                var end = {
                    elem: '#timeEnd',
                    choose: function(data) {
                        start.max = data;
                        paging.timeEnd = data;
                    },
                    clear: function() {
                        paging.timeEnd = null;
                    }
                };
                tools = $.extend(tools, {
                    // 点击"申请时间:起始时间"输入框事件
                    initStartDate: function() {
                        laydate(start);
                    },
                    // 点击"申请时间:起始时间"输入框事件
                    initEndDate: function() {
                        laydate(end);
                    },
                });

                /*
                获取免费会员列表
                */

                if (commonTool.isEmpty(vm.packageList)) {
                    service.getMemPackageList({ page: 1, pageSize: 1000, status: 1 }).success(function(rs) {
                        vm.packageList = rs.page.items;
                    })
                }

                if (commonTool.isEmpty(vm.addPackageList)) {
                    service.addPackageList({ page: 1, pageSize: 1000, status: 1 }).success(function(rs) {
                        vm.addPackageList = rs.page.items;
                    })
                }

                tools.searchFreeMem = function() {
                    paging.page = 1;
                    tools.getFreeMemList();
                }

                tools.searchContMem = function() {
                    paging.page = 1;
                    tools.getContMemList();
                }


                tools.getFreeMemList = function() {
                    service.getFreeMemList(commonTool.filterParam(paging)).success(function(rs) {
                        if (rs.status == 'success') {
                            vm.freeMCheckDatas = [];
                            if (vm.currentTab != 'freeMem') {
                                return;
                            }
                            vm.items = rs.data.items;
                            if (vm.items == null) {
                                vm.items = [];
                            }
                            paging.total = rs.data.total;
                        } else {
                            alert("数据加载失败");
                        }
                    });
                }

                /*
                获取免费会员列表
                 */
                tools.getContMemList = function() {
                    service.getContMemList(commonTool.filterParam(paging)).success(function(rs) {
                        if (rs.status == 'success') {
                            if (vm.currentTab != 'contMem') {
                                return;
                            }
                            vm.items = rs.data.items;
                            if (vm.items == null) {
                                vm.items = [];
                            }
                            paging.total = rs.data.total;
                        } else {
                            alert("数据加载失败");
                        }
                    });
                }


                /* 初始化免费会员tab*/
                tools.initFreeMem = function() {
                    vm.currentTab = 'freeMem';
                    vm.items = null;
                    paging = $scope.paging = {
                        pageSize: 10,
                        page: 1,
                        isExhibitor: 0,
                        sKey: '1', // 类型
                        sValue: '' // 关键字
                    }
                    tools.baseInit();
                    tools.getFreeMemList();
                    // 获取普通用户总量
                    if (commonTool.isEmpty(vm.freeMemCount)) {
                        service.getFreeMemCount().success(function(rs) {
                            if (rs.status == 'success') {
                                vm.freeMemCount = rs.data;
                            } else {
                                console.log("获取普通用户总量失败");
                            }
                            // 加载失败时不作处理
                        });
                    }
                }
                tools.initFreeMem();
                /* 初始化在约会员tab*/
                tools.initContMem = function() {
                    vm.items = null;
                    vm.currentTab = 'contMem';
                    paging = $scope.paging = {
                        pageSize: 10,
                        page: 1,
                        isExhibitor: 0, // 是否参展商
                        isExpireSoon: 0, // 是否快过期
                        openState: '', // 开通状态
                        packageId: '', // 套餐类型
                        sKey: '1', // 类型
                        sValue: '', // 关键字
                        timeKey: '1',
                        timeBegin: '',
                        timeEnd: ''
                    }

                    tools.getContMemList();
                    // 获取普通用户总量
                    if (commonTool.isEmpty(vm.contMemCount)) {
                        service.getContMemCount().success(function(rs) {
                            if (rs.status == 'success') {
                                vm.contMemCount = rs.data;
                            } else {
                                console.log("获取在约用户总量失败");
                            }
                            // 加载失败时不作处理
                        });
                    }
                    // 初始化下拉框数据

                }

                tools.resetCont = function() {
                    paging = $scope.paging = {
                        pageSize: 10,
                        page: 1,
                        isExhibitor: 0, // 是否参展商
                        isExpireSoon: 0, // 是否快过期
                        openState: '', // 开通状态
                        packageId: '', // 套餐类型
                        sKey: '1', // 类型
                        sValue: '', // 关键字
                        timeKey: '1',
                        timeBegin: '',
                        timeEnd: ''
                    }
                }


                // 分页组件
                tools.getnewpage = function(type) {
                    if (type == 1) { // 跳转到第几页
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) { // 每页显示多少条切换时
                        paging.page = 1;
                    }
                    if (paging.hasOwnProperty('isExpireSoon')) {
                        tools.getContMemList();
                    } else {
                        tools.getFreeMemList();
                    }
                }

                /*
                全选or全不选
                 */
                tools.checkAll = function(isAllChecked) {
                    vm.freeMCheckDatas = [];
                    angular.forEach(vm.items, function(item) {
                        item.$checked = isAllChecked;
                        if (isAllChecked) {
                            vm.freeMCheckDatas.push(item.companyId);
                        }
                    });
                }

                tools.setCheckedData = function() {
                    var checkedIts = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            checkedIts.push(item.companyId);
                        }
                    });
                    vm.freeMCheckDatas = checkedIts;
                }

                /**
                 * 获取选中项的id们
                 * @param  {[string]} 能作为唯一标识的属性名
                 * @return {[string]} 没有选中项时：空串，有选中时,形如：'id1,id2,id3'
                 */
                tools.getCheckedItIds = function(attrName) {
                    var checkedIts = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            checkedIts.push(item[attrName]);
                        }
                    });
                    return checkedIts.join(",");
                }

                /**
                 * 获取选中项的关键词数组
                 * @param  {[string]} 能作为唯一标识的属性名
                 * @return {[string]} 数组
                 */
                tools.getCheckedItNames = function(attrName) {
                    var checkedIts = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            checkedIts.push(item[attrName]);
                        }
                    });
                    return checkedIts;
                }

                /**
                 * 普通供应商开通套餐操作响应
                 * @param {Boolean} isBatch [是否批量开通]
                 * @param {[type]}  index   [单个开通时在list里的index]
                 */
                tools.setMemPackage = function(isBatch, index) {
                    vm.dialogData = {};

                    if (isBatch) {
                        vm.dialogData.companyIds = vm.freeMCheckDatas.join(',');
                        if (commonTool.isEmpty(vm.dialogData.companyIds)) {
                            alert("请先选择操作项!");
                            return;
                        }
                        vm.dialogData.chkNameArr = tools.getCheckedItNames('companyName');
                    } else {
                        vm.dialogData.companyIds = vm.items[index].companyId;
                        vm.dialogData.chkNameArr = [vm.items[index].companyName]; // 数组
                    }


                    tools.activeMember();
                }

                /* 开通会员套餐 */
                tools.activeMemberDb = function() {
                    if (forms.activeForm.$invalid) {
                        return;
                    }
                    var param = {
                        sEffectiveTime: vm.dialogData.sEffectiveTime,
                        sExpireTime: vm.dialogData.sExpireTime,
                        companyIds: vm.dialogData.companyIds,
                        packageId: vm.dialogData.packageId,
                        remark: vm.dialogData.remark
                    }
                    vm.dialogData.doing = true;
                    service.fmSetPackage(param).success(function(rs) {
                        if (rs.status == 'success') {
                            $rootScope.alertMsgService.setMessage("操作成功");
                            tools.closeDlg();
                            vm.dialogData.doing = false;
                            tools.getFreeMemList();
                        } else {
                            vm.dialogData.doing = false;
                            $rootScope.alertMsgService.setMessage("操作失败", 'warning');
                        }
                    })
                }

                /* 在约会员设置会员套餐 */
                tools.auditMemberDb = function() {
                    if (forms.activeForm.$invalid) {
                        return;
                    }

                    for (var i = 0, l = vm.packageList.length; i < l; i++) {
                        if (vm.packageList[i].packageId == vm.dialogData.packageId) {
                            vm.dialogData.packageName = vm.packageList[i].packageName;
                            break;
                        }
                    }
                    var param = {
                        sEffectiveTime: vm.dialogData.sEffectiveTime,
                        sExpireTime: vm.dialogData.sExpireTime,
                        companyId: vm.dialogData.companyId,
                        packageId: vm.dialogData.packageId,
                        setType: vm.dialogData.setType,
                        packageRecordId: vm.dialogData.packageRecordId,
                        packageName: vm.dialogData.packageName,// 后端记录操作日志需要这个参数
                        remark: vm.dialogData.remark                        
                    }
                    vm.dialogData.doing = true;
                    service.contMemSetPackage(param).success(function(rs) {
                        vm.dialogData.doing = false;
                        if (rs.status == 'success') {
                            $rootScope.alertMsgService.setMessage("操作成功");
                            tools.closeDlg();
                            tools.getContMemList();
                        } else {

                            $rootScope.alertMsgService.setMessage("操作失败", 'warning');
                        }
                    })
                }

                /* 续费 */
                tools.renewMemberDb = function() {
                    var param = {
                        packageRecordIdLast: vm.dialogData.packageRecordIdLast
                    }
                    service.contMemRenewPackage(param).success(function(rs) {
                        if (rs.status == 'success') {
                            $rootScope.alertMsgService.setMessage("操作成功");
                            tools.closeDlg();
                            tools.getContMemList();
                        } else {
                            $rootScope.alertMsgService.setMessage("操作失败:" + rs.message, 'warning');
                        }
                    })
                }

                /*
                普通供应商激活套餐Dialog
                 */
                tools.activeMember = function() {
                    // 初始化下拉框数据
                    service.addPackageList({ page: 1, pageSize: 1000, status: 1 }).success(function(rs) {
                        vm.addPackageList = rs.page.items;
                        vm.dialogData.packageId = vm.packageList[0].packageId;
                    })


                    vm.activeDlg = ngDialog.open({
                        title: '套餐开通',
                        template: 'activeDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        width: 560,
                        controller: ['$scope', function($scope) {
                            // 生效日期
                            vm.dialogData.sEffectiveTime = commonTool.formatDate(new Date(), 'yyyy-MM-dd');
                            vm.dialogData.minDate = vm.dialogData.sEffectiveTime;
                            vm.dialogData.sExpireTime = commonTool.formatDate(service.getOneMoreYear(new Date()), 'yyyy-MM-dd');                                
                        }]

                    });
                }

                /*
                在约供应商-详情Dialog
                 */
                tools.toDetail = function(packageRecordId) { 
                    vm.activeDlg = ngDialog.open({
                        title: '会员套餐详情',
                        template: 'detailDlgId',
                        appendClassName: "dialog-detailM",
                        width: 780,
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            service.contMemDetail(packageRecordId).success(function(rs) {
                                if (rs.status = 'success') {
                                    vm.contMemDetail = rs.data;
                                }
                            })
                        }]
                    });
                }
                tools.toPackageDetail = function(pakageId) {
                        vm.detailVo = null;
                        service.getMemPackageDetail(pakageId).success(function(rs) {
                            if (rs.status == 'success') {
                                vm.detailVo = rs.data;
                                vm.detailVo.noChg = true;
                            }
                        });
                        vm.addDialog = ngDialog.open({
                            template: "./controller/member/packageDetail.html",
                            appendClassName: 'dialog-detailM',
                            scope: $scope,
                            width: 780,
                            title: '套餐类型详情',
                            closeByNavigation: true,
                            controller: ['$scope', function($scope) { // 内联控制
                            }]
                        });
                    }
                    /*
                    在约供应商-设置Dialog
                     */
                tools.auditMember = function(index, isFromDetail) {
                        service.addPackageList({ page: 1, pageSize: 1000, status: 1 }).success(function(rs) {
                            vm.addPackageList = rs.page.items;
                            vm.dialogData.packageId = vm.packageList[0].packageId;
                        })

                        vm.dialogData = {};
                        var temp = null;
                        if (!isFromDetail) {
                            temp = vm.items[index];
                            vm.dialogData.expireTime = temp.expireTime;
                        } else {
                            tools.closeDlg(); // 关闭详情dialog
                            temp = vm.contMemDetail;
                            vm.dialogData.expireTime = temp.expireTimeMax;
                        }
                        vm.dialogData.companyName = temp.companyName;
                        vm.dialogData.packageName = temp.packageName;
                        vm.dialogData.companyId = temp.companyId;
                        vm.dialogData.setType = 1;
                        vm.dialogData.packageId = vm.packageList[0].packageId;
                        vm.dialogData.packageRecordId = temp.packageRecordId;                       
                        vm.activeDlg = ngDialog.open({
                            title: '会员套餐开通',
                            template: 'auditDlgId',
                            appendClassName: "dialog-activeM",
                            width: 560,
                            scope: $scope,
                            controller: ['$scope', function($scope) {
                                // /*初始化日期控件相关*/
                                // vm.dialogData.dateOptions = {
                                //     formatYear: 'yy',
                                //     startingDay: 1
                                // };
                                // 默认不显示日期控件
                                // vm.dialogData.opened1 = false;
                                // vm.dialogData.opened2 = false;
                                // for (var i = 1; i <= 2; i++) {
                                //     (function(i) {
                                //         vm.dialogData["open" + i] = function($event) { // 创建open方法 。 下面默认行为并将opened 设为true
                                //             $event.preventDefault();
                                //             $event.stopPropagation();
                                //             for (var j = 1; j <= 2; j++) {
                                //                 vm.dialogData["opened" + j] = (j == i ? true : false);
                                //             }
                                //         };
                                //     })(i)
                                // }

                                /*生效类型*/
                                tools.setEffectiveTime = function() {
                                    // 立即生效-生效日期为当天
                                    var sEffectiveTimeTemp = null;
                                    if (vm.dialogData.setType == 1) {
                                        vm.dialogData.sEffectiveTime = commonTool.formatDate(new Date(), 'yyyy-MM-dd');
                                        sEffectiveTimeTemp = new Date();
                                    } else { // 顺延-生效日期为过期日期后一天
                                        vm.dialogData.sEffectiveTime = commonTool.formatDate(new Date(vm.dialogData.expireTime + 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
                                        sEffectiveTimeTemp = new Date(vm.dialogData.expireTime + 24 * 60 * 60 * 1000);
                                    }
                                    vm.dialogData.sExpireTime = commonTool.formatDate(service.getOneMoreYear(sEffectiveTimeTemp), 'yyyy-MM-dd');
                                }
                                tools.setEffectiveTime();
                            }]
                        });
                    }
                    /*
                    在约供应商-续费Dialog
                     */
                tools.renewMember = function(packageRecordIdLast, packageName) {
                    vm.dialogData = {};
                    vm.dialogData.packageRecordIdLast = packageRecordIdLast;
                    vm.dialogData.packageName = packageName;
                    vm.activeDlg = ngDialog.openConfirm({
                        confirmInfo: '该公司目前使用的是【' + vm.dialogData.packageName + '】套餐，是否要为其续费？',
                        title: '会员套餐续费'
                    }).then(function(yes) {
                        tools.renewMemberDb();
                    }, function(no) {
                        // 取消
                    });
                }

                /*
                关闭弹出窗口
                 */
                tools.closeDlg = function(id) {
                    vm.dialogData = [];
                    if (commonTool.isEmpty(id)) {
                        ngDialog.closeAll();
                    } else {
                        ngDialog.close(id);
                    }
                }
            }
        ])
        // 套餐类型设置
        .controller('MemberPackageListCtrl', ['$scope', '$rootScope', '$controller', 'ngDialog', 'commonService', 'commonTool', 'memberService', function($scope, $rootScope, $controller, ngDialog, commonService, commonTool, service) {

            $controller('baseListController', { '$scope': $scope });
            var tools = $scope.tools; // 继承父控制器的
            var vm = $scope.vm; // 继承父控制器的
            var forms = $scope.forms = {};
            var paging = $scope.paging = {
                'page': 1,
                'pageSize': 10
            };

            tools.init = function() {
                tools.baseInit();
                tools.getList();
            }

            /* 查询列表 */
            tools.getList = function() {
                service.getMemPackageList(paging).success(function(rs) {
                    if (rs.status == 'success') {
                        vm.items = rs.page.items;
                        paging.total = rs.page.total;
                    } else {
                        alert("数据加载失败");
                    }
                });
            }

            tools.init();

            // 分页组件
            tools.getnewpage = function(type) {
                if (type == 1) { // 跳转到第几页
                    paging.page = tools.newpagesize;
                    tools.newpagesize = null;
                } else if (type == 0) { // 每页显示多少条切换时
                    paging.page = 1;
                }

                tools.getList();

            }


            /* 获取套餐等级列表 */
            tools.getPackageLevels = function() {
                if (commonTool.isEmpty(vm.packageLevels)) {
                    // console.log(new Date())
                    service.getPackageLevels().success(function(rs) {
                        if (rs.status = 'success') {
                            vm.packageLevels = rs.data;
                            // console.log(new Date())
                        }
                    })
                }
            }

            tools.closeDlg = function(id) {
                if (commonTool.isEmpty(id)) {
                    ngDialog.closeAll();
                } else {
                    ngDialog.close(id);
                }
            };

            /* 添加 or 
             * 从列表页来的修改type=2
             * 从详情页来的修改 type= 1
             */
            tools.addPackageDlg = function(type, pakageId) {
                if (type == 1) {
                    vm.dlgTitle = "修改";
                    // 复制 并 对自定义的值特殊处理
                    vm.detailVoNew = service.getPackageViewForm(angular.copy(vm.detailVo));

                } else if (type == 2) {
                    vm.dlgTitle = "修改";
                    service.getMemPackageDetail(pakageId).success(function(rs) {
                        if (rs.status == 'success') {
                            vm.detailVoNew = service.getPackageViewForm(rs.data);
                        }
                    });
                } else {
                    vm.dlgTitle = "新增";
                    vm.detailVoNew = service.getNewPackage();
                }
                vm.addDialog = ngDialog.open({
                    template: "./controller/member/packageAdd.html",
                    appendClassName: 'dialog-addM',
                    scope: $scope,
                    width: 780,
                    title: vm.dlgTitle + '会员套餐',
                    closeByNavigation: true,
                    controller: ['$scope', '$interval', function($scope, $timeout) {
                        // 初始化-获取套餐等级列表
                        tools.getPackageLevels();
                        var selectPackageLevel = $scope.selectPackageLevel = {};



                        // if(vm.dlgTitle == '新增'){
                        //  selectPackageLevel.cur = vm.packageLevels[0];
                        // }else{
                        // }

                        // vm.detailVoNew.packageTypeId = selectPackageLevel.cur.packageTypeId;
                        // selectPackageLevel.showls = false;


                        // selectPackageLevel.change = function(index){
                        //  selectPackageLevel.cur = vm.packageLevels[index];
                        //  selectPackageLevel.showls = false;
                        //  vm.detailVoNew.packageTypeId = selectPackageLevel.cur.packageTypeId;
                        // }

                    }]
                })
            };

            /* 查看详情 */
            tools.detailPackage = function(pakageId) {
                vm.addDialog = ngDialog.open({
                    template: "./controller/member/packageDetail.html",
                    appendClassName: 'dialog-detailM',
                    scope: $scope,
                    closeByNavigation: true,
                    width: 780,
                    title: "套餐类型详情",
                    controller: ['$scope', function($scope) { // 内联控制器

                        vm.detailVo = null;
                        service.getMemPackageDetail(pakageId).success(function(rs) {
                            if (rs.status == 'success') {
                                vm.detailVo = rs.data;
                            }
                        });


                    }]
                });
            };

            /* 修改状态-是否有效 */
            tools.chgStatus = function(packageId, curStatus, packageName) {
                vm.detailVoNew = {};
                vm.detailVoNew.packageId = packageId;
                vm.detailVoNew.status = curStatus;
                vm.detailVoNew.packageName = packageName;

                vm.addDialog = ngDialog.open({
                    template: "chgStatusDlg",
                    appendClassName: 'dialog-activeM',
                    closeByNavigation: true,
                    scope: $scope
                });
            };



            /**
             * [保存修改]
             * @param  {Boolean} isForm     [是否修改form]
             * @return {[type]}             [description]
             */
            tools.savePackage = function(isForm) {
                // 是否表单并验证通过
                if (isForm && forms.chgForm.$invalid) {
                    return;
                }
                var vo = {};
                // 处理表单里的自定义项
                if (isForm) {
                    vo = service.getPackageSaveForm(vm.detailVoNew);
                } else {
                    vo.packageId = vm.detailVoNew.packageId;
                    // 当前状态为失效的，改为生效
                    vo.status = (vm.detailVoNew.status == 0 ? 1 : 0);
                }
                service.updateMemPackage(vo).success(function(rs) {
                    if (rs.status == 'success') {
                        $rootScope.alertMsgService.setMessage("操作成功");
                        tools.closeDlg();
                        tools.getList();
                    } else if (rs.status == '400') {
                        $rootScope.alertMsgService.setMessage("套餐已被使用，不能修改或失效", 'warning');
                    } else {
                        $rootScope.alertMsgService.setMessage("操作失败:" + rs.message, 'warning');
                    }
                })

            }


        }])

    .filter('memOpenStatus', function() {
        return function(status) {
            var rs = '';
            if (status == 1) {
                rs = "首次开通";
            } else if (status == 2) {
                rs = "续费";
            }
            return rs;
        };
    })


})
