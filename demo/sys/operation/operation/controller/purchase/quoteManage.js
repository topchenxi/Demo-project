/**
 *
 * @authors huangqinxian@cf-ec.com
 * @date    2016-06-01 16:48:03
 * @version 1.0
 */


define(['../module'], function(ng) {
    ng.factory('quoteService', ['$http', 'api',
        function($http, api) {
            return {
                getQuoteList: function(params) {
                    return $http.get(api.getQuoteList, {
                        params: params
                    });
                },
                chxQuoteStatus: function(params) {
                    return $http.post(api.chxQuoteStatus, params);
                },
                getQuoteDetail: function(inqueryUUID) {
                    var params = {
                        inqueryUUID: inqueryUUID
                    }
                    return $http.get(api.getQuoteDetail, {
                        params: params
                    });
                },
                getUnpassReason: function(params) {
                    return $http.get(api.getUnpassReason, {
                        params: params
                    })
                },
                // 报价详情——刷新邮件状态接口
                refreshQuotePriceEmailState: function(params) {
                    return $http.get(api.refreshQuotePriceEmailState, {
                        'params': params
                    })
                },
                getAuditorList: function(params) {
                    return $http.get(api.getSysUserList, {
                        'params': params
                    })
                },
                // 重发邮件
                reSendQutoteEmail: function(params) {
                    return $http.post(api.reSendQutoteEmail, params);
                }
            };
        }
    ])
    ng.controller('PurchaseQuoteListCtrl', ['$scope', '$rootScope', 'ngDialog', '$controller', '$location', '$uibModal', 'quoteService', 'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog, $controller, $location, $uibModal, quoteService, commonService, commonTool) {
            $controller('baseListController', {
                $scope: $scope
            }); // 存放数据
            var vm = $scope.vm;
            // 存放方法
            var tools = $scope.tools;

            var paging = $scope.paging = {

                // 1：供应商ID,2：供应商姓名，3：供应商公司名
                dropDwonType: "1",
                // 对应搜索的值
                dropDwonValue: null,
                // 结束时间
                endTime: null,
                // 开始时间
                startTime: null,
                // 是否有附件，ture是，flase否
                hasAttachment: null,
                // 行业Id
                productCategoryId: null,
                // 主题
                productName: null,
                // 报价状态，1：待审核，2：审核通过，-1：审核不通过
                quotePriceState: null,
                // 报价类型
                quoteType: null,
                // 分页
                page: 1,
                pageSize: 20
            };

            vm.currentState = null;
            vm.selectionItme = [];
            vm.showOperateFlag = false;
            // 定义方法
            tools = $.extend(tools, {
                // 获取报价列表
                getQuoteList: function() {
                    vm.showOperateFlag = false;
                    vm.allChecked = false;
                    quoteService.getQuoteList(paging).success(function(data) {
                        if ('success' == data.status) {
                            vm.items = data.data.items;
                            paging.total = data.data.total;
                            paging.pageSize = data.data.pageSize;
                        } else {
                            console.log("Get Countries Fail");
                        }
                    })

                },
                // 点击全选或者取消全选
                checkAll: function(checked) {
                    vm.selectionItme = [];
                    vm.showOperateFlag = checked ? true : false;
                    angular.forEach(vm.items, function(item) {
                        item.$checked = checked;
                        if (true === checked) {
                            vm.selectionItme.push(item.inqueryUUID);
                        }
                    });
                },
                selection: function() {
                    var selectionItme = [];
                    angular.forEach(vm.items, function(item) {
                        if (item.$checked === true) {
                            selectionItme.push(item.inqueryUUID);
                        }
                    });
                    vm.showOperateFlag = selectionItme.length > 0 ? true : false;
                    vm.selectionItme = selectionItme;
                },
                toDetail: function(inqueryUUID) {
                    $location.path('/purchase/purchaseQuoteDetail').search({
                        inqueryUUID: inqueryUUID
                    });
                },
                chxQuoteStatus: function(status) {
                    $scope.inqueryUUID = vm.selectionItme;
                    $scope.status = status;
                    $scope.type = "list";
                    $scope.tools = tools;
                    vm.sellerListDlg = ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 600,
                        templateUrl: 'quoteConfirm',
                        controller: 'quoteConfirmCtrl'
                    })
                },
                isInteger: function(value) {
                    var reg = /^[0-9]*[1-9][0-9]*$/;
                    return reg.test(value);
                },
                checkSearchParams: function() {
                    if (paging.dropDwonType == 1 && !commonTool.isEmpty(paging.dropDwonValue) && !this.isInteger(paging.dropDwonValue)) {
                        $rootScope.alertMsgService.setMessage("供应商ID只能是数字", 'warning');
                        return false;
                    }
                    if (paging.dropDwonType == 1 && !commonTool.isEmpty(paging.dropDwonValue) && paging.dropDwonValue.length > 9) {
                        $rootScope.alertMsgService.setMessage("供应商ID最多9位", 'warning');
                        return false;
                    }
                    return true;
                },
                search: function() {
                    if (this.checkSearchParams() == false) return;
                    this.getQuoteList();
                },
                keyup: function($event) {
                    if ($event.keyCode == 13) {
                        this.search();
                    }
                },
                getnewpage: function(type) {
                    if (type == 1) { // 跳转到第几页
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) { // 每页显示多少条切换时
                        paging.page = 1;
                    }
                    tools.getQuoteList();
                },
                reset: function() {
                    paging.dropDwonType = "1";
                    paging.dropDwonValue = null;
                    paging.startTime = null;
                    paging.endTime = null;
                    paging.productCategoryId = null;
                    paging.isAttachment = null;
                    paging.productName = null;
                    paging.startAuditTime = null;
                    paging.endAuditTime = null;
                    paging.auditor = null;
                    paging.quoteType = null;

                    // paging.isValid = null;
                    paging.quotePriceState = vm.currentState == null ? null : paging.quotePriceState;
                }
            });

            tools.getQuoteList();

            var method = {
                value: "",
                key: "",
                // 定义对象
                myObject: function(value, key) {
                    this.value = value;
                    this.key = key;
                },
                // 调用对象方法，生成审核状态数组 3种：待审核，审核涌过，审核不通过
                AuditStatusArray: function() {
                    var auditStatusArray = [
                        new this.myObject("待审核", "1"),
                        new this.myObject("审核通过", "2"),
                        new this.myObject("审核不通过", "-1")
                    ];
                    return auditStatusArray;
                },
                // 调用对象方法，生成附件信息数组 2种：有附件，没附件
                AttachmentArray: function() {
                    var attachmentArray = [
                        new this.myObject("有", "1"),
                        new this.myObject("无", "0")
                    ];
                    return attachmentArray;
                },
                // 调用对象方法，生成附件信息数组 2种：有附件，没附件
                ValidArray: function() {
                    var vaildArray = [
                        new this.myObject("是", "1"),
                        new this.myObject("否", "0")
                    ];
                    return vaildArray;
                }
            };


            // 调用
            init_data();
            // 初始化数据
            function init_data() {
                // 获取行业数据
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    vm.categories = 'success' === data.status ? data.data : [];
                });
                // 获取状态数据
                vm.auditStatusArray = method.AuditStatusArray();
                // 供应商下拉框 默认selected
                paging.dropDwonType = "1";
                // 定义附件数组
                vm.attachmentArray = method.AttachmentArray();
                // 定义有效数组
                // vm.vaildArray = method.ValidArray();
                // 定义分页数组
                vm.pages = commonService.setPageSizeArray(20, 30, 50);

                vm.sellerArray = [];
                quoteService.getAuditorList({
                    roleName: '卖家组'
                }).success(function(data) {
                    vm.sellerArray = 'success' === data.status ? data.page.items : [];
                })
            };
        }
    ])

    ng.controller('PurchaseQuoteDetailCtrl', ['$scope', '$rootScope', 'ngDialog', '$controller', '$location', '$uibModal', 'quoteService', 'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog, $controller, $location, $uibModal, quoteService, commonService, commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var inqueryUUID = $location.search().inqueryUUID;


            if (inqueryUUID == null || inqueryUUID == "" || inqueryUUID == undefined) return;

            function Attachment(attachmentName, attachmentPath) {
                this.attachmentName = attachmentName;
                this.attachmentPath = attachmentPath;
            }
            // 定义方法
            tools = $.extend(tools, {
                // 获取报价详情
                getQuoteDetailById: function(inqueryUUID) {
                    quoteService.getQuoteDetail(inqueryUUID).success(function(data) {
                        if (data.status == "success") {
                            vm.item = data.data;
                            var attachmentName = vm.item.quotePrice.attachmentName;
                            var attachmentPath = vm.item.quotePrice.attachmentPath;
                            if (!commonTool.isEmpty(attachmentName) && !commonTool.isEmpty(attachmentPath)) {
                                var attachmentNameArray = attachmentName.split(',');
                                var attachmentPathArray = attachmentPath.split(',');
                                var attachmentArray = [];
                                if (attachmentNameArray.length == attachmentPathArray.length) {
                                    for (var i = 0, len = attachmentNameArray.length; i < len; i++) {
                                        attachmentArray.push(new Attachment(attachmentNameArray[i], attachmentPathArray[i]))
                                    }
                                }
                                vm.attachmentArray = attachmentArray;
                            }
                        } else {
                            console.log("Get Detail Info Error!");
                        }
                    })
                },
                chxQuoteStatus: function(status) {
                    $scope.inqueryUUID = [inqueryUUID];
                    $scope.status = status;
                    $scope.tools = tools;
                    $scope.type = "detail";
                    vm.sellerListDlg = ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 600,
                        templateUrl: 'quoteConfirm',
                        controller: 'quoteConfirmCtrl'
                    })
                },
                //  重发邮件
                reSendEmail() {
                    $scope.quotedId = vm.item.quotePrice.inqueryUUID;
                    $scope.type = "detail";
                    vm.reSendEmailDlg = ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 600,
                        templateUrl: 'reSendConfirm',
                        controller: 'reSendEmailCtrl3'
                    })
                },
                download: function(url) {
                    window.open(imgUrl + url);
                },
                // 报价详情——刷新邮件状态接口
                refreshQuotePriceEmailState: function(inqueryUUID) {
                    if (inqueryUUID != null && inqueryUUID != undefined && inqueryUUID != '') {
                        var params = {
                            quoteId: inqueryUUID
                        }
                        quoteService.refreshQuotePriceEmailState(params)
                            .success(function(data) {
                                if (data.status == 'success') {
                                    if (data.data != null) {
                                        vm.item.quotePrice.emailState = data.data;
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
                        $rootScope.alertMsgService.setMessage("inqueryUUID参数错误，请刷新页面重试", 'warning');
                        return;
                    }
                }
            });

            tools.getQuoteDetailById(inqueryUUID);
        }
    ])
    ng.controller('quoteConfirmCtrl', ['$scope', '$rootScope', 'ngDialog', '$controller', '$location', 'quoteService', 'commonService', 'commonTool',
            function($scope, $rootScope, ngDialog, $controller, $location, quoteService, commonService, commonTool) {

                // 采购需求id数组
                var inqueryUUID = $scope.inqueryUUID;
                var status = $scope.status;
                var tools = $scope.tools;
                var type = $scope.type;
                tools.btnFlag = false;
                var vm = $scope.vm = {};

                vm.changestatus = status;

                vm.unPassReasonList = [];

                if (vm.changestatus == -1) {
                    quoteService.getUnpassReason({
                        modular: 2
                    }).success(function(data) {
                        vm.unPassReasonList = data.data;
                        angular.forEach(vm.unPassReasonList, function(item) {
                            item.flag = false;
                            if (item.auditUnpassReasonId == 16) {
                                item.reasonNameBias = '';
                            }
                        })
                    })
                }

                tools = $.extend(tools, {
                    comfirm: function() {
                        tools.btnFlag = true;

                        var params = {
                            auditState: status,
                            quotePriceIds: inqueryUUID.join(',')
                        };
                        if (vm.changestatus == -1) {
                            var unPassReasonArray = [];
                            angular.forEach(vm.unPassReasonList, function(item) {
                                if (item.flag == true && !commonTool.isEmpty(item.reasonNameBias)) {
                                    unPassReasonArray.push(item.reasonNameBias);
                                }
                            })
                            var reason = unPassReasonArray.join(' ； ');
                            if (commonTool.isEmpty(reason)) {
                                $rootScope.alertMsgService.setMessage('请先选择原因', 'warning');
                                tools.btnFlag = false;
                                return;
                            } else {
                                params.reason = reason;
                            }
                        }
                        quoteService.chxQuoteStatus(params).success(function(data) {
                            if (data.status == 'success') {
                                if (type == 'list') {
                                    tools.getQuoteList();
                                } else {
                                    tools.getQuoteDetailById(inqueryUUID[0]);
                                }
                                $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                ngDialog.closeAll();
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    },
                    close: function() {
                        ngDialog.closeAll();
                    }
                })

            }
        ])
        // 重发邮件
    ng.controller('reSendEmailCtrl3', ['$scope', '$rootScope', 'ngDialog', '$controller', '$location', 'quoteService', 'commonService', 'commonTool',
        function($scope, $rootScope, ngDialog, $controller, $location, quoteService, commonService, commonTool) {

            let tools = $scope.tools;
            let quotedId = $scope.quotedId
            let params = { qutoPriceId: quotedId };

            tools = $.extend(tools, {
                confirm() {
                    quoteService.reSendQutoteEmail(params)
                        .success((data) => {
                            if (data.status === "success") {
                                $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                tools.getQuoteDetailById(quotedId);

                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        });
                    ngDialog.closeAll();
                },
                close() {
                    ngDialog.closeAll();
                }
            })
        }
    ])

    ng.filter("hasAttach", function() {
        return function(status) {
            return status ? "有" : "无";
        };
    })
    ng.filter("checkState", function() {
        return function(status) {
            switch (status) {
                case 1:
                    return "待审核";
                case 2:
                    return "通过";
                case -1:
                    return "未通过";
                default:
                    return "";
            }
        };
    })
    ng.filter("quoteType", function() {
        // 报价类型
        return function(status) {
            switch (status) {
                case 1:
                    return "匹配报价";
                case 0:
                    return "自由报价";
                default:
                    return '';
            }
        };
    })

    ng.filter("checkIcon", function() {
        return function(attachmentPath) {
            var path = attachmentPath.substring(attachmentPath.indexOf(".") + 1, attachmentPath.length);
            switch (path) {
                case "doc":
                case "docx":
                    return "icon-attaType-doc";
                case "png":
                case "jpg":
                case "jpeg":
                    return "icon-attaType-img";
                case "ppt":
                case "pptx":
                    return "icon-attaType-ppt";
                case "pdf":
                    return "icon-attaType-pdf";
                case "xls":
                case "xlsx":
                    return "icon-attaType-xls";
                default:
                    return "";
            }
            return "";
        };
    })
    ng.filter("emailStateFilter", function() {
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
