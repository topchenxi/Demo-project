define(['../module'], function(ng) {
    ng.factory('sellerServer', ['$http', 'api',
        function($http, api) {
            return {
                getSellerList: function(params) {
                    return $http.get(api.getSellerList, {
                        params: params
                    });
                },
                getSellerDetail: function(sellerId) {
                    return $http.get(api.getSellerDetail, {
                        params: {
                            sellerId: sellerId
                        }
                    })
                },
                getSellerIdentity: function(params) {
                    return $http.get(api.getSellerIdentity, {
                        params: params
                    });
                },
                getSellerIdentityDetail: function(sellerId) {
                    return $http.get(api.getSellerIdentityDetail, {
                        params: {
                            sellerId: sellerId
                        }
                    })
                },
                getMemPackageList: function(params) {
                    return $http.get(api.getMemPackageList, {
                        params: params
                    });
                },
                chgSellerAudit: function(params) {
                    return $http.post(api.chgSellerAudit, params);
                },
                saveSellerIdentity: function(params) {
                    return $http.post(api.saveSellerIdentity, params);
                },
                chgSellerIdentityAudit: function(params) {
                    return $http.post(api.chgSellerIdentityAudit, params)
                },
                chgSellerInfoAudit: function(params) {
                    return $http.post(api.chgSellerInfoAudit, params)
                },
                getPurchaseList: function(params, type) {
                    var apiUrl = type == 0 ? api.findMatchedProcurement : api.findProcurementBySearchQuote;
                    return $http.get(apiUrl, {
                        params: params
                    });
                },
                getEnquiryList: function(params) {
                    return $http.get(api.getInquiryList, {
                        params: params
                    });
                },
                addedValueInfo: function(params) {
                    return $http.get(api.addedValueInfo, {
                        params: params
                    });
                },
                getSourceList: function() {
                    return $http.get(api.getSourceList);
                },
                getAdKeywordList: function(params) {
                    return $http.get(api.getAds, {
                        params: params
                    });
                },
                getContactMsg: function(params) {
                    return $http.get(api.getPchsSplContactMsg, {
                        params: params
                    });
                },
                getSellerBusinessInfo: function(params) {
                    return $http.get(api.getSellerBusinessInfo, {
                        params: params
                    });
                },
                chgSellerBusinessInfo: function(params) {
                    return $http.post(api.chgSellerBusinessInfo, {
                        business: params
                    });
                },
                getSellerExportInfo: function(params) {
                    return $http.get(api.getSellerExportInfo, {
                        params: params
                    });
                },
                chgSellerExportInfo: function(params) {
                    return $http.post(api.chgSellerExportInfo, {
                        export: params
                    });
                },
                getSellerTradeInfo: function(params) {
                    return $http.get(api.getSellerTradeInfo, {
                        params: params
                    });
                },
                chgSellerTradeInfo: function(params) {
                    return $http.post(api.chgSellerTradeInfo, params);
                },
                getProducts: function(params) {
                    return $http.get(api.getSellerProducts, {
                        params: params
                    });
                },
                getShopinfo: function(params) {
                    return $http.get(api.getShopinfo, {
                        params: params
                    });
                },
                getMemberPackage: function(params) {
                    return $http.get(api.getMemberPackage, {
                        params: params
                    });
                },
                getRecordInfo: function(params) {
                    return $http.get(api.getsellerFollowDetail, {
                        params: params
                    })
                },
                getFlolowDlgContent: function() {
                    var chkReasons = [];
                    chkReasons[0] = [];
                    chkReasons[1] = [];
                    // 可跟进
                    chkReasons[0][0] = {
                        "text": "登录情况是否改善"
                    };
                    chkReasons[0][1] = {
                        "text": "回复率是否提升"
                    };
                    chkReasons[0][2] = {
                        "text": "商机数量是否提升"
                    };
                    chkReasons[0][3] = {
                        "text": "商品描述是否优化"
                    };
                    chkReasons[0][4] = {
                        "text": "考虑推荐增值服务"
                    };
                    chkReasons[0][5] = {
                        "text": "其他"
                    };

                    // 免跟进
                    chkReasons[1][0] = {
                        "text": "回复率正常"
                    };
                    chkReasons[1][1] = {
                        "text": "无法取得联系"
                    };
                    chkReasons[1][2] = {
                        "text": "客户拒绝沟通"
                    };
                    chkReasons[1][3] = {
                        "text": "缺少运营人员"
                    };
                    chkReasons[1][4] = {
                        "text": "未回复的商机质量差"
                    };
                    chkReasons[1][5] = {
                        "text": "未回复的商机不匹配"
                    };
                    chkReasons[1][6] = {
                        "text": "多次联系，无法激活"
                    };
                    chkReasons[1][7] = {
                        "text": "其他"
                    };
                    return chkReasons;
                },
                // 添加供应商跟进记录
                addsellerFollowRecord: function(params) {
                    return $http.get(api.addsellerFollowRecord, {
                        'params': params
                    })
                },
                // 一键登录
                oneClickLogin: function(params) {
                    return $http.get(api.oneClickLogin, {
                        'params': params
                    })
                },
                // 记录一键登录操作日志
                oneClickLoginLog: function(params) {
                    return $http.get(api.oneClickLoginLog, {
                        'params': params
                    })
                },
                // 重置密码
                resetPassword: function(params) {
                    return $http.post(api.resetPassword, params)
                },
                // 禁用启用采购商
                chxTestAccountStatus: function(params) {
                    return $http.post(api.chxTestSellerStatus, params);
                },
                // 设为报价免审用户
                setFreeAuditQuote: function(params) {
                    return $http.post(api.setFreeAuditQuote, params);
                },
                // 更新卖家个人信息
                updateSellerInfo: function(params) {
                    return $http.get(api.updateSellerInfo, {
                        'params': params
                    })
                },
                // 获得邮件推广计划列表
                getedmList: function(params) {
                    return $http.get(api.getEdm, {
                        'params': params
                    });
                },
            };
        }
    ])
    ng.controller('SellerCtrl', [
        '$scope', '$rootScope', '$location',
        'ngDialog', 'sellerServer', 'commonService',
        'commonTool',
        function(
            $scope, $rootScope, $location,
            ngDialog, sellerServer, commonService,
            commonTool) {
            var vm = $scope.vm = {};
            var tools = $scope.tools = {};

            var paging = $scope.paging = {
                // Tab状态：-10: 全部, 2: 待审核, 3: 审核完成
                statusTab: 2,
                // 身份审核状态: 2: 待审核, 3: 审核通过, -1: 审核不通过
                auditStatus: null,
                // 资质审核状态: 2: 待审核, 3: 审核通过, -1: 审核不通过
                sellerAuthAuditStatus: null,
                // 店铺信息:  0:未提交, 1: 已开通
                shopStatus: null,
                // 其他资料审核状态: 2: 待审核, 3: 审核通过, -1: 审核不通过
                otherInfoAuditStatus: null,
                // 商品信息:  0:待审核, 1:审核完成
                productStatus: null,
                // 邮件推广: 0:待审核, 1: 审核完成
                promotionMailStatus: null,
                // 主营行业
                mainCategoryId: null,
                // 供应商来源
                source: null,
                // 套餐类型
                packageId: null,
                // 店铺上线时间(开始日期)
                shopCreateTimeStart: null,
                // 店铺上线时间(结束日期)
                shopCreateTimeEnd: null,
                // 查询参数:username, email,companyName,companyEnName
                qKey: null,
                qValue: null,
                // 付费卖家
                paidSeller: 0,
                // 广交会参展商
                exibitor: 0,
                // 新客户
                newShop: 0,
                // 报价免审
                freeAduitQuote: null,
                // 分页
                page: 1,
                pageSize: 10
            }

            vm.selectionItme = [];
            vm.showOperateFlag = false;
            tools = $.extend(tools, {
                getSellerLst: function() {
                    vm.allChecked = false;
                    vm.showOperateFlag = false;

                    sellerServer.getSellerList(commonTool.filterParam(paging)).success(function(data) {
                        vm.items = data.data.items;
                        paging.total = data.page.total;
                    })
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        paging.page = 1;
                    }
                    tools.getSellerLst();
                },
                search: function() {
                    paging.page = 1;
                    this.getSellerLst();
                },
                reset: function() {
                    paging.auditStatus = null;
                    paging.sellerAuthAuditStatus = null;
                    paging.shopStatus = null;
                    paging.otherInfoAuditStatus = null;
                    paging.mainCategoryId = null;
                    paging.source = null;
                    paging.packageId = null;
                    paging.productStatus = null;
                    paging.promotionMailStatus = null;
                    paging.qKey = null;
                    paging.qValue = null;
                    paging.paidSeller = 0;
                    paging.exibitor = 0;
                    paging.newShop = 0;
                    paging.freeAduitQuote = null;
                    paging.shopCreateTimeEnd = null;
                    paging.shopCreateTimeStart = null;
                    paging.sourceFourType = null;
                },
                getSecondSource: function() {
                    console.log(paging.source);
                    if (commonTool.isEmpty(paging.source)) {
                        vm.secondSourceArray = [];
                        return;
                    }
                    var tmpObj = {
                        sourceType: 2,
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
                },
                // 关闭弹出层
                close: function() {
                    ngDialog.closeAll();
                },
                // 一键登录
                oneClickLogin: function(id) {
                    if (id != null && id != '' && id != undefined) {
                        vm.userId = id;
                        var params = {
                                userId: id
                            }
                            // 发送请求
                        sellerServer.oneClickLogin(params).success(function(data) {
                            if ('success' === data.status) {
                                var _data = data.data;
                                vm.oneClickUrl = _data.url + '&username=' + _data.username + '&login_source=' + _data.login_source + '&password=' + _data.password;
                                vm.oneClickLoginDlg = ngDialog.open({
                                    template: 'oneClickLoginDlgId',
                                    appendClassName: "dialog-activeM",
                                    scope: $scope,
                                    width: 500,
                                    title: "一键登录",
                                    controller: ['$scope', function($scope) {

                                    }]
                                });
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })

                    }
                },
                oneClickLoginLog: function(id) {
                    if (id != null && id != '' && id != undefined) {
                        var params = {
                            userId: id
                        }
                        sellerServer.oneClickLoginLog(params).success(function(data) {
                            tools.close();
                            // 不做任何处理，只发送操作日志记录
                        })
                    }
                },
                // 重置密码
                resetPassword: function(id) {
                    if (id != null && id != '' && id != undefined) {
                        $scope.ids = id;
                        $scope.tools = tools;

                        vm.resetPasswordDlg = ngDialog.open({
                            template: 'resetPasswordDlgId',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            width: 550,
                            title: "重置密码",
                            // 关闭时回调
                            preCloseCallback: function(value) {
                                vm.newPassword = null;
                                return true;
                            },
                            controller: ['$scope', function($scope) {
                                var ids = $scope.ids;
                                var tools = $scope.tools;

                                $scope.submit = function() {
                                    var params = {
                                        sellerId: ids,
                                        sellerPassWord: vm.newPassword
                                    };

                                    var rangelength = [8, 25];
                                    var rangelengthFlag = vm.newPassword.length >= rangelength[0] && vm.newPassword.length <= rangelength[1];
                                    var passwordStringCheck = (/[a-zA-Z]+/.test(vm.newPassword) && /\d/.test(vm.newPassword));

                                    if (commonTool.isEmpty(vm.newPassword)) {
                                        $rootScope.alertMsgService.setMessage('请输入新密码', 'warning');
                                        return;
                                    }
                                    if (!rangelengthFlag) {
                                        $rootScope.alertMsgService.setMessage('请输入' + rangelength[0] + '-' + rangelength[1] + '位新密码', 'warning');
                                        return;
                                    }
                                    if (!passwordStringCheck) {
                                        $rootScope.alertMsgService.setMessage('新密码至少使用一个数字和一个字母', 'warning');
                                        return;
                                    }

                                    sellerServer.resetPassword(params)
                                        .success(function(data) {
                                            if ('success' === data.status) {
                                                $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                                tools.close();
                                            } else {
                                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                            }
                                        })
                                }

                            }]

                        });
                    }
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
                    var tmpArray = [
                        new this.init('账号', 'username'),
                        new this.init('邮箱', 'email'),
                        new this.init('公司中文名称', 'companyName'),
                        new this.init('公司英文名称', 'companyEnName')
                    ];
                    return tmpArray;
                }
            };

            init_data();

            function init_data() {
                tools.getSellerLst();
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if (data.status == 'success') {
                        vm.categorys1List = data.data;
                    }
                });

                sellerServer.getSourceList().success(function(data) {
                    vm.sourceArray = data.data;
                });

                sellerServer.getMemPackageList({
                    page: 1,
                    pageSize: 1000,
                    status: 1
                }).success(function(data) {
                    vm.packageList = data.page.items;
                });
                vm.pages = commonService.setPageSizeArray(10, 30, 50);

                vm.searchTypeArray = method.getSearchTypeArray();
            };
        }
    ])
    ng.controller('sellerConfirmCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'sellerServer', 'commonTool',
        function($scope, $rootScope, ngDialog,
            sellerServer, commonTool) {
            var vm = $scope.vm = {},
                tools = $scope.tools,
                sellerId = $scope.sellerId,
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
                        sellerIds: sellerId,
                        auditStatus: vm.status
                    };
                    if (vm.status == -1) params.reason = vm.reason;
                    sellerServer.chgSellerAudit(params).success(function(data) {
                        if ('success' == data.status) {
                            ngDialog.closeAll();
                            if (type == 'list') {
                                $rootScope.alertMsgService.setMessage("修改成功", 'success');
                                tools.getSellerLst();
                            } else {
                                tools.getdetail();
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
    ng.controller('batchauditConfirmCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'sellerServer', 'commonTool',
        function($scope, $rootScope, ngDialog,
            sellerServer, commonTool) {
            var vm = $scope.vm = {},
                tools = $scope.tools,
                sellerId = $scope.sellerId,
                isCertExist = $scope.isCertExist,
                isAuditExist = $scope.isAuditExist,
                ids = $scope.ids;
            tools = $.extend(tools, {
                submit: function() {
                    var sellerInfoParams = {
                        sellerIds: sellerId,
                        auditStatus: 3
                    };
                    var sellerAuditParams = {
                        sellerIds: sellerId,
                        auditStatus: 3
                    };
                    var sellerCertParams = {
                        ids: ids,
                        auditStatus: 3,
                        type: 3
                    };
                    sellerServer.chgSellerAudit(sellerInfoParams).success(function(data) {
                        if ('success' == data.status) {
                            if (isAuditExist == 1) {
                                sellerServer.chgSellerIdentityAudit(sellerAuditParams).success(function(data) {
                                    if ('success' == data.status) {
                                        if (isCertExist == 1) {
                                            sellerServer.chgSellerInfoAudit(sellerCertParams).success(function(data) {
                                                if ('success' == data.status) {
                                                    tools.getdetail();
                                                    ngDialog.closeAll();
                                                    $rootScope.alertMsgService.setMessage("修改成功", 'success');
                                                } else {
                                                    $rootScope.alertMsgService.setMessage("审核失败", 'warning');
                                                }
                                            })
                                        } else {
                                            tools.getdetail();
                                            ngDialog.closeAll();
                                        }
                                    } else {
                                        $rootScope.alertMsgService.setMessage("审核失败", 'warning');
                                    }
                                })
                            } else {
                                if (isCertExist == 1) {
                                    sellerServer.chgSellerInfoAudit(sellerCertParams).success(function(data) {
                                        if ('success' == data.status) {
                                            tools.getdetail();
                                            ngDialog.closeAll();
                                            $rootScope.alertMsgService.setMessage("修改成功", 'success');
                                        } else {
                                            $rootScope.alertMsgService.setMessage("审核失败", 'warning');
                                        }
                                    })
                                } else {
                                    tools.getdetail();
                                    ngDialog.closeAll();
                                }
                            }

                        } else {
                            $rootScope.alertMsgService.setMessage("审核失败", 'warning');
                        }
                    })


                },
                close: function() {
                    ngDialog.closeAll();
                }
            });

        }
    ])

    ng.controller('showMoreImgCtrl', ['$scope', '$rootScope', 'ngDialog', 'commonTool',
        function($scope, $rootScope, ngDialog, commonTool) {

            var vm = $scope.vm = {};
            vm.imgArray = $scope.imgArray;
            console.log(vm.imgArray);
            vm.imgIndex = 0;

            vm.imageStart = 0;

            vm.imageEnd = vm.imgArray.length - 1;

            var tools = $scope.tools = {};
            tools = $.extend(tools, {
                prevImage: function() {
                    if (vm.imgIndex == 0) return;
                    vm.imgIndex--;
                    this.setImageLsit();
                },
                nextImage: function() {
                    if (vm.imgIndex == vm.imgArray.length - 1) return;
                    vm.imgIndex++;
                    this.setImageLsit();
                },
                setImageLsit: function() {
                    if (vm.imgArray.length <= 13) return;
                    if (vm.imgIndex < 6) return;
                    if (vm.imgIndex > vm.imgArray.length - 7) return;

                    vm.imageStart = vm.imgIndex - 6;
                    vm.imageEnd = vm.imgIndex + 6;
                    // vm.imageStart = vm.imgIndex - 5 > 0 ? vm.imgIndex - 5 : 0;
                    // vm.imageEnd = vm.imageEnd + 5 > vm.imgArray.length - 1 ? vm.imgArray.length - 1 : vm.imageEnd + 5;
                    vm.imageStart
                    console.log(vm.imageStart, vm.imageEnd);
                },
                chxImageByIndex: function(index) {
                    vm.imgIndex = index;
                    this.setImageLsit();
                }
            });

            tools.setImageLsit();
        }
    ])


    ng.controller('whiteListConfirmCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'sellerServer', 'commonTool',
        function($scope, $rootScope, ngDialog,
            sellerServer, commonTool) {
            var vm = $scope.vm = {},
                tools = $scope.tools,
                sellerId = $scope.sellerId,
                status = $scope.status;

            vm.status = status;

            tools = $.extend(tools, {
                submit: function() {
                    var params = {
                        sellerId: sellerId,
                        isFreeAduit: status,
                    };
                    sellerServer.setFreeAuditQuote(params).success(function(data) {
                        if ('success' == data.status) {
                            ngDialog.closeAll();
                            $rootScope.alertMsgService.setMessage('修改成功', 'success');
                            tools.getdetail();
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


    ng.controller('testSellerConfirmCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        'sellerServer', 'commonTool',
        function($scope, $rootScope, ngDialog,
            sellerServer, commonTool) {
            var vm = $scope.vm = {},
                tools = $scope.tools,
                sellerId = $scope.sellerId,
                userId = $scope.userId,
                status = $scope.status;

            vm.status = status;

            tools = $.extend(tools, {
                submit: function() {
                    var params = {
                        sellerId: sellerId,
                        userId: userId,
                        isTestAccount: status
                    };
                    sellerServer.chxTestAccountStatus(params).success(function(data) {
                        if ('success' == data.status) {
                            ngDialog.closeAll();
                            $rootScope.alertMsgService.setMessage('修改成功', 'success');
                            tools.getdetail();
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

    ng.controller('SellerDetailCtrl', [
        '$scope', '$rootScope', '$http',
        'ngDialog', 'api', '$location',
        'sellerServer', 'commonService', 'commonTool', '$uibModal',
        function(
            $scope, $rootScope, $http,
            ngDialog, api, $location,
            sellerServer, commonService, commonTool, $uibModal) {
            // commonTool
            var vm = $scope.vm = {};
            var info = $scope.info = {};
            var search = $location.search();
            var tools = $scope.tools = {};
            var linkTab = search.tab ? search.tab : 0;
            tools.sellerId = parseInt(search.sellerId);
            vm.activeTab = 0;

            // 定义baseInfo模块修改资料变量
            vm.modifyData = {
                typeNo: null,
                type: null,
                typeName: null,
                email: null,
                mobile: null,
                companyName: null,
                companyEnName: null,
                mainCategoryId: null
            };
            vm.modifyDataTemp = {
                email: null,
                mobile: null,
                companyName: null,
                companyEnName: null,
                mainCategoryId: null
            }


            $rootScope = $.extend($rootScope, {
                // 基本信息
                baseInfoTemplate: "/controller/seller/sellerDetail/baseInfo.html",
                // 店铺信息
                shopInfoTemplate: "/controller/seller/sellerDetail/shopInfo.html",
                // 商品信息
                productInfoTemplate: "/controller/seller/sellerDetail/productInfo.html",
                // 市场信息
                marketInfoTemplate: "/controller/seller/sellerDetail/marketInfo.html",
                // 增值信息
                appreciationInfoTemplate: "/controller/seller/sellerDetail/appreciationInfo.html",
                // 邮件推广
                promotionEmailTemplate: "/controller/seller/sellerDetail/promotionEmail.html",
                // 采购需求
                purchaseInfoTemplate: "/controller/seller/sellerDetail/purchaseInfo.html",
                // 询盘
                inquiryInfoTemplate: "/controller/seller/sellerDetail/inquiryInfo.html",
                // 公司形象
                shopCompanyPicTemplate: "/controller/seller/sellerDetail/shop/companypic.html",
                // 专属域名
                shopCompanyDomainTemplate: "/controller/seller/sellerDetail/shop/domain.html",
                // 公司Logo
                shopCompanyLogoTemplate: "/controller/seller/sellerDetail/shop/companylogo.html",
                // 视频信息
                shopCompanyVedioTemplate: "/controller/seller/sellerDetail/shop/companyvideo.html",
                // 跟进记录
                recordInfoTemplate: "/controller/seller/sellerDetail/recordInfo.html"
            });

            /**************************************************
                                邮件推广
            **************************************************/
            let promotionEmailTools = $scope.promotionEmailTools = {};

            promotionEmailTools.list = null;

            vm.pages = commonService.setPageSizeArray(10, 30, 50);

            let pagingEmail = $scope.pagingEmail = {
                sellerId: tools.sellerId,
                page: 1,
                pageSize: 10
            }


            promotionEmailTools = $.extend(promotionEmailTools, {
                getPromotionEmailList() {
                    sellerServer.getedmList(pagingEmail)
                        .success((data) => {
                            if (data.page.items != null) {
                                promotionEmailTools.list = data.page.items;
                            } else {
                                promotionEmailTools.list = [];
                            }
                            pagingEmail.total = data.page.total;
                        })
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        pagingEmail.page = promotionEmailTools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) {
                        pagingEmail.page = 1;
                    }
                    this.getPromotionEmailList();
                }

            })

            /**************************************************
                               市场信息
             **************************************************/
            var marketTools = $scope.marketTools = {};
            var marketInfo = $scope.marketInfo = {};

            var marketMethod = {
                key: '',
                value: '',
                init: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                getYearArray: function() {
                    var tmpArray = [];
                    var date = new Date();
                    for (var i = 2000; i <= date.getFullYear(); i++) {
                        tmpArray.push(new this.init('' + i, '' + i));
                    }
                    return tmpArray;
                }
            };
            // 营业情况
            marketTools = $.extend(marketTools, {
                isBusinessNotify: false,
                toMarketInfo: function() {
                    // 营业情况
                    this.getSellerBusinessInfo();
                    // 出口情况
                    this.getSellerExportInfo();
                    // 贸易条款
                    this.getSellerTradeInfo();

                    this.init_MarketData();
                },
                getSellerBusinessInfo: function() {
                    sellerServer.getSellerBusinessInfo({
                        sellerId: tools.sellerId
                    }).success(function(data) {
                        if (commonTool.isEmpty(data.data)) return;
                        marketInfo.businessInfo = data.data;
                    })
                },
                toNotifyBusiness: function() {
                    this.isBusinessNotify = true;
                },
                toEnsureBusiness: function() {

                    if (marketInfo.businessInfo == null || marketInfo.businessInfo.length <= 0) return;

                    var yearArr = [];


                    for (var i = 0, len = marketInfo.businessInfo.length; i < len; i++) {
                        var item = marketInfo.businessInfo[i];
                        if (item.annualSales <= 0) {
                            $rootScope.alertMsgService.setMessage('营业额要大于0', 'warning');
                            return;
                        }
                        if (item.exportRatio <= 0) {
                            $rootScope.alertMsgService.setMessage('出口比例要大于0', 'warning');
                            return;
                        }
                        if ($.inArray(item.accountingYear, yearArr) == -1) yearArr.push(item.accountingYear);
                    }

                    console.log(yearArr.length == marketInfo.businessInfo.length);
                    if (yearArr.length != marketInfo.businessInfo.length) {
                        $rootScope.alertMsgService.setMessage('会计年度冲突', 'warning');
                        return;
                    }
                    this.isBusinessNotify = false;
                    var param = {};
                    param.businessList = marketInfo.businessInfo;
                    sellerServer.chgSellerBusinessInfo(JSON.stringify(param)).success(function(data) {
                        marketTools.getSellerBusinessInfo();
                        $rootScope.alertMsgService.setMessage('修改成功', 'success');
                    })
                },
                toCancelBusiness: function() {
                    this.isBusinessNotify = false;
                    this.getSellerBusinessInfo();
                },
                init_MarketData: function() {
                    marketTools.yearArray = marketMethod.getYearArray();
                },
                chxExportRatio: function(item) {
                    var tmp = parseInt(item.exportRatio);
                    item.exportRatio = tmp > 100 ? 100 : item.exportRatio;
                }
            });

            // 出口情况
            marketTools = $.extend(marketTools, {
                isExportNotify: false,
                getSellerExportInfo: function() {
                    sellerServer.getSellerExportInfo({
                        sellerId: tools.sellerId
                    }).success(function(data) {
                        if (commonTool.isEmpty(data.data)) return;
                        marketInfo.exportInfo = data.data;
                    })
                },
                toNotifyExport: function() {
                    this.isExportNotify = true;
                },
                toEnsureExport: function() {

                    if (marketInfo.exportInfo.states == null || marketInfo.exportInfo.states.length <= 0) return;

                    if (commonTool.isEmpty(marketInfo.exportInfo.annualExportSales)) {
                        $rootScope.alertMsgService.setMessage('请输入年出口销售额', 'warning');
                        return;
                    }

                    var sum = 0;
                    var tradeAreaArr = [];

                    for (var i = 0, len = marketInfo.exportInfo.states.length; i < len; i++) {
                        item = marketInfo.exportInfo.states[i];
                        if (item.annualSales <= 0) {
                            $rootScope.alertMsgService.setMessage('营业额要大于0', 'warning');
                            return;
                        }
                        if ($.inArray(item.tradeArea, tradeAreaArr) == -1) tradeAreaArr.push(item.tradeArea);
                        sum = sum + item.annualSales;
                    }

                    if (tradeAreaArr.length != marketInfo.exportInfo.states.length) {
                        $rootScope.alertMsgService.setMessage('出口信息冲突', 'warning');
                        return;
                    }

                    if (sum > marketInfo.exportInfo.annualExportSales) {
                        $rootScope.alertMsgService.setMessage('营业额总和不能大于年出口销售额！', 'warning');
                        return;
                    }
                    this.isExportNotify = false;
                    var param = {};
                    delete marketInfo.exportInfo["datas"];
                    delete marketInfo.exportInfo["createBy"];
                    delete marketInfo.exportInfo["createTime"];
                    delete marketInfo.exportInfo["updateBy"];
                    delete marketInfo.exportInfo["updateTime"];
                    param = marketInfo.exportInfo;
                    sellerServer.chgSellerExportInfo(JSON.stringify(param)).success(function(data) {
                        marketTools.getSellerExportInfo();
                        $rootScope.alertMsgService.setMessage('修改成功', 'success');
                    })
                },
                toCancelExport: function() {
                    this.isExportNotify = false;
                    this.getSellerExportInfo();
                },
                checkAnnualSales: function(item) {
                    item.exportRatio = (parseFloat(item.annualSales) / marketInfo.exportInfo.annualExportSales * 100).toFixed(2);
                },
                checkTotalSales: function(total) {
                    if (commonTool.isEmpty(total)) return;
                    angular.forEach(marketInfo.exportInfo.states, function(item) {
                        item.exportRatio = (parseFloat(item.annualSales) / total * 100).toFixed(2);
                    })
                }
            })

            // 贸易条款
            marketTools = $.extend(marketTools, {
                isTradeNotify: false,
                getSellerTradeInfo: function() {
                    sellerServer.getSellerTradeInfo({
                        sellerId: tools.sellerId
                    }).success(function(data) {
                        if (commonTool.isEmpty(data.data)) return;
                        marketInfo.tradeInfo = data.data;
                        marketTools.chxMarkStatus(marketInfo.tradeInfo.acceptPayTermsDatas);
                        marketTools.chxMarkStatus(marketInfo.tradeInfo.acceptPayCurrenyDatas);
                        marketTools.chxMarkStatus(marketInfo.tradeInfo.payTypeDatas);
                    })
                },
                toNotifyTrade: function() {
                    this.isTradeNotify = true;
                },
                toEnsureTrade: function() {

                    var reg = /^[\w\s`~!@#$%^&*()_+\-=[\]{}\\|;':"/,.?]*$/ig;
                    if (!reg.test(marketInfo.tradeInfo.offshorePort)) {
                        $rootScope.alertMsgService.setMessage('离岸港口格式错误', 'warning');
                        return;
                    }
                    this.isTradeNotify = false;
                    var params = {
                        acceptPayTerms: marketTools.getTardeArrayTarget(marketInfo.tradeInfo.acceptPayTermsDatas),
                        acceptPayCurreny: marketTools.getTardeArrayTarget(marketInfo.tradeInfo.acceptPayCurrenyDatas),
                        payType: marketTools.getTardeArrayTarget(marketInfo.tradeInfo.payTypeDatas),
                        sellerId: tools.sellerId,
                        tradeId: marketInfo.tradeInfo.tradeId,
                        offshorePort: marketInfo.tradeInfo.offshorePort
                    };
                    sellerServer.chgSellerTradeInfo(params).success(function(data) {
                        marketTools.getSellerTradeInfo();
                        $rootScope.alertMsgService.setMessage('修改成功', 'success');
                    })
                },
                toCancelTrade: function() {
                    this.isTradeNotify = false;
                    this.getSellerTradeInfo();
                },
                chxMarkStatus: function(array) {
                    angular.forEach(array, function(item) {
                        item.isMark = item.isMark == 1 ? true : false;
                    })
                },
                getTardeArrayTarget: function(array) {
                    if (array == null || array.length <= 0) return;
                    var tmpArray = [];
                    angular.forEach(array, function(item) {
                        item.isMark ? tmpArray.push(item.code) : '';
                    });
                    return tmpArray.join(',');
                }
            })

            tools = $.extend(tools, {

                getdetail: function(sellerId) {
                    sellerServer.getSellerDetail(tools.sellerId).success(function(data) {
                        if ('success' == data.status) {
                            vm.item = data.data;
                            //console.log(vm.item);
                            commonService.getDictItems('factory_staff_number,factory_certification').success(function(data) {
                                vm.factoryArray = data;
                            });
                            tools.getSellerStatus();


                        }
                    });
                },
                setTestAccount: function(status) {
                    $scope.userId = vm.item.personInfo.userId;
                    $scope.sellerId = tools.sellerId;
                    $scope.tools = tools;
                    $scope.status = status;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        templateUrl: 'confirmTest.html',
                        controller: 'testSellerConfirmCtrl'
                    })
                },
                setQuoteWhiteList: function(status) {
                    $scope.sellerId = tools.sellerId;
                    $scope.tools = tools;
                    $scope.status = status;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        templateUrl: 'confirmWhiteList.html',
                        controller: 'whiteListConfirmCtrl'
                    })
                },
                getSellerStatus: function() {
                    var obj = {
                        statusTab: -10,
                        paidSeller: 0,
                        exibitor: 0,
                        page: 1,
                        pageSize: 10,
                        sellerId: tools.sellerId,
                        total: 1
                    }
                    sellerServer.getSellerList(obj).success(function(data) {
                        console.log(data);
                        vm.sellerAuditStatus = data.data.items[0];
                    })
                },
                auditDialog: function(auditStatus) {
                    $scope.sellerId = tools.sellerId;
                    $scope.tools = tools;
                    $scope.type = 'detail';
                    $scope.status = auditStatus;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'sellerDetailDlgId',
                        controller: 'sellerConfirmCtrl'
                    })
                },
                chxSellerAudit: function(status) {
                    $scope.sellerId = tools.sellerId;
                    $scope.tools = tools;
                    $scope.type = 'sellerDetail';
                    $scope.status = status;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'sellerAuditConfirm.html',
                        controller: 'sellerAuditToConfirmCtrl'
                    })
                },
                chxCertStatus: function(auditStatus, id, auditLogId) {
                    $scope.sellerIds = id + '@' + auditLogId;
                    $scope.tools = tools;
                    $scope.status = auditStatus;
                    $scope.type = 3;
                    $scope.pageType = 'sellerDetail';
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'certConfirm.html',
                        controller: 'sellerAuditConfirmCtrl'
                    })
                },
                enLarge: function(str_img) {
                    $scope.str_img = str_img;
                    $uibModal.open({
                        animation: true,
                        templateUrl: '/controller/index/enlarge.html',
                        controller: 'SqEnLargeCtrl',
                        size: '',
                        scope: $scope,
                        resolve: {
                            index: function() {
                                return -1;
                            }
                        }
                    })
                },
                batchaudit: function() {
                    var personStatus = vm.item.personInfo.auditStatus;
                    if (personStatus == 0 || personStatus == 1 || personStatus == null || personStatus == '') {
                        $rootScope.alertMsgService.setMessage('账户信息未完善', 'warning');
                        return;
                    }
                    var certInfo = vm.item.certInfo;
                    var audit = vm.item.authInfo;
                    $scope.sellerId = tools.sellerId;
                    $scope.tools = tools;
                    $scope.isCertExist = certInfo == null || certInfo.id == null ? 0 : 1;
                    $scope.ids = certInfo == null || certInfo.id == null ? null : certInfo.id + '@' + certInfo.auditLogId;
                    $scope.isAuditExist = audit == null || audit == undefined ? 0 : 1;

                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'batchauditConfirm.html',
                        controller: 'batchauditConfirmCtrl'
                    })

                },
                chxSellerDetailTabs: function(tabIndex) {
                    vm.activeTab = tabIndex;
                },
                showMoreImg: function(imgArray) {
                    if (imgArray == null || imgArray.length <= 0) return;
                    $scope.imgArray = imgArray;

                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 640,
                        templateUrl: '/controller/seller/photo.html',
                        controller: 'showMoreImgCtrl'
                    })
                },
                close: function() {
                    ngDialog.closeAll();
                },
                // 详情页修改资料
                modifyData: function(type, val) {
                    /**
                     * 0: email
                     * 1: mobile
                     * 2: company chinese name
                     * 3: company english name
                     * 4: company main category
                     */
                    vm.modifyData.type = type;
                    switch (type) {
                        case 'email':
                            vm.modifyData.typeName = '邮箱';
                            vm.modifyData.typeNo = 0;
                            break;
                        case 'mobile':
                            vm.modifyData.typeName = '手机号码';
                            vm.modifyData.typeNo = 1;
                            break;
                        case 'companyName':
                            vm.modifyData.typeName = '公司名称（中文）';
                            vm.modifyData.typeNo = 2;
                            break;
                        case 'companyEnName':
                            vm.modifyData.typeName = '公司名称（英文）';
                            vm.modifyData.typeNo = 3;
                            break;
                        case 'mainCategoryId':
                            vm.modifyData.typeName = '主营行业';
                            vm.modifyData.typeNo = 4;
                            break;
                    }
                    vm.modifyData[type] = val;
                    vm.modifyDataTemp[type] = val;
                    vm.modifyDataDlg = ngDialog.open({
                        template: 'modifyDataDlgId',
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        width: 550,
                        title: "修改-" + vm.modifyData.typeName,
                        controller: ['$scope', function($scope) {
                            var tools = $scope.tools;
                            commonService.getAllCategorysOfLevel1().success(function(data) {
                                if (data.status == 'success') {
                                    vm.categorys1List = data.data;
                                }
                            });
                            $scope.submit = function() {
                                var params = {
                                    sellerId: tools.sellerId,
                                    sellerInfoType: vm.modifyData.typeNo,
                                    sellerInfoValue: vm.modifyData[vm.modifyData.type]
                                };
                                // 校验
                                if (vm.modifyData.type == 'email') {
                                    if (!/^[a-zA-Z0-9-_.@]+$/.test(params.sellerInfoValue)) {
                                        $rootScope.alertMsgService.setMessage('请输入正确的' + vm.modifyData.typeName, 'warning');
                                        return;
                                    }
                                }
                                if (vm.modifyData.type == 'mobile') {
                                    if (!/0?(13|14|15|17|18)[0-9]{9}/.test(params.sellerInfoValue)) {
                                        $rootScope.alertMsgService.setMessage('请输入正确的' + vm.modifyData.typeName, 'warning');
                                        return;
                                    }
                                }
                                if (vm.modifyData.type == 'companyName' || vm.modifyData.type == 'companyEnName') {
                                    if (params.sellerInfoValue == '') {
                                        $rootScope.alertMsgService.setMessage(vm.modifyData.typeName + '不能为空', 'warning');
                                        return;
                                    }
                                }
                                if (vm.modifyData.type == 'mainCategoryId') {
                                    if (params.sellerInfoValue == undefined) {
                                        $rootScope.alertMsgService.setMessage('请选择' + vm.modifyData.typeName, 'warning');
                                        return;
                                    }
                                }

                                if (vm.modifyData[vm.modifyData.type] == vm.modifyDataTemp[vm.modifyData.type]) {
                                    $rootScope.alertMsgService.setMessage('内容没任何修改', 'success');
                                    tools.close();
                                } else {
                                    // 提交
                                    sellerServer.updateSellerInfo(params).success(function(data) {
                                        if (data.status == 'success') {
                                            tools.getdetail(tools.sellerId);
                                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                            // 重置 modifyData
                                            tools.modifyDataReset();
                                            tools.close();
                                        } else {
                                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                        }
                                    });
                                }
                            }
                        }]
                    });
                },
                modifyDataReset: function() {
                    vm.modifyData = {
                        type: null,
                        typeName: null,
                        email: null,
                        mobile: null,
                        companyName: null,
                        companyEnName: null,
                        mainCategoryId: null
                    };
                }
            });

            tools.getdetail();
            /**************************************************
                                店铺信息
             **************************************************/
            var sellerShopTools = $scope.sellerShopTools = {};
            var sellerShopInfo = $scope.purchaseInfo = {
                sellerId: tools.sellerId
            };

            sellerShopTools = $.extend(sellerShopTools, {
                toSellerShop: function() {
                    this.getSellerShopInfo();
                },
                getSellerShopInfo: function() {
                    sellerServer.getShopinfo(sellerShopInfo).success(function(data) {
                        vm.shopInfo = data.data;
                        sellerShopTools.adjustShopContent();
                    })
                },
                showVideo: function(url) {
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'showVideo.html',
                        controller: 'ShowVideoCtrl',
                        size: '',
                        scope: $scope,
                        resolve: {
                            url: function() {
                                return url;
                            }
                        }
                    })
                },
                chxShopAudit: function(auditStatus, id, auditLogId, type) {
                    $scope.sellerIds = id + '@' + auditLogId;
                    $scope.tools = sellerShopTools;
                    $scope.status = auditStatus;
                    $scope.type = type;
                    $scope.pageType = 'shopDetail';
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'certConfirm.html',
                        controller: 'sellerAuditConfirmCtrl'
                    })
                },
                adjustShopContent: function() {
                    sellerShopTools.auditStatusArray = [];
                    if (commonTool.isEmpty(vm.shopInfo)) return;
                    var titleArray = ['companylogo', 'companypic', 'companyvideo', 'domain'];
                    angular.forEach(titleArray, function(item) {
                        var tmpItem = vm.shopInfo[item];
                        if (commonTool.isEmpty(tmpItem.items) || tmpItem.items.length <= 0 || commonTool.isEmpty(tmpItem.items[0].auditStatus) || commonTool.isEmpty(tmpItem.items[0].auditDate)) return;
                        sellerShopTools.auditStatusArray.push(initAuditObj(item, tmpItem.items));
                    });
                }

            });

            function initAuditObj(itemName, obj) {
                var tmpObj = {
                    name: itemName,
                    auditDate: obj[0].auditDate,
                    auditor: obj[0].auditor,
                    auditStatus: obj[0].auditStatus,
                    unPassReason: obj[0].unPassReason
                }
                return tmpObj;
            }



            /**************************************************
                                采购需求
             **************************************************/
            var method = {
                key: '',
                value: '',
                init: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                getReadStatusArray: function() {
                    return [new this.init('未读', 0), new this.init('已读', 1)];
                },
                getQuoteStatusArray: function() {
                    return [new this.init('未报价', 0), new this.init('已报价', 1)];
                },
                getQuoteAuditStatusArray: function() {
                    return [new this.init('待审核', 1), new this.init('审核通过', 2), new this.init('审核不通过', -1)];
                },
                getPurchaseMateStatusArray: function() {
                    return [new this.init('系统匹配', 0), new this.init('干预匹配', 1)];
                }
            };

            var tabs = $scope.tabs = {};
            tabs.imgUrl = imgUrl;
            var purchaseTools = $scope.purchaseTools = {};
            var purchaseInfo = $scope.purchaseInfo = {
                // 卖家ID
                sellerId: parseInt(search.sellerId),
                // 是否报价
                isQuote: null,
                // 是否已读
                isRead: null,
                // 匹配类型
                matchType: null,
                // 报价审核状态
                quoteAuditState: null,
                // 报价结束时间
                quoteDateFrom: null,
                // 报价开始时间
                quoteDateTo: null,
                page: 1,
                pageSize: 10
            };
            purchaseTools = $.extend(purchaseTools, {
                status: 0,
                toPurchase: function() {
                    init_purchase();
                },
                getPurchaseList: function() {
                    purchaseTools.purchaseList = [];
                    sellerServer.getPurchaseList(commonTool.filterParam(purchaseInfo), purchaseTools.status).success(function(data) {
                        if (!commonTool.isEmpty(data.page)) {
                            purchaseTools.purchaseList = data.page.items;
                            purchaseTools.total = data.page.total;
                        }
                    })
                },
                search: function() {
                    purchaseInfo.page = 1;
                    this.getPurchaseList();
                },
                reset: function() {
                    purchaseInfo.isQuote = null;
                    purchaseInfo.isRead = null;
                    purchaseInfo.matchType = null;
                    purchaseInfo.quoteAuditState = null;
                    purchaseInfo.quoteDateFrom = null;
                    purchaseInfo.quoteDateTo = null;
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        purchaseInfo.page = purchaseTools.newpagesize;
                        purchaseTools.newpagesize = null;
                    } else if (type == 0) {
                        purchaseInfo.page = 1;
                    }
                    purchaseTools.getPurchaseList();
                },
                getMessages: function(param) {
                    tabs.messages = [];
                    sellerServer.getContactMsg(param).success(function(rs) {
                        if (rs.status == 'success') {
                            tabs.messages = rs.data;
                        }
                    })
                },
                showMsgDialog: function(messageId) {
                    var pm = {};
                    pm.messageId = messageId;
                    this.getMessages(pm);
                    ngDialog.open({
                        title: "站内信沟通内容",
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        templateUrl: '/controller/purchase/message.html',
                        width: 700
                    })
                }
            });

            function init_purchase() {
                purchaseTools.pages = commonService.setPageSizeArray(10, 30, 50);
                purchaseTools.getPurchaseList();
                purchaseTools.readStatusArray = method.getReadStatusArray();
                purchaseTools.quoteStatusArray = method.getQuoteStatusArray();
                purchaseTools.quoteAuditStatusArray = method.getQuoteAuditStatusArray();
                purchaseTools.purchaseMateStatusArray = method.getPurchaseMateStatusArray();
            };

            /**************************************************
                                  询盘
             **************************************************/

            var enquiryTools = $scope.enquiryTools = {};
            var enquiryInfo = $scope.enquiryInfo = {
                ddSellerType: 3,
                messageState: 2,

                page: 1,
                pageSize: 10
            };

            method = $.extend(method, {
                getEnquiryReadStatusArray: function() {
                    return [new this.init('未读', 0), new this.init('已读', 1)];
                },
                getEnquiryReplyStatusArray: function() {
                    return [new this.init('是', 0), new this.init('否', 1)];
                },
                getEnquiryTypeArray: function() {
                    return [new this.init('公司询盘', 0), new this.init('商品询盘', 1)];
                }
            });

            enquiryTools = $.extend(enquiryTools, {

                toInquiry: function() {
                    init_inquiry();
                },
                getEnquiryList: function() {
                    sellerServer.getEnquiryList(commonTool.filterParam(enquiryInfo)).success(function(data) {
                        if (!commonTool.isEmpty(data.data)) {
                            enquiryTools.enquiryList = data.data.items;
                            enquiryInfo.total = data.data.total;
                        }

                    })
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
            });

            function init_inquiry() {
                enquiryInfo.ddSellerValue = vm.item.personInfo.sellerId;
                enquiryTools.pages = commonService.setPageSizeArray(10, 30, 50);
                enquiryTools.getEnquiryList();
            };
            /**************************************************
                                  广告列表
             **************************************************/
            var adKeyowrdTools = $scope.adKeyowrdTools = {};
            var adKeyowrdInfo = $scope.adKeyowrdInfo = {

                status: 3,

                page: 1,
                pageSize: 10
            };
            adKeyowrdTools = $.extend(adKeyowrdTools, {
                toAdKeyword: function() {
                    init_AdKeyword();
                },
                getAdKeywordList: function() {
                    sellerServer.getAdKeywordList(commonTool.filterParam(adKeyowrdInfo)).success(function(data) {
                        adKeyowrdTools.adKeyowrdList = data.data.items;
                        adKeyowrdTools.total = data.page.total;
                    })
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        adKeyowrdInfo.page = adKeyowrdTools.newpagesize;
                        adKeyowrdTools.newpagesize = null;
                    } else if (type == 0) {
                        adKeyowrdInfo.page = 1;
                    }
                    adKeyowrdTools.getAdKeywordList();
                }
            })

            function init_AdKeyword() {

                adKeyowrdTools.pages = commonService.setPageSizeArray(10, 30, 50);

                if (vm.item.companyInfo.companyId == null) return;

                adKeyowrdInfo.companyId = vm.item.companyInfo.companyId;

                adKeyowrdTools.getAdKeywordList();
            }



            /**************************************************
                                 套餐列表
            **************************************************/
            var memberPackageTools = $scope.memberPackageTools = {};
            var memberPackageInfo = $scope.memberPackageInfo = {
                isExhibitor: 0,
                isExpireSoon: 0,
                sKey: 1,
                timeKey: 1,

                sellerId: tools.sellerId,

                page: 1,
                pageSize: 10
            };

            memberPackageTools = $.extend(memberPackageTools, {
                toMemberPackage: function() {
                    init_MemberPackage();
                    this.getComsume();
                },
                getComsume: function() {
                    sellerServer.addedValueInfo({
                        sellerId: tools.sellerId
                    }).success(function(data) {
                        vm.addValInfo = data.data;
                    })
                },
                getMemberPackageList: function() {
                    sellerServer.getMemberPackage(commonTool.filterParam(memberPackageInfo)).success(function(data) {
                        memberPackageTools.memberPackageList = data.data.items;
                        memberPackageTools.setPackageStatus();
                    })
                },
                setPackageStatus: function() {
                    if (commonTool.isEmpty(memberPackageTools.memberPackageList)) return;
                    var now = new Date().getTime();
                    for (var i = 0, len = memberPackageTools.memberPackageList.length; i < len; i++) {

                        var item = memberPackageTools.memberPackageList[i];

                        var pkgStatus;
                        if (item.currentPackage == 0 && item.status == 3) {
                            pkgStatus = 0;
                        } else if (item.currentPackage == 1 && item.status == 3) {
                            pkgStatus = 1;
                        } else {
                            pkgStatus = -1;
                        }

                        memberPackageTools.memberPackageList[i].pkgStatus = pkgStatus;

                    }
                    console.log(memberPackageTools.memberPackageList);
                }
            })

            function init_MemberPackage() {
                memberPackageTools.getMemberPackageList();
            }

            /**************************************************
                                 产品列表
            **************************************************/
            var productTools = $scope.productTools = {};
            var productInfo = $scope.productInfo = {
                status: 99,
                sellerId: tools.sellerId,

                page: 1,
                pageSize: 10
            };
            vm.productStatus = null;
            method = $.extend(method, {
                getProductStatusArray: function() {
                    return [new this.init('待审核', 0), new this.init('已读', 1), new this.init('已读', 1), ];
                }
            });
            productTools = $.extend(productTools, {
                toProductInfo: function() {
                    productTools.status = 0;
                    this.getProducts();
                    productTools.pages = commonService.setPageSizeArray(10, 30, 50);
                },
                getProducts: function() {
                    sellerServer.getProducts(productInfo).success(function(data) {
                        productTools.productList = data.data.items;
                        productTools.total = data.page.total;
                    })
                },
                getProductsByStatus: function(productStatus) {
                    switch (productStatus) {
                        case "2":
                            productInfo.status = 2;
                            break;
                        case "3":
                            productInfo.status = -1;
                            break;
                        case "7":
                            productInfo.status = 3;
                            break;
                        default:
                            productInfo.status = 99;
                            break;
                    }
                    this.getProducts();
                },
                search: function() {
                    productInfo.page = 1;
                    this.getProducts();
                },
                reset: function() {
                    productInfo.isSensitiveWord = null;
                    vm.productStatus = null;
                    productInfo.productName = null;
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        productInfo.page = productTools.newpagesize;
                        productTools.newpagesize = null;
                    } else if (type == 0) {
                        productInfo.page = 1;
                    }
                    productTools.getProducts();
                },
                // 修改商品状态（单个）
                chgOneStatus: function(status, productId, isOnline) {
                    status == -1 ? this.chxstatus(productId) : this.confirm(productId, status, isOnline);
                },
                // 修改状态
                chxstatus: function(productId) {
                    $scope.productId = productId;
                    $scope.tools = productTools;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 500,
                        templateUrl: 'makesure.html',
                        controller: 'MakeSureCtrl1'
                    })
                },
                // 确认
                confirm: function(productId, status, isOnline) {
                    $scope.productId = productId;
                    $scope.status = status;
                    $scope.isOnline = isOnline;
                    $scope.tools = productTools;
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        templateUrl: 'confirm.html',
                        controller: 'GoodConfirmCtrl'
                    })
                }
            });

            /**************************************************
                                跟进记录 
             **************************************************/
            var recordTools = $scope.recordTools = {};
            var recordInfo = $scope.recordInfo = {
                sellerId: tools.sellerId,
                page: 1,
                pageSize: 10
            };
            vm.needNode = true;

            recordTools = $.extend(recordTools, {
                toFollowRecord: function() {
                    this.getSellerRecordInfo();
                },
                // 供应商跟进记录
                getSellerRecordInfo: function() {
                    sellerServer.getRecordInfo(recordInfo).success(function(data) {
                        if (data.page.items != null) {
                            if (data.page.items.length > 0) {
                                vm.recordInfo = data.page.items;
                            } else {
                                vm.recordInfo = [];
                            }
                        } else {
                            vm.recordInfo = [];
                        }
                        recordTools.total = data.page.total;
                        recordTools.pageSize = data.page.pageSize;
                    })
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
                    this.followSellerConfirm(ids);
                    vm.selectionItme = [];
                    vm.followContent = sellerServer.getFlolowDlgContent();
                },
                // 跟进供应商 弹出层
                followSellerConfirm: function(ids) {
                    $scope.ids = ids;
                    $scope.recordTools = recordTools;

                    vm.sellerDlg = {
                        freeFollowPeriod: 30,
                        followStatus: 0,
                        followContent: '',
                        followSignType: null,
                        followSignWay: null,
                        followSignWayArray: [],
                        remarkContent: ''
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
                            var recordTools = $scope.recordTools;

                            $scope.submit = function() {
                                var params = {
                                    sellerIds: ids,
                                    followStatus: vm.sellerDlg.followStatus,
                                    freeFollowPeriod: vm.sellerDlg.freeFollowPeriod,
                                    remark: vm.sellerDlg.remarkContent
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


                                sellerServer.addsellerFollowRecord(params)
                                    .success(function(data) {
                                        if ('success' === data.status) {
                                            vm.needNode = true;
                                            recordTools.getSellerRecordInfo();
                                            $rootScope.alertMsgService.setMessage('操作成功', 'success');
                                            recordTools.close();
                                        } else {
                                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                                        }
                                    })
                            }

                        }]

                    });
                },
                close: function() {
                    vm.needNode = true;
                    ngDialog.closeAll();
                },
                getnewpage: function(type) {
                    if (type == 1) {
                        recordTools.page = recordTools.newpagesize;
                        recordTools.newpagesize = null;
                    } else if (type == 0) {
                        recordInfo.page = 1;
                    }
                    recordTools.getSellerRecordInfo();
                },
                // 免跟进周期
                freeFollowPeriod: [{
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
                }]
            });

            recordTools.pages = commonService.setPageSizeArray(10, 30, 50);

            // 检测Include模板加载，加载完成后执行Tab跳转
            var loadedCount = 0;
            $scope.$on('$includeContentLoaded', function(e, templateName) {
                loadedCount += 1;
                if (loadedCount == 13) {
                    if (parseInt(linkTab)) {
                        tools.chxSellerDetailTabs(parseInt(linkTab));
                        switch (parseInt(linkTab)) {
                            case 0:
                                tools.getdetail();
                                break;
                            case 1:
                                sellerShopTools.toSellerShop();
                                break;
                            case 2:
                                productTools.toProductInfo();
                                break;
                            case 3:
                                tools.initTrade();
                                tools.initBusiness();
                                tools.initExport();
                                marketTools.toMarketInfo();
                                break;
                            case 4:
                                adKeyowrdTools.toAdKeyword();
                                memberPackageTools.toMemberPackage();
                                break;
                            case 5:
                                purchaseTools.toPurchase();
                                break;
                            case 6:
                                enquiryTools.toInquiry();
                                break;
                            case 7:
                                recordTools.toFollowRecord();
                                break;
                        }
                    }
                }

            });
        }
    ])
    ng.controller('SqEnLargeCtrl', ['$scope', '$location', '$uibModalInstance',
        function($scope, $location, $uibModalInstance) {
            $scope.en_img = $scope.str_img;
            $scope.turnBack = function() {
                $uibModalInstance.dismiss('cancel');
            }
        }
    ])
    ng.filter("array2Str", function() {
        return function(arr, splitSymbol) {
            if (arr == null || splitSymbol == "undefined") {
                return '';
            }
            if (splitSymbol == null || splitSymbol == "undefined") {
                splitSymbol = ',';
            }
            return arr.join(',');
        }
    })
    ng.filter('checkPurchaseRead', function() {
        return function(status) {
            switch (status) {
                case 0:
                    return '未读';
                case 1:
                    return '已读';
                default:
                    return '';
            }
        }
    })
    ng.filter("checkPurchaseQuote", function() {
        return function(status) {
            switch (status) {
                case 0:
                    return '未报价';
                case 1:
                    return '已报价';
                default:
                    return '';
            }
        }
    })

    ng.filter("checkPurchaseQuoteAudit", function() {
        return function(status) {
            switch (status) {
                case 1:
                    return '待审核';
                case 2:
                    return '通过';
                case -1:
                    return '不通过';
                default:
                    return '';
            }
        }
    })

    ng.filter("checkPurchaseMatchType", function() {
        return function(status) {
            switch (status) {
                case 0:
                    return '系统匹配';
                case 1:
                    return '干预匹配';
                default:
                    return '';
            }
        }
    })

    ng.filter("checkEnquiryMessageType", function() {
        return function(status) {
            switch (status) {
                case 1:
                    return '产品询盘';
                case 5:
                    return '公司询盘';
                default:
                    return '';
            }
        }
    })

    ng.filter("checkEnquiryReply", function() {
        return function(status) {
            switch (status) {
                case 1:
                    return '是';
                case 0:
                    return '否';
                default:
                    return '';
            }
        }
    })

    ng.filter("auditchaseState", function() {
        return function(auditStatus) {
            switch (auditStatus) {
                case 0:
                    return '新增';
                case 1:
                    return '修改';
                case 2:
                    return '待审核';
                case 3:
                    return '审核通过';
                case -1:
                    return '审核不通过';
                default:
                    return '未提交';
            }
        };
    })

    ng.filter("sellerInfoAuditStatus", function() {
        return function(auditStatus) {
            switch (auditStatus) {
                case 1:
                    return '待审核';
                case 2:
                    return '审核不通过';
                case 3:
                    return '审核通过';
                default:
                    return '未提交';
            }
        };
    })

    ng.filter("chxSellerAuthAuditStatus", function() {
        return function(sellerAuthAuditStatus) {
            switch (sellerAuthAuditStatus) {
                case 2:
                    return '待审核';
                case 3:
                    return '审核通过';
                case -1:
                    return '审核不通过';
                default:
                    return '未提交';
            }
        };
    })

    ng.filter("chxShopStatus", function() {
        return function(shopStatus) {
            switch (shopStatus) {
                case 0:
                    return '未提交';
                case 1:
                    return '已开通';
                default:
                    return '未提交';
            }
        };
    })

    ng.filter("chxOtherInfoAuditStatus", function() {
        return function(shopStatus) {
            switch (shopStatus) {
                case 0:
                    return '待审核';
                case 1:
                    return '审核完成';
                default:
                    return '未提交';
            }
        };
    })

    ng.filter("chxProductStatus", function() {
        return function(productStatus) {
            switch (productStatus) {
                case 0:
                    return '待审核';
                case 1:
                    return '审核完成';
                default:
                    return '未提交';
            }
        };
    })

    ng.filter("chxTradeItem", function() {
        return function(array) {

            if (array == null || array.length <= 0) return;

            var tmpArray = [];
            angular.forEach(array, function(item) {
                item.isMark ? tmpArray.push(item.enName) : '';
            });
            return tmpArray.join(',');
        };
    })

    ng.filter("chxFatoryStaff", function() {
        return function(number, array) {
            if (array == undefined || array == null || array.length <= 0) return;
            if (number == null || number == '') return;
            for (var i = 0; i < array.length; i++) {
                if (number == array[i].id) return array[i].cnName;
            }
        };
    })

    ng.filter("chxFatoryCertification", function() {
        return function(certification, array) {
            if (array == undefined || array == null || array.length <= 0) return;
            if (certification == null || certification == '') return;
            var tmpArray = [];
            angular.forEach(array, function(item) {
                if (certification.indexOf(item.id) != -1) {
                    tmpArray.push(item.cnName);
                }
            });
            return tmpArray.join(',')
        };
    })

    ng.filter("chxAuditTitle", function() {
        return function(shopInfoName) {
            var tmpObj = {
                companylogo: "公司Logo",
                companypic: "公司形象信息",
                companyvideo: "视频信息",
                domain: "专属域名信息"
            }
            return tmpObj[shopInfoName];
        };
    })

    ng.filter("packageTimeStatus", function() {
        return function(pkgStatus) {
            switch (pkgStatus) {
                case -1:
                    return '已过期';
                case 0:
                    return '未生效';
                case 1:
                    return '当前套餐';
                default:
                    return '未生效';
            }
        };
    })
    ng.filter("seller_array2string", function() {
        return function(arr) {
            return arr.join('|');
        }
    })

    ng.filter("chxPromotionEmailStatus", () => {
            return (peStatus) => {
                switch (peStatus) {
                    case 3:
                        return "审核完成";
                    case 4:
                        return "审核完成";
                    case 2:
                        return "待审核";
                    default:
                        return "未提交";
                }
            }
        }),

        ng.filter("statusFilter", function() {
            return function(status) {
                switch (status) {
                    case 1:
                        return "未提交";
                    case 2:
                        return "待审核";
                    case 3:
                        return "审核通过";
                    case 4:
                        return "审核不通过";
                }

            }
        })
});
