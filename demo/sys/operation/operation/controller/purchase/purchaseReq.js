define(['../module'], function(ng) {
    ng
        .factory('purchaseService', ['$http', 'api', 'commonTool', '$rootScope', function($http, api, commonTool, $rootScope) {
            return {
                // 获取采购需求来源 
                getPurchaseSource: function() {
                    return $http.get(api.getPurchaseSource);
                },
                // 获取采购需求列表
                getPurchaseList: function(params) {

                    return $http.get(api.getPurchaseList, {
                        'params': params
                    });
                },
                // 获取国家列表
                getCountries: function() {
                    return $http.get(api.getCountryCode);
                },

                // getIndustry: function() {
                //     return $http.get(api.GoodgetIndustry);
                // },
                getCategoryRoot: function(indusId) {
                    return $http.get(api.GoodgetCategory, {
                        'params': {
                            'indusId': indusId
                        }
                    });
                },
                getCategoryChildren: function(param) {
                    return $http.get(api.GoodgetChildCategory, {
                        'params': param
                    });
                },

                // 获取采购需求详情
                getPurchaseDetail: function(params) {
                    return $http.get(api.getPurchaseDetail, {
                        'params': params
                    });
                },
                // 详情页-tab最终匹配供应商
                getLastMatchSuppliers: function(params) {
                    return $http.get(api.getPchsLastMatchSuppliers, {
                        'params': params
                    });
                },
                // 详情页-tab系统匹配供应商-剔除
                getDeledSuppliers: function(params) {
                    return $http.get(api.getPchsDeledSuppliers, {
                        'params': params
                    });
                },
                // 详情页-tab自由报价供应商
                getQuoteSuppliers: function(params) {
                    return $http.get(api.getPchsQuoteSuppliers, {
                        'params': params
                    });
                },
                getContactMsg: function(params) {
                    return $http.get(api.getPchsSplContactMsg, {
                        'params': params
                    });
                },

                // 审核采购需求
                chgPurchaseStatus: function(param) {
                    return $http.post(api.chgPurchaseStatus, param);
                },
                // 删除标签
                delPurchaseTag: function(param) {
                    return $http.post(api.delPurchaseTag, param);
                },

                // == [[ 匹配管理
                // 列表
                getPchsMatchList: function(params) {
                    // commonTool.formParam(params)
                    // params.pageSize=2;
                    return $http.get(api.getPchsMatchList, {
                        'params': params
                    });
                },
                // 匹配到的供应商
                getPchsMatchSuppliers: function(params) {
                    return $http.get(api.getPchsMatchSuppliers, {
                        'params': params
                    });
                },
                // 查询供应商列表
                getPchsQrySuppliers: function(params) {
                    return $http.get(api.getPchsQrySuppliers, {
                        'params': params
                    });
                },
                confirmPchsManualMatch: function(params) {
                    return $http.post(api.confirmPchsManualMatch, params);
                },
                getSellerProductCategory: function(params) {
                    return $http.get(api.getSellerProductCategory, {
                        'params': params
                    });
                },
                updatePurchaseCategory: function(params) {
                    return $http.post(api.updatePurchaseCategory, params);
                },
                updatePurchase: function(params) {
                    return $http.post(api.updatePurchase, params);
                },

                // == 匹配管理 ]]

                //设置查询条件
                getSearchPage: function(tabType) {
                    // console.log(tabType);
                    var page = {
                        'page': 1,
                        'pageSize': 10,

                        'publisherName': null, // 买家名称
                        'productName': null, //主题
                        'productCategoryId': null, //行业id[一级类目]
                        'countryId': '', //国家
                        'dropdwonType': '1', // 下拉查询条件
                        'dropdwonValue': '',
                        'procurementState': '', //  状态，默认待审核 [待审核 1,审核通过 2,审核不通过 3]
                        'startTime': null, // 发布时间
                        'endTime': null, // 发布时间
                        'hasAttachment': '', //  是否有附件
                        'isError': null, // 是否有问题
                        'isRepeat': null, // 是否重复
                        'quality': '', // 质量
                        'source': '', // 来原
                        'agentUserId': '' // 代发人
                    };
                    if (tabType == 'tabWaitAudit') {
                        page.procurementState = 1;
                    } else if (tabType == 'tabPassAudit') {
                        page.procurementState = 2;
                    } else if (tabType == 'tabFailAudit') {
                        page.procurementState = 3;
                    } else if (tabType == 'tabSuccessAudit') {
                        page.procurementState = 8;
                    }

                    return page;
                }

                ,
                getMatchListPage: function() {
                    var page = {
                        'page': 1,
                        'pageSize': 10,

                        'productName': '', //主题
                        'productCategoryId': '', //行业id[一级类目]
                        'countryId': '', //国家
                        'buyerDropdownType': '1', // 下拉查询条件
                        'buyerDropdownValue': '',
                        'startTime': '', // 发布时间
                        'endTime': '', // 发布时间
                        'matchTimeStart': '', // 最后匹配时间起止时间
                        'matchTimeEnd': '', // 最后匹配时间起止时间
                        'quality': '', // 质量
                        'source': '', // 来原
                        'matchQtyStart': null,
                        'matchQtyEnd': null,
                        'matchById': null
                    };
                    return page;
                },
                // 采购需求——供应商/采购商 跟进商机记录
                getBusinessTrace_purchase: function(params) {
                    return $http.get(api.getBusinessTrace_purchase, {
                        'params': params
                    })
                },
                // 添加采购需求跟进商机
                saveBusinessTrace: function(params) {
                    return $http.get(api.saveBusinessTrace, {
                        'params': params
                    })
                },
                // 获取采购商未二次回复采购需求列表
                getPurchaseReplyList: function(params) {
                    return $http.get(api.getPurchaseReplyList, {
                        'params': params
                    });
                },
                getFlolowDlgContent: function() {
                    var chkReasons = [];
                    chkReasons[0] = {
                        "text": "已找到合作厂家"
                    };
                    chkReasons[1] = {
                        "text": "采购项目终止"
                    };
                    chkReasons[2] = {
                        "text": "该类目暂无合适的厂家"
                    };
                    chkReasons[3] = {
                        "text": "其他"
                    };
                    return chkReasons;
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
                // 采购商跟进记录
                buyerFollowRecord: function(params) {
                    return $http.get(api.buyerFollowRecord, {
                        'params': params
                    })
                },
                // 采购需求详细页 供应商回复情况
                queryMatchSupplierReplyInfo: function(params) {
                    return $http.get(api.queryMatchSupplierReplyInfo, {
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
                // 二次匹配干预——检测供应商是否存在列表中
                isExistSupplierList: function(params) {
                    return $http.get(api.isExistSupplierList, {
                        'params': params
                    })
                },
                // 采购需求二次干预匹配提交
                confirmManualMatchAgain: function(params) {
                    return $http.get(api.confirmManualMatchAgain, {
                        'params': params
                    })
                },
                getAuditorList: function(params) {
                    return $http.get(api.getSysUserList, {
                        'params': params
                    })
                },
                findRepeatProcurements: function(params) {
                    return $http.get(api.findRepeatProcurements, {
                        'params': params
                    })
                },
                // 屏蔽采购需求
                hiddenPurchase: function(params) {
                    return $http.get(api.hiddenPurchase, {
                        'params': params
                    })
                },
                //  发送询盘邮件通知
                reSendInquiryEmail(params) {
                    return $http.post(api.reSendInqueryEmail, params);
                },
                //  发送询盘回复邮件通知
                reSendInquiryReplyEmail(params) {
                    return $http.post(api.reSendInqueryReplyEmail, params);
                },
                // 零匹配原因获取
                getZeroMatchReason: function(params) {
                    return $http.get(api.getZeroMatchReason);
                }
            };
        }])

    //采购列表页面控制器
    .controller('PurchaseReqListCtrl', ['$scope', '$rootScope', '$controller', '$window', '$location', 'ngDialog', 'purchaseService', 'commonService', 'commonTool',
        function($scope, $rootScope, $controller, $window, $location, ngDialog, purchaseService, commonService, commonTool) {
            $controller('baseListController', {
                $scope: $scope
            });
            var vm = $scope.vm;
            var tools = $scope.tools;
            var tabs = $scope.tabs = {};
            tabs.tabAll = {}, tabs.tabWaitAudit = {}, tabs.tabPassAudit = {}, tabs.tabFailAudit = {}, tabs.tabSuccessAudit = {};
            tabs.tabAll.paging = {}, tabs.tabWaitAudit.paging = {}, tabs.tabPassAudit.paging = {}, tabs.tabFailAudit.paging = {}, tabs.tabSuccessAudit.paging = {};
            var tabName = $scope.tabName;
            // $rootScope.alertMsgService.setMessage("hello.");

            // 从其他页面过来时的参数
            var otherPageParam = $location.search();


            /* 查询条件里的select数据*/
            tools.setInitData = function() {
                // 获取采购需求来源
                purchaseService.getPurchaseSource().success(function(data) {
                        if ('success' == data.status) {
                            tools.purchaseSources = data.data;
                        } else {
                            console.log("Get Purchase Source Fail");
                        }
                    })
                    // 获取国家列表
                purchaseService.getCountries().success(function(data) {
                    if ('success' == data.status) {
                        tools.countries = data.data;
                    } else {
                        console.log("Get Countries Fail");
                    }
                });

                // 获取所有一级类目
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if ('success' == data.status) {
                        tools.categorys = data.data;
                    } else {
                        console.log("Get getAllCategorysOfLevel1 Fail");
                    }
                });

                // 设置查询条件里的采购商类型
                tools.sellerSearchType = [{
                    'id': '1',
                    'name': '采购商姓名'
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

            tools.search = function() {
                this.getPurchaseList(vm.tabsName);
            };

            // 获取采购列表
            tools.getPurchaseList = function(tabType) {
                // console.log(tabs[tabType].paging);
                purchaseService.getPurchaseList(commonTool.filterParam(tabs[tabType].paging)).success(function(data) {
                    if (data.data != null) {
                        if (data.data.items != null) {
                            tabs[tabType].items = data.data.items;
                            tabs[tabType].paging.total = data.data.total;
                        } else {
                            tabs[tabType].items = [];
                            tabs[tabType].paging.total = 0;
                        }
                    } else {
                        tabs[tabType].items = [];
                        tabs[tabType].paging.total = 0;
                    }
                    tabs[tabType].isAllChecked = false; // 是否全选
                    tabs[tabType].checkedDatas = []; // 每一个checkbox 
                });
            };


            // 1.查询条件初始化 [type 0 初次加载或tab切换，1 重置
            tools.initTab = function(type, _tabName) {
                vm.tabsName = _tabName;
                //var tabName= 'tabAll';
                tabName = _tabName;
                if (type == 0 && tabs[tabName].isFirstLoad != true) {
                    tabs[tabName].isFirstLoad = false;
                    /* [[-日期 */
                    tabs[tabName].start = {
                        format: 'YYYY/MM/DD',
                        choose: function(dates) { //选择好日期的回调
                            tabs.tabAll.end.min = dates;
                        }

                    };
                    $('body,html').on("click", '#startTime_' + tabName, function() {
                        laydate(tabs[tabName].start);
                    });
                    tabs[tabName].end = {
                        format: 'YYYY/MM/DD',
                        choose: function(dates) { //选择好日期的回调
                            tabs[tabName].start.max = dates;
                        }
                    };
                    // 页面的id需与此处的保持一致！！
                    $('body,html').on("click", '#endTime_' + tabName, function() {
                        laydate(tabs.tabAll.end);
                    });

                    /* 日期-]] */
                    tabs[tabName].paging = purchaseService.getSearchPage(tabName);

                    // 其他页面跳转来时事的参数
                    if (!commonTool.isEmptyObject(otherPageParam) && !commonTool.isEmpty(otherPageParam.userId)) {
                        tabs[tabName].paging.dropdwonType = '5';
                        tabs[tabName].paging.dropdwonValue = otherPageParam.userId;
                    }
                    // 转到第几页
                    tabs[tabName].newpage = null;

                    // 需求583 判断用户是否有  “只查看我跟进采购商发的” 权限
                    // 如果勾选  tabs[tabName].paging.isFollower = 1
                    // 如果没勾选  tabs[tabName].paging.isFollower = 0
                    // var moduleName = '采购需求管理';
                    // var functionName = '采购需求列表';
                    // var opearName = '只查看我跟进采购商发的';

                    if (purchaseService.getPermission('采购需求管理', '采购需求列表', '只查看我跟进采购商发的')) {
                        tabs[tabName].paging.isFollower = 1;
                        vm.isFollowerShowFlag = false;
                    } else {
                        tabs[tabName].paging.isFollower = 0;
                        vm.isFollowerShowFlag = true;
                    }

                    tools.getPurchaseList(tabName);

                } else if (type == 1) {
                    // 重置条件但不发请求
                    tabs[tabName].paging = purchaseService.getSearchPage(tabName);
                }
            }


            // 分页组件 type 为 null时，翻页
            tools.getnewpage = function(type, tabType) {
                if (type == 1) { // 跳转到第几页
                    tabs[tabType].paging.page = tabs[tabType].newpage;
                    tabs[tabType].newpage = null;
                } else if (type == 0) { // 每页显示多少条切换时
                    tabs[tabType].paging.page = 1;
                }
                tools.getPurchaseList(tabType);
            }


            // 跳转采购详情页面
            tools.showDetail = function(purchaseId) {
                $window.open('#/purchase/purchaseReqDetail?purchaseId=' + purchaseId);
            };
            /*
             * 单个或批量更改记录状态
             * purchaseId 单个处理时的采购需求id
             */
            tools.chgAuditStatus = function(auditStatus, tabName, purchaseId) {
                if (tabs[tabName].checkedDatas.length < 1 && commonTool.isEmpty(purchaseId)) {
                    $rootScope.alertMsgService.setMessage("请先选择要操作的记录.");
                    return;
                }
                var templateId = 'auditPassConfirm.html';
                var title = "审核通过信息";
                if (auditStatus == 3) {
                    templateId = 'auditNopassConfirm.html';
                    title = "审核不通过信息"
                }
                var procurementId = tabs[tabName].checkedDatas.join(",");
                if (!commonTool.isEmpty(purchaseId)) {
                    // 单个更改
                    procurementId = purchaseId;
                }
                $scope.auditData = {
                    auditState: auditStatus,
                    tabName: tabName,
                    procurementId: procurementId
                };
                ngDialog.openConfirm({
                    title: title,
                    template: templateId,
                    scope: $scope,
                    controller: 'PurchaseAuditCtrl'
                }).then(function(yes) {
                    // 刷新列表
                    tools.getPurchaseList($scope.auditData.tabName);
                }, function(no) {
                    // 取消
                });
            }


            // 批量选择
            tools.toggleCheckAll = function(ischecked, tabName) {
                tabs[tabName].checkedDatas = [];
                angular.forEach(tabs[tabName].items, function(item) {
                    item.$checked = ischecked;
                    if (true === ischecked) {
                        tabs[tabName].checkedDatas.push(item.procurementId);
                    }
                });
            };
            tools.setCheckedData = function(tabName) {
                var selectionItem = [];
                angular.forEach(tabs[tabName].items, function(item) {
                    if (true === item.$checked) {
                        selectionItem.push(item.procurementId);
                    }
                });
                tabs[tabName].checkedDatas = selectionItem;
            }

            tools.getSecondSource = function(source) {
                console.log(source);
                if (commonTool.isEmpty(source)) {
                    vm.secondSourceArray = [];
                    return;
                }
                var tmpObj = {
                    sourceType: 3,
                    source: source
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
            var buyerParams = {
                groupId: 282,
                page: 1,
                pageSize: 100
            };

            commonService.getFollowPeople(buyerParams).success(function(data) {
                if ('success' === data.status) {
                    vm.followPeopleArray = data.page.items;
                }
            });


        }
    ])

    // 采购详情页面控制器
    .controller('PurchaseReqDetailCtrl', ['$scope',
        '$rootScope',
        '$window',
        '$location',
        '$filter',
        'ngDialog',
        'purchaseService',
        'commonService',
        'commonTool',
        'addpurchaseService',
        function($scope, $rootScope, $window, $location, $filter, ngDialog, purchaseService, commonService, commonTool, addpurchaseService) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var paging = $scope.paging = {};
            var toolsdlg = $scope.toolsdlg = {};
            var pagingdlg = $scope.pagingdlg = {
                page: 1,
                pageSize: 10,
                personDropdownType: '0'
            };

            // 弹出层控制
            var vmdlg = $scope.vmdlg = {};
            vmdlg.isdisabled = false;

            vm.viewItems = [];
            vm.keyName = 'sellerId';

            // 获取采购ID
            var search = $location.search();
            tools.procurementId = search.purchaseId;
            tools.fromIntervene = search.fromIntervene;

            vm.needNode = true;
            vm.activeTab = 0;
            if (tools.fromIntervene || search.type || search.isQuote || search.quoteAuditState || search.hasSendMsgSeller || search.hasSendMsgBuyer) {
                // 从干预匹配页回来的，要默认赞中tab1
                vm.activeTab = 1;
            }


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

            // 获取买家详情
            tools.getPurchaseDetail = function() {
                purchaseService.getPurchaseDetail({
                    'procurementId': tools.procurementId
                }).success(function(data) {
                    if ('success' == data.status) {
                        vm.item = data.data.detailInfo;
                        vm.buyer = data.data.buyerInfo;
                        vm.auditList = data.data.auditList;
                        vm.company = data.data.companyInfo;
                        vm.matchInfo = data.data.matchInfo;
                        // 获取buyerId
                        tools.buyerId = vm.buyer.buyerId;
                        tools.userId = vm.buyer.userId;
                        // 获取干预状态
                        tools.matchStatus = null;
                        if (data.data.matchInfo != null) {
                            tools.matchStatus = data.data.matchInfo.status;
                        }
                        if (vm.item.productLastCategoryId) {
                            addpurchaseService.getCategoryPath({
                                'categoryId': vm.item.productLastCategoryId,
                                'noIndus': true
                            }).success(function(data) {
                                if (data.status === 'success') {
                                    vm.item.comlpeteCategoryPath = data.data.categoryStructureEn;
                                }
                            })
                        }
                        // 系统记录问题
                        vm.error = {};
                        if (vm.item.errorReason == null || vm.item.errorReason == '') {
                            vm.error.chineseWord = '无';
                            vm.error.notUsUrl = '无';
                            vm.error.sensitiveWord = '无';
                        } else {
                            var error = eval("(" + vm.item.errorReason + ")");
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

                        // 附件列表
                        if (!commonTool.isEmpty(vm.item.attachmentUrl) && vm.item.attachmentUrl.length > 0) {
                            // var _arr = [];
                            vm.item.attachmentUrl = vm.item.attachmentUrl.split(',');
                            // .forEach(function(str){
                            //     _arr.push(imgUrl+str);
                            // })
                            // vm.item.attachmentUrl = _arr;
                        }

                        // 最后审核人，时间
                        vm.item.lastAuditor = '';
                        vm.item.lastAuditTime = '';
                        if (vm.auditList.length > 0) {
                            vm.item.lastAuditor = vm.auditList[0].auditor;
                            vm.item.lastAuditTime = vm.auditList[0].auditTime;
                        }
                    } else {
                        alert("请更新索引");
                    }
                })
            };
            tools.getPurchaseDetail();
            vm.propMatchArray = [];
            var notFindObj = {
                categoryCascade: "Don't find?Choose my Category",
                categoryId: -1
            };

            var textareaId = 'productDes';
            var TEXTAREA_DOM = '#' + textareaId;

            $rootScope.selectedCategory = {
                categoryId: -1,
                categoryOfSuggestAarry: []
            }
            $rootScope.selectedCategory.categoryOfSuggestAarry.push(notFindObj);

            // 提示列表
            var MATCH_KEY_DOM = '.match-key-list';

            var MATCH_VAL_DOM = '.match-val-list';

            tools = $.extend(tools, {
                productNameChange: function() {
                    if (commonTool.isEmpty(vm.newPurchase.productName)) {
                        $rootScope.selectedCategory.categoryOfSuggestAarry = [];

                        $rootScope.selectedCategory.categoryOfSuggestAarry.push(notFindObj);
                        $rootScope.selectedCategory.categoryId = -1;
                        return;
                    }

                    addpurchaseService.getSuggestCategory({
                        prefix: vm.newPurchase.productName
                    }).success(function(data) {
                        if (data.status === 'success') {
                            $rootScope.selectedCategory.categoryOfSuggestAarry = data.data;
                            $rootScope.selectedCategory.categoryId = data.data[0].categoryId;
                        }

                    })
                },
                categoryChange: function() {
                    if (commonTool.isEmpty($rootScope.selectedCategory.categoryId)) return;
                    console.log($rootScope.selectedCategory.categoryId);
                    if ($rootScope.selectedCategory.categoryId == -1) {
                        tools.dlgSelectCategory();
                    }
                },
                // 屏蔽采购需求
                hiddenPurchase: function(procurementId, isHidden) {
                    $scope.procurementId = procurementId;
                    $scope.isHidden = isHidden;
                    vm.hiddenPurchaseDlg = ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 600,
                        templateUrl: 'hiddenPurchaseConfirm',
                        controller: ['$scope', function($scope) {
                            var procurementId = $scope.procurementId;
                            var isHidden = $scope.isHidden;
                            var tools = $scope.tools;

                            $scope.submit = function() {
                                var params = {
                                    'procurementId': procurementId,
                                    'isHidden': isHidden
                                };
                                purchaseService.hiddenPurchase(params).success(function(data) {
                                    ngDialog.close();
                                    tools.getPurchaseDetail();
                                })
                            }
                            $scope.cancel = function() {
                                ngDialog.close();
                            }
                        }]
                    })

                }
            });
            // 更改记录状态
            tools.chgAuditStatus = function(auditStatus, id) {
                var templateId = 'auditPassConfirm.html';
                var title = "审核通过信息";
                if (auditStatus == 3) {
                    templateId = 'auditNopassConfirm.html';
                    title = "审核不通过信息"
                }
                $scope.auditData = {
                    auditState: auditStatus,
                    procurementId: id == undefined ? tools.procurementId : id
                };
                ngDialog.openConfirm({
                    title: title,
                    template: templateId,
                    scope: $scope,
                    controller: 'PurchaseAuditCtrl'
                }).then(function(yes) {
                    // 刷新
                    if (id == undefined) {
                        tools.getPurchaseDetail();
                    } else {
                        tools.getRepeatTable();
                    }

                }, function(no) {
                    // 取消
                });
            }

            tools.delTag = function(tagType) {
                ngDialog.openConfirm({
                    title: "操作提示",
                    template: "delLabelConfirm.html"
                }).then(function(yes) {
                    purchaseService.delPurchaseTag({
                        procurementId: tools.procurementId,
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
            }

            /**
             * 修改类目
             * @return {[type]} [description]
             */
            tools.selectCategory = function() {
                vm.categoryTypeParam = "purchaseDetail";
                var dialog = ngDialog.openConfirm({
                    template: './controller/purchase/dialogCategory.html',
                    controller: 'DialogCategoryCtrl',
                    width: 1200,
                    title: '类目选择',
                    scope: $scope
                }).then(function(yes) {
                    var param = {};
                    param.procurementId = tools.procurementId;
                    param.categoryId = vm.checkedCategoryRs.id;
                    purchaseService.updatePurchaseCategory(param).success(function(rs) {
                        if (rs.status == 'success') {
                            $rootScope.alertMsgService.setMessage("类目修改成功");
                            // vm.item.productCategory = vm.rootCategoryName;
                            // vm.item.productLastCategory = vm.checkedCategoryRs.name;
                            // vm.item.productLastCategoryId = vm.checkedCategoryRs.id;
                            tools.getPurchaseDetail();
                        } else {
                            $rootScope.alertMsgService.setMessage("类目修改失败：" + rs.message, 'warning');
                        }
                    })

                }, function(no) {

                });
            }

            /**
             * 修改采购需求信息
             * @return {[type]} [description]
             */
            tools.changePurchase = function() {
                var dialog = ngDialog.open({
                    template: './controller/purchase/changePurchase.html',
                    width: 1200,
                    title: '修改采购需求',
                    scope: $scope,
                    controller: ['$scope', 'Upload', 'api', function($scope, Upload, api) {
                        function File(filename, uploadurl) {
                            this.filename = filename;
                            this.uploadurl = uploadurl;
                        }

                        function Trade(code, name) {
                            this.id = code;
                            this.enName = name;
                        };
                        // 放select下拉数据等辅助数据
                        vm.toolData = {};
                        // vm.newPurchase 用来修改的采购需求对像
                        vm.newPurchase = {};
                        angular.copy(vm.item, vm.newPurchase);
                        vm.newPurchase.publisherId = vm.buyer.userId;

                        function init() {
                            // 查字典表
                            commonService.getDictItems('order_unit,payment_terms').success(function(rs) {
                                vm.toolData.packageUnits = rs.order_unit;
                                vm.toolData.paymentTerms = rs.payment_terms;
                                $rootScope.selectedCategory.categoryOfSuggestAarry = [];
                                if (!commonTool.isEmpty(vm.item.productLastCategoryId)) {
                                    addpurchaseService.getCategoryPath({
                                        'categoryId': vm.item.productLastCategoryId,
                                        'noIndus': true
                                    }).success(function(data) {
                                        if (data.status === 'success') {
                                            var item = data.data;

                                            var hasSelectObj = {
                                                categoryCascade: item.categoryStructureEn,
                                                categoryId: vm.item.productLastCategoryId
                                            };
                                            var notFindObj = {
                                                categoryCascade: "Don't find?Choose my Category",
                                                categoryId: -1
                                            };
                                            $rootScope.selectedCategory.categoryOfSuggestAarry.push(hasSelectObj);
                                            $rootScope.selectedCategory.categoryOfSuggestAarry.push(notFindObj);
                                            $rootScope.selectedCategory.categoryId = vm.item.productLastCategoryId;
                                        }
                                    })


                                }
                                $(TEXTAREA_DOM).focus(function() {
                                    var categoryId = $rootScope.selectedCategory.categoryId;
                                    if (commonTool.isEmpty(categoryId) || categoryId == -1) return;
                                    tools.getPropMatchArray();

                                });
                                $(TEXTAREA_DOM).blur(function(event) {
                                    vm.propMatchArray = [];
                                });

                                $(document).off('keydown').on('keydown', TEXTAREA_DOM, function(event) {
                                    var keyCode = event.keyCode;
                                    // Esc:27; UpArrow:38; DwArrow:40 Enter:13 
                                    switch (keyCode) {
                                        case 13:
                                            tools.checkKeyboardEnter(event);
                                            break;
                                        case 38:
                                        case 40:
                                            tools.checkKeyboardUpOrDown(event);
                                            break;
                                        case 27:
                                            tools.checkKeyboardEsc(event)
                                            break;
                                        default:
                                            break;
                                    }
                                });
                                $(document).off('keyup').on('keyup', TEXTAREA_DOM, function(event) {
                                    var keyCode = event.keyCode;
                                    switch (keyCode) {
                                        case 13:
                                        case 38:
                                        case 40:
                                        case 27:
                                            return;
                                        default:
                                            break;
                                    }
                                    tools.checkKeyboardCode(event);
                                });
                            });
                            // 应后端开发要求，写死
                            vm.toolData.tradeArray = [
                                new Trade("106001", "FOB"), new Trade("106002", "EXW"),
                                new Trade("106003", "FAS"), new Trade("106004", "FCA"),
                                new Trade("106005", "CFR"), new Trade("106006", "CPT"),
                                new Trade("106007", "CIF"), new Trade("106008", "CIP"),
                                new Trade("106009", "DES"), new Trade("106010", "DAF"),
                                new Trade("106011", "DEQ"), new Trade("106012", "DDP"),
                                new Trade("106013", "DDU"), new Trade("106014", "CPT")
                            ];

                            vm.newPurchase.curentDay = $filter('date')(new Date(), 'yyyy-MM-dd');

                            vm.priceType = vm.newPurchase.moq == 1 ? 2 : 1;

                            vm.newPurchase.endTime = $filter('date')(vm.newPurchase.endTime, 'yyyy-MM-dd');
                            vm.newPurchase.productCategoryName = vm.item.productLastCategory;
                            // vm.newPurchase.expectNum = vm.item.expectNum ;
                            vm.newPurchase.productCategoryId = vm.item.productLastCategoryId;
                            vm.newPurchase.boothProcurement = vm.item.boothProcurement == 1 ? true : false;
                            // console.log(vm.newPurchase.expect);
                            vm.toolData.expectations = [];
                            vm.toolData.expectations[0] = {
                                'id': 'dsc',
                                'name': 'Detailed Specification/Categories',
                                'checked': false
                            };
                            vm.toolData.expectations[1] = {
                                'id': 'dpl',
                                'name': 'Detailed Price List ',
                                'checked': false
                            };
                            vm.toolData.expectations[2] = {
                                'id': 'cert',
                                'name': 'Certificates',
                                'checked': false
                            };
                            vm.toolData.expectationsOther = {
                                'checked': false,
                                'value': ''
                            };
                            // 设置是否选中
                            var hasExpect = (vm.newPurchase.expect == null || vm.newPurchase.expect.length < 1 ? false : true);
                            var expects = [];
                            if (vm.newPurchase.expect != null) {
                                expects = vm.newPurchase.expect.split(',');
                            }
                            var isOther = true;
                            if (hasExpect) {
                                for (var i = 0, l = expects.length; i < l; i++) {
                                    isOther = true;
                                    for (var j = 0, lj = vm.toolData.expectations.length; j < lj; j++) {
                                        if (expects[i] == vm.toolData.expectations[j].name) {
                                            vm.toolData.expectations[j].checked = true;
                                            isOther = false;
                                            break;
                                        }
                                    }
                                    if (isOther) {
                                        vm.toolData.expectationsOther.checked = true;
                                        vm.toolData.expectationsOther.value = expects[i];
                                    }
                                }
                            }

                            vm.toolData.supplierRequires = [];
                            vm.toolData.supplierRequires[0] = {
                                'id': 'goldSupplier',
                                'name': 'Gold Supplier',
                                'checked': false
                            };
                            vm.toolData.supplierRequires[1] = {
                                'id': 'auditedSupplier',
                                'name': 'Audited Supplier',
                                'checked': false
                            };
                            vm.toolData.supplierRequires[2] = {
                                'id': 'verifiedSupplier',
                                'name': 'Verified Supplier',
                                'checked': false
                            };
                            // 设置是否选中
                            for (var j = 0, lj = vm.toolData.supplierRequires.length; j < lj; j++) {
                                for (var i = 0, l = vm.newPurchase.supplierRequired.length; i < l; i++) {
                                    if (vm.newPurchase.supplierRequired[i] == vm.toolData.supplierRequires[j].name) {
                                        vm.toolData.supplierRequires[j].checked = true;
                                        break;
                                    }
                                }
                            }

                            // 组织附件对像
                            vm.toolData.attachmentFiles = [];
                            if (!commonTool.isEmpty(vm.item.attachmentName) && vm.item.attachmentName.length > 0) {
                                var names = vm.item.attachmentName.split(',');
                                for (var i = 0, l = names.length; i < l; i++) {
                                    vm.toolData.attachmentFiles.push(new File(names[i], vm.item.attachmentUrl[i]));
                                }
                            }
                        }

                        init();

                        /**
                         * 选择类目
                         * @return {[type]} [description]
                         */
                        tools.dlgSelectCategory = function() {
                            vm.categoryTypeParam = "purchaseDetail";
                            var dialog = ngDialog.openConfirm({
                                template: './controller/purchase/dialogCategory.html',
                                controller: 'DialogCategoryCtrl',
                                width: 1200,
                                title: '类目选择',
                                scope: $scope
                            }).then(function(yes) {
                                // vm.item.productCategoryName = vm.rootCategoryName;
                                vm.newPurchase.productCategoryName = vm.checkedCategoryRs.name;
                                vm.newPurchase.productCategoryId = vm.checkedCategoryRs.id;
                                console.log(vm.newPurchase.productCategoryName, vm.newPurchase.productCategoryId);

                                var categoryId = vm.newPurchase.productCategoryId;

                                console.log(categoryId);

                                tools.isMutiCategoty(categoryId);

                                addpurchaseService.getCategoryPath({
                                    'categoryId': categoryId,
                                    'noIndus': true
                                }).success(function(data) {
                                    if (data.status === 'success') {
                                        var item = data.data;
                                        var tmpObj = {
                                            categoryCascade: item.categoryStructureEn,
                                            categoryId: item.lastCategory
                                        };
                                        $rootScope.selectedCategory.categoryId = categoryId;

                                        $rootScope.selectedCategory.categoryOfSuggestAarry.unshift(tmpObj);

                                    }
                                })

                            }, function(no) {

                            });
                        }
                        tools.isMutiCategoty = function(categoryId) {
                            var array = $rootScope.selectedCategory.categoryOfSuggestAarry;
                            var len = array.length;
                            if (len <= 0) return false;
                            for (var i = 0; i < len; i++) {
                                var item = array[i];
                                if (item.categoryId == categoryId) {
                                    $rootScope.selectedCategory.categoryOfSuggestAarry.splice(i, 1);
                                    return true;
                                }
                            }
                            return false;
                        }
                        tools.uploadFile = function(file) {
                            if (commonTool.isEmpty(file)) return;
                            var myFiles = file;
                            if (vm.toolData.attachmentFiles.length + myFiles.length > 8) {
                                $rootScope.alertMsgService.setMessage("最多不能超过8个附件", 'warning');
                                return false;
                            }
                            for (var i = 0, len = myFiles.length; i < len; i++) {
                                var fileItem = myFiles[i]
                                if ((!/.*\.(jpg)|(jpeg)|(gif)|(png)|(doc)|(docx)|(xls)|(xlsx)|(ppt)|(pdf)$/.test(fileItem.name)) || fileItem.size > 2 * 1024 * 1024) {
                                    $rootScope.alertMsgService.setMessage("请重新支持格式：jpg/jpeg/gif/png/doc/docx/xls/xlsx/ppt/pdf;文件大小不超过2M", 'warning');
                                    return false;
                                }
                            }

                            for (var k = 0, len = myFiles.length; k < len; k++) {
                                var fileItem = myFiles[k]
                                Upload.upload({
                                    url: api.uploadContract,
                                    file: fileItem
                                }).success(function(data, status, headers, config) {
                                    var tmpFile = new File(config.file.name.replace(',', ' '), data.data.url);
                                    vm.toolData.attachmentFiles.push(tmpFile);
                                });
                            }


                        }
                        tools.delFile = function(index) {
                            vm.toolData.attachmentFiles.splice(index, 1);
                        }
                        tools.savePurchase = function() {
                            vm.newPurchase.productCategoryId = $rootScope.selectedCategory.categoryId;
                            if (commonTool.isEmpty(vm.newPurchase.productCategoryId) || vm.newPurchase.productCategoryId == -1) {
                                $rootScope.alertMsgService.setMessage("请选择类目", 'warning');
                                return;
                            }
                            if (vm.priceType == 1 && commonTool.isEmpty(vm.newPurchase.expectNum)) {
                                $rootScope.alertMsgService.setMessage("请填写 Purchase quantity", 'warning');
                                return;
                            }

                            if (vm.priceType == 1 && commonTool.isEmpty(vm.newPurchase.expectUnit)) {
                                $rootScope.alertMsgService.setMessage("请填写 Purchase quantity", 'warning');
                                return;
                            }

                            vm.toolData.isDoing = true;
                            // 附件
                            var fileNames = [],
                                fileUrls = [];
                            angular.forEach(vm.toolData.attachmentFiles, function(it) {
                                    fileNames.push(it.filename);
                                    fileUrls.push(it.uploadurl);
                                })
                                // 期望
                            var expects = [];
                            angular.forEach(vm.toolData.expectations, function(it) {
                                if (it.checked) {
                                    expects.push(it.name);
                                }
                            })
                            if (vm.toolData.expectationsOther.checked && vm.toolData.expectationsOther.value.length > 0) {
                                expects.push(vm.toolData.expectationsOther.value);
                            }
                            // 卖家资质
                            var supplierMarks = [];
                            angular.forEach(vm.toolData.supplierRequires, function(it) {
                                if (it.checked) {
                                    supplierMarks.push(it.name);
                                }
                            })

                            //要提交的参数
                            var params = {};
                            var keys = [
                                'publisherId',
                                'productCategoryId',
                                'productName',
                                'productDes',
                                'expectUnit',
                                'portOfArrival',
                                // 'attachmentName',
                                // 'attachmentUrl',
                                // 'expect',
                                // 'supplierRequired',
                                'expectPriceUnit',
                                'expectNum',
                                'endTime',
                                'trading',
                                'expectPrice',
                                'procurementId',
                                'paymentMethod'
                            ];
                            for (var i = 0, l = keys.length; i < l; i++) {
                                var key = keys[i];
                                if (vm.newPurchase.hasOwnProperty(key)) {
                                    params[key] = vm.newPurchase[key];
                                }
                            }
                            params.attachmentName = fileNames.join(',');
                            params.attachmentUrl = fileUrls.join(',');
                            params.expect = expects.join(',');
                            params.supplierRequired = supplierMarks.join(',');
                            params.boothProcurement = vm.newPurchase.boothProcurement ? 1 : 0;
                            params.productDes = $('#productDes').val();

                            if (vm.priceType == 1) {
                                params.moq = 0;
                            } else {
                                params.moq = 1;
                                params.expectNum = '';
                                params.expectUnit = '';
                            }

                            console.log(params);
                            // 更新到数据库
                            purchaseService.updatePurchase(params).success(function(rs) {
                                vm.toolData.isDoing = false;
                                if (rs.status == 'success') {
                                    // 保存成功，关闭弹窗，刷新详情页
                                    $rootScope.alertMsgService.setMessage("修改成功.");
                                    $scope.closeThisDialog();
                                    tools.getPurchaseDetail();
                                } else {
                                    $rootScope.alertMsgService.setMessage("修改失败", 'warning');
                                }
                            })
                        }

                        tools = $.extend(tools, {
                            getPropMatchArray: function() {
                                var categoryId = $rootScope.selectedCategory.categoryId;
                                addpurchaseService.getCategoryProperties({
                                    'lastCategoryId': categoryId
                                }).success(function(data) {
                                    console.log(data);
                                    propMatchArray = data.data.properties;
                                    vm.propMatchArray = propMatchArray;
                                })

                            },
                            isEmpty: function(param) {
                                if (param == null || param == undefined || param == '') {
                                    return true;
                                }
                                return false;
                            },
                            //
                            setPropTips: function() {
                                if (propMatchArray == null || propMatchArray == undefined || propMatchArray.length <= 0) {
                                    $(TEXTAREA_TIPS_DOM).css("display", "block");
                                    $(TEXTAREA_TIPS_DOM).find('p').remove();
                                    $(TEXTAREA_TIPS_DOM).append(TEXTAREA_TIPS_COMMON_HTML);
                                    return;
                                }
                                var tmpPropTipsHtml = '';
                                tmpPropTipsHtml += TEXTAREA_TIPS_HEAD_HTML;
                                for (var i = 0, len = propMatchArray.length; i < len; i++) {
                                    var item = propMatchArray[i];
                                    tmpPropTipsHtml += '<p>' + item.propertyEnName + '</p>'
                                }
                                $(TEXTAREA_TIPS_DOM).find('p').remove();
                                $(TEXTAREA_TIPS_DOM).append(tmpPropTipsHtml);
                            },
                            // 
                            getCursorPosition: function() {
                                var oTxt1 = document.getElementById(textareaId);
                                var cursurPosition = -1;
                                if (oTxt1.selectionStart) {
                                    // 非IE浏览器
                                    cursurPosition = oTxt1.selectionStart;
                                } else {
                                    // IE
                                    var range = document.selection.createRange();
                                    range.moveStart("character", -oTxt1.value.length);
                                    cursurPosition = range.text.length;
                                }
                                return cursurPosition;
                            },
                            MoveCursortoPos: function(pos) {
                                //定位光标到某个位置    
                                var obj = document.getElementById(textareaId);
                                pos = pos ? pos : obj.value.length;
                                if (obj.createTextRange) {
                                    var range = obj.createTextRange();
                                    range.moveStart("character", pos);
                                    range.collapse(true);
                                    range.select();
                                } else {
                                    obj.setSelectionRange(obj.value.length, pos);
                                }
                                obj.focus();
                            },
                            // 判断是否是字母
                            isLetter: function(value) {
                                return /[a-zA-Z]/g.test(value);
                            },
                            // 根据特殊字符切割文本
                            getSplitArray: function(param) {
                                return param.match(/[a-zA-Z]{1,}/g);
                            },

                            getPosition: function(str) {
                                var myPosition = {
                                    // 宽是通过计算 换行符切割 数组的最后一个 的字符串 到光标的 距离
                                    x: 0,
                                    // 高是通过换行符的个数来计算
                                    y: 0
                                }
                                if (/\n/g.test(str)) {
                                    myPosition.y = str.match(/\n/ig).length;
                                } else {
                                    myPosition.y = 0;
                                }

                                // console.log(myPosition);
                                if (myPosition.y >= 1) {
                                    var target_index = str.lastIndexOf(str.match(/\n/ig)[0]);
                                    myPosition.x = str.length - target_index - 1;
                                } else {
                                    myPosition.x = str.length;
                                }

                                return myPosition;
                            },
                            getStrBeforeCursor: function() {
                                return $(TEXTAREA_DOM).val().substring(0, this.getCursorPosition());
                            },
                            getPropMathKeyList: function(target_str, targetPosition) {
                                if ($(MATCH_KEY_DOM).length) $(MATCH_KEY_DOM).remove();
                                if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();
                                if (propMatchArray == null || propMatchArray.length <= 0) {
                                    return;
                                }
                                var matchKeyArray = [];

                                for (var i = 0; i < propMatchArray.length; i++) {
                                    var item = propMatchArray[i];
                                    if (item.propertyEnName.toLowerCase().indexOf(target_str.toLowerCase()) == 0) {
                                        matchKeyArray.push(item.propertyEnName);
                                    }
                                }

                                if (matchKeyArray.length <= 0) return;

                                var mathKeyHtml = '';
                                mathKeyHtml += '<ul class="match-key-list"' + 'data-str="' + target_str + '"' + '>';
                                for (var i = 0; i < matchKeyArray.length; i++) {
                                    var item = matchKeyArray[i];
                                    mathKeyHtml += '  <li>' + item + '</li>';
                                }
                                mathKeyHtml += ' </ul>';

                                $('.form-desc').append(mathKeyHtml);
                                $(MATCH_KEY_DOM).css({
                                    top: 50 + targetPosition.y * 20 + 'px',
                                    left: $('.form-desc label').outerWidth() + 35 + targetPosition.x * 5 + 'px'
                                });

                                $(MATCH_KEY_DOM).find('li').eq(0).addClass('active');

                                $(MATCH_KEY_DOM).find('li').on('click', function(event) {
                                    var tmp_str = $(MATCH_KEY_DOM).attr('data-str');
                                    var exchange_str = $(this).text();
                                    tools.exchangeKeyStr(tmp_str, exchange_str);
                                });
                            },
                            // 按照最后一个匹配的字符串来替换
                            replaceOfLastMatch: function(target, substr, replacement) {
                                return target.substring(0, target.lastIndexOf(substr)) + replacement + target.substring(target.lastIndexOf(substr) + substr.length, target.length);
                            },

                            exchangeKeyStr: function(substr, replacement) {
                                // 替换符合
                                var sub_textAreaVal = this.replaceOfLastMatch(this.getStrBeforeCursor(), substr, replacement);

                                sub_textAreaVal += $(MATCH_KEY_DOM).length ? ' : ' : ' ';

                                // 替换文本
                                var tmp_textAreaVal = $(TEXTAREA_DOM).val().replace(target_textAreaVal, sub_textAreaVal);
                                // 赋值
                                $(TEXTAREA_DOM).val(tmp_textAreaVal);



                                this.MoveCursortoPos(sub_textAreaVal.length + 1);
                                target_textAreaVal = sub_textAreaVal;

                                if ($(MATCH_KEY_DOM).length) {
                                    $(MATCH_KEY_DOM).remove();
                                    this.showPropMathValue(replacement, sub_textAreaVal);
                                } else {
                                    if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();
                                }

                                return true;
                            },
                            getMatchPropValueArray: function(replacement) {
                                for (var i = 0, len = propMatchArray.length; i < len; i++) {
                                    var item = propMatchArray[i];
                                    if (item.propertyEnName == replacement) {
                                        return item.propertyValues;
                                    }
                                }
                                return [];
                            },
                            showPropMathValue: function(replacement, sub_textAreaVal) {
                                if ($(MATCH_KEY_DOM).length) $(MATCH_KEY_DOM).remove();
                                if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();

                                var matchValArray = this.getMatchPropValueArray(replacement);
                                if (matchValArray.length <= 0) return;
                                var position = this.getPosition(sub_textAreaVal);
                                var mathValHtml = '';
                                mathValHtml += '<ul class="match-val-list"' + 'data-str="' + '' + '"' + '>';
                                for (var i = 0; i < matchValArray.length; i++) {
                                    var item = matchValArray[i];
                                    mathValHtml += '  <li>' + item.propertyValueEn + '</li>';
                                }
                                mathValHtml += ' </ul>';
                                $('.form-desc').append(mathValHtml);
                                $(MATCH_VAL_DOM).find('li').eq(0).addClass('active');
                                $(MATCH_VAL_DOM).css({
                                    top: 50 + position.y * 20 + 'px',
                                    left: $('.form-desc label').outerWidth() + 35 + position.x * 5 + 'px'
                                });
                                $(MATCH_VAL_DOM).find('li').on('click', function(event) {
                                    var exchange_str = $(this).text();
                                    tools.exchangeKeyStr('', exchange_str);
                                });

                            },
                            checkKeyboardEnter: function(event) {
                                if (!$(MATCH_KEY_DOM).length && !$(MATCH_VAL_DOM).length) return false;

                                var DOM = $(MATCH_KEY_DOM).length ? MATCH_KEY_DOM : MATCH_VAL_DOM;
                                var tmp_str = $(DOM).attr('data-str');
                                var exchange_str = $(DOM).find('.active').html();
                                tools.exchangeKeyStr(tmp_str, exchange_str);
                                event.preventDefault();
                                return true;
                            },
                            checkKeyboardUpOrDown: function(event) {
                                if (!$(MATCH_KEY_DOM).length && !$(MATCH_VAL_DOM).length) return false;

                                var DOM = $(MATCH_KEY_DOM).length ? MATCH_KEY_DOM : MATCH_VAL_DOM;
                                var matchKeyArray = $(DOM).find('li');
                                var currentIndex = matchKeyArray.index($(DOM).find('.active'));
                                var targetIndex = (event.keyCode == 40 ? currentIndex + 1 : currentIndex - 1 + matchKeyArray.length) % matchKeyArray.length;
                                matchKeyArray.eq(targetIndex).addClass('active').siblings('li').removeClass('active');
                                event.preventDefault();
                                return true;
                            },
                            checkKeyboardEsc: function(event) {
                                if ($(MATCH_KEY_DOM).length) $(MATCH_KEY_DOM).remove();
                                if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();
                                return true;;
                            },
                            checkKeyboardCode: function(event) {

                                var textAreaVal = $(TEXTAREA_DOM).val();

                                if (this.isEmpty(textAreaVal)) {
                                    if ($(MATCH_KEY_DOM).length) $(MATCH_KEY_DOM).remove();
                                    if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();
                                    return;
                                }

                                target_cursorPosition = parseInt(this.getCursorPosition());

                                target_textAreaVal = textAreaVal.substring(0, target_cursorPosition);

                                var lastLetter = target_textAreaVal.substring(target_textAreaVal.length - 1, target_textAreaVal.length);

                                if (!this.isLetter(lastLetter)) {
                                    // console.log('最后一个是特殊字符，不处理');
                                    if ($(MATCH_KEY_DOM).length) $(MATCH_KEY_DOM).remove();
                                    if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();
                                    return;
                                }

                                var splitArray = this.getSplitArray(target_textAreaVal);

                                if (splitArray.length <= 0) return;

                                var targetPosition = tools.getPosition(target_textAreaVal);
                                tools.getPropMathKeyList(splitArray[splitArray.length - 1], targetPosition);


                            }
                        })

                    }]
                })
            }

            // 相关采购需求
            tools.moreProcurement = function() {
                // 去列表页查该买家下的所有采购需求
                $window.open(path);
            }

            tools.open = function(path, isFile) {
                if (isFile) {
                    path = imgUrl + path;
                }
                $window.open(path);
            };

            // 添加供应商商机跟进记录
            tools.seller_followBusiness = function(id) {
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
            };
            // 添加供应商商机跟进记录 弹出层
            tools.seller_followBusinessConfirm = function(ids) {
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
                                'procurementIds': ids,
                                'followStatus': vm.seller_businessDlg.followStatus,
                                'content': vm.seller_businessDlg.content,
                                'userType': 1
                            };

                            if (commonTool.isEmpty(vm.seller_businessDlg.content)) {
                                $rootScope.alertMsgService.setMessage('请输入跟进内容', 'warning');
                                return;
                            }

                            purchaseService.saveBusinessTrace(params)
                                .success(function(data) {
                                    if ('success' === data.status) {
                                        tools.tab.getList();
                                        $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                        tools.close();
                                    } else {
                                        $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                    }
                                })
                        }

                    }]

                });
            };
            tools.checkChange = function() {
                vm.checkedItems = [];
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
            };
            // 添加采购商跟进记录
            tools.followBuyer = function(id) {
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
                tools.followBuyerConfirm(ids);
                vm.selectionItme = [];
                // vm.followContent = purchaseService.getFlolowDlgContent();
            };
            // 添加采购商跟进记录 弹出层
            tools.followBuyerConfirm = function(ids) {
                $scope.ids = ids;
                $scope.tools = tools;

                vm.buyerDlg = {
                    isFollowed: 1,
                    nonFollowInterval: 30,
                    followSignType: 1,
                    followSignWay: 1,
                    followSignWayArray: [],
                    followContent: ''
                };

                tools.followSignTypeChange();

                vm.followBuyerDlg = ngDialog.open({
                    template: 'followBuyerDlgId',
                    appendClassName: "dialog-activeM",
                    scope: $scope,
                    width: 780,
                    title: "添加采购商跟进记录",
                    controller: ['$scope', function($scope) {
                        var ids = $scope.ids;
                        var tools = $scope.tools;

                        $scope.submit = function() {
                            var params = {
                                buyerId: ids,
                                isFollowed: vm.buyerDlg.isFollowed,
                                nonFollowInterval: vm.buyerDlg.isFollowed == 1 ? null : vm.buyerDlg.nonFollowInterval,
                                followSignType: vm.buyerDlg.followSignType,
                                followSignWay: vm.buyerDlg.followSignWay,
                                followContent: vm.buyerDlg.followContent
                            };

                            purchaseService.followAdd(commonTool.filterParam(params))
                                .success(function(data) {
                                    if ('success' === data.status) {
                                        tools.tab.getList();
                                        $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                        tools.close();
                                    } else {
                                        $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                    }
                                })
                        }

                    }]

                });
            };
            // 跟进该采购商的商机
            tools.buyer_followBusiness = function(id) {
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
                tools.buyer_followBusinessConfirm(ids);
                vm.selectionItme = [];
                vm.followContent = purchaseService.getFlolowDlgContent();
            };
            // 批量跟进该采购商的所有商机 弹出层
            tools.buyer_followBusinessConfirm = function(procurementIds) {

                $scope.buyerId = tools.buyerId;
                $scope.procurementIds = procurementIds;
                $scope.type = 2;
                $scope.tools = tools;
                $scope.source = 'purchaseReqDetail';
                ngDialog.open({
                    appendClassName: "dialog-activeM",
                    scope: $scope,
                    animation: true,
                    width: 700,
                    templateUrl: '/controller/buyer/dialogTmp/followBusinessDlg.html',
                    controller: 'followBusRcdCtrl',
                    title: "跟进商机"
                })
            };
            tools.close = function() {
                vm.needNode = true;
                ngDialog.closeAll();
            };
            tools.resetSellerReplyInfo = function() {
                tabs.tabReply.paging.hasSendMsgBuyer = null;
                tabs.tabReply.paging.hasSendMsgSeller = null;
                tabs.tabReply.paging.isQuote = null;
                tabs.tabReply.paging.quoteAuditState = null;
                tabs.tabReply.paging.type = null;
            };

            // 供应商回复情况，系统匹配供应商（剔除），采购商跟进记录，供应商跟进记录 tab页

            var tabs = $scope.tabs = {};
            tabs.imgUrl = imgUrl;
            tabs.currentTab = "tabDetail";

            tabs.tabReply = {}, tabs.tabDeled = {}, tabs.tabBuyerFollow = {}, tabs.tabSellerFollow = {};
            tabs.tabReply.paging = tabs.tabDeled.paging = tabs.tabBuyerFollow.paging = tabs.tabSellerFollow.paging = {
                page: 1,
                pageSize: 10
            };
            // 分页条数:三个tab页共用
            vm.pages = commonService.setPageSizeArray(10, 30, 50);

            tools.tab = {
                // 1.查询条件初始化 [type 0 初次加载或tab切换，1 重置
                init: function(type, tabName) {
                    // console.log(11);
                    if (!commonTool.isEmpty(tabName)) {
                        tabs.currentTab = tabName;
                    }
                    if (type == 1) {
                        tabs[tabs.currentTab].paging.quoteType == '';
                        if (tabs.currentTab == 'tabReply') {
                            tabs[tabs.currentTab].paging.matchType = '';
                        }
                    }
                    // if(commonTool.isEmpty(tabs[tabs.currentTab].items)){
                    tools.tab.getList();
                    // }
                },
                getList: function() {
                    tabs[tabs.currentTab].paging.procurementId = tools.procurementId;
                    if (tabs.currentTab == 'tabDeled') {
                        purchaseService.getDeledSuppliers(commonTool.filterParam(tabs[tabs.currentTab].paging)).success(function(rs) {
                            if (rs.status == 'success') {
                                // console.log('tabDeled')
                                tabs[tabs.currentTab].items = rs.page.items;
                                tabs[tabs.currentTab].paging.total = rs.page.total;
                                tabs[tabs.currentTab].paging.maxPage = rs.page.maxPage;
                            }
                        })
                    } else if (tabs.currentTab == 'tabSellerFollow') {
                        paging.page = tabs[tabs.currentTab].paging.page;
                        paging.pageSize = tabs[tabs.currentTab].paging.pageSize;
                        var getBusinessTrace_purchase_paging = {
                            page: tabs[tabs.currentTab].paging.page,
                            // pageSize: tabs[tabs.currentTab].paging.pageSize,
                            pageSize: 500,
                            referTo: tabs[tabs.currentTab].paging.procurementId,
                            userType: 1
                        }
                        purchaseService.getBusinessTrace_purchase(getBusinessTrace_purchase_paging).success(function(rs) {
                            if (rs.status == 'success') {
                                tabs[tabs.currentTab].items = rs.page.items;
                                paging.total = tabs[tabs.currentTab].paging.total = rs.page.total;
                                tabs[tabs.currentTab].paging.maxPage = rs.page.maxPage;
                                if (rs.page.items != null) {
                                    tabs[tabs.currentTab].sellerId = rs.page.items[0].sellerId;
                                }
                            }
                        })
                    } else if (tabs.currentTab == 'tabBuyerFollow') {
                        paging.page = tabs[tabs.currentTab].paging.page;
                        paging.pageSize = tabs[tabs.currentTab].paging.pageSize;
                        // 获取采购商信息
                        var buyerFollowRecord_paging = {
                            page: tabs[tabs.currentTab].paging.page,
                            // pageSize: tabs[tabs.currentTab].paging.pageSize,
                            pageSize: 500,
                            buyerId: tools.buyerId
                        }
                        purchaseService.buyerFollowRecord(buyerFollowRecord_paging).success(function(rs) {
                                if (rs.status == 'success') {
                                    // tabs[tabs.currentTab].items = rs.page.items;
                                    // tabs[tabs.currentTab].paging.total = rs.page.total;
                                    // tabs[tabs.currentTab].paging.maxPage = rs.page.maxPage;
                                    tabs[tabs.currentTab].buyerId = tools.buyerId;
                                    tabs[tabs.currentTab].buyerFollowInfo = rs.data.buyerFollowInfo;
                                    tabs[tabs.currentTab].companyInfo = rs.data.companyInfo;
                                    tabs[tabs.currentTab].personInfo = rs.data.personInfo;
                                    tabs[tabs.currentTab].reversionRate = rs.data.reversionRate;
                                    tabs[tabs.currentTab].isMyFollow = rs.data.isMyFollow;
                                    vm.isMyFollow = rs.data.isMyFollow;
                                }
                            })
                            // 获取采购商商机跟进明细
                        var buyerBusinessDetail_paging = {
                            page: tabs[tabs.currentTab].paging.page,
                            pageSize: tabs[tabs.currentTab].paging.pageSize,
                            referTo: tabs[tabs.currentTab].paging.procurementId,
                            userType: 0
                        }
                        purchaseService.getBusinessTrace_purchase(buyerBusinessDetail_paging).success(function(rs) {
                            if (rs.status == 'success') {
                                tabs[tabs.currentTab].items = rs.page.items;
                                paging.total = tabs[tabs.currentTab].paging.total = rs.page.total;
                                tabs[tabs.currentTab].paging.maxPage = rs.page.maxPage;

                            }
                        })
                    } else if (tabs.currentTab == 'tabReply') {
                        if (tabs[tabs.currentTab].paging.hasSendMsgBuyer == null) {
                            if (search.hasSendMsgBuyer) {
                                tabs[tabs.currentTab].paging.hasSendMsgBuyer = parseInt(search.hasSendMsgBuyer);
                            }
                        }

                        if (tabs[tabs.currentTab].paging.hasSendMsgSeller == null) {
                            if (search.hasSendMsgSeller) {
                                tabs[tabs.currentTab].paging.hasSendMsgSeller = parseInt(search.hasSendMsgSeller);
                            }
                        }

                        if (tabs[tabs.currentTab].paging.isQuote == null) {
                            if (search.isQuote) {
                                tabs[tabs.currentTab].paging.isQuote = parseInt(search.isQuote);
                            }
                        }

                        if (tabs[tabs.currentTab].paging.quoteAuditState == null) {
                            if (search.quoteAuditState) {
                                tabs[tabs.currentTab].paging.quoteAuditState = parseInt(search.quoteAuditState);
                            }
                        }

                        if (tabs[tabs.currentTab].paging.type == null) {
                            if (search.type) {
                                tabs[tabs.currentTab].paging.type = parseInt(search.type);
                            }
                        }


                        var queryMatchSupplierReplyInfo_paging = {
                            hasSendMsgBuyer: tabs[tabs.currentTab].paging.hasSendMsgBuyer,
                            hasSendMsgSeller: tabs[tabs.currentTab].paging.hasSendMsgSeller,
                            isQuote: tabs[tabs.currentTab].paging.isQuote,
                            page: tabs[tabs.currentTab].paging.page,
                            pageSize: tabs[tabs.currentTab].paging.pageSize,
                            procurementId: tabs[tabs.currentTab].paging.procurementId,
                            quoteAuditState: tabs[tabs.currentTab].paging.quoteAuditState,
                            type: tabs[tabs.currentTab].paging.type
                        };
                        // 供应商回复情况
                        purchaseService.queryMatchSupplierReplyInfo(queryMatchSupplierReplyInfo_paging).success(function(rs) {
                            if (rs.status == 'success') {
                                tabs[tabs.currentTab].items = rs.page.items;
                                tabs[tabs.currentTab].paging.total = rs.page.total;
                                tabs[tabs.currentTab].paging.maxPage = rs.page.maxPage;
                                tabs[tabs.currentTab].zeroMatchReason = rs.data.zeroMatchReason == null && rs.data.zeroMatchReason == undefined ? null : rs.data.zeroMatchReason;
                            }
                        })
                    }
                },
                getnewpage: function(type) {
                    if (type == 1) { // 跳转到第几页
                        tabs[tabs.currentTab].paging.page = tabs[tabs.currentTab].newpage;
                        tabs[tabs.currentTab].newpage = null;
                    } else if (type == 0) { // 每页显示多少条切换时
                        tabs[tabs.currentTab].paging.page = 1;
                    }
                    tools.tab.getList();
                },
                getMessages: function(param) {
                    tabs.messages = [];
                    purchaseService.getContactMsg(param).success(function(rs) {
                        if (rs.status == 'success') {
                            tabs.messages = rs.data;
                            console.log(tabs.messages)
                        }
                    })
                },
                showMsgDialog: function(messageId) {
                    // messageId='55a03b7284ae1dbf7e565634'
                    // 获取站内信
                    var pm = {};

                    vm.globalMSId = messageId;
                    pm.messageId = messageId;
                    tools.tab.getMessages(pm);
                    ngDialog.open({
                        title: "站内信沟通内容",
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        templateUrl: '/controller/purchase/message.html',
                        width: 700
                            // controller: ['$scope',function($scope){

                        // }]

                    })
                },
                // 询盘详情——对话内容——询盘对话——刷新
                refreshMessageEmailState: function(item, messageId, isReply) {
                    if (messageId != null && messageId != undefined && messageId != '') {
                        var params = {
                            messageId: messageId,
                            isReply: isReply
                        }
                        purchaseService.refreshMessageEmailState(params)
                            .success(function(data) {
                                if (data.status == 'success') {
                                    var pm = {};
                                    pm.messageId = vm.globalMSId;
                                    tools.tab.getMessages(pm);
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
                reSendEmail(status) {

                    $scope.status = status;
                    $scope.messages = tabs.messages;

                    $scope.dialogMSId = vm.globalMSId;
                    vm.reSendEmailDlg = ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 600,
                        templateUrl: 'reSendConfirm',
                        controller: 'reSendEmailCtrl2'
                    })
                }

            };

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
            // 免跟进周期
            tools.nonFollowInterval = [{
                "title": "3天内",
                "key": 7
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
            // 供应商回复情况——类型
            tools.tabReplyType = [{
                key: 0,
                title: '匹配'
            }, {
                key: 1,
                title: '自主'
            }];
            // 供应商回复情况——报价情况
            tools.isQuote = [{
                key: 0,
                title: '未报价'
            }, {
                key: 1,
                title: '已报价'
            }];
            // 供应商回复情况——报价审核状态
            tools.quoteAuditState = [{
                key: 1,
                title: '待审核'
            }, {
                key: 2,
                title: '审核通过'
            }, {
                key: -1,
                title: '审核不通过'
            }];
            // 供应商回复情况——供应商已发消息
            tools.hasSendMsgSeller = [{
                key: 1,
                title: '是'
            }, {
                key: 0,
                title: '否'
            }];
            // 供应商回复情况——采购商已发消息
            tools.hasSendMsgBuyer = [{
                key: 1,
                title: '是'
            }, {
                key: 0,
                title: '否'
            }];
            tools.addDialog = function() {

                ngDialog.open({
                    template: "addSupplier.html",
                    title: "添加",
                    width: 980,
                    scope: $scope,
                    controller: ["$scope", '$rootScope', 'ngDialog', 'commonService', 'commonTool', function($scope, $rootScope, ngDialog, commonService, commonTool) {
                        vmdlg.pages = commonService.setPageSizeArray(10, 30, 50);
                        toolsdlg.newpagesize = null;

                        // 获取所有一级类目
                        if (commonTool.isEmpty(tools.categorys)) {
                            commonService.getAllCategorysOfLevel1().success(function(data) {
                                if ('success' == data.status) {
                                    tools.categorys = data.data;
                                } else {
                                    console.log("Get getAllCategorysOfLevel1 Fail");
                                }
                            });
                        }

                        // 类目选择
                        toolsdlg.selectCategory = function() {
                            vm.categoryTypeParam = 'forSearchType2';
                            var dialog = ngDialog.openConfirm({
                                template: './controller/purchase/dialogCategory.html',
                                controller: 'DialogCategoryCtrl',
                                width: 800,
                                title: '类目选择',
                                scope: $scope
                            }).then(function(yes) {
                                // console.log(yes);
                                pagingdlg.productCategory = vm.checkedCategoryRs.id;
                                pagingdlg.isBottom = (vm.checkedCategoryRs.isRoot ? 0 : 1);


                            }, function(no) {

                            });
                        }

                        function checkEmpty() {
                            if (!commonTool.isEmpty(pagingdlg.personDropdownValue)) return true;
                            if (!commonTool.isEmpty(pagingdlg.packageTypeId)) return true;
                            if (!commonTool.isEmpty(pagingdlg.exhibitionType)) return true;
                            if (!commonTool.isEmpty(pagingdlg.mainCategory)) return true;
                            if (!commonTool.isEmpty(pagingdlg.productCategory)) return true;
                            if (!commonTool.isEmpty(pagingdlg.exportArea)) return true;
                            return false;
                        }
                        toolsdlg.getSuppliers = function() {
                                if (checkEmpty() == false) {
                                    $rootScope.alertMsgService.setMessage("至少填写一个搜索条件！", 'warning');
                                    return;
                                }
                                vmdlg.isSearching = true;
                                purchaseService.getPchsQrySuppliers(commonTool.filterParam(pagingdlg)).success(function(data) {
                                    vmdlg.isSearching = false;
                                    if ('success' == data.status) {
                                        vmdlg.items = data.page.items;
                                        pagingdlg.total = data.page.total;
                                        vmdlg.checkedDatas = [];
                                    }
                                }).error(function(rs) {
                                    vmdlg.isSearching = false;
                                })


                            }
                            /**
                             * 查询条件重置
                             * @return {[type]} [description]
                             */
                        toolsdlg.reset = function() {
                            pagingdlg = $scope.pagingdlg = {};
                            pagingdlg.page = 1;
                            pagingdlg.pageSize = 10;
                            pagingdlg.personDropdownType = '0';
                            if (!commonTool.isEmpty(vm.checkedCategoryRs)) {
                                vm.checkedCategoryRs.name = '';
                                vm.checkedCategoryRs.id = '';
                            }
                            pagingdlg.productCategory = ''
                        }

                        // 分页组件
                        toolsdlg.getnewpage = function(type) {
                            if (type == 1) { // 跳转到第几页
                                pagingdlg.page = toolsdlg.newpagesize;
                                toolsdlg.newpagesize = null;
                            } else if (type == 0) { // 每页显示多少条切换时
                                pagingdlg.page = 1;
                            }
                            toolsdlg.getSuppliers();
                        }

                        // 全选 checkbox
                        toolsdlg.toggleCheckAll = function(ischecked) {
                            vmdlg.checkedDatas = [];
                            angular.forEach(vmdlg.items, function(item) {
                                if (commonTool.isEmpty(item.inqueryUUID)) {
                                    item.$checked = ischecked;
                                    if (true === ischecked) {
                                        // 添加整条记录
                                        vmdlg.checkedDatas.push(item);
                                    }
                                }
                            });
                        };

                        // 单个checkbox
                        toolsdlg.setCheckedData = function() {
                            var selectionItem = [];
                            angular.forEach(vmdlg.items, function(item) {
                                if (true === item.$checked) {
                                    selectionItem.push(item);
                                }
                            });
                            vmdlg.checkedDatas = selectionItem;
                        }


                        // 关闭
                        toolsdlg.closeAddDialog = function() {
                                $scope.closeThisDialog();
                            }
                            // 确认
                        toolsdlg.add = function() {
                            tools.addToIntervenes();
                            vmdlg.checkedDatas = [];
                        };
                    }]
                })
            };
            tools.addToIntervenes = function() {
                var checkedItems = vmdlg.checkedDatas;

                var existCompNames = [];
                var existFlag = null;
                // 合并到干预匹配结果列表中去
                // vm.viewItems and vmdlg.checkedDatas
                angular.forEach(checkedItems, function(addIt) {
                    addIt.$checked = false;
                    existFlag = false;
                    angular.forEach(vm.viewItems, function(it) {
                        if (!existFlag && it[vm.keyName] == addIt[vm.keyName]) {
                            // 记录已存在可视列表中的
                            existCompNames.push(addIt[vm.keyName]);
                            existFlag = true;
                            // break; 不支持
                        }
                    });
                    if (!existFlag) {
                        delete addIt['$checked']
                        addIt.procurementId = tools.procurementId;
                        vm.viewItems.push(addIt);
                    }
                });

                if (existCompNames.length == 0) {
                    vm.isAllChecked = false;
                    $rootScope.alertMsgService.setMessage("操作成功。", 'success');
                } else {
                    $rootScope.alertMsgService.setMessage("操作成功。" + existCompNames.join(',') + '是重复添加的供应商.', 'success');
                }
                checkedItems = [];
                // console .log(1)
                // vmdlg.checkedDatas =[];
            };
            tools.deLFromIntervene = function(index) {
                ngDialog.openConfirm({
                    confirmInfo: "确认删除？",
                    title: "操作提示"
                }).then(function(yes) {
                    vm.viewItems.splice(index, 1);
                }, function(no) {
                    // 取消
                });
            };
            tools.interveneCommit = function() {
                // 整理提交的数据 vm.sysItems vm.viewItems
                // var isInOld = false;
                var addItems = [];

                addItems = vm.viewItems;

                var ids = [];
                var repeatCount = 0;
                var totalCount = addItems.length;
                angular.forEach(addItems, function(addIt) {
                    ids.push(addIt.sellerId);
                })

                // 禁用按钮
                vmdlg.isdisabled = true;

                // 提交数据到后台
                var checkExistParam = {
                    procurementId: tools.procurementId,
                    sellerIds: ids.join(',')
                }

                // 检测是否该供应商是否存在列表中
                purchaseService.isExistSupplierList(checkExistParam).success(function(data) {
                    if (data.data != null) {
                        if (data.data.length > 0) {
                            // 根据接口返回数据删除重复的记录
                            for (var i = 0; i < addItems.length; i++) {
                                addItems[i].procurementId = tools.procurementId;
                                for (var k = 0; k < data.data.length; k++) {
                                    if (addItems[i].sellerId == data.data[k].sellerId && data.data[k].isExist == 1) {
                                        addItems.splice(i, 1);
                                        repeatCount += 1;
                                    }
                                }
                            }

                            var param = {
                                procurementId: tools.procurementId,
                                itemsAdd: JSON.stringify(addItems)
                            }

                            if (addItems.length > 0) {
                                purchaseService.confirmManualMatchAgain(param).success(function(data) {
                                    if ('success' == data.status) {
                                        vmdlg.isdisabled = false;
                                        $rootScope.alertMsgService.setMessage('操作成功');
                                        var alertStr = repeatCount > 0 ? '操作成功（成功添加' + (totalCount - repeatCount) + '条，' + repeatCount + '条重复不作处理）' : '操作成功！'
                                        $rootScope.alertMsgService.setMessage(alertStr, 'success');
                                        tools.tab.getList();
                                        vm.viewItems = [];
                                    } else {
                                        vmdlg.isdisabled = false;
                                        $rootScope.alertMsgService.setMessage('操作失败，原因：' + data.message, 'warning');
                                    }
                                })
                            } else {
                                vmdlg.isdisabled = false;
                                $rootScope.alertMsgService.setMessage("添加的供应商已存在列表中", 'warning');
                            }
                        } else {
                            vmdlg.isdisabled = false;
                            $rootScope.alertMsgService.setMessage("接口返回数据数组长度为0", 'warning');
                        }
                    } else {
                        vmdlg.isdisabled = false;
                        $rootScope.alertMsgService.setMessage("接口返回数据字段为空", 'warning');
                    }
                })



            }
            tools.showRepeatTable = function() {
                if (vm.showRepeatTable != 1) {
                    vm.showRepeatTable = 1;
                } else {
                    vm.showRepeatTable = 0;
                }

                if (vm.showRepeatTable == 1) {
                    tools.getRepeatTable();
                }
            }
            tools.getRepeatTable = function() {
                    var params = {
                        procurementId: tools.procurementId
                    }
                    purchaseService.findRepeatProcurements(params).success(function(rs) {
                        if (rs.status == 'success') {
                            vm.repeatList = rs.data;
                        } else {
                            $rootScope.alertMsgService.setMessage("获取重复列表失败 " + rs.message, 'warning');
                        }
                    })
                }
                // 跳转采购详情页面
            tools.showDetail = function(purchaseId) {
                $window.open('#/purchase/purchaseReqDetail?purchaseId=' + purchaseId);
            };
        }
    ])

    // 审核控制器
    .controller('PurchaseAuditCtrl', ['$scope', '$rootScope', 'purchaseService', function($scope, $rootScope, purchaseService) {
        var confVm = $scope.confVm = {};
        var vm = $scope.vm = {};
        angular.extend(confVm, $scope.auditData);
        // 弹出层控制
        var vmdlg = $scope.vmdlg = {};

        /*
         * 控制页面显示
         */
        if (confVm.auditState == 3) { // 不通过
            vm.title = "审核不通过信息";
            vm.chkReasons = [];
            vm.chkReasons[0] = {
                "zh": "带有异常链接",
                "en": "Content contains external links"
            };
            vm.chkReasons[1] = {
                "zh": "带有敏感词",
                "en": "Content contains sensitive words"
            };
            vm.chkReasons[2] = {
                "zh": "含其他同行电商信息",
                "en": "Content contains information related to other e-commerce platform"
            };
            vm.chkReasons[3] = {
                "zh": "发布内容为销售/推广产品信息",
                "en": "Selling leads or promotional information"
            };
            vm.chkReasons[4] = {
                "zh": "内容侵犯版权或知识权、含任何人身攻击或恶意的评论或任何政治或宗教讨论",
                "en": "Content contains personal attacks, hostile comments or political or religious discussions"
            };
            vm.chkReasons[5] = {
                "zh": "内容不符",
                "en": "Inappropriate content"
            };
            vm.chkReasons[6] = {
                "zh": "需求内容不清晰",
                "en": "Unclear request"
            };
            vm.chkReasons[7] = {
                "zh": "产品分类错误",
                "en": "Unmatched product category"
            };
            vm.chkReasons[8] = {
                "zh": "频密发送",
                "en": "Launched frequently / Repeated"
            };
            vm.chkReasons[9] = {
                "zh": "其他",
                "en": "0"
            };
            vm.chkReason = {};
        } else {
            confVm.quality = 2;
        }


        $scope.checkChange = function() {
            vm.checkedItems = [];
            vm.needNode = false;
            angular.forEach(vm.chkReasons, function(item) {
                if (item.$checked === true) {
                    if (item.en == '0') {
                        vm.needNode = true;
                    } else {
                        vm.checkedItems.push(item.en);
                    }
                }
            });
        }
        $scope.save = function(isValid) {
            if (confVm.auditState == 3) {
                var tel = /^[\w\s`~!@#$%^&*()_+\-=[\]{}\\|;':"/,.?]*$/ig;
                if (!tel.test(vm.note)) {
                    $rootScope.alertMsgService.setMessage("备注信息必须是英文或英文字符", 'info');
                    return;
                } else if ((vm.checkedItems == null || vm.checkedItems.length == 0) && vm.needNode != true) {
                    $rootScope.alertMsgService.setMessage("请选择原因", 'info');
                    return;
                } else if (vm.needNode == true) {
                    if (vm.note == null || vm.note.length < 1) {
                        $rootScope.alertMsgService.setMessage("原因选有【其他】时，备注必填", 'info');
                        return;
                    } else {
                        vm.checkedItems.push(vm.note);
                    }
                } else if (vm.note != "null" && vm.note != undefined && vm.note.length > 1) {
                    vm.checkedItems.push(vm.note);
                }
                if (isValid == false) {
                    return;
                }
                confVm.reason = vm.checkedItems.join(";");

            }
            // console.log(confVm);
            var param = angular.copy(confVm);
            delete param['tabName'];
            vmdlg.isdisabled = true;
            purchaseService.chgPurchaseStatus(param).success(function(data) {
                if (data.status == "success") {
                    vmdlg.isdisabled = false;
                    $rootScope.alertMsgService.setMessage("审核操作成功");
                    $scope.confirm();
                } else {
                    vmdlg.isdisabled = false;
                    $rootScope.alertMsgService.setMessage(data.message, 'warning');
                }
            })

        }
        $scope.close = function() {
            $scope.closeThisDialog();
        }
    }])

    //采购需求匹配管理列表页面控制器
    .controller('PurchaseMatchListCtrl', ['$scope', '$rootScope', '$controller', '$window', 'purchaseService', 'commonService', 'commonTool',
        function($scope, $rootScope, $controller, $window, purchaseService, commonService, commonTool) {
            $controller('baseListController', {
                $scope: $scope
            });
            var vm = $scope.vm;
            var tools = $scope.tools;
            var paging = $scope.paging = {};
            vm.unMatchReasonArr = [];

            function isInteger(value) {
                var reg = /^[0-9]*[1-9][0-9]*$/;
                return reg.test(value);
            }

            /* 查询条件里的select数据*/
            tools.setInitData = function() {
                vm.sellerArray = [];
                purchaseService.getAuditorList({
                    roleName: '卖家组'
                }).success(function(data) {
                    vm.sellerArray = 'success' === data.status ? data.page.items : [];
                })

                // 获取采购需求来源
                purchaseService.getPurchaseSource().success(function(data) {
                    if ('success' == data.status) {
                        tools.purchaseSources = data.data;
                    } else {
                        console.log("Get Purchase Source Fail");
                    }
                })

                // 获取国家列表
                purchaseService.getCountries().success(function(data) {
                    if ('success' == data.status) {
                        tools.countries = data.data;
                    } else {
                        console.log("Get Countries Fail");
                    }
                });

                // 获取所有一级类目
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if ('success' == data.status) {
                        tools.categorys = data.data;
                    } else {
                        console.log("Get getAllCategorysOfLevel1 Fail");
                    }
                });
                /* [[-日期 */
                tools.start = {
                    format: 'YYYY/MM/DD',
                    choose: function(dates) { //选择好日期的回调
                        tools.end.min = dates;
                    }

                };
                $('body,html').on("click", '#startTime', function() {
                    laydate(tools.start);
                });
                tools.end = {
                    format: 'YYYY/MM/DD',
                    choose: function(dates) { //选择好日期的回调
                        tools.start.max = dates;
                    }
                };
                // 页面的id需与此处的保持一致！！
                $('body,html').on("click", '#endTime', function() {
                    laydate(tools.end);
                });
                /* 日期-]] */

                tools.baseInit();
            }

            tools.setInitData();

            // 获取零匹配原因选择项目
            tools.getZeroMatchReason = function() {
                purchaseService.getZeroMatchReason().success(function(data) {
                    if ('success' == data.status) {
                        vm.unMatchReasonArr = data.data;
                    }
                })
            }

            // 获取采购列表
            tools.getPurchaseMatchList = function() {
                paging.tabName = tools.currentTab;
                // 查询条件 status 
                if (tools.currentTab == 'waitDeal') {
                    paging.resultType = '';
                } else if (tools.currentTab == 'dealHasResult') {
                    paging.resultType = 1;
                } else if (tools.currentTab == 'dealNoResult') {
                    paging.resultType = 0;
                }
                if (!commonTool.isEmpty(paging.matchQtyStart) && !isInteger(paging.matchQtyStart)) {
                    $rootScope.alertMsgService.setMessage("只能输入正整数");
                    return;
                }
                if (!commonTool.isEmpty(paging.matchQtyEnd) && !isInteger(paging.matchQtyEnd)) {
                    $rootScope.alertMsgService.setMessage("只能输入正整数");
                    return;
                }
                if (!commonTool.isEmpty(paging.matchQtyEnd) && !commonTool.isEmpty(paging.matchQtyEnd) && paging.matchQtyEnd < paging.matchQtyStart) {
                    $rootScope.alertMsgService.setMessage("匹配结果后面数字要大于等于前面数字");
                    return;
                }

                purchaseService.getPchsMatchList(commonTool.filterParam(paging)).success(function(data) {
                    if (data.status === 'success' && data.data.tabName === tools.currentTab) {
                        tools.items = data.page.items;
                        paging.total = data.page.total;
                    }

                });
            };

            // 1.查询条件初始化 [type 0 初次加载或tab切换，1 重置
            tools.initTab = function(type, tabName) {
                // 重置条件
                paging = $scope.paging = purchaseService.getMatchListPage();

                if (type == 0) {
                    // 当前tab名
                    tools.currentTab = tabName;
                    // 转到第几页
                    tools.items = null;
                    tools.newpage = null;
                    tools.getPurchaseMatchList();

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
                tools.getPurchaseMatchList();
            }

            tools.toDetail = function(id) {
                $window.open("/#/purchase/purchaseReqDetail?purchaseId=" + id);
                // $window.open("/#/purchase/purchaseMatchDetail?fromList=1&procurementId="+id);
            };
            tools.toInterveneMatch = function(id) {
                $window.open("/#/purchase/purchaseMatchIntervene?procurementId=" + id);
            };
            tools.getSecondSource = function() {
                if (commonTool.isEmpty(paging.source)) {
                    vm.secondSourceArray = [];
                    return;
                }
                var tmpObj = {
                    sourceType: 3,
                    source: paging.source
                };
                commonService.getSecondSourceType(tmpObj).success(function(data) {
                    if ('success' === data.status) {
                        vm.secondSourceArray = data.data;
                    } else {
                        console.log('error');
                    }
                })
            };

            // 获取零匹配原因
            tools.getZeroMatchReason();
        }
    ])

    // 采购需求匹配详情页面控制器
    .controller('PurchaseMatchDetailCtrl', ['$scope', '$rootScope', '$window', '$location', 'ngDialog', 'purchaseService', 'commonTool',
        function($scope, $rootScope, $window, $location, ngDialog, purchaseService, commonTool) {

            var tools = $scope.tools = {};
            // 获取采购ID
            tools.procurementId = $location.search().procurementId;
            tools.fromList = $location.search().fromList;

            var vm = $scope.vm = {};
            vm.tabDetail = {};
            vm.tabSysResult = {};
            vm.toInterveneResult = {};
            vm.activeTab = 0;

            if (!tools.fromList) {
                // 从干预匹配页回来的，要默认赞中tab3
                vm.activeTab = 2;
                // console.log("从干预匹配页回来的，要默认赞中tab3");
            }


            // 获取买家详情
            tools.getPurchaseDetail = function() {
                // 存数据的对象有数据时，不再重新加载
                if (!commonTool.isEmptyObject(vm.tabDetail)) {
                    return;
                }
                purchaseService.getPurchaseDetail({
                    'procurementId': tools.procurementId
                }).success(function(data) {
                    if ('success' == data.status) {
                        vm.tabDetail.item = data.data.detailInfo;
                        vm.tabDetail.buyer = data.data.buyerInfo;
                        vm.tabDetail.auditList = data.data.auditList;
                        vm.tabDetail.company = data.data.companyInfo;

                        // 附件列表
                        if (vm.tabDetail.item.attachmentUrl.length > 0) {
                            var _arr = [];
                            vm.tabDetail.item.attachmentUrl.split(',').forEach(function(str) {
                                _arr.push(imgUrl + str);
                            })
                            vm.tabDetail.item.attachmentUrl = _arr;
                        }

                        // 最后审核人，时间
                        vm.tabDetail.item.lastAuditor = '';
                        vm.tabDetail.item.lastAuditTime = '';
                        if (vm.tabDetail.auditList.length > 0) {
                            vm.tabDetail.item.lastAuditor = vm.tabDetail.auditList[0].auditor;
                            vm.tabDetail.item.lastAuditTime = vm.tabDetail.auditList[0].auditTime;
                        }
                    } else {
                        alert("请更新索引");
                    }
                })
            };

            // 系统匹配结果
            tools.getPurchaseSysResult = function() {
                purchaseService.getPchsMatchSuppliers({
                    'procurementId': tools.procurementId,
                    'matchType': 0 // 标识系统匹配
                }).success(function(data) {
                    if ('success' == data.status) {
                        vm.tabSysResult.items = data.page.items;
                    }
                })
                console.log("加臷系统匹配结果");
            };
            // 干预匹配结果
            tools.getPurchaseInterveneResult = function() {
                purchaseService.getPchsMatchSuppliers({
                    'procurementId': tools.procurementId,
                    'matchType': 1 // 标识系统匹配
                }).success(function(data) {
                    if ('success' == data.status) {
                        vm.toInterveneResult.items = data.page.items;
                    }
                })

            };
            // 当前页打开干预匹配页面
            tools.toIntervenePage = function() {
                $location.path('/purchase/purchaseMatchIntervene').search({
                    'fromDetail': 1,
                    'procurementId': tools.procurementId
                });
            }


            tools.open = function(path) {
                $window.open(path);
            };
        }
    ])

    // 采购需求干预-控制器
    .controller('PurchaseMatchInterveneCtrl', ['$scope', '$rootScope', '$window', '$location', 'ngDialog', 'purchaseService', 'commonService', 'commonTool',
        function($scope, $rootScope, $window, $location, ngDialog, purchaseService, commonService, commonTool) {

            var tools = $scope.tools = {};
            // 获取采购ID
            tools.procurementId = $location.search().procurementId;
            var vm = $scope.vm = {};
            vm.keyName = "sellerId";
            vm.viewItems = []; // 存放临时干预匹配结果
            vm.unMatchReasonArr = []; // 存放零匹配原因
            vm.unMatchReason = null;
            vm.needNode = true;

            var paging = null;

            // 添加弹窗里的数据--因需求要保存页面
            tools.categorys = null;
            var vmdlg = $scope.vmdlg = {};
            var toolsdlg = $scope.toolsdlg = {};
            var pagingdlg = $scope.pagingdlg = {
                page: 1,
                pageSize: 10,
                personDropdownType: '0'
            };

            // 按钮状态控制
            vmdlg.isdisabled = false;

            // 系统匹配结果 ,带分页
            tools.getPurchaseSysResult = function() {
                purchaseService.getPchsMatchSuppliers(commonTool.filterParam(paging)).success(function(data) {
                    if ('success' == data.status) {
                        vm.sysItems = data.page.items;
                        paging.total = data.page.total;
                        vm.checkedDatas = [];
                    }
                })
            };
            tools.init = function(isReset) {
                paging = $scope.paging = {
                    'productNumRange': '',
                    'latestLoginTimeNumber': '',
                    'sortName': 'weight',
                    'sortOrder': 'DESC',
                    'procurementId': tools.procurementId,
                    'matchType': 0, // 标识系统匹配
                    'pageSize': 10,
                    'page': 1
                }
                if (!isReset) {
                    tools.getPurchaseSysResult();
                    vm.sortNames = [{
                        'value': '默认排序',
                        'key': 'weight'
                    }, {
                        'value': '上架商品数由大到小',
                        'key': 'productQty'
                    }, {
                        'value': '近30天登录数由大到小',
                        'key': 'login_times'
                    }, {
                        'value': '最近登录时间由近到远',
                        'key': 'latest_login_time'
                    }];
                    vm.latestLoginTimeNumbers = [{
                        'value': '3日内',
                        'key': '3'
                    }, {
                        'value': '7日内',
                        'key': "7"
                    }, {
                        'value': '15日内',
                        'key': '15'
                    }, {
                        'value': '30日内',
                        'key': '30'
                    }, {
                        'value': '90日内',
                        'key': '90'
                    }, {
                        'value': '90日未登陆',
                        'key': '-90'
                    }]
                    vm.productNumRanges = [{
                        'value': '0-5',
                        'key': '0-5'
                    }, {
                        'value': '6-10',
                        'key': '6-10'
                    }, {
                        'value': '11-20',
                        'key': '11-20'
                    }, {
                        'value': '21-50',
                        'key': '21-50'
                    }, {
                        'value': '50以上',
                        'key': '50-'
                    }, ];
                    // 分页
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);
                }
                tools.getZeroMatchReason();
            }

            tools.getnewpage = function(type) {
                    if (type == 1) { // 跳转到第几页
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) { // 每页显示多少条切换时
                        paging.page = 1;
                    }
                    tools.getPurchaseSysResult();
                },



                // 批量选择
                tools.toggleCheckAll = function(ischecked) {
                    vm.checkedDatas = [];
                    angular.forEach(vm.sysItems, function(item) {
                        if (commonTool.isEmpty(item.inqueryUUID)) { // 只能添加已报价
                            item.$checked = ischecked;
                            if (true === ischecked) {
                                vm.checkedDatas.push(item); //item[vm.keyName]
                            }
                        }
                    });
                };
            tools.setCheckedData = function() {
                var selectionItem = [];
                angular.forEach(vm.sysItems, function(item) {
                    if (true === item.$checked) {
                        selectionItem.push(item);
                    }
                });
                vm.checkedDatas = selectionItem;
            }

            tools.addFromSysMatch = function() {
                // ngDialog.openConfirm({
                //     confirmInfo:"确认添加到干预匹配结果列表中？",
                //     title:"操作提示"
                // }).then(function(yes){
                tools.addToIntervenes('SYS');
                vm.checkedDatas = [];
                // },function(no){
                //     // 取消
                // });
            }

            tools.addToIntervenes = function(sourceType) {
                var checkedItems = (sourceType == 'SYS' ? vm.checkedDatas : vmdlg.checkedDatas);

                var existCompNames = [];
                var existFlag = null;
                // 合并到干预匹配结果列表中去
                // vm.viewItems and vmdlg.checkedDatas
                angular.forEach(checkedItems, function(addIt) {
                    addIt.$checked = false;
                    existFlag = false;
                    angular.forEach(vm.viewItems, function(it) {
                        if (!existFlag && it[vm.keyName] == addIt[vm.keyName]) {
                            // 记录已存在可视列表中的
                            existCompNames.push(addIt[vm.keyName]);
                            existFlag = true;
                            // break; 不支持
                        }
                    });
                    if (!existFlag) {
                        addIt.isManual = (sourceType == 'SYS' ? 0 : 1); // 标识是来自系统匹配还是手动筛选添加
                        delete addIt['$checked']
                        addIt.procurementId = tools.procurementId;
                        vm.viewItems.push(addIt);
                    }
                });

                if (existCompNames.length == 0) {
                    vm.isAllChecked = false;
                    $rootScope.alertMsgService.setMessage("操作成功。");
                } else {
                    $rootScope.alertMsgService.setMessage("操作成功。" + existCompNames.join(',') + '是重复添加的供应商.');
                }
                checkedItems = [];
                // console .log(1)
                // vmdlg.checkedDatas =[];
            };

            tools.deLFromIntervene = function(index) {
                ngDialog.openConfirm({
                    confirmInfo: "确认删除？",
                    title: "操作提示"
                }).then(function(yes) {
                    vm.viewItems.splice(index, 1);
                }, function(no) {
                    // 取消
                });

            }
            toolsdlg.sellerProductCategory = function(sellerId) {
                vmdlg.productCategoryList = [];
                purchaseService.getSellerProductCategory({
                    sellerId: sellerId
                }).success(function(data) {
                    if ('success' == data.status) {
                        vmdlg.productCategoryList = data.page.items;
                        // console.log(vmdlg.productCategoryList);
                    }
                })
                var dialogCategoryCount = ngDialog.open({
                    template: 'dialogSellerCategory.html',
                    width: 500,
                    title: '商品上传类目',
                    scope: $scope
                });
            }

            tools.addDialog = function() {

                ngDialog.open({
                    template: "addSupplier.html",
                    title: "添加",
                    width: 980,
                    scope: $scope,
                    controller: ["$scope", '$rootScope', 'ngDialog', 'commonService', 'commonTool', function($scope, $rootScope, ngDialog, commonService, commonTool) {
                        vmdlg.pages = commonService.setPageSizeArray(10, 30, 50);
                        toolsdlg.newpagesize = null;

                        // 获取所有一级类目
                        if (commonTool.isEmpty(tools.categorys)) {
                            commonService.getAllCategorysOfLevel1().success(function(data) {
                                if ('success' == data.status) {
                                    tools.categorys = data.data;
                                } else {
                                    console.log("Get getAllCategorysOfLevel1 Fail");
                                }
                            });
                        }

                        // 类目选择
                        toolsdlg.selectCategory = function() {
                            vm.categoryTypeParam = 'forSearchType2';
                            var dialog = ngDialog.openConfirm({
                                template: './controller/purchase/dialogCategory.html',
                                controller: 'DialogCategoryCtrl',
                                width: 800,
                                title: '类目选择',
                                scope: $scope
                            }).then(function(yes) {
                                // console.log(yes);
                                pagingdlg.productCategory = vm.checkedCategoryRs.id;
                                pagingdlg.isBottom = (vm.checkedCategoryRs.isRoot ? 0 : 1);


                            }, function(no) {

                            });
                        }

                        function checkEmpty() {
                            if (!commonTool.isEmpty(pagingdlg.personDropdownValue)) return true;
                            if (!commonTool.isEmpty(pagingdlg.packageTypeId)) return true;
                            if (!commonTool.isEmpty(pagingdlg.exhibitionType)) return true;
                            if (!commonTool.isEmpty(pagingdlg.mainCategory)) return true;
                            if (!commonTool.isEmpty(pagingdlg.productCategory)) return true;
                            if (!commonTool.isEmpty(pagingdlg.exportArea)) return true;
                            return false;
                        }
                        toolsdlg.getSuppliers = function() {
                                if (checkEmpty() == false) {
                                    $rootScope.alertMsgService.setMessage("至少填写一个搜索条件！", 'warning');
                                    return;
                                }
                                vmdlg.isSearching = true;
                                // 添加采购需求ID
                                pagingdlg.procurementId = tools.procurementId;
                                purchaseService.getPchsQrySuppliers(commonTool.filterParam(pagingdlg)).success(function(data) {
                                    vmdlg.isSearching = false;
                                    if ('success' == data.status) {
                                        vmdlg.items = data.page.items;
                                        pagingdlg.total = data.page.total;
                                        vmdlg.checkedDatas = [];
                                    }
                                }).error(function(rs) {
                                    vmdlg.isSearching = false;
                                })


                            }
                            /**
                             * 查询条件重置
                             * @return {[type]} [description]
                             */
                        toolsdlg.reset = function() {
                            pagingdlg = $scope.pagingdlg = {};
                            pagingdlg.page = 1;
                            pagingdlg.pageSize = 10;
                            pagingdlg.personDropdownType = '0';
                            if (!commonTool.isEmpty(vm.checkedCategoryRs)) {
                                vm.checkedCategoryRs.name = '';
                                vm.checkedCategoryRs.id = '';
                            }
                            pagingdlg.productCategory = ''
                        }

                        // 分页组件
                        toolsdlg.getnewpage = function(type) {
                            if (type == 1) { // 跳转到第几页
                                pagingdlg.page = toolsdlg.newpagesize;
                                toolsdlg.newpagesize = null;
                            } else if (type == 0) { // 每页显示多少条切换时
                                pagingdlg.page = 1;
                            }
                            toolsdlg.getSuppliers();
                        }

                        // 全选 checkbox
                        toolsdlg.toggleCheckAll = function(ischecked) {
                            vmdlg.checkedDatas = [];
                            angular.forEach(vmdlg.items, function(item) {
                                if (commonTool.isEmpty(item.inqueryUUID)) {
                                    item.$checked = ischecked;
                                    if (true === ischecked) {
                                        // 添加整条记录
                                        vmdlg.checkedDatas.push(item);
                                    }
                                }
                            });
                        };

                        // 单个checkbox
                        toolsdlg.setCheckedData = function() {
                            var selectionItem = [];
                            angular.forEach(vmdlg.items, function(item) {
                                if (true === item.$checked) {
                                    selectionItem.push(item);
                                }
                            });
                            vmdlg.checkedDatas = selectionItem;
                        }


                        // 关闭
                        toolsdlg.closeAddDialog = function() {
                                $scope.closeThisDialog();
                            }
                            // 确认
                        toolsdlg.add = function() {
                            tools.addToIntervenes('SEARCH');
                            vmdlg.checkedDatas = [];
                        };
                    }]
                })
            }

            // 确认完成匹配
            tools.interveneCommit = function() {
                // 整理提交的数据 vm.sysItems vm.viewItems
                // var isInOld = false;
                var addItems = [];
                var keyAtt = "matchId"

                addItems = vm.viewItems;
                // 提交数据到后台
                var param = $scope.unMatchParam = {
                    procurementId: tools.procurementId,
                    // matchIdsDel:delIds.join(','),
                    itemsAdd: JSON.stringify(addItems)
                }

                // 禁用按钮
                vmdlg.isdisabled = true;

                // 匹配无结果
                if (addItems.length < 1) {
                    vm.unMatchDlg = ngDialog.open({
                        template: 'unMatchDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        width: 700,
                        title: "零匹配原因",
                        controller: ['$scope', function($scope) {
                            var tools = $scope.tools;
                            $scope.submit = function() {

                                if (vm.reasonId == 8 && commonTool.isEmpty(vm.unMatchReason)) {
                                    $rootScope.alertMsgService.setMessage('请输入内容', 'warning');
                                    return;
                                }

                                $scope.unMatchParam.reasonId = vm.reasonId;
                                $scope.unMatchParam.reason = vm.unMatchReason == '' || vm.unMatchReason == null ? null : vm.unMatchReason;

                                tools.interveneCommitAction(commonTool.filterParam($scope.unMatchParam));
                            }

                        }]

                    });
                } else {
                    tools.interveneCommitAction(param);
                }

            }

            // 确认完成匹配 提取提交公共方法
            tools.interveneCommitAction = function(param) {
                purchaseService.confirmPchsManualMatch(param).success(function(data) {
                    if ('success' == data.status) {
                        vmdlg.isdisabled = false;
                        $rootScope.alertMsgService.setMessage('操作成功');
                        $location.path('/purchase/purchaseReqDetail').search({
                            purchaseId: tools.procurementId,
                            fromIntervene: true
                        });
                        tools.close();
                        // $location.path('/purchase/purchaseMatchDetail').search({
                        //    procurementId:tools.procurementId
                        // });
                    } else {
                        vmdlg.isdisabled = false;
                        if (data.message.indexOf('已经完成干预匹配') > -1) {
                            vmdlg.info = '此采购需求已经完成干预匹配'
                            ngDialog.openConfirm({
                                title: "提示",
                                scope: $scope,
                                template: "hadIntervenedTmpl.html"
                            });
                        } else {
                            $rootScope.alertMsgService.setMessage('操作失败，原因：' + data.message, 'warning');
                        }
                    }
                })
            }

            // 获取零匹配原因选择项目
            tools.getZeroMatchReason = function() {
                purchaseService.getZeroMatchReason().success(function(data) {
                    if ('success' == data.status) {
                        vm.unMatchReasonArr = data.data;
                    }
                })
            }

            tools.radioChange = function() {
                if (vm.reasonId == 8) {
                    vm.needNode = false;
                } else {
                    vm.needNode = true;
                }
            }

            // 按钮组滚动固定头部
            tools.scroll_fixed = function() {
                if ($('.j-sroll-fixed').length) {
                    var _this = $('.j-sroll-fixed:first');
                    var top = _this.parent().offset().top;
                    var h = _this.height();

                    var viewH = $(window).height(); // 浏览器可视区的高度

                    $(window).on('scroll', function() {
                        var tableH = _this.closest('table').height(); // 当前table的高度
                        if ($(window).scrollTop() >= top && $(window).scrollTop() <= top + tableH - h) {
                            // console.log($(window).scrollTop());
                            _this.addClass('cfec-fixed-thead');

                        } else {
                            _this.removeClass('cfec-fixed-thead');
                        }
                    })
                }
            }

            // 关闭弹出层
            tools.close = function() {
                vmdlg.isdisabled = false;
                vm.needNode = true;
                ngDialog.closeAll();
            }
            tools.init();
            tools.scroll_fixed();

        }
    ])

    .controller('DialogCategoryCtrl', ['$scope', '$rootScope', '$location', 'commonService', 'commonTool',
        function($scope, $rootScope, $location, commonService, commonTool) {

            var tools = $scope.tools;
            var vm = $scope.vm;
            vm.categorys = [];
            vm.checkedCategory = null;
            vm.searchCategoresList = [];
            vm.keyAttr = "categoryName";
            var controlParam = {};
            // 采购需求详情页，要返回根类目名，末级选中类目id,name
            if (vm.categoryTypeParam == "purchaseDetail") {
                controlParam.rootName = true;
                vm.keyAttr = "categoryEname";
            } else if (vm.categoryTypeParam == 'forSearchType2') {
                // 作为查询条件,选中一级或末级类目时都可以返回
                vm.keyAttr = "categoryName"; // 展示中文
                controlParam.rootNode = true;
            }
            var setTime;
            tools = $.extend(tools, {
                getCategoryRoot: function() {
                    commonService.getAllCategorysOfLevel1().success(function(data) {
                        if ('success' == data.status) {
                            vm.categorys = [];
                            vm.categorys[0] = data.data;
                        } else {
                            alert(data.message);
                        }
                    })
                },
                // 非一级类目 ,level 父级是第几级类目 start from 1,isBottom 末级类目 1
                getCategoryChildren: function(parentId, level, isBottom) {
                    $('#' + parentId).siblings().css('background-color', '#fff');
                    $('#' + parentId).css("background-color", '#f0f0f0');

                    // if (isBottom == 1) {
                    // 最末级
                    vm.checkedCategory = {};
                    vm.checkedCategory.id = parentId;
                    vm.checkedCategory.name = $('#' + parentId).data(vm.keyAttr.toLowerCase());
                    // return;

                    // }
                    // 滚动条自动滚动
                    // var left = event.target.offsetLeft;
                    // var boxWidth = $('.j-box').width();
                    // var itemSize = 180;
                    // if (boxWidth - left < itemSize * 1.5) {
                    //     $('.j-box').animate({
                    //         scrollLeft: $('.j-box').scrollLeft() + itemSize
                    //     }, 300);
                    // } else if (left <= itemSize * 1.5 && $('.j-box').scrollLeft() > 0) {
                    //     $('.j-box').animate({
                    //         scrollLeft: $('.j-box').scrollLeft() < itemSize ? 0 : $('.j-box').scrollLeft() - itemSize
                    //     }, 300);
                    // }

                    // if (level == 1) {
                    //     if (controlParam.rootName) {
                    //         vm.rootCategoryName = $('#' + parentId).data(vm.keyAttr.toLowerCase());
                    //     } else if (controlParam.rootNode) {
                    //         vm.checkedCategory = {};
                    //         vm.checkedCategory.id = parentId;
                    //         vm.checkedCategory.name = $('#' + parentId).data(vm.keyAttr.toLowerCase());
                    //         vm.checkedCategory.isRoot = true;
                    //     }
                    // }
                    commonService.getCategoryChildren({
                        'parentId': parentId
                    }).success(function(data) {
                        if ('success' == data.status) {
                            var l = vm.categorys.length;
                            if (l > level) {
                                vm.categorys.splice(level, l - level)
                            }
                            // 不是最末级类目时存在子类目
                            if (data.data != null && data.data.length > 0) {
                                vm.categorys[level] = data.data;
                                // root结点另论
                                // if (level != 1 || !controlParam.rootNode) {
                                //     vm.checkedCategory = {};
                                // }
                            }

                        } else {
                            alert(data.message);
                        }
                    })
                },
                sure: function() {
                    if (commonTool.isEmptyObject(vm.checkedCategory)) {
                        $rootScope.alertMsgService.setMessage('当前选择类目不能为空!', 'info');
                        return;
                    }
                    $scope.confirm();
                    vm.checkedCategoryRs = vm.checkedCategory;
                },
                cancel: function() {
                    $scope.closeThisDialog();
                },
                searchCate: function() {
                    searchCategories(vm.cateKeyword);
                },
                chxSelectCate: function(item) {
                    var obj = '#search' + item.categoryId;
                    $(obj).addClass('active').siblings('li').removeClass('active');
                    vm.checkedCategory = {};
                    vm.checkedCategory.id = item.categoryId;
                    vm.checkedCategory.name = item.categoryName;
                },
                checCatekKeyUp: function() {
                    clearTimeout(setTime);
                    if (commonTool.isEmpty(vm.cateKeyword)) {
                        vm.searchCategoresList = [];
                        return;
                    } else {
                        setTime = setTimeout(searchCategories, 500);
                    }
                },
                checkCateKeyUp: function(event) {
                    var keycode = window.event ? event.keyCode : event.which;
                    if (keycode == 13) searchCategories(vm.cateKeyword);
                }
            });

            function searchCategories(keyword) {
                keyword = vm.cateKeyword;
                if (commonTool.isEmpty(keyword)) {
                    vm.searchCategoresList = [];
                    return;
                }
                commonService.searchCategories({
                    keywords: keyword
                }).success(function(data) {
                    if (data.status == 'success') {
                        vm.searchCategoresList = data.data;
                        for (var i = 0; i < vm.searchCategoresList.length; i++) {
                            vm.searchCategoresList[i].categoryTreeHtml = vm.searchCategoresList[i].categoryTree.join('>>');
                        }
                    }
                })
            }

            // 初始化
            tools.getCategoryRoot();

        }
    ])

    //  重发邮件
    .controller('reSendEmailCtrl2', ['$scope', '$rootScope', 'ngDialog', '$controller', '$location', 'purchaseService', 'commonService', 'commonTool',
        ($scope, $rootScope, ngDialog, $controller, $location, purchaseService, commonService, commonTool) => {

            let status = $scope.status;
            let messages = $scope.messages;
            let messageId = messages[0].messageId;
            let messagesObj = messages[status];
            let isReply = messagesObj.isReply;
            let replyId = messagesObj.messageId;
            let sendUserId = messagesObj.senderId;
            let tools = $scope.tools;

            let dialogMSId = $scope.dialogMSId;




            tools = $.extend(tools, {
                // 买家消息 
                inquiryEmailconFirm() {
                    purchaseService.reSendInquiryEmail({ messageId, sendUserId })
                        .success((data) => {
                            if (data.status === "success") {
                                $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                var pm = {};
                                pm.messageId = dialogMSId;
                                tools.tab.getMessages(pm);
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    $scope.closeThisDialog();
                },
                //  卖家回复
                inquiryReplyEmailConfirm() {
                    purchaseService.reSendInquiryReplyEmail({ messageId, sendUserId, replyId })
                        .success((data) => {
                            if (data.status === "success") {
                                $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                var pm = {};
                                pm.messageId = dialogMSId;
                                tools.tab.getMessages(pm);
                                //   setTimeout(()=>{
                                //     location.reload();
                                // }, 1000)
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    $scope.closeThisDialog();
                },

                reSendEmailCancel() {
                    $scope.closeThisDialog();
                },

                checkUserType() {
                    !isReply ? tools.inquiryEmailconFirm() : tools.inquiryReplyEmailConfirm();
                }
            })

        }
    ])

    .filter("purchaseState", function() {
            return function(status) {
                var name = "";
                if (status == 1) {
                    name = "待审核";
                } else if (status == 2) {
                    name = "审核通过";
                } else if (status == 3) {
                    name = "审核不通过";
                } else if (status == 8) {
                    name = "完成干预";
                } else if (status == 6) {
                    name = "已下单";
                } else if (status == 4) {
                    name = "已过期";
                } else if (status == 5) {
                    name = "已下线";
                } else if (status == 7) {
                    name = "已删除";
                }
                return name;
            };
        })
        .filter("purchaseQuality", function() {
            return function(status) {
                var name = status;
                if (status == 1) {
                    name = "高";
                } else if (status == 2) {
                    name = "中";
                } else if (status == 3) {
                    name = "低";
                }
                return name;
            };
        })
        .filter("purchaseSource", function() {
            return function(status) {
                var name = "";
                if (status == '006') {
                    name = "现场自助终端";
                } else if (status == '007') {
                    name = "新平台（pc端平台）";
                } else if (status == '010') {
                    name = "ios";
                } else { // (status == '011')
                    name = "不明来源";
                }
                return name;
            };
        })
        .filter("memPackageType", function() {
            return function(status) {
                var name = status;
                if (status == 1) {
                    name = "金牌供应商";
                } else if (status == 2) {
                    name = "认证供应商";
                }
                return name;
            }
        })
        .filter("pchsSplMatchType", function() {
            return function(status) {
                var name = status;
                if (status == 0) {
                    name = "系统匹配";
                } else if (status == 1) {
                    name = "干预匹配";
                }
                return name;
            }
        })
        .filter("isQuote", function() {
            return function(status) {
                var name = status;
                if (status == 0) {
                    name = "未报价";
                } else if (status == 1) {
                    name = "已报价";
                }
                return name;
            }
        })
        // 买家审核状态
        .filter('checkBuyerStatus', function() {
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
        // 报价审核状态   待审核 1   审核通过  2   审核不通过  -1
        .filter('quoteAuditStateFilter', function() {
            return function(status) {
                switch (status) {
                    case 1:
                        return '待审核';
                    case 2:
                        return '审核通过';
                    case -1:
                        return '审核不通过';
                }
            }
        })
});
