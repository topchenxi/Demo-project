define(['../module'], function(ng) {
    ng
        .factory('inquiryService', ['$http', 'api', 'commonTool', '$rootScope', function($http, api, commonTool, $rootScope) {
            return {
                // 获取询盘列表
                getInquiryList: function(params) {
                    return $http.get(api.getInquiryList, {
                        'params': params
                    });
                },
                // 获取询盘详情
                getInquiryDetail: function(params) {
                    return $http.get(api.getInquiryDetail, {
                        'params': params
                    });
                },
                // 获取询盘不通过的原因列表
                getInquiryAuditReason: function(params) {
                    return $http.get(api.getInquiryAuditReason, {
                        'params': params
                    });
                },
                // 获取询盘详情
                getMsgSourceType: function(params) {
                    return $http.get(api.getMsgSourceType, {
                        'params': params
                    });
                },
                // 审核询盘
                chgInquiryAuditStatus: function(param) {
                    return $http.post(api.chgInquiryAuditStatus, param);
                },
                // 删除标签
                removeInquryTag: function(param) {
                    return $http.post(api.removeInquryTag, param);
                },
                // 设置查询条件
                getListPage: function(tabName) {
                    var page = {
                        'page': 1,
                        'pageSize': 10,

                        'messageTypeId': '', //询盘类型
                        'messageState': '', //审核状态
                        'ddBuyerType': '1', //采购商下拉框列表
                        'ddBuyerValue': '', //下拉框的值
                        'ddSellerType': '1', // 供应商下拉框的值
                        'ddSellerValue': '', //供应商下拉框值
                        'startTime': '', // 发布起始时间
                        'endTime': '', // 
                        'messageId': '', // 询盘id
                        'reapet': '', // 是否重复（0否，1是）
                        'error': '', // 有问题（0否，1是）
                        'source': '', // 来源
                        'sourceFourType': '' // 来源
                    };
                    if (tabName == 'tabAll') {
                        page.messageState = '';
                    } else if (tabName == 'tabWaitAudit') {
                        page.messageState = '1';
                    } else if (tabName == 'tabPassAudit') {
                        page.messageState = '2';
                    } else if (tabName == 'tabFailAudit') {
                        page.messageState = '-1';
                    }
                    return page;
                },
                // 供应商信息
                getSellerDetail: function(params) {
                    return $http.get(api.getSellerDetail, {
                        'params': params
                    });
                },
                // 获取跟进状态
                getsellerFollowDetail: function(params) {
                    return $http.get(api.getsellerFollowDetail, {
                        'params': params
                    })
                },
                // 跟进供应商 跟进内容
                getFlolowDlgContent: function() {
                    var chkReasons = [];
                    chkReasons[0] = [];
                    chkReasons[1] = [];
                    // 可跟进
                    chkReasons[0][0] = { "text": "登录情况是否改善" };
                    chkReasons[0][1] = { "text": "回复率是否提升" };
                    chkReasons[0][2] = { "text": "商机数量是否提升" };
                    chkReasons[0][3] = { "text": "商品描述是否优化" };
                    chkReasons[0][4] = { "text": "考虑推荐增值服务" };
                    chkReasons[0][5] = { "text": "其他" };

                    // 免跟进
                    chkReasons[1][0] = { "text": "回复率正常" };
                    chkReasons[1][1] = { "text": "无法取得联系" };
                    chkReasons[1][2] = { "text": "客户拒绝沟通" };
                    chkReasons[1][3] = { "text": "缺少运营人员" };
                    chkReasons[1][4] = { "text": "未回复的商机质量差" };
                    chkReasons[1][5] = { "text": "未回复的商机不匹配" };
                    chkReasons[1][6] = { "text": "多次联系，无法激活" };
                    chkReasons[1][7] = { "text": "其他" };
                    return chkReasons;
                },
                // 采购商 跟进商机 跟进内容
                buyer_getFlolowDlgContent: function() {
                    var chkReasons = [];
                    chkReasons[0] = { "text": "已找到合作厂家" };
                    chkReasons[1] = { "text": "采购项目终止" };
                    chkReasons[2] = { "text": "该类目暂无合适的厂家" };
                    chkReasons[3] = { "text": "其他" };
                    return chkReasons;
                },
                // 添加供应商跟进记录
                addsellerFollowRecord: function(params) {
                    return $http.get(api.addsellerFollowRecord, {
                        'params': params
                    })
                },
                // 添加询盘跟进商机
                saveBusinessTrace_inquiry: function(params) {
                    return $http.get(api.saveBusinessTrace_inquiry, {
                        'params': params
                    })
                },
                // 询盘跟进商机查看
                getBusinessTrace: function(params) {
                    return $http.get(api.getBusinessTrace, {
                        'params': params
                    })
                },
                // 采购商跟进记录
                buyerFollowRecord: function(params) {
                    return $http.get(api.buyerFollowRecord, {
                        'params': params
                    })
                },
                // 添加采购商跟进记录
                followAdd: function(params) {
                    return $http.get(api.followAdd, {
                        'params': params
                    })
                },
                // 采购商 跟进商机
                saveBuyerBusinessTrace: function(params) {
                    return $http.get(api.saveBuyerBusinessTrace, {
                        'params': params
                    })
                },
                // 询盘详情——对话内容——询盘对话——刷新
                refreshMessageEmailState: function(params) {
                    return $http.get(api.refreshMessageEmailState, {
                        'params': params
                    })
                },
                // 获取权限
                getPermission: function(_moduleName, _functionName, _opearName) {
                    var moduleName = _moduleName;
                    var functionName = _functionName;
                    var opearName = _opearName;

                    if ($rootScope.userOpers != undefined && $rootScope.userOpers != null) {
                        var data = $rootScope.userOpers;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].moduleName == moduleName) {
                                var functionList = data[i].functionList;
                                for (var k = 0; k < functionList.length; k++) {
                                    if (functionList[k].functionName == functionName) {
                                        var userOpear = functionList[k].userOpear;
                                        for (var j = 0; j < userOpear.length; j++) {
                                            if (userOpear[j].opearName == opearName) {
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        return false;
                    }
                },
                //  发送询盘邮件通知
                reSendInquiryEmail(params) {
                    return $http.post(api.reSendInqueryEmail, params);
                },
                //  发送询盘回复邮件通知
                reSendInquiryReplyEmail(params) {
                    return $http.post(api.reSendInqueryReplyEmail, params);
                }
            };
        }])

    //询盘列表页面控制器
    .controller('InquiryListCtrl', [
        '$scope',
        '$rootScope',
        '$controller',
        '$window',
        '$location',
        'ngDialog',
        'inquiryService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, $controller, $window, $location, ngDialog, service, commonService, commonTool) {
            $controller('baseListController', {
                $scope: $scope
            });
            var vm = $scope.vm;
            var tools = $scope.tools;
            var paging = {};
            var key = 'messageId';
            vm.checkedDatas = [];

            // 从其他页面过来时的参数
            var otherPageParam = $location.search();


            /* 查询条件里的select数据*/
            tools.setInitData = function() {
                paging = $scope.paging = service.getListPage();
                // 设置查询条件里的采购商类型
                tools.buyerSearchType = [{
                    'id': '1',
                    'name': '姓名'
                }, {
                    'id': '2',
                    'name': '公司名称'
                }, {
                    'id': '3',
                    'name': '邮箱'
                }, {
                    'id': '4',
                    'name': '用户名'
                }, {
                    'id': '5',
                    'name': '用户ID'
                }, {
                    'id': '6',
                    'name': '广交会ID'
                }]
                tools.baseInit();
            }
            tools.setInitData();

            // 获取采购列表
            tools.getList = function() {
                if (service.getPermission('询盘管理', '询盘列表', '只查看我跟进采购商发的')) {
                    paging.isFollower = 1;
                    vm.isFollowerShowFlag = false;
                } else {
                    vm.isFollowerShowFlag = true;
                }

                service.getInquiryList(commonTool.filterParam(paging)).success(function(rs) {
                    if (rs.data != null) {
                        if (rs.data.items != null) {
                            vm.items = rs.data.items;
                            paging.total = rs.data.total;
                        } else {
                            vm.items = [];
                            paging.total = 0;
                        }
                    } else {
                        vm.items = [];
                        paging.total = 0;
                    }

                    vm.isAllChecked = false; // 是否全选
                    vm.checkedDatas = []; // 每一个checkbox 
                });
            };

            service.getMsgSourceType().success(function(data) {
                vm.sourceArray = data.data;
            });

            tools.search = function() {
                paging.page = 1;
                this.getList();
            };

            tools.getSecondSource = function() {
                console.log(paging.source);
                if (commonTool.isEmpty(paging.source)) {
                    vm.secondSourceArray = [];
                    return;
                }
                var tmpObj = {
                    sourceType: 4,
                    source: paging.source
                };
                commonService.getSecondSourceType(tmpObj).success(function(data) {
                    console.log(data);
                    if ('success' === data.status) {
                        vm.secondSourceArray = data.data;
                    } else {
                        console.log('error');
                    }
                })
            }

            // 1.查询条件初始化 [type 0 初次加载或tab切换，1 重置
            tools.init = function(type, tabName) {
                if (tabName) {
                    vm.currentTab = tabName;
                    // tabAll tabWaitAudit tabPassAudit tabFailAudit
                }

                if (type == 0) {
                    paging = $scope.paging = service.getListPage(vm.currentTab);
                    // 其他页面跳转来时事的参数
                    if (!commonTool.isEmptyObject(otherPageParam) && !commonTool.isEmpty(otherPageParam.userId)) {
                        paging.ddBuyerType = '5';
                        paging.ddBuyerValue = otherPageParam.userId;
                    }
                    tools.getList()
                } else if (type == 1) {
                    // 重置条件但不发请求
                    paging = $scope.paging = service.getListPage(vm.currentTab);
                }
            }


            // 分页组件 type 为 null时，翻页
            tools.getnewpage = function(type) {
                if (type == 1) { // 跳转到第几页
                    paging.page = tools.newpagesize;
                    newpage = null;
                } else if (type == 0) { // 每页显示多少条切换时
                    paging.page = 1;
                }
                tools.getList();
            }

            /*
             * 单个或批量更改记录状态
             * id 单个处理时的采购需求id
             */
            tools.chgAuditStatus = function(auditStatus, id) {
                if (vm.checkedDatas.length < 1 && commonTool.isEmpty(id)) {
                    $rootScope.alertMsgService.setMessage("请先选择要操作的记录.");
                    return;
                }
                var templateId = 'auditPassConfirm.html';
                var title = "审核通过信息";
                if (auditStatus == -1) {
                    templateId = 'auditNopassConfirm.html';
                    title = "审核不通过信息"
                }
                var messageId = vm.checkedDatas.join(",");
                if (!commonTool.isEmpty(id)) {
                    // 单个更改
                    messageId = id;
                }
                $scope.auditData = {
                    messageState: auditStatus,
                    messageId: messageId
                };
                ngDialog.openConfirm({
                    title: title,
                    template: templateId,
                    scope: $scope,
                    controller: 'InquiryAuditCtrl'
                }).then(function(yes) {
                    // 刷新列表
                    tools.getList();
                }, function(no) {
                    // 取消
                });
            }


            // 批量选择
            tools.toggleCheckAll = function(ischecked) {
                vm.checkedDatas = [];
                angular.forEach(vm.items, function(item) {
                    item.$checked = ischecked;
                    if (true === ischecked) {
                        vm.checkedDatas.push(item[key]);
                    }
                });
            };
            tools.setCheckedData = function(tabName) {
                var selectionItem = [];
                angular.forEach(vm.items, function(item) {
                    if (true === item.$checked) {
                        selectionItem.push(item[key]);
                    }
                });
                vm.checkedDatas = selectionItem;
            }

        }
    ])

    // 询盘详情页面控制器
    .controller('InquiryDetailCtrl', ['$scope', '$rootScope', '$window', '$location', '$filter', 'ngDialog', 'inquiryService', 'commonService', 'commonTool',
            function($scope, $rootScope, $window, $location, $filter, ngDialog, service, commonService, commonTool) {

                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                vm.imgUrl = imgUrl;

                vm.sellerInfo = {};
                vm.followInfo = {};
                vm.recordInfo = {};
                vm.businessInfo = {};
                vm.needNode = true;
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    sellerId: null
                };

                var method = {
                    key: "",
                    value: "",
                    myObject: function(key, value) {
                        this.key = key;
                        this.value = value;
                    },
                    getFollowSignTypeArray: function() {
                        return [new this.myObject('有效买家', 1), new this.myObject("Can't Find Key Person", 2), new this.myObject('No English', 3), new this.myObject('Not Import from China', 4), new this.myObject('Service Refused', 5), new this.myObject('Fail to Contact', 6), new this.myObject('Not Buyer', 7), new this.myObject('Blick List', 8)];
                    },
                    getFollowSignWayArray: function() {
                        return [new this.myObject('Transfer', 1), new this.myObject('Find Key Person', 2), new this.myObject('LeadExpress', 3), new this.myObject('Inquiry', 4), new this.myObject('E-mail Inquiry', 5), new this.myObject('Online Chat', 6), new this.myObject('Success Case', 7)];
                    },
                    getArrayOfContact: function() {
                        return [new this.myObject('首次联系无人接听', 1), new this.myObject('首次联系打不通', 2), new this.myObject('Wrong Number', 3), new this.myObject('Wrong Email', 4), new this.myObject('Wrong Email &amp; Number', 5)];
                    },
                    getArrayOfBuyer: function() {
                        return [new this.myObject('Personal Customer', 1), new this.myObject('Mainland Manufacturer', 2), new this.myObject('Advertisement', 3), new this.myObject('Cheater', 4), new this.myObject('Not Buyer-Other', 5)];
                    }
                };

                // 获取询盘ID
                var search = $location.search();
                tools.messageId = search.messageId;

                tools = $.extend(tools, {
                    // 获取询盘详情
                    getInquiryDetail: function(reloadFlag) {
                        service.getInquiryDetail({
                            'messageId': tools.messageId
                        }).success(function(data) {
                            if ('success' == data.status) {
                                vm.item = data.data.message;
                                vm.auditList = data.data.messageAudits;
                                vm.contactList = data.data.messageContactList;
                                paging.sellerId = data.data.message.sellerId;
                                paging.buyerId = data.data.message.buyerId;
                                tools.messageTypeId = data.data.message.messageTypeId;

                                // 系统记录问题
                                vm.error = {};
                                if (vm.item.errorReason == null || vm.item.errorReason == '') {
                                    vm.error.chineseWord = '无';
                                    vm.error.notUsUrl = '无';
                                    vm.error.sensitiveWord = '无';
                                } else {
                                    var error = JSON.parse(vm.item.errorReason);
                                    var tempArr = [];
                                    error.chineseWord.hasInProductName && tempArr.push("标题里有中文");
                                    error.chineseWord.hasInDescription && tempArr.push("内容里有中文");
                                    vm.error.chineseWord = tempArr.length > 0 ? tempArr.join(';') : '无';

                                    tempArr = [];
                                    error.notUsUrl.productNameUrls != null && error.notUsUrl.productNameUrls.length > 0 && tempArr.push("标题里有外链：" + error.notUsUrl.productNameUrls.join(","));
                                    error.notUsUrl.descriptionUrls != null && error.notUsUrl.descriptionUrls.length > 0 && tempArr.push("内容里有外链：" + error.notUsUrl.descriptionUrls.join(","));
                                    vm.error.notUsUrl = tempArr.length > 0 ? tempArr.join(';') : '无';

                                    tempArr = [];
                                    error.sensitiveWord.productNames && error.sensitiveWord.productNames.length > 0 && tempArr.push("标题里有敏感词：" + error.sensitiveWord.productNames.join(','));
                                    error.sensitiveWord.description && error.sensitiveWord.description.length > 0 && tempArr.push("内容里有敏感词：" + error.sensitiveWord.description.join(','));
                                    vm.error.sensitiveWord = tempArr.length > 0 ? tempArr.join(';') : '无';
                                }
                                if (reloadFlag) {
                                    $rootScope.alertMsgService.setMessage('刷新成功', 'success');
                                }
                            } else {
                                if (reloadFlag) {
                                    $rootScope.alertMsgService.setMessage('刷新失败', 'warning');
                                } else {
                                    $rootScope.alertMsgService.setMessage('请更新索引', 'warning');
                                }
                            }
                        })
                    },
                    // 更改记录状态
                    chgAuditStatus: function(auditStatus) {
                        var templateId = 'auditPassConfirm.html';
                        var title = "审核通过信息";
                        if (auditStatus == -1) {
                            templateId = 'auditNopassConfirm.html';
                            title = "审核不通过信息"
                        }
                        $scope.auditData = {
                            messageState: auditStatus,
                            messageId: tools.messageId
                        };
                        ngDialog.openConfirm({
                            title: title,
                            template: templateId,
                            scope: $scope,
                            controller: 'InquiryAuditCtrl'
                        }).then(function(yes) {
                            // 刷新
                            tools.getInquiryDetail();
                        }, function(no) {
                            // 取消
                        });
                    },

                    delTag: function(tagType) {
                        ngDialog.openConfirm({
                            title: "操作提示",
                            template: "delLabelConfirm.html"
                        }).then(function(yes) {
                            service.removeInquryTag({
                                messageId: tools.messageId,
                                tagType: tagType
                            }).success(function(rs) {
                                if (rs.status === 'success') {
                                    $rootScope.alertMsgService.setMessage("删除成功.");
                                    // 刷新
                                    if (tagType == 1) {
                                        vm.item.error = null;
                                    } else if (tagType == 2) {
                                        vm.item.repeat = null;
                                    }
                                } else {
                                    $rootScope.alertMsgService.setMessage("删除失败.", 'warning');
                                }
                            })


                        }, function(no) {
                            // 取消
                            console.log('no');
                        });
                    },
                    // 相关采购需求
                    moreProcurement: function() {
                        // 去列表页查该买家下的所有采购需求
                        $window.open(path);
                    },
                    // 跳转到供应商跟进详情
                    toSellerDetail: function() {
                        this.getSellerDetail();
                        this.getsellerFollowDetail();
                        this.getBusinessTrace(1);
                    },

                    // 供应商互动行为跟踪 - 供应商详情
                    getSellerDetail: function() {
                        service.getSellerDetail(paging).success(function(data) {
                            if (commonTool.isEmpty(data.data)) return;
                            vm.sellerInfo = data.data;
                        })
                    },
                    // 供应商互动行为跟踪 - 供应商跟进状态
                    getsellerFollowDetail: function() {
                        service.getsellerFollowDetail({
                            sellerId: paging.sellerId,
                            page: 1,
                            pageSize: 1
                        }).success(function(data) {
                            if (data.page.items == null) {
                                return;
                            } else {
                                if (data.page.items.length == 0) {
                                    return;
                                } else {
                                    vm.followInfo = data.page.items[0];
                                }
                            }
                        })
                    },

                    // 询盘跟进商机查看
                    getBusinessTrace: function(userType) {
                        // userType 0：买家 , 1：卖家
                        var businessTracePaging = {
                            page: 1,
                            pageSize: 10,
                            referTo: tools.messageId,
                            userType: userType
                        }
                        service.getBusinessTrace(businessTracePaging).success(function(data) {
                            if (data.page.items != null) {
                                if (data.page.items.length > 0) {
                                    vm.businessInfo = data.page.items;
                                } else {
                                    vm.businessInfo = [];
                                }
                                if (userType == 0) {
                                    vm.isMyFollow = data.data.isMyFollow;
                                }
                            } else {
                                vm.businessInfo = [];
                            }

                            paging.total = tools.total = data.page.total;
                            tools.pageSize = data.page.pageSize;
                        })
                    },
                    // 添加供应商商机跟进记录
                    seller_followBusiness: function(id) {
                        var ids = '';
                        if (commonTool.isEmpty(id)) {
                            vm.allChecked = false;
                            ids = vm.selectionItme.join(',');
                            if (commonTool.isEmpty(ids)) {
                                $rootScope.alertMsgService.setMessage("请先选择处理的记录", 'warning');
                                return;
                            }
                        } else {
                            ids = id;
                        }
                        tools.seller_followBusinessConfirm(ids);
                        vm.selectionItme = [];
                    },
                    // 添加供应商商机跟进记录 弹出层
                    seller_followBusinessConfirm: function(ids) {
                        $scope.ids = ids;
                        $scope.tools = tools;

                        vm.seller_businessDlg = {
                            followStatus: 1,
                            content: ''
                        };

                        vm.seller_followBusinessDlg = ngDialog.open({
                            template: 'seller_followBusinessDlgId',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            width: 500,
                            title: "添加供应商商机跟进记录",
                            controller: ['$scope', function($scope) {
                                var ids = $scope.ids;
                                var tools = $scope.tools;

                                $scope.submit = function() {
                                    var params = {
                                        'inquriyIds': ids,
                                        'followStatus': vm.seller_businessDlg.followStatus,
                                        'content': vm.seller_businessDlg.content,
                                        'userType': 1,
                                        'sellerId': paging.sellerId
                                    };

                                    if (commonTool.isEmpty(vm.seller_businessDlg.content)) {
                                        $rootScope.alertMsgService.setMessage('请输入跟进内容', 'warning');
                                        return;
                                    }

                                    service.saveBusinessTrace_inquiry(params)
                                        .success(function(data) {
                                            if ('success' === data.status) {
                                                tools.getBusinessTrace(1);
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
                    // 重置弹出层勾选
                    resetCheckbox: function() {
                        vm.checkedItems = [];
                        vm.sellerDlg.followContent = '';
                        angular.forEach(vm.followContent, function(item_p) {
                            angular.forEach(item_p, function(item) {
                                item.$checked = false;
                            })
                        });
                    },
                    // 弹出层勾选
                    checkChange: function(status) {
                        vm.checkedItems = [];
                        if (status != undefined) {
                            angular.forEach(vm.followContent[status], function(item) {
                                if (item.$checked === true && item.text != '其他') {
                                    vm.checkedItems.push(item.text);
                                }
                                if (item.$checked === true && item.text == '其他') {
                                    vm.needNode = false;
                                } else {
                                    vm.needNode = true;
                                }
                            });
                        } else {
                            angular.forEach(vm.followContent, function(item) {
                                if (item.$checked === true && item.text != '其他') {
                                    vm.checkedItems.push(item.text);
                                }
                                if (item.$checked === true && item.text == '其他') {
                                    vm.needNode = false;
                                } else {
                                    vm.needNode = true;
                                }
                            });
                        }
                    },
                    // 跟进供应商
                    followSeller: function(id) {
                        var ids = '';
                        if (commonTool.isEmpty(id)) {
                            vm.allChecked = false;
                            ids = vm.selectionItme.join(',');
                            if (commonTool.isEmpty(ids)) {
                                $rootScope.alertMsgService.setMessage("请先选择处理的记录", 'warning');
                                return;
                            }
                        } else {
                            ids = id;
                        }
                        tools.followSellerConfirm(ids);
                        vm.selectionItme = [];
                        vm.followContent = service.getFlolowDlgContent();
                    },
                    // 跟进供应商 弹出层
                    followSellerConfirm: function(ids) {
                        $scope.ids = ids;
                        $scope.tools = tools;

                        vm.sellerDlg = {
                            freeFollowPeriod: 30,
                            followStatus: 0,
                            followContent: '',
                            followSignType: null,
                            followSignWay: null,
                            followSignWayArray: []
                        };

                        vm.checkedItems = [];

                        vm.followSellerDlg = ngDialog.open({
                            template: 'followSellerDlgId',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            width: 550,
                            title: "添加供应商跟进记录",
                            controller: ['$scope', function($scope) {
                                var ids = $scope.ids;
                                var tools = $scope.tools;

                                $scope.submit = function() {
                                    var params = {
                                        sellerIds: ids,
                                        followStatus: vm.sellerDlg.followStatus,
                                        freeFollowPeriod: vm.sellerDlg.freeFollowPeriod
                                    };

                                    var otherContent = vm.sellerDlg.followContent != '' ? vm.sellerDlg.followContent + ';' : '';
                                    if (vm.needNode == false && vm.sellerDlg.followContent == '') {
                                        $rootScope.alertMsgService.setMessage('请输入其他内容', 'warning');
                                        return;
                                    }
                                    if (vm.checkedItems.length < 1 && vm.sellerDlg.followContent == '') {
                                        $rootScope.alertMsgService.setMessage('请选择原因', 'warning');
                                        return;
                                    } else {
                                        if (vm.checkedItems.length > 0) {
                                            params.followContent = vm.checkedItems.join(';') + ';' + otherContent;
                                        } else {
                                            params.followContent = otherContent;
                                        }
                                    }

                                    service.addsellerFollowRecord(params)
                                        .success(function(data) {
                                            if ('success' === data.status) {
                                                vm.needNode = true;
                                                tools.getsellerFollowDetail();
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
                    // 关闭弹出层
                    close: function() {
                        vm.needNode = true;
                        ngDialog.closeAll();
                    },
                    // 跳转到采购商跟进详情
                    toBuyerDetail: function() {
                        this.buyerFollowRecord();
                        this.getBusinessTrace(0);
                    },
                    // 采购商跟进——采购商详情
                    buyerFollowRecord: function() {
                        var buyerFollowRecord_paging = {
                            page: paging.page,
                            pageSize: paging.pageSize,
                            buyerId: paging.buyerId
                        }
                        service.buyerFollowRecord(buyerFollowRecord_paging).success(function(rs) {
                            if (rs.status == 'success') {
                                vm.buyerId = paging.buyerId;
                                vm.buyerFollowInfo = rs.data.buyerFollowInfo;
                                vm.companyInfo = rs.data.companyInfo;
                                vm.personInfo = rs.data.personInfo;
                                vm.halfYearTwoRate = rs.data.halfYearTwoRate;
                                vm.isMyFollow = rs.data.isMyFollow;
                                paging.userId = vm.personInfo.userId;
                            }
                        })
                    },
                    // 获取免跟进日期
                    getFreeFollowPeriod: function() {
                        var freeFollowPeriod = [{
                            "title": "3天内",
                            "key": 3
                        }, {
                            "title": "7天内",
                            "key": 7
                        }, {
                            "title": "10天内",
                            "key": 10
                        }, {
                            "title": "15天内",
                            "key": 15
                        }, {
                            "title": "20天内",
                            "key": 20
                        }, {
                            "title": "30天内",
                            "key": 30
                        }, {
                            "title": "60天内",
                            "key": 60
                        }, {
                            "title": "90天内",
                            "key": 90
                        }, {
                            "title": "180天内",
                            "key": 180
                        }];
                        return freeFollowPeriod;
                    },
                    // 跟进该采购商的商机
                    buyer_followBusiness: function(id, type) {
                        var ids = '';
                        if (commonTool.isEmpty(id)) {
                            vm.allChecked = false;
                            ids = vm.selectionItme.join(',');
                            if (commonTool.isEmpty(ids)) {
                                $rootScope.alertMsgService.setMessage("请先选择处理的记录", 'warning');
                                return;
                            }
                        } else {
                            ids = id + ';' + type;
                        }
                        tools.buyer_followBusinessConfirm(ids);
                        vm.selectionItme = [];
                        vm.followContent = service.buyer_getFlolowDlgContent();
                    },
                    // 批量跟进该采购商的所有商机 弹出层
                    buyer_followBusinessConfirm: function(inquiryInfos) {

                        $scope.buyerId = paging.buyerId;
                        $scope.inquiryInfos = inquiryInfos;
                        $scope.type = 3;
                        $scope.tools = tools;
                        $scope.source = 'inquiryMgrDetail';
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 700,
                            templateUrl: '/controller/buyer/dialogTmp/followBusinessDlg.html',
                            controller: 'followBusRcdCtrl',
                            title: "跟进商机"
                        })

                    },
                    // 询盘详情——对话内容——询盘对话——刷新
                    refreshMessageEmailState: function(item, messageId, isReply) {
                        if (messageId != null && messageId != undefined && messageId != '') {
                            var params = {
                                messageId: messageId,
                                isReply: isReply
                            }
                            service.refreshMessageEmailState(params)
                                .success(function(data) {
                                    if (data.status == 'success') {
                                        if (data.data != null) {
                                            item.emailState = data.emailState;
                                            $rootScope.alertMsgService.setMessage("刷新成功", 'success');
                                        } else {
                                            $rootScope.alertMsgService.setMessage("刷新成功，状态无变化", 'success');
                                        }
                                    } else {
                                        $rootScope.alertMsgService.setMessage("刷新状态失败，请刷新页面重试", 'warning');
                                    }
                                })
                                .error(function() {
                                    $rootScope.alertMsgService.setMessage("刷新状态失败，请刷新页面重试", 'warning');
                                });
                        } else {
                            $rootScope.alertMsgService.setMessage("messageId参数错误，请刷新页面重试", 'warning');
                            return;
                        }
                    },
                    //  重发邮件
                    reSendEmail(status) {
                        $scope.status = status;
                        $scope.contactList = vm.contactList;
                        $scope.type = "detail";
                        vm.reSendEmailDlg = ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 600,
                            templateUrl: 'reSendConfirm',
                            controller: 'reSendEmailCtrl1'
                        })
                    }
                });
                tools.followSignTypeChange = function() {
                    switch (vm.buyerDlg.followSignType) {
                        case 1:
                            vm.buyerDlg.followSignWayArray = method.getFollowSignWayArray();
                            return;
                        case 6:
                            vm.buyerDlg.followSignWayArray = method.getArrayOfContact();
                            return;
                        case 7:
                            vm.buyerDlg.followSignWayArray = method.getArrayOfBuyer();
                            return;
                        default:
                            vm.buyerDlg.followSignWayArray = [];
                            return;
                    }
                };
                tools.followSignTypeArray = method.getFollowSignTypeArray();
                // seller 免跟进周期
                tools.freeFollowPeriod = tools.getFreeFollowPeriod();
                // buyer 面跟进周期
                tools.nonFollowInterval = tools.getFreeFollowPeriod();

                function init_data() {
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);
                    tools.getInquiryDetail();
                }

                init_data();
            }
        ])
        // 审核控制器
        .controller('InquiryAuditCtrl', ['$scope', '$rootScope', 'inquiryService', function($scope, $rootScope, service) {
            var confVm = $scope.confVm = {};
            var vm = $scope.vm = {};
            angular.extend(confVm, $scope.auditData);
            // 弹出层控制
            var vmdlg = $scope.vmdlg = {};
            /*
             * 控制页面显示
             */
            if (confVm.messageState == -1) { // 不通过
                vm.title = "审核不通过信息";
                var pm = {
                    'modular': 1
                };
                vm.chkReasons = [];
                service.getInquiryAuditReason(pm).success(function(rs) {
                    if (rs.status == 'success') {
                        vm.chkReasons = rs.data;
                    }
                })
            }


            $scope.checkChange = function() {
                vm.checkedItems = [];
                vm.needNode = false;
                angular.forEach(vm.chkReasons, function(item) {
                    if (item.$checked === true) {
                        if (item.reasonEnName == 'Others') {
                            vm.needNode = true;
                        }
                        vm.checkedItems.push(item.reasonCode);

                    }
                });
            }
            $scope.save = function(isValid) {
                var note = "";
                if (confVm.messageState == -1) {
                    var tel = /^[\w\s`~!@#$%^&*()_+\-=[\]{}\\|;':"/,.?]*$/ig;
                    if (!tel.test(vm.note)) {
                        $rootScope.alertMsgService.setMessage("备注信息必须是英文或英文字符", 'info');
                        return;
                    } else if (vm.checkedItems == null || vm.checkedItems.length == 0) {
                        $rootScope.alertMsgService.setMessage("请选择原因", 'info');
                        return;
                    } else if (vm.needNode == true) {
                        if (vm.note == null || vm.note.length < 1) {
                            $rootScope.alertMsgService.setMessage("原因选有【其他】时，备注必填", 'info');
                            return;
                        } else {
                            note = vm.note;
                        }
                    } else if (vm.note != "null" && vm.note != undefined && vm.note.length > 1) {
                        note = vm.note;
                        // if(!vm.needNode){
                        //     vm.checkedItems.push('008'); // 其他checked的
                        // }
                    }
                    if (isValid == false) {
                        return;
                    }
                    confVm.reason = vm.checkedItems.join(",");

                }
                // console.log(confVm);
                var param = angular.copy(confVm);
                if (note.length > 0) {
                    param.remark = note;
                }
                vmdlg.isdisabled = true;

                service.chgInquiryAuditStatus(param).success(function(data) {
                    if (data.status == "success") {
                        vmdlg.isdisabled = false;
                        $rootScope.alertMsgService.setMessage("审核操作成功");
                        $scope.confirm();
                    } else {
                        vmdlg.isdisabled = false;
                        $rootScope.alertMsgService.setMessage("审核操作失败", 'warning');
                    }
                })

            }
            $scope.close = function() {
                $scope.closeThisDialog();
            };
        }])

    //  重发邮件控制器
    .controller("reSendEmailCtrl1", ['$scope', '$rootScope', 'ngDialog', 'inquiryService', ($scope, $rootScope, ngDialog, service) => {

        let tools = $scope.tools;
        let status = $scope.status;
        let constact = $scope.contactList;
        let messageId = constact[0].messageId;
        let messageObj = constact[status];
        let replyId = messageObj.messageId;
        let isReply = messageObj.isReply;
        let sendUserId = messageObj.senderId;

        // reSendInquiryReplyEmail
        tools = $.extend(tools, {
            // 买家消息 
            inquiryEmailconFirm() {
                service.reSendInquiryEmail({ messageId, sendUserId })
                    .success((data) => {
                        if (data.status === "success") {
                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                            tools.getInquiryDetail();
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                ngDialog.closeAll();
            },
            //  卖家回复
            inquiryReplyEmailConfirm() {
                service.reSendInquiryReplyEmail({ messageId, sendUserId, replyId })
                    .success((data) => {
                        if (data.status === "success") {
                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                            tools.getInquiryDetail();
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                ngDialog.closeAll();
            },

            reSendEmailCancel() {
                ngDialog.closeAll();
            },

            checkUserType() {
                !isReply ? tools.inquiryEmailconFirm() : tools.inquiryReplyEmailConfirm();
            }
        })
    }])


    .filter("messageType", function() {
            return function(status) {
                var name = status;
                if (status == 1) {
                    name = "产品询盘";
                } else if (status == 5) {
                    name = "公司询盘";
                }
                return name;
            };
        })
        .filter("messageState", function() {
            return function(status) {
                var name = status;
                if (status == 1) {
                    name = "待审核";
                } else if (status == 2) {
                    name = "审核通过";
                } else if (status == -1) {
                    name = "审核不通过";
                }
                return name;
            };
        })
        .filter("emailStateFilter", function() {
            //    空    旧数据，未发邮件
            //    faild     失败
            //    success    邮件已到达，未读
            //    soft    软退
            //    hard    硬退
            //    open    邮件已到达，已读
            return function(status) {
                switch (status) {
                    case null:
                        return '未发邮件';
                    case 'fail':
                        return '邮件发送失败';
                    case 'success':
                        return '邮件已到达，未读';
                    case 'soft':
                        return '邮件发送失败（软退）';
                    case 'hard':
                        return '邮件发送失败（硬退）';
                    case 'open':
                        return '邮件已到达，已读';
                }
            };
        })
});
