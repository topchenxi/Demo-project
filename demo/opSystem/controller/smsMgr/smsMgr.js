define(['../module'], function(ng) {

    ng.factory('smsMgrService', ['$http', 'api', function($http, api) {
        return {
            getSMSList: function(params) {
                return $http.get(api.getSMSList, {
                    params: params
                })
            },
            getSMSDetail: function(params) {
                return $http.get(api.getSMSDetail, {
                    params: params
                })
            },
            getSMSTmpList: function(params) {
                return $http.get(api.loadSmsTpl, {
                    params: params
                })
            },
            saveSMSInfo: function(params) {
                return $http.post(api.sendSMS, params);
            }
        }
    }])

    ng.controller('foreignSMSMgrCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'smsMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            smsMgrService,
            commonService
        ) {

            let List = commonService.getListClass();

            let defaultPaging = {
                // 分页
                page: 1,
                pageSize: 10,
                // 名称
                taskName: null,
                // 短信创建时间：
                sendTimeFrom: null,
                sendTimeTo: null
            };
            class SMS extends List {
                constructor(defaultPaging) {
                    super(defaultPaging)
                }
                getList() {
                    smsMgrService.getSMSList(commonTool.filterParam(this.paging)).success((data) => {
                        this.list = data.page.items;
                        this.total = data.page.total;
                    })
                }
                sendSMSByMuti() {
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 700,
                        title: "选择短信模板",
                        templateUrl: './controller/smsMgr/selectSMSTmp.html',
                        controller: 'selectSMSTmpCtrl'
                    });
                }
            }

            let vm = $scope.vm = new SMS(defaultPaging)

        }
    ])

    ng.controller('foreignSMSDetailCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'smsMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            smsMgrService,
            commonService
        ) {
            var tools = $scope.tools = {},
                vm = $scope.vm = {},
                search = $location.search(),
                taskId = search.taskId;

            vm.imgUrl = imgUrl;


            tools = angular.extend(tools, {
                getSMSDetail: function() {
                    smsMgrService.getSMSDetail({
                        taskId: taskId
                    }).success(function(data) {
                        vm.item = data.data;
                    })
                }
            });

            (function() {
                tools.getSMSDetail();
            })()
        }
    ])


    ng.controller('selectSMSTmpCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'smsMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            smsMgrService,
            commonService
        ) {
            let List = commonService.getListClass();
            let defaultPaging = {
                page: 1,
                pageSize: 10,
                tplId: null
            };
            class Tpl extends List {
                constructor(defaultPaging) {
                    super(defaultPaging);
                }
                getList() {
                    smsMgrService.getSMSTmpList(commonTool.filterParam(this.paging)).success((data) => {
                        this.list = data.page.items;
                        this.total = data.page.total;
                    })
                }
                sendSMS(item) {
                    localStorage.smsContent = item.tpl_content;
                    ngDialog.closeAll();
                    $location.path('/smsMgr/sendForeignSMS').search({
                        tplId: item.tpl_id
                    });
                }
            }
            let tplVm = $scope.tplVm = new Tpl(defaultPaging);
        }
    ])

    ng.controller('sendForeignSMSCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'smsMgrService',
        'commonService',
        'Upload',
        'api',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            smsMgrService,
            commonService,
            Upload,
            api
        ) {
            var tools = $scope.tools = {};
            var vm = $scope.vm = {};
            var search = $location.search();

            var smsInfo = $scope.smsInfo = {
                // 模板ID
                tplId: search.tplId,
                // Excel文件路径
                filePath: null,
                // Excel文件名
                fileName: null,
                // 展会通ID
                planId: null,
                // 短信内容
                text: "",
                // 名称
                title: ""
            };

            vm.isAollowSend = true;

            vm.imgUrl = imgUrl;

            if (localStorage && localStorage.smsContent) {
                smsInfo.text = localStorage.smsContent;
            }

            tools = angular.extend(tools, {
                upload: function(files) {
                    if (!files || !files.length) return;

                    var file = files[0];

                    var reg = /.*\.(txt)|(TXT)$/;
                    if ((!reg.test(file.name)) || file.size > 2 * 1024 * 1024) {
                        $rootScope.alertMsgService.setMessage("请重新选择文件,支持格式：txt;文件大小不超过2M", 'warning');
                        return false;
                    }
                    Upload.upload({
                        url: api.uploadContract,
                        file: file
                    }).success(function(data, status, headers, config) {
                        smsInfo.filePath = data.data.url;
                        smsInfo.fileName = config.file.name;
                    });
                },
                alertWarningMessage: function(messgae) {
                    $rootScope.alertMsgService.setMessage(messgae, 'warning');
                },
                isInteger: function(value) {
                    var reg = /^[0-9]*[1-9][0-9]*$/;
                    return reg.test(value);
                },
                checkRequire: function() {
                    if (commonTool.isEmpty(smsInfo.filePath)) {
                        this.alertWarningMessage('请导入收信人');
                        return false;
                    }
                    if (commonTool.isEmpty(smsInfo.planId)) {
                        this.alertWarningMessage('请输入展会通计划ID');
                        return false;
                    }
                    if (!this.isInteger(smsInfo.planId)) {
                        this.alertWarningMessage('展会通计划ID只能是正整数');
                        return false;
                    }
                    if (commonTool.isEmpty(smsInfo.title)) {
                        this.alertWarningMessage('请输入名称');
                        return false;
                    }
                    if (commonTool.isEmpty(smsInfo.text)) {
                        this.alertWarningMessage('请输入内容');
                        return false;
                    }
                    return true;
                },
                sendSMS: function() {
                    if (!this.checkRequire()) return;

                    vm.isAollowSend = false;
                    smsMgrService.saveSMSInfo(smsInfo).success(function(data) {
                        if (data.status === 'success') {
                            $rootScope.alertMsgService.setMessage('发送成功', 'success');
                            $location.path('/smsMgr/foreignSMS');
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            vm.isAollowSend = true;
                        }

                    })
                }
            });
        }
    ])

})