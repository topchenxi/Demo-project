define(['../module'], function(ng) {

    ng.factory('messageMgrService', [
        '$http',
        'api',
        function($http, api) {
            return {
                // 消息推送
                addMsgPush: function(params) {
                    params = angular.extend({}, params);
                    delete params.timeType;
                    if (params.sendType == 1) {
                        delete params.sendValue;
                    } else {
                        delete params.title;
                        delete params.msgtext;
                        delete params.urlType;
                        delete params.urlValue;
                    }
                    if (params.sendRang == 1) {
                        delete params.tags;
                        delete params.userIds;
                    } else if (params.sendRang == 2) {
                        delete params.userIds;
                    } else if (params.sendRang == 3) {
                        delete params.tags;
                    }

                    return $http.post(api.addMsgPush, params);
                },
                // app消息推送列表
                getMsgList: function(params) {
                    return $http.get(api.getMsgList, {
                        params: params
                    })
                },
                // 获取消息点击量
                getMessageStatisc: function(params) {
                    return $http.get(api.getMessageStatisc, {
                        params: params
                    })
                },
                // 获取标签库列表
                getTagDictList: function(params) {
                    return $http.get(api.getTagDictList, {
                        params: params
                    })
                },
                // 新建标签库
                addTagDict: function(params) {
                    return $http.post(api.addTagDict, params);
                },
                // 删除标签库标签
                delTagDict: function(params) {
                    return $http.post(api.delTagDict, params);
                },
                // 用户标签列表
                getUserTagList: function(params) {
                    params = angular.extend({}, params);
                    if (params.searchVal) {
                        params[isNaN(params.searchVal) ? 'appId' : 'userId'] = params.searchVal;
                    }
                    delete params.searchVal;
                    return $http.get(api.getUserTagList, {
                        params: params
                    })
                },
                // 插入用户标签
                addUserTagList: function(params) {
                    return $http.post(api.addUserTagList, params);
                },
                // 获取保存情况
                getInsertTagInfo: function(params) {
                    return $http.get(api.getInsertTagInfo, {
                        params: params
                    })
                },
                // 获取保存情况
                reportUserTag: function(params) {
                    let str = "?";
                    for (let key in params) {
                        str += `${key}=${params[key]}&`;
                    }
                    str = str.replace(/&$/, '');
                    console.log(str);
                    window.open(api.reportUserTag + str);
                }
            }
        }
    ])

    ng.controller('msgPsuhCtrl', [
        '$scope',
        '$location',
        'commonService',
        'messageMgrService',
        'commonTool',
        'ngDialog',
        function($scope, $location, commonService, messageMgrService, commonTool, ngDialog) {

            let List = commonService.getListClass();
            let defaultPaging = {

                sendType: null,
                // 描述
                description: null,
                // 开始时间
                startTime: null,
                // 结束时间
                expireTime: null,
                // 继承
                page: 1,
                pageSize: 10
            };
            class Msg extends List {
                constructor(defaultPaging) {
                    super(defaultPaging);
                }
                addMsgPush() {
                    $location.path('/appCms/addMsgPush');
                }
                getList() {
                    let self = this;
                    messageMgrService.getMsgList(commonTool.filterParam(this.paging)).success(function(data) {
                        if (data.status === 'success') {
                            self.list = data.page.items;
                            self.total = data.page.total;
                        }
                    })
                }
                showDialog(messeageId) {
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 700,
                        templateUrl: 'showDetail',
                        controller: ['$scope', function($scope) {
                            let vm = $scope.vm = {};
                            vm.messageStatisc = null;
                            messageMgrService.getMessageStatisc({ 'messeageId': messeageId }).success(function(data) {
                                vm.messageStatisc = data.status === 'success' ? data.data : '';
                            })
                        }]
                    })
                }
            }
            let vm = $scope.vm = new Msg(defaultPaging);
        }
    ])

    ng.controller('addMsgPushCtrl', [
        '$scope',
        '$rootScope',
        '$filter',
        'messageMgrService',
        'commonTool',
        '$location',
        'ngDialog',
        function($scope, $rootScope, $filter, messageMgrService, commonTool, $location, ngDialog) {
            let vm = $scope.vm = {
                    tagIsNot: '1',
                    tagAndOr: '1',
                    keyword: null
                },
                tools = $scope.tools = {},
                msgInfo = $scope.msgInfo = {
                    // 发送消息类型 :自定义消息(1) 展会通消息(2)
                    sendType: '1',
                    // 通知描述
                    description: null,
                    // 标题
                    title: null,
                    // 通知内容
                    msgtext: null,
                    // 展会通计划ID
                    sendValue: null,
                    // 链接状态 : 商品详情页(1) 店铺详情页(2) H5链接(3)
                    urlType: null,
                    // 链接值
                    urlValue: null,
                    // 目标用户 : 全部用户(1) 部分用户(2) 特定用户(3)
                    sendRang: '1',
                    // 部分用户 json条件
                    tags: null,
                    // 特定用户 填写的用户ID
                    userIds: null,
                    // 消息发送时间 格式: "YYYY-MM-DD hh:mm:ss"
                    startTime: null,
                    // 消息过期时间
                    expireTime: null,
                    // 推送时间 : 即时推送(1) 定时推送(2)
                    timeType: '1'
                };
            let formValid;

            let tagList = $scope.tagList = [];

            class Tag {
                constructor() {
                    this.enabled = '1';
                    this.hasSelectTag = [];
                }
            }

            tagList.push(new Tag());

            let method = {
                initValid: function() {
                    formValid = $('#addMsgPushform').validate({
                        errorElement: "em",
                        errorClass: "error-explain",
                        validClass: "valid-explain",
                        groups: {
                            gs_time: "startTime expireTime"
                        },
                        rules: {
                            sendType: {
                                required: true
                            },
                            description: {
                                required: true,
                                maxlength: 100
                            },
                            title: {
                                required: true,
                                maxlength: 100
                            },
                            text: {
                                required: true,
                                maxlength: 100
                            },
                            urlType: {
                                required: true
                            },
                            sendValue: {
                                required: true
                            },
                            urlValue: {
                                required: true
                            },
                            userIds: {
                                required: true,
                                maxlength: 500
                            },
                            startTime: {
                                required: true
                            },
                            expireTime: {
                                required: true
                            }
                        },
                        messages: {}
                    })

                },
                getNowTime: function(date) {
                    return $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
                },
                isUnique: function(checkItem, array) {
                    if (!Array.isArray(array)) return false;
                    if (!array.length) return true;

                    for (let i = 0, len = array.length; i < len; i++) {
                        let item = array[i];
                        if (checkItem.tagId === item.tagId) return false;
                    }
                    return true;
                },
                initJson: function() {
                    if (!tagList.length) return '';
                    let resultArray = [];
                    for (let i = 0, len = tagList.length; i < len; i++) {
                        let item = tagList[i];
                        if (!item.hasSelectTag.length) return '';
                        let obj = {
                            'logic': item.enabled == 1 ? "and" : "not",
                            'type': "tag",
                            'value': []
                        };
                        item.hasSelectTag.forEach(item => {
                            obj.value.push(item.tagName);
                        })
                        resultArray.push(obj);
                    }
                    return JSON.stringify(resultArray);
                },
                initMatchArray: function(keyword) {
                    if (commonTool.isEmpty(keyword)) {
                        vm.targetDictArray = Array.from(vm.tagDictList);
                        return;
                    }
                    vm.targetDictArray = [];
                    for (let i = 0, len = vm.tagDictList.length; i < len; i++) {
                        let item = vm.tagDictList[i]
                        if (item.tagName.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                            vm.targetDictArray.push(item);
                        }
                    }
                }
            };

            vm.now = method.getNowTime(new Date());
            // 全部的标签库
            vm.tagDictList = [];
            // 显示的标签库
            vm.targetDictArray = [];
            // 已选择的标签库
            vm.selectTagArray = [];
            tools = angular.extend(tools, {
                saveInfo: function() {

                    if (!formValid.form()) return;

                    msgInfo.tags = method.initJson();

                    if (msgInfo.sendRang == 2 && commonTool.isEmpty(msgInfo.tags)) {
                        $rootScope.alertMsgService.setMessage("请选择标签", 'warning');
                        return;
                    }

                    if (msgInfo.timeType == 2 && !commonTool.isEmpty(msgInfo.startTime)) {
                        let startTime = (new Date(msgInfo.startTime)).getTime();
                        let expireTime = (new Date(msgInfo.expireTime)).getTime();
                        let now = (new Date()).getTime();
                        if (startTime < now) {
                            $rootScope.alertMsgService.setMessage("推送时间的开始时间不能小于目前时间", 'warning');
                            return;
                        }
                        if (expireTime - startTime > 7 * 1000 * 3600 * 24) {
                            $rootScope.alertMsgService.setMessage("推送时间间隔不能超过7天", 'warning');
                            return;
                        }
                    }


                    this.showConfirmDlg(msgInfo);

                },
                showConfirmDlg: function(msgInfo) {
                    $scope.array = vm.selectTagArray;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'confirmMsg',
                        controller: ['$scope', function($scope) {
                            let info = $scope.info = msgInfo;
                            let vm = $scope.vm = {
                                array: $scope.array,
                                submit: function() {
                                    tools.postData(msgInfo);
                                    $scope.closeThisDialog();
                                },
                                close: function() {
                                    $scope.closeThisDialog();
                                }
                            };
                            vm.now = new Date();
                        }]
                    })
                },
                postData: function(msgInfo) {
                    messageMgrService.addMsgPush(msgInfo).success(function(data) {
                        if (data.status === "success") {
                            $rootScope.alertMsgService.setMessage("添加成功");
                            $location.path('/appCms/msgPsuh');
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                },
                getTagDictList: function() {
                    messageMgrService.getTagDictList({
                        page: 1,
                        pageSize: 9999
                    }).success(function(data) {
                        if (data.status === "success") {
                            vm.tagDictList = data.page.items;
                            vm.targetDictArray = data.page.items;
                            method.initValid();
                        }
                    })
                },
                delTag: function(index, tagIndex) {
                    console.log(index, tagIndex);
                    tagList[tagIndex].hasSelectTag.splice(index, 1);
                },
                addTag: function(item, tagIndex) {
                    if (!method.isUnique(item, tagList[tagIndex].hasSelectTag)) return;
                    tagList[tagIndex].hasSelectTag.push(item);
                },
                delTagItem: function(index) {
                    if (tagList.length == 1) return;
                    tagList.splice(index, 1);
                },
                addTagItem: function() {
                    tagList.push(new Tag());
                }
            });

            $scope.$watch('msgInfo.timeType', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                vm.now = method.getNowTime(new Date());
            });

            $scope.$watch('vm.keyword', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                method.initMatchArray(newValue);
            });

            (function() {
                tools.getTagDictList();
            }());


        }
    ])

    // 标签库
    ng.controller('tagMgrCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonService',
        'messageMgrService',
        'commonTool',
        'ngDialog',
        function($scope, $rootScope, $location, commonService, messageMgrService, commonTool, ngDialog) {


            let List = commonService.getListClass();

            let defaultPaging = {
                page: 1,
                pageSize: 10,
                // 标签名称
                tagName: null
            }

            class Tag extends List {
                constructor(defaultPaging) {
                    super(defaultPaging)
                }
                getList() {
                    let self = this;
                    messageMgrService.getTagDictList(commonTool.filterParam(this.paging)).success(function(data) {
                        if (data.status === 'success') {
                            self.list = data.page.items;
                            self.total = data.page.total;
                        }
                    })
                }
                addTag(tagType) {
                    $scope.tagType = tagType;
                    $scope.tools = this;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 900,
                        templateUrl: 'addTagDlg',
                        controller: 'addTagCtrl'
                    })
                }
                delTag(tagId) {
                    let self = this;
                    ngDialog.open({
                        template: 'delTagDlg',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            let vm = $scope.vm = {
                                btnFlag: false,
                                submit: function() {
                                    vm.btnFlag = true;
                                    messageMgrService.delTagDict({
                                        tagId: tagId
                                    }).success(function(data) {
                                        if (data.status === 'success') {
                                            self.getList();
                                            $scope.closeThisDialog();
                                            $rootScope.alertMsgService.setMessage("删除成功", 'warning');
                                        } else {
                                            $rootScope.alertMsgService.setMessage("删除失败", 'warning');
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
            }
            let vm = $scope.vm = new Tag(defaultPaging);
        }
    ])
    ng.controller('addTagCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonService',
        'messageMgrService',
        'commonTool',
        'ngDialog',
        function($scope, $rootScope, $location, commonService, messageMgrService, commonTool, ngDialog) {

            let vm = $scope.vm = {},
                tools = $scope.tools,
                tagInfo = $scope.tagInfo = {
                    // 标签名称
                    tagName: null,
                    // 系统打标的时间
                    beginTime: null,
                    endTime: null,
                    // 1,系统配置 2,运营标签
                    tagType: $scope.tagType
                };

            vm.btnFlag = false;
            tools = angular.extend(tools, {
                saveInfo: function() {
                    if (!formValid.form()) return;
                    vm.btnFlag = true;
                    messageMgrService.addTagDict(tagInfo).success(function(data) {
                        if (data.status === 'success') {
                            $rootScope.alertMsgService.setMessage("保存成功", 'success');
                            tools.getList();
                            $scope.closeThisDialog();
                        } else {
                            $rootScope.alertMsgService.setMessage('标签重复，请重新输入', 'warning');
                            vm.btnFlag = false;
                        }
                    })
                },
                close: function() {
                    $scope.closeThisDialog();
                }
            });

            let formValid;

            function initValid() {
                formValid = $('#addTagForm').validate({
                    errorElement: "em",
                    errorClass: "error-explain",
                    validClass: "valid-explain",
                    groups: {
                        gs_time: "beginTime endTime"
                    },
                    rules: {
                        tagName: {
                            required: true,
                            maxlength: 50
                        },
                        beginTime: {
                            required: true
                        },
                        endTime: {
                            required: true
                        }
                    },
                    messages: {
                        tagName: {
                            maxlength: '最多可输入{0}字符'
                        }
                    }
                })
            };
            (function() {
                setTimeout(initValid, 500)
            }());

        }
    ])


    ng.controller('userTagMgrCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonService',
        'messageMgrService',
        'commonTool',
        'ngDialog',
        function($scope, $rootScope, $location, commonService, messageMgrService, commonTool, ngDialog) {


            let List = commonService.getListClass();

            let defaultPaging = {
                page: 1,
                pageSize: 10,
                // 标签名称
                tagName: null,
                // 标签类型 1:系统配置 2:运营标签
                tagType: null,
                // 用户ID/appId
                searchVal: null,
                // 状态  0：失效 1:有效
                status: null
            };

            class UserTag extends List {
                constructor(defaultPaging) {
                    super(defaultPaging);
                    this.isAllowReport = false;
                }
                getList() {
                    messageMgrService.getUserTagList(commonTool.filterParam(this.paging)).success(data => {
                        if (data.status === 'success') {
                            this.list = data.page.items;
                            this.total = data.page.total;
                        }
                    });
                }
                report() {
                    if (!!this.list) {
                        let params = Object.assign({}, this.paging);
                        delete params.page;
                        delete params.pageSize;
                        messageMgrService.reportUserTag(commonTool.filterParam(params))
                    } else {
                        this.showMsg('搜索结果为空，不能导出', 'warning')
                    }
                }
                search() {
                    super.search();
                    this.isAllowReport = true;
                }
                reset() {
                    super.reset();
                    this.isAllowReport = false;
                }
                addTag() {
                    $scope.tools = this;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 900,
                        templateUrl: 'addUserTagDlg',
                        controller: 'addUserTagCtrl'
                    })
                }
            };

            let vm = $scope.vm = new UserTag(defaultPaging);
        }
    ])


    ng.controller('addUserTagCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonService',
        'messageMgrService',
        'commonTool',
        'ngDialog',
        'Upload',
        'api',
        '$http',
        function($scope, $rootScope, $location, commonService, messageMgrService, commonTool, ngDialog, Upload, api, $http) {

            let vm = $scope.vm = {},
                tools = $scope.tools,
                tagInfo = $scope.tagInfo = {
                    // 标签id
                    tagId: null,
                    // 用户Id 多个用逗号隔开
                    ids: null,
                    // 上传的txt文件
                    fileName: null
                };

            vm.btnFlag = false;

            vm.isShowSubmit = true;

            // 全部的标签库
            vm.tagDictList = [];
            // 显示的标签库
            vm.targetDictArray = [];

            vm.selectItem = null;
            // 1. userid 2.appid
            vm.idsType = 1;

            class AttachFile {
                constructor(fileName, fileUrl) {
                    this.fileName = fileName;
                    this.fileUrl = fileUrl;
                }
            }

            tools = angular.extend(tools, {
                submit: function() {

                    if (commonTool.isEmpty(vm.selectItem) || commonTool.isEmpty(vm.selectItem.tagId)) {
                        $rootScope.alertMsgService.setMessage("请选择标签", 'warning');
                        return;
                    }

                    if (commonTool.isEmpty(tagInfo.ids) && commonTool.isEmpty(vm.attachFile)) {
                        $rootScope.alertMsgService.setMessage(`请先填写${vm.idsType==1?'userId':'appId'}`, 'warning');
                        return;
                    }

                    if (!commonTool.isEmpty(vm.attachFile)) {
                        tagInfo.fileName = vm.attachFile.fileUrl;
                    }

                    tagInfo.tagId = vm.selectItem.tagId;
                    vm.isShowSubmit = false;

                    let dealId = this.newGuid();
                    tagInfo.dealId = dealId;


                    if (vm.idsType == 1) {
                        tagInfo.fileNameUserIds = tagInfo.fileName;
                        tagInfo.userIds = tagInfo.ids;
                    } else {
                        tagInfo.fileNameAppIds = tagInfo.fileName;
                        tagInfo.appIds = tagInfo.ids;
                    }
                    delete tagInfo.fileName;
                    delete tagInfo.ids;

                    messageMgrService.addUserTagList(tagInfo).success(function(data) {
                        if (data.status === "success") {

                        } else {
                            vm.isShowSubmit = true;
                            // $rootScope.alertMsgService.setMessage("执行中", 'warning');
                        }
                    })
                    let timer;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 900,
                        showClose: false,
                        templateUrl: 'messageDlg',
                        controller: ['$scope', function($scope) {
                            let vm = $scope.vm = {};
                            vm.message = "";
                            timer = setInterval(function() {
                                messageMgrService.getInsertTagInfo({
                                    'dealId': dealId
                                }).success(function(data) {
                                    vm.message = data.message;
                                    if (data.status != 'needUpdate') {
                                        clearInterval(timer);
                                        tools.getList();
                                    }
                                })
                            }, 3000)


                            vm.close = function() {
                                clearInterval(timer);
                                ngDialog.closeAll();
                                tools.getList();
                            }
                        }]
                    })


                },
                close: function() {
                    $scope.closeThisDialog();
                },
                getTagDictList: function() {
                    messageMgrService.getTagDictList({
                        page: 1,
                        pageSize: 9999,
                        tagType: 2
                    }).success(function(data) {
                        if (data.status === "success") {
                            vm.tagDictList = data.page.items;
                            vm.targetDictArray = data.page.items;
                        }
                    })
                },
                initMatchArray: function(keyword) {
                    if (commonTool.isEmpty(keyword)) {
                        vm.targetDictArray = Array.from(vm.tagDictList);
                        return;
                    }
                    vm.targetDictArray = [];
                    for (let i = 0, len = vm.tagDictList.length; i < len; i++) {
                        let item = vm.tagDictList[i]
                        if (item.tagName.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                            vm.targetDictArray.push(item);
                        }
                    }
                },
                uploadFile: function(files) {

                    if (commonTool.isEmpty(files) || !files.length) return;

                    let myFile = files[0];

                    if ((!/.*\.(txt)|(TXT)$/.test(myFile.name)) || myFile.size > 2 * 1024 * 1024) {
                        $rootScope.alertMsgService.setMessage("请重新上传,支持格式：txt;文件大小不超过2M", 'warning');
                        return false;
                    }
                    Upload.upload({
                        url: api.uploadContract,
                        file: myFile
                    }).success(function(data, status, headers, config) {
                        vm.attachFile = new AttachFile(config.file.name, imgUrl + data.data.url);
                    });
                },
                delFile: function() {
                    vm.attachFile = null;
                },
                newGuid: function() {
                    let guid = "";
                    for (let i = 1; i <= 32; i++) {
                        let n = Math.floor(Math.random() * 16.0).toString(16);
                        guid += n;
                        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                            guid += "-";
                    }
                    return guid;
                }
            });


            $scope.$watch('vm.keyword', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                tools.initMatchArray(newValue);
            });


            (function() {
                tools.getTagDictList();
            }());



        }
    ])



    ng.filter('urlTipsFilter', function() {
        return function(urlType) {
            switch (urlType) {
                case '1':
                    return '请输入产品ID';
                case '2':
                    return '请输入sellerId';
                case '3':
                    return '请输入完整的H5链接';
                case '13':
                    return '请输入SNS文章ID';
                default:
                    return ''
            }
        };
    });

    ng.filter('addSendTypeFilter', function() {
        return function(sendType) {
            switch (parseInt(sendType)) {
                case 1:
                    return '自定义消息';
                case 2:
                    return '展会通消息';
                case 3:
                    return '通知消息';
                default:
                    return '';
            }
        };
    });

    ng.filter('sendTypeFilter', function() {
        return function(sendType, item) {
            let messageType = '';
            switch (parseInt(sendType)) {
                case 1:
                    messageType = '自定义消息';
                    break;
                case 2:
                    messageType = '展会通消息';
                    break;
                case 3:
                    messageType = '通知消息';
                    break;
                default:
                    messageType = '';
                    break;
            }
            let messageItem = JSON.parse(item.content);
            let urlType = '';
            switch (parseInt(messageItem.urlType)) {
                case 1:
                    urlType = '( 产品 )';
                    break;
                case 2:
                    urlType = '( 店铺 )';
                    break;
                case 3:
                    urlType = '( H5 )';
                    break;
                case 11:
                    urlType = '( SNS消息 - 最热 )';
                    break;
                case 12:
                    urlType = '( SNS消息 - 最新 )';
                    break;
                case 13:
                    urlType = '( SNS消息 - 详情 )';
                    break;
                default:
                    urlType = '';
                    break;
            }

            return `${messageType} ${urlType}`;

        };
    });
    ng.filter('sendRangFilter', function() {
        return function(sendRang) {
            switch (parseInt(sendRang)) {
                case 1:
                    return '全部用户';
                case 2:
                    return '部分用户';
                case 3:
                    return '特定用户';
                default:
                    return '';
            }
        };
    });

    ng.filter('urlTypeFilter', function() {
        return function(urlType) {
            switch (parseInt(urlType)) {
                case 1:
                    return '产品详情页';
                case 2:
                    return '店铺详情页';
                case 3:
                    return 'H5链接';
                case 11:
                    return 'SNS推广的最热列表';
                case 12:
                    return 'SNS推广的最新列表';
                case 13:
                    return 'SNS推广的文章详情';
                default:
                    return '';
            }
        };
    });

    ng.filter('tagTypeFilter', function() {
        return function(tagType) {
            switch (tagType) {
                case 1:
                    return '系统配置';
                case 2:
                    return '运营标签';
                default:
                    return '';
            }
        };
    });

    ng.filter('tagStatusFilter', function() {
        return function(status) {
            switch (status) {
                case 1:
                    return '生效';
                case 0:
                    return '失效';
                default:
                    return '';
            }
        };
    });

})