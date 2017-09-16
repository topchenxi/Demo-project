define(['app'], function(app) {

    app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/index');
        //$urlRouterProvider.when( '/index', '/buyer');
        // $urlRouterProvider.otherwise('/index');

        $stateProvider
            //首页
            .state('index', {
                url: '/index',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@index': {
                        templateUrl: './template/menu.html'
                    },
                    'main@index': {
                        templateUrl: './controller/index/homepage.html',
                        controller: 'homePageCtrl'
                    }
                }
            })
            //登入
            .state('login', {
                url: '/login',

                templateUrl: './controller/login/login.html',
                controller: 'LoginCtrl'


            })

            // 买家管理
            .state('buyer', {
                url: '/buyer',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@buyer': {
                        templateUrl: './template/menu.html'
                    },
                    'main@buyer': {
                        templateUrl: './controller/buyer/index.html',
                        controller: 'BuyerListCtrl'
                    }
                }
            })
            //买家列表
            .state('buyer.list', {
                url: '/list',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/index.html',
                        controller: 'BuyerListCtrl'
                    }
                }
            })
            //买家详情
            .state('buyer.detail', {
                url: '/detail',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/detail.html',
                        controller: 'BuyerDetailCtrl'
                    }
                }
            })

            .state('buyer.cfecDetail', {
                url: '/cfecDetail',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/buyerDetail/cfecDetail.html',
                        controller: 'cfecBuyerDetailCtrl'
                    }
                }
            })

            .state('buyer.addBuyer', {
                url: '/addBuyer',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/addBuyer.html',
                        controller: 'addBuyerCtrl'
                    }
                }
            })
            // 我跟进的采购商
            .state('buyer.myfollow', {
                url: '/myfollow',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/myfollow.html',
                        controller: 'myfollowCtrl'
                    }
                }
            })
            // 采购商跟进管理
            .state('buyer.follow', {
                url: '/follow',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/followManage.html',
                        controller: 'followManageCtrl'
                    }
                }
            })

            // 采购商互动行为跟踪
            .state('buyer.trackingList', {
                url: '/trackingList',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/trackingList.html',
                        controller: 'buyerTrackingListCtrl'
                    }
                }
            })
            // 采购需求未二次回复列表
            .state('buyer.purchaseReply', {
                url: '/purchaseReply',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/purchaseReply.html',
                        controller: 'buyerPurchaseReplyCtrl'
                    }
                }
            })
            // 询盘未二次回复列表
            .state('buyer.inquiryReply', {
                url: '/inquiryReply',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/inquiryReply.html',
                        controller: 'buyerInquiryReplyCtrl'
                    }
                }
            })

            .state('buyer.myFollowHistory', {
                url: '/myFollowHistory',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/myFollowHistory.html',
                        controller: 'myFollowHistoryCtrl'
                    }
                }
            })

            .state('buyer.followList', {
                url: '/followList',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/followList.html',
                        controller: 'followListCtrl'
                    }
                }
            })

            // 采购商——新增标签记录
            .state('buyer.addLabelRecord', {
                url: '/addLabelRecord',
                views: {
                    'main@buyer': {
                        templateUrl: './controller/buyer/addLabelRecord.html',
                        controller: 'addLabelRecordCtrl'
                    }
                }
            })


            //**买家管理 } end **/

            // ** 采购需求管理 start{
            .state('purchase', {
                url: '/purchase',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@purchase': {
                        templateUrl: './template/menu.html'
                    },
                    'main@purchase': {
                        templateUrl: './controller/purchase/purchaseReqList.html',
                        controller: 'PurchaseReqListCtrl'
                    }
                }
            })
            // 采购需求
            .state('purchase.purchaseReqList', {
                url: '/purchaseReqList',
                views: {
                    'main@purchase': {
                        templateUrl: './controller/purchase/purchaseReqList.html',
                        controller: 'PurchaseReqListCtrl'
                    }
                }
            })
            // 采购需求详情
            .state('purchase.purchaseReqDetail', {
                url: '/purchaseReqDetail',
                views: {
                    'main@purchase': {
                        templateUrl: './controller/purchase/purchaseReqDetail.html',
                        controller: 'PurchaseReqDetailCtrl'
                    }
                }
            })
            // 采购需求匹配
            .state('purchase.purchaseMatchList', {
                url: '/purchaseMatchList',
                views: {
                    'main@purchase': {
                        templateUrl: './controller/purchase/purchaseMatchList.html',
                        controller: 'PurchaseMatchListCtrl'
                    }
                }
            })
            // 采购需求匹配详情页
            .state('purchase.purchaseMatchDetail', {
                url: '/purchaseMatchDetail',
                views: {
                    'main@purchase': {
                        templateUrl: './controller/purchase/purchaseMatchDetail.html',
                        controller: 'PurchaseMatchDetailCtrl'
                    }
                }
            })
            // 采购需求匹配干预
            .state('purchase.purchaseMatchIntervene', {
                url: '/purchaseMatchIntervene',
                views: {
                    'main@purchase': {
                        templateUrl: './controller/purchase/purchaseMatchIntervene.html',
                        controller: 'PurchaseMatchInterveneCtrl'
                    }
                }
            })
            // 报价管理
            .state('purchase.purchaseQuoteList', {
                url: '/purchaseQuoteList',
                views: {
                    'main@purchase': {
                        templateUrl: './controller/purchase/purchaseQuoteList.html',
                        controller: 'PurchaseQuoteListCtrl'
                    }
                }
            })
            .state('purchase.purchaseQuoteDetail', {
                url: '/purchaseQuoteDetail',
                views: {
                    'main@purchase': {
                        templateUrl: './controller/purchase/purchaseQuoteDetail.html',
                        controller: 'PurchaseQuoteDetailCtrl'
                    }
                }
            })
            .state('purchase.exemptReview', {
                url: '/exemptReview',
                views: {
                    'main@purchase': {
                        templateUrl: './controller/purchase/exemptReview.html',
                        controller: 'exemptReviewCtrl'
                    }
                }
            })

            // } 采购需求管理 end **/

            // ** 询盘管理 start{
            .state('inquiryMgr', {
                url: '/inquiryMgr',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@inquiryMgr': {
                        templateUrl: './template/menu.html'
                    },
                    'main@inquiryMgr': {
                        templateUrl: './controller/inquiryMgr/inquiryList.html',
                        controller: 'InquiryListCtrl'
                    }
                }
            })
            // 询盘列表
            .state('inquiryMgr.list', {
                url: '/list',
                views: {
                    'main@inquiryMgr': {
                        templateUrl: './controller/inquiryMgr/inquiryList.html',
                        controller: 'InquiryListCtrl'
                    }
                }
            })
            // 询盘详情
            .state('inquiryMgr.detail', {
                url: '/detail',
                views: {
                    'main@inquiryMgr': {
                        templateUrl: './controller/inquiryMgr/inquiryDetail.html',
                        controller: 'InquiryDetailCtrl'
                    }
                }
            })

            // } 采购需求管理 end **/



            //**商品管理 start { **/
            // 商品管理
            .state('goods', {
                url: '/goods',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@goods': {
                        templateUrl: './template/menu.html'
                    },
                    'main@goods': {
                        templateUrl: './controller/goods/index.html',
                        controller: 'ListCtrl'
                    }
                }
            })
            //商品列表
            .state('goods.list', {
                url: '/list',
                views: {
                    'main@goods': {
                        templateUrl: './controller/goods/index.html',
                        controller: 'ListCtrl'
                    }
                }
            })
            //商品详情
            .state('goods.detail', {
                url: '/detail',
                views: {
                    'main@goods': {
                        templateUrl: './controller/goods/detail.html',
                        controller: 'DetailCtrl'
                    }
                }
            })
            //议价商品详情
            .state('goods.barginDetail', {
                url: '/barginDetail',
                views: {
                    'main@goods': {
                        templateUrl: './controller/goods/barginDetail.html',
                        controller: 'BarginDetailCtrl'
                    }
                }
            })
            //商品详情PC预览
            .state('goods.pcPreview', {
                url: '/pcPreview',
                views: {
                    'main@goods': {
                        templateUrl: './controller/goods/pcPreview.html',
                        controller: 'goodsPreviewCtrl'
                    }
                }
            })
            //商品详情WAP预览
            .state('goods.wapPreview', {
                url: '/wapPreview',
                views: {
                    'main@goods': {
                        templateUrl: './controller/goods/wapPreview.html',
                        controller: 'goodsPreviewCtrl'
                    }
                }
            })
            // 商品标签
            .state('goods.productTag', {
                url: '/productTag',
                views: {
                    'main@goods': {
                        templateUrl: './controller/goods/productTagList.html',
                        controller: 'productTagCtrl'
                    }
                }
            })

            // 添加修改商品标签
            .state('goods.saveOrUpdateTag', {
                url: '/saveOrUpdateTag',
                views: {
                    'main@goods': {
                        templateUrl: './controller/goods/saveOrUpdateTag.html',
                        controller: 'saveOrUpdateTagCtrl'
                    }
                }
            })
            //**商品管理 } end **/

            //**卖家管理 start { **/
            //卖家管理
            .state('seller', {
                url: '/seller',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@seller': {
                        templateUrl: './template/menu.html'
                    },
                    'main@seller': {
                        templateUrl: './controller/seller/index.html',
                        controller: 'SellerCtrl'
                    }
                }
            })
            //卖家列表
            .state('seller.list', {
                url: '/list',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/index.html',
                        controller: 'SellerCtrl'
                    }
                }
            })
            //卖家详情
            .state('seller.detail', {
                url: '/detail',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/detail.html',
                        controller: 'SellerDetailCtrl'
                    }
                }
            })
            //卖家资质审核列表
            .state('seller.qualificationAuditIndex', {
                url: '/qualificationAuditIndex',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/qualificationAuditIndex.html',
                        controller: 'QualificationAuditIndexCtrl'
                    }
                }
            })
            //卖家资质审核详情
            .state('seller.qualificationAuditDetail', {
                url: '/qualificationAuditDetail',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/qualificationAuditDetail.html',
                        controller: 'QualificationAuditDetailCtrl'
                    }
                }
            })
            //卖家专属域名审核
            .state('seller.domainNameList', {
                url: '/domainNameList',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/domainNameList.html',
                        controller: 'SellerInfoCtrl'
                    }
                }
            })
            //卖家公司形象审核
            .state('seller.companyImageList', {
                url: '/companyImageList',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/companyImageList.html',
                        controller: 'SellerInfoCtrl'
                    }
                }
            })
            //卖家认证证书审核
            .state('seller.certificateList', {
                url: '/certificateList',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/certificateList.html',
                        controller: 'SellerInfoCtrl'
                    }
                }
            })
            .state('seller.certificateDetail', {
                url: '/certificateDetail',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/certificateDetail.html',
                        controller: 'CertificateDetail'
                    }
                }
            })
            //卖家视频审核
            .state('seller.videoList', {
                url: '/videoList',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/videoList.html',
                        controller: 'SellerInfoCtrl'
                    }
                }
            })
            //卖家公司LOGO审核
            .state('seller.logoList', {
                url: '/logoList',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/logoList.html',
                        controller: 'SellerInfoCtrl'
                    }
                }
            })
            // 供应商互动行为跟踪
            .state('seller.trackingList', {
                url: '/trackingList',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/trackingList.html',
                        controller: 'sellerTrackingListCtrl'
                    }
                }
            })
            // 采购需求未二次回复列表
            .state('seller.purchaseReply', {
                url: '/purchaseReply',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/purchaseReply.html',
                        controller: 'purchaseReplyCtrl'
                    }
                }
            })
            // 询盘未二次回复列表
            .state('seller.inquiryReply', {
                url: '/inquiryReply',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/inquiryReply.html',
                        controller: 'inquiryReplyCtrl'
                    }
                }
            })
            // 店铺诊断管理
            .state('seller.shopDiagnosis', {
                url: '/shopDiagnosis',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/shopDiagnosis.html',
                        controller: 'shopDiagnosisCtrl'
                    }
                }
            })
            // 供应商 绑定展会通列表
            .state('seller.bindExhibitionList', {
                url: '/bindExhibitionList',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/bindExhibitionList.html',
                        controller: 'sellerBindExhibitionListCtrl'
                    }
                }
            })
            // 供应商 绑定展会通
            .state('seller.bindExhibition', {
                url: '/bindExhibition',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/bindExhibition.html',
                        controller: 'sellerBindExhibitionCtrl'
                    }
                }
            })
            // 供应商 绑定展会通 详情
            .state('seller.bindExhibitionDetail', {
                url: '/bindExhibitionDetail',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/bindExhibitionDetail.html',
                        controller: 'sellerBindExhibitionDetailCtrl'
                    }
                }
            })
            // 供应商 展会通 消息审核
            .state('seller.exhibitionMsgList', {
                url: '/exhibitionMsgList',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/exhibitionMsgList.html',
                        controller: 'sellerExhibitionMsgListCtrl'
                    }
                }
            })
            // 供应商 展会通 消息审核详情
            .state('seller.exhibitionMsgDetail', {
                url: '/exhibitionMsgDetail',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/exhibitionMsgDetail.html',
                        controller: 'sellerExhibitionMsgDetailCtrl'
                    }
                }
            }).state('seller.eShop', {
                // e店通
                url: '/eShop',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/eShop.html',
                        controller: 'eShopCtrl'
                    }
                }
            }).state('seller.eShopAudit', {
                url: '/eShopAudit',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/eShopAudit.html',
                        controller: 'eShopAuditCtrl'
                    }
                }
            }).state('seller.eShopDetail', {
                url: '/eShopDetail',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/eShopDetail.html',
                        controller: 'eShopDetailCtrl'
                    }
                }
            }).state('seller.addEShop', {
                url: '/addEShop',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/addEShop.html',
                        controller: 'addEShopCtrl'
                    }
                }
            }).state('seller.fans', {
                url: '/fans',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/fans.html',
                        controller: 'fansCtrl'
                    }
                }
            }).state('seller.BindFans', {
                url: '/BindFans',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/BindFans.html',
                        controller: 'BindFansCtrl'
                    }
                }
            }).state('seller.fansDetail', {
                url: '/fansDetail',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/fansDetail.html',
                        controller: 'fansDetailCtrl'
                    }
                }
            }).state('seller.accountBalance', {
                url: '/accountBalance',
                views: {
                    'main@seller': {
                        templateUrl: './controller/seller/accountBalance.html',
                        controller: 'accountBalanceCtrl'
                    }
                }
            })



            /*卖家账户管理*/
            .state('sellerAccount', {
                url: '/sellerAccount',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@sellerAccount': {
                        templateUrl: './template/menu.html'
                    },
                    'main@sellerAccount': {
                        templateUrl: './controller/sellerAccount/RMBAccount.html',
                        controller: 'RMBAccountCtrl'
                    }
                }
            })
            //虚拟账号
            .state('sellerAccount.fictitiousAccount', {
                url: '/fictitiousAccount',
                views: {
                    'main@sellerAccount': {
                        templateUrl: 'controller/sellerAccount/fictitiousAccount.html',
                        controller: 'fictitiousAccountCtrl'
                    }
                }
            })
            //虚拟账号详情
            .state('sellerAccount.fictitiousDetail', {
                url: '/fictitiousDetail',
                views: {
                    'main@sellerAccount': {
                        templateUrl: 'controller/sellerAccount/fictitiousDetail.html',
                        controller: 'fictitiousDetailCtrl'
                    }
                }
            })
            //人民币账号审核
            .state('sellerAccount.RMBAccount', {
                url: '/RMBAccount',
                views: {
                    'main@sellerAccount': {
                        templateUrl: 'controller/sellerAccount/RMBAccount.html',
                        controller: 'RMBAccountCtrl'
                    }
                }
            })
            //人民币账号审核详情
            .state('sellerAccount.RMBDetail', {
                url: '/RMBDetail',
                views: {
                    'main@sellerAccount': {
                        templateUrl: 'controller/sellerAccount/RMBDetail.html',
                        controller: 'RMBDetailCtrl'
                    }
                }
            })
            //外币账号审核
            .state('sellerAccount.ForeignAccount', {
                url: '/ForeignAccount',
                views: {
                    'main@sellerAccount': {
                        templateUrl: 'controller/sellerAccount/ForeignAccount.html',
                        controller: 'ForeignAccountCtrl'
                    }
                }
            })
            //外币账号审核详情
            .state('sellerAccount.ForeignDetail', {
                url: '/ForeignDetail',
                views: {
                    'main@sellerAccount': {
                        templateUrl: 'controller/sellerAccount/ForeignDetail.html',
                        controller: 'ForeignDetailCtrl'
                    }
                }
            })
            //人民币账号修改审核
            .state('sellerAccount.RMBChange', {
                url: '/RMBChange',
                views: {
                    'main@sellerAccount': {
                        templateUrl: 'controller/sellerAccount/RMBChange.html',
                        controller: 'RMBChangeCtrl'
                    }
                }
            })
            //人民币账号修改审核详情
            .state('sellerAccount.RMBChangeDetail', {
                url: '/RMBChangeDetail',
                views: {
                    'main@sellerAccount': {
                        templateUrl: 'controller/sellerAccount/RMBChangeDetail.html',
                        controller: 'RMBChangeDetailCtrl'
                    }
                }
            })
            //外币账号修改审核
            .state('sellerAccount.ForeignChange', {
                url: '/ForeignChange',
                views: {
                    'main@sellerAccount': {
                        templateUrl: 'controller/sellerAccount/ForeignChange.html',
                        controller: 'ForeignChangeCtrl'
                    }
                }
            })
            //外币账号修改审核详情
            .state('sellerAccount.ForeignChangeDetail', {
                url: '/ForeignChangeDetail',
                views: {
                    'main@sellerAccount': {
                        templateUrl: 'controller/sellerAccount/ForeignChangeDetail.html',
                        controller: 'ForeignChangeDetailCtrl'
                    }
                }
            })



            /*交易管理*/
            .state('tradeManager', {
                url: '/tradeManager',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@tradeManager': {
                        templateUrl: './template/menu.html'
                    },
                    'main@tradeManager': {
                        templateUrl: './controller/tradeManager/tradeManager.html',
                        controller: 'tradeManagerCtrl'
                    }
                }
            })

            //消费类——渠道流入资金
            .state('tradeManager.consumePipline', {
                url: '/consumePipline',
                views: {
                    'main@tradeManager': {
                        templateUrl: 'controller/tradeManager/consumePipline.html',
                        controller: 'consumePiplineCtrl'
                    }
                }
            })

            //消费类——卖家虚拟账户流入资金
            .state('tradeManager.consumeSeller', {
                url: '/consumeSeller',
                views: {
                    'main@tradeManager': {
                        templateUrl: 'controller/tradeManager/consumeSeller.html',
                        controller: 'consumeSellerCtrl'
                    }
                }
            })

            //提现——卖家虚拟账户资金申请
            .state('tradeManager.withdrawSellerApply', {
                url: '/withdrawSellerApply',
                views: {
                    'main@tradeManager': {
                        templateUrl: 'controller/tradeManager/withdrawSellerApply.html',
                        controller: 'withdrawSellerApplyCtrl'
                    }
                }
            })

            //提现——待打款给卖家资金
            .state('tradeManager.withdrawPaySeller', {
                url: '/withdrawPaySeller',
                views: {
                    'main@tradeManager': {
                        templateUrl: 'controller/tradeManager/withdrawPaySeller.html',
                        controller: 'withdrawPaySellerCtrl'
                    }
                }
            })

            //提现——待打款给买家资金
            .state('tradeManager.withdrawPayBuyer', {
                url: '/withdrawPayBuyer',
                views: {
                    'main@tradeManager': {
                        templateUrl: 'controller/tradeManager/withdrawPayBuyer.html',
                        controller: 'withdrawPayBuyerCtrl'
                    }
                }
            })

            //退款——卖家虚拟账户退款记录
            .state('tradeManager.refundSeller', {
                url: '/refundSeller',
                views: {
                    'main@tradeManager': {
                        templateUrl: 'controller/tradeManager/refundSeller.html',
                        controller: 'refundSellerCtrl'
                    }
                }
            })
            //**订单管理 start { **/
            //订单管理
            .state('order', {
                url: '/order',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@order': {
                        templateUrl: './template/menu.html'
                    },
                    'main@order': {
                        templateUrl: './controller/order/orderList.html',
                        controller: 'OrderListCtrl'
                    }
                }
            })
            //订单列表
            .state('order.list', {
                url: '/list',
                views: {
                    'main@order': {
                        templateUrl: './controller/order/orderList.html',
                        controller: 'OrderListCtrl'
                    }
                }
            })
            //订单详情-线下订单
            .state('order.offlineOrderDetail', {
                url: '/offlineOrderDetail',
                views: {
                    'main@order': {
                        templateUrl: './controller/order/offlineOrderDetail.html',
                        controller: 'OrderDetailCtrl'
                    }
                }
            })
            //主订单详情-单个商品
            .state('order.detailOne', {
                url: '/detailOne',
                views: {
                    'main@order': {
                        templateUrl: './controller/order/orderDetailOne.html',
                        controller: 'OrderDetailCtrl'
                    }
                }
            })
            // 主订单多个商品
            .state('order.detailMany', {
                url: '/detailMany',
                views: {
                    'main@order': {
                        templateUrl: './controller/order/orderDetailMany.html',
                        controller: 'OrderDetailCtrl'
                    }
                }
            })
            //子订单详情
            .state('order.orderDetail', {
                url: '/orderDetail',
                views: {
                    'main@order': {
                        templateUrl: './controller/order/orderDetail.html',
                        controller: 'OrderDetailCtrl'
                    }
                }
            })
            //**订单管理 end } **/

            //**合同管理 start { **/
            .state('contract', {
                url: '/contract',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@contract': {
                        templateUrl: './template/menu.html'
                    },
                    'main@contract': {
                        templateUrl: './controller/contract/contractList.html',
                        controller: 'ContractListCtrl'
                    }
                }
            })
            .state('contract.contractList', {
                url: '/contractList',
                views: {
                    'main@contract': {
                        templateUrl: './controller/contract/contractList.html',
                        controller: 'ContractListCtrl'
                    }
                }
            })
            .state('contract.contractView', {
                url: '/contractView',
                views: {
                    'main@contract': {
                        templateUrl: './controller/contract/contractView.html',
                        controller: 'ContractDetailCtrl'
                    }
                }
            })
            .state('contract.updateContract', {
                url: '/updateContract',
                views: {
                    'main@contract': {
                        templateUrl: './controller/contract/updateContract.html',
                        controller: 'ContractDetailCtrl'
                    }
                }
            })
            //**合同管理 end } **/

            //**类目属性管理 start { **/
            //类目属性管理
            .state('categoryattribute', {
                url: '/categoryattribute',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@categoryattribute': {
                        templateUrl: './template/menu.html'
                    },
                    'main@categoryattribute': {
                        'template': '<iframe width="100%" height="920px" src="' + categoryUrl + '/oms/product/industrys/listFtl.cf" id="ifrm"></iframe>'
                    }
                }
            })
            // 行业管理
            .state('categoryattribute.industrylist', {
                url: '/industrylist',
                views: {
                    'main@categoryattribute': {
                        'template': '<iframe width="100%" height="920px" src="' + categoryUrl + '/oms/product/industrys/listFtl.cf" id="ifrm"></iframe>'
                    }
                }
            })
            //类目管理
            .state('categoryattribute.categorylist', {
                url: '/categorylist',
                views: {
                    'main@categoryattribute': {
                        'template': '<iframe width="100%" height="920px" src="' + categoryUrl + '/oms/product/category/listFtl.cf" id="ifrm"></iframe>'
                    }
                }
            })
            // 属性值管理
            .state('categoryattribute.attributelist', {
                url: '/attributelist',
                views: {
                    'main@categoryattribute': {
                        'template': '<iframe width="100%" height="920px" src="' + categoryUrl + '/oms/product/propertyValue/listFtl.cf" id="ifrm"></iframe>'
                    }
                }
            })
            //标签组管理
            .state('categoryattribute.lablegrplist', {
                url: '/lablegrplist',
                views: {
                    'main@categoryattribute': {
                        'template': '<iframe width="100%" height="940px" src="' + categoryUrl + '/oms/product/tagGroup/listFtl.cf" id="ifrm"></iframe>'
                    }
                }
            })
            //标签管理
            .state('categoryattribute.lablelist', {
                url: '/lablelist',
                views: {
                    'main@categoryattribute': {
                        'template': '<iframe width="100%" height="920px" src="' + categoryUrl + '/oms/product/tag/listFtl.cf" id="ifrm"></iframe>'
                    }
                }
            })
            //属性规格管理
            .state('categoryattribute.attrtypelist', {
                url: '/attrtypelist',
                views: {
                    'main@categoryattribute': {
                        'template': '<iframe width="100%" height="920px" src="' + categoryUrl + '/oms/product/tag/listFtl.cf" id="ifrm"></iframe>'
                    }
                }
            })
            //**类目属性管理 end } **/

            /* [[==品牌管理 == */
            .state('brandMgr', {
                url: '/brandMgr',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@brandMgr': {
                        templateUrl: './template/menu.html'
                    },
                    'main@brandMgr': {
                        templateUrl: './controller/brandMgr/classifyList.html',
                        controller: 'ClassifyListCtrl'
                    }
                }
            })
            // 111 品牌分类管理
            .state('brandMgr.classify', {
                url: '/classify',
                views: {
                    'main@brandMgr': {
                        templateUrl: 'controller/brandMgr/classifyList.html',
                        controller: 'ClassifyListCtrl'
                    }
                }
            })
            // 112 品牌库管理
            .state('brandMgr.base', {
                url: '/base',
                views: {
                    'main@brandMgr': {
                        templateUrl: 'controller/brandMgr/baseList.html',
                        controller: 'BaseListCtrl'
                    }
                }
            })
            // 113 企业品牌授权管理
            .state('brandMgr.enterpriseBrand', {
                url: '/enterpriseBrand',
                views: {
                    'main@brandMgr': {
                        templateUrl: 'controller/brandMgr/enterpriseBrandList.html',
                        controller: 'EnterpriseBrandListCtrl'
                    }
                }
            })
            // 114 企业品牌有效期查看
            .state('brandMgr.validDate', {
                url: '/validDate',
                views: {
                    'main@brandMgr': {
                        templateUrl: 'controller/brandMgr/validDateList.html',
                        controller: 'ValidDateListCtrl'
                    }
                }
            })
            /* ]] ==品牌管理 == */

            /* [[==报表管理 == */
            .state('reportMgr', {
                url: '/reportMgr',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@reportMgr': {
                        templateUrl: './template/menu.html'
                    },
                    'main@reportMgr': {
                        templateUrl: './controller/reportMgr/sellerReg.html',
                        controller: 'ReportSellerRegCtrl'
                    }
                }
            })
            // 131 卖家注册
            .state('reportMgr.sellerReg', {
                url: '/sellerReg',
                views: {
                    'main@reportMgr': {
                        templateUrl: './controller/reportMgr/sellerReg.html',
                        controller: 'ReportSellerRegCtrl'
                    }
                }
            })
            // 132 卖家登陆
            .state('reportMgr.sellerLogin', {
                url: '/sellerLogin',
                views: {
                    'main@reportMgr': {
                        templateUrl: './controller/reportMgr/sellerLogin.html',
                        controller: 'ReportSellerLoginCtrl'
                    }
                }
            })
            // 133 卖家回复消息
            .state('reportMgr.sellerRespMsg', {
                url: '/sellerRespMsg',
                views: {
                    'main@reportMgr': {
                        templateUrl: './controller/reportMgr/sellerRespMsg.html',
                        controller: 'ReportSellerRespMsgCtrl'
                    }
                }
            })
            // 134 卖家店铺
            .state('reportMgr.sellerShop', {
                url: '/sellerShop',
                views: {
                    'main@reportMgr': {
                        templateUrl: './controller/reportMgr/sellerShop.html',
                        controller: 'ReportSellerShopCtrl'
                    }
                }
            })
            // 135 卖家商品
            .state('reportMgr.sellerProduct', {
                url: '/sellerProduct',
                views: {
                    'main@reportMgr': {
                        templateUrl: './controller/reportMgr/sellerProduct.html',
                        controller: 'ReportSellerProductCtrl'
                    }
                }
            })
            // 136 买家注册
            .state('reportMgr.buyerReg', {
                url: '/buyerReg',
                views: {
                    'main@reportMgr': {
                        templateUrl: './controller/reportMgr/buyerReg.html',
                        controller: 'ReportBuyerRegCtrl'
                    }
                }
            })
            // 137 买家登陆
            .state('reportMgr.buyerLogin', {
                url: '/buyerLogin',
                views: {
                    'main@reportMgr': {
                        templateUrl: './controller/reportMgr/buyerLogin.html',
                        controller: 'ReportBuyerLoginCtrl'
                    }
                }
            })
            // 138 买家询盘
            .state('reportMgr.buyerInquiry', {
                url: '/buyerInquiry',
                views: {
                    'main@reportMgr': {
                        templateUrl: './controller/reportMgr/buyerInquiry.html',
                        controller: 'ReportBuyerInquiryCtrl'
                    }
                }
            })
            // 139 买家交易信息
            .state('reportMgr.buyerTrade', {
                url: '/buyerTrade',
                views: {
                    'main@reportMgr': {
                        templateUrl: './controller/reportMgr/buyerTrade.html',
                        controller: 'ReportBuyerTradeCtrl'
                    }
                }
            })
            // 1310 订单
            .state('reportMgr.order', {
                url: '/order',
                views: {
                    'main@reportMgr': {
                        templateUrl: './controller/reportMgr/order.html',
                        controller: 'ReportOrderCtrl'
                    }
                }
            })

            /* ]] ==报表管理 == */

            /* [[== 财务资金管理 == */
            .state('financeFunds', {
                url: '/financeFunds',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@financeFunds': {
                        templateUrl: './template/menu.html'
                    },
                    'main@financeFunds': {
                        templateUrl: './controller/financeFunds/consumeApproval.html',
                        controller: 'ConsumeApprovalCtrl'
                    }
                }
            })
            // 消费资金审核
            .state('financeFunds.consumeApproval', {
                url: '/consumeApproval',
                views: {
                    'main@financeFunds': {
                        templateUrl: './controller/financeFunds/consumeApproval.html',
                        controller: 'ConsumeApprovalCtrl'
                    }
                }
            })
            // 消费资金审核--查看历史
            .state('financeFunds.consumeHistory', {
                url: '/consumeHistory',
                views: {
                    'main@financeFunds': {
                        templateUrl: './controller/financeFunds/consumeHistory.html',
                        controller: 'ConsumeHistoryCtrl'
                    }
                }
            })
            // 提现资金审核
            .state('financeFunds.withdrawApproval', {
                url: '/withdrawApproval',
                views: {
                    'main@financeFunds': {
                        templateUrl: './controller/financeFunds/withdrawApproval.html',
                        controller: 'WithdrawApprovalCtrl'
                    }
                }
            })
            // 提现资金审核--查看历史/financeFunds/withdrawHistory
            .state('financeFunds.withdrawHistory', {
                url: '/withdrawHistory',
                views: {
                    'main@financeFunds': {
                        templateUrl: './controller/financeFunds/withdrawHistory.html',
                        controller: 'WithdrawHistoryCtrl'
                    }
                }
            })
            // 卖家虚拟账户 SellerVirtualAccount
            .state('financeFunds.SellerVirtualAccount', {
                url: '/SellerVirtualAccount',
                views: {
                    'main@financeFunds': {
                        templateUrl: './controller/financeFunds/sellerVirtualAccount.html',
                        controller: 'SellerVirtualAccountCtrl'
                    }
                }
            })
            // 卖家虚拟账户详情
            .state('financeFunds.sellerVAccountDetail', {
                url: '/sellerVAccountDetail',
                views: {
                    'main@financeFunds': {
                        templateUrl: './controller/financeFunds/sellerVAccountDetail.html',
                        controller: 'SellerVAccountDetailCtrl'
                    }
                }
            })
            // 银行入账流水-信用证
            .state('financeFunds.bankInCredit', {
                url: '/bankInCredit',
                views: {
                    'main@financeFunds': {
                        templateUrl: './controller/financeFunds/bankInCredit.html',
                        controller: 'BankInCreditCtrl'
                    }
                }
            })
            // 银行入账流水-信用证-详情
            .state('financeFunds.bankInCreditDetail', {
                url: '/bankInCreditDetail',
                views: {
                    'main@financeFunds': {
                        templateUrl: './controller/financeFunds/bankInCreditDetail.html',
                        controller: 'BankInCreditDetailCtrl'
                    }
                }
            })
            // 银行入账流水-汇款
            .state('financeFunds.bankInRemit', {
                url: '/bankInRemit',
                views: {
                    'main@financeFunds': {
                        templateUrl: './controller/financeFunds/bankInRemit.html',
                        controller: 'BankInRemitCtrl'
                    }
                }
            })
            // 银行入账流水-汇款-详情
            .state('financeFunds.bankInRemitDetail', {
                url: '/bankInRemitDetail',
                views: {
                    'main@financeFunds': {
                        templateUrl: './controller/financeFunds/bankInRemitDetail.html',
                        controller: 'BankInRemitDetailCtrl'
                    }
                }
            })
            /* ]] == 财务资金管理 == */

            /* [[ == 物流订单管理 == */
            .state('logistics', {
                url: '/logistics',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@logistics': {
                        templateUrl: './template/menu.html'
                    },
                    'main@logistics': {
                        templateUrl: './controller/logistics/logistList.html',
                        controller: 'LogistListCtrl'
                    }
                }
            })
            // 物流订单列表
            .state('logistics.logistList', {
                url: '/logistList',
                views: {
                    'main@logistics': {
                        templateUrl: './controller/logistics/logistList.html',
                        controller: 'LogistListCtrl'
                    }
                }
            })
            // 物流订单详情-快递/空运
            .state('logistics.logistDetail', {
                url: '/logistDetail',
                views: {
                    'main@logistics': {
                        templateUrl: './controller/logistics/logistDetail.html',
                        controller: 'LogistDetailCtrl'
                    }
                }
            })
            // 物流订单详情-海运
            .state('logistics.logistDetailBoat', {
                url: '/logistDetailBoat',
                views: {
                    'main@logistics': {
                        templateUrl: './controller/logistics/logistDetailBoat.html',
                        controller: 'LogistDetailCtrl'
                    }
                }
            })
            /* ]] == 物流订单管理 == */

            /* [[ == 会员套餐管理 == */
            .state('member', {
                url: '/member',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@member': {
                        templateUrl: './template/menu.html'
                    },
                    'main@member': {
                        templateUrl: './controller/member/sellerList.html',
                        controller: 'MemberUserListCtrl'
                    }
                }
            })
            // 会员套餐设置列表
            .state('member.sellerList', {
                url: '/sellerList',
                views: {
                    'main@member': {
                        templateUrl: './controller/member/sellerList.html',
                        controller: 'MemberUserListCtrl'
                    }
                }
            })

            // 会员类型列表
            .state('member.setting', {
                url: '/setting',
                views: {
                    'main@member': {
                        templateUrl: './controller/member/packageList.html',
                        controller: 'MemberPackageListCtrl'
                    }
                }
            })
            /* ]] == 会员套餐管理 == */

            /* [[ == 系统管理 == */
            .state('system', {
                url: '/system',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@system': {
                        templateUrl: './template/menu.html'
                    },
                    'main@system': {
                        templateUrl: './controller/system/userList.html',
                        controller: 'sysUserListCtrl'
                    }
                }
            })

            // 用户列表
            .state('system.userManage', {
                url: '/userManage',
                views: {
                    'main@system': {
                        templateUrl: './controller/system/userList.html',
                        controller: 'sysUserListCtrl'
                    }
                }
            })
            // 用户详情
            .state('system.userDetail', {
                url: '/userDetail',
                views: {
                    'main@system': {
                        templateUrl: './controller/system/userDetail.html',
                        controller: 'sysUserDetailCtrl'
                    }
                }
            })

            // 用户分组列表
            .state('system.userGroupMng', {
                url: '/userGroupMng',
                views: {
                    'main@system': {
                        templateUrl: './controller/system/userGroupList.html',
                        controller: 'sysUserGroupListCtrl'
                    }
                }
            })

            // 角色管理
            .state('system.roleManage', {
                url: '/roleManage',
                views: {
                    'main@system': {
                        templateUrl: './controller/system/roleList.html',
                        controller: 'sysRoleListCtrl'
                    }
                }
            })
            .state('system.roleDetail', {
                url: '/roleDetail',
                views: {
                    'main@system': {
                        templateUrl: './controller/system/roleDetail.html',
                        controller: 'sysRoleDetailCtrl'
                    }
                }
            })

            // 用户个人信息 by ken
            .state('system.userInfo', {
                url: '/userInfo',
                views: {
                    'main@system': {
                        templateUrl: './controller/system/userInfo.html',
                        controller: 'sysUserInfoCtrl'
                    }
                }
            })

            // 操作日志 by ken
            .state('system.operationLog', {
                url: '/operationLog',
                views: {
                    'main@system': {
                        templateUrl: './controller/system/operationLog.html',
                        controller: 'sysOperationLogCtrl'
                    }
                }
            })
            /* ]] == 系统管理 == */

            /* [[ == 广告管理 == */
            // 广告管理
            .state('keywordAdMgr', {
                url: '/keywordAdMgr',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@keywordAdMgr': {
                        templateUrl: './template/menu.html'
                    },
                    'main@keywordAdMgr': {
                        templateUrl: './controller/keywordAdMgr/index.html',
                        controller: 'kwAdMgrListCtrl'
                    }
                }
            })
            //广告管理列表
            .state('keywordAdMgr.list', {
                url: '/list',
                views: {
                    'main@keywordAdMgr': {
                        templateUrl: './controller/keywordAdMgr/index.html',
                        controller: 'kwAdMgrListCtrl'
                    }
                }
            })
            //广告管理列表-新增广告
            .state('keywordAdMgr.addAd', {
                url: '/addAd',
                views: {
                    'main@keywordAdMgr': {
                        templateUrl: './controller/keywordAdMgr/addAd.html',
                        controller: 'kwAdMgrAddCtrl'
                    }
                }
            })
            //广告管理列表-详情
            .state('keywordAdMgr.detail', {
                url: '/detail',
                views: {
                    'main@keywordAdMgr': {
                        templateUrl: './controller/keywordAdMgr/detail.html',
                        controller: 'kwAdMgrDetailCtrl'
                    }
                }
            })
            /* ]] == 广告管理 == */


            /* [[ == EDM邮件推广 == */

            .state('edm', {
                url: '/edm',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@edm': {
                        templateUrl: './template/menu.html'
                    },
                    'main@edm': {
                        templateUrl: './controller/edm/index.html',
                        controller: 'edmListCtrl'
                    }
                }
            })
            // EDM邮件推广列表
            .state('edm.list', {
                url: '/list',
                views: {
                    'main@edm': {
                        templateUrl: './controller/edm/index.html',
                        controller: 'edmListCtrl'
                    }
                }
            })
            // EDM邮件推广详情
            .state('edm.detail', {
                url: '/detail',
                views: {
                    'main@edm': {
                        templateUrl: './controller/edm/detail.html',
                        controller: 'edmDetailCtrl'
                    }
                }
            })
            // EDM充值消费记录列表
            .state('edm.comsumeRecord', {
                url: '/comsumeRecord',
                views: {
                    'main@edm': {
                        templateUrl: './controller/edm/comsumeRecord.html',
                        controller: 'edmComsumeRecordListCtrl'
                    }
                }
            })
            // EDM充值消费记录详细
            .state('edm.comsumeRecordDetail', {
                url: '/comsumeRecordDetail',
                views: {
                    'main@edm': {
                        templateUrl: './controller/edm/comsumeRecordDetail.html',
                        controller: 'edmComsumeRecordDetailCtrl'
                    }
                }
            })

            // EDM发票申请记录列表
            .state('edm.invoiceRecord', {
                url: '/invoiceRecord',
                views: {
                    'main@edm': {
                        templateUrl: './controller/edm/invoiceRecord.html',
                        controller: 'invoiceRecordListCtrl'
                    }
                }
            })

            // EDM资金流水列表
            .state('edm.fundRecord', {
                url: '/fundRecord',
                views: {
                    'main@edm': {
                        templateUrl: './controller/edm/fundRecord.html',
                        controller: 'fundRecordListCtrl'
                    }
                }
            })

            /* ]] == EDM邮件推广 == */


            // 关键词

            .state('keywordMgr', {
                url: '/keywordMgr',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@keywordMgr': {
                        templateUrl: './template/menu.html'
                    },
                    'main@keywordMgr': {
                        templateUrl: './controller/keywordMgr/productKw.html',
                        controller: 'productKwListCtrl'
                    }
                }
            })

            .state('keywordMgr.productKw', {
                url: '/productKw',
                views: {
                    'main@keywordMgr': {
                        templateUrl: './controller/keywordMgr/productKw.html',
                        controller: 'productKwListCtrl'
                    }
                }
            })

            .state('keywordMgr.addProductKw', {
                url: '/addProductKw',
                views: {
                    'main@keywordMgr': {
                        templateUrl: './controller/keywordMgr/addProductKw.html',
                        controller: 'addProductKwCtrl'
                    }
                }
            })

            .state('keywordMgr.sellerKw', {
                url: '/sellerKw',
                views: {
                    'main@keywordMgr': {
                        templateUrl: './controller/keywordMgr/sellerKw.html',
                        controller: 'sellerKwListCtrl'
                    }
                }
            })

            .state('keywordMgr.addSellerKw', {
                url: '/addSellerKw',
                views: {
                    'main@keywordMgr': {
                        templateUrl: './controller/keywordMgr/addSellerKw.html',
                        controller: 'addSellerKwtCtrl'
                    }
                }
            })

            // app内容管理系统

            .state('appCms', {
                url: '/appCms',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@appCms': {
                        templateUrl: './template/menu.html'
                    },
                    'main@appCms': {
                        templateUrl: './controller/appCms/appContentList.html',
                        controller: 'appContentListCtrl'
                    }
                }
            })

            .state('appCms.appContentList', {
                url: '/appContentList',
                views: {
                    'main@appCms': {
                        templateUrl: './controller/appCms/appContentList.html',
                        controller: 'appContentListCtrl'
                    }
                }
            })

            .state('appCms.appEditIndex', {
                url: '/appEditIndex',
                views: {
                    'main@appCms': {
                        templateUrl: './controller/appCms/appEditIndex.html',
                        controller: 'appEditIndexCtrl'
                    }
                }
            })
            .state('appCms.appEditIndex_v2', {
                url: '/appEditIndex_v2',
                views: {
                    'main@appCms': {
                        templateUrl: './controller/appCms/appEditIndex_v2.html',
                        controller: 'appEditIndex_v2Ctrl'
                    }
                }
            })

            .state('appCms.feedBack', {
                url: '/feedBack',
                views: {
                    'main@appCms': {
                        templateUrl: './controller/appCms/feedBack.html',
                        controller: 'feedBackCtrl'
                    }
                }
            })

            .state('appCms.msgPsuh', {
                url: '/msgPsuh',
                views: {
                    'main@appCms': {
                        templateUrl: './controller/appCms/msgPsuh.html',
                        controller: 'msgPsuhCtrl'
                    }
                }
            })

            .state('appCms.userTagMgr', {
                url: '/userTagMgr',
                views: {
                    'main@appCms': {
                        templateUrl: './controller/appCms/userTagMgr.html',
                        controller: 'userTagMgrCtrl'
                    }
                }
            })

            .state('appCms.tagMgr', {
                url: '/tagMgr',
                views: {
                    'main@appCms': {
                        templateUrl: './controller/appCms/tagMgr.html',
                        controller: 'tagMgrCtrl'
                    }
                }
            })

            .state('appCms.addMsgPush', {
                url: '/addMsgPush',
                views: {
                    'main@appCms': {
                        templateUrl: './controller/appCms/addMsgPush.html',
                        controller: 'addMsgPushCtrl'
                    }
                }
            })

            .state('smsMgr', {
                url: '/smsMgr',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@smsMgr': {
                        templateUrl: './template/menu.html'
                    },
                    'main@smsMgr': {
                        templateUrl: './controller/smsMgr/foreignSMSList.html',
                        controller: 'foreignSMSMgrCtrl'
                    }
                }
            })

            .state('smsMgr.foreignSMS', {
                url: '/foreignSMS',
                views: {
                    'main@smsMgr': {
                        templateUrl: './controller/smsMgr/foreignSMSList.html',
                        controller: 'foreignSMSMgrCtrl'
                    }
                }
            })

            .state('smsMgr.foreignSMSDetail', {
                url: '/foreignSMSDetail',
                views: {
                    'main@smsMgr': {
                        templateUrl: './controller/smsMgr/foreignSMSDetail.html',
                        controller: 'foreignSMSDetailCtrl'
                    }
                }
            })

            .state('smsMgr.sendForeignSMS', {
                url: '/sendForeignSMS',
                views: {
                    'main@smsMgr': {
                        templateUrl: './controller/smsMgr/sendForeignSMS.html',
                        controller: 'sendForeignSMSCtrl'
                    }
                }
            })

            .state('activityMgr', {
                url: '/activityMgr',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@activityMgr': {
                        templateUrl: './template/menu.html'
                    },
                    'main@activityMgr': {
                        templateUrl: './controller/activityMgr/activityList.html',
                        controller: 'activityListCtrl'
                    }
                }
            })

            .state('activityMgr.activityList', {
                url: '/activityList',
                views: {
                    'main@activityMgr': {
                        templateUrl: './controller/activityMgr/activityList.html',
                        controller: 'activityListCtrl'
                    }
                }
            })

            .state('activityMgr.activityDetail', {
                url: '/activityDetail',
                views: {
                    'main@activityMgr': {
                        templateUrl: './controller/activityMgr/activityDetail.html',
                        controller: 'activityDetailCtrl'
                    }
                }
            })

            .state('activityMgr.editActivityInfo', {
                url: '/editActivityInfo',
                views: {
                    'main@activityMgr': {
                        templateUrl: './controller/activityMgr/editActivityInfo.html',
                        controller: 'editActivityInfoCtrl'
                    }
                }
            })

            .state('activityMgr.enrollList', {
                url: '/enrollList',
                views: {
                    'main@activityMgr': {
                        templateUrl: './controller/activityMgr/enrollList.html',
                        controller: 'enrollListCtrl'
                    }
                }
            })

            .state('activityMgr.onLineList', {
                url: '/onLineList',
                views: {
                    'main@activityMgr': {
                        templateUrl: './controller/activityMgr/onLineList.html',
                        controller: 'onLineListCtrl'
                    }
                }
            })

            .state('activityMgr.offLineList', {
                url: '/offLineList',
                views: {
                    'main@activityMgr': {
                        templateUrl: './controller/activityMgr/offLineList.html',
                        controller: 'offLineListCtrl'
                    }
                }
            })

            .state('activityMgr.offLineSellerDetail', {
                url: '/offLineSellerDetail',
                views: {
                    'main@activityMgr': {
                        templateUrl: './controller/activityMgr/offLineSellerDetail.html',
                        controller: 'offLineSellerDetailCtrl'
                    }
                }
            })


            .state('snsMgr', {
                url: '/snsMgr',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@snsMgr': {
                        templateUrl: './template/menu.html'
                    },
                    'main@snsMgr': {
                        templateUrl: './controller/snsMgr/sellerList.html',
                        controller: 'snsSellerListCtrl'
                    }
                }
            })

            .state('snsMgr.sellerList', {
                url: '/sellerList',
                views: {
                    'main@snsMgr': {
                        templateUrl: './controller/snsMgr/sellerList.html',
                        controller: 'snsSellerListCtrl'
                    }
                }
            })

            .state('snsMgr.systemList', {
                url: '/systemList',
                views: {
                    'main@snsMgr': {
                        templateUrl: './controller/snsMgr/systemList.html',
                        controller: 'snsSystemListCtrl'
                    }
                }
            })

            .state('snsMgr.positionEdit', {
                url: '/positionEdit',
                views: {
                    'main@snsMgr': {
                        templateUrl: './controller/snsMgr/positionEdit.html',
                        controller: 'positionEditCtrl'
                    }
                }
            })

            .state('snsMgr.addSNS', {
                url: '/addSNS',
                views: {
                    'main@snsMgr': {
                        templateUrl: './controller/snsMgr/addSNS.html',
                        controller: 'addSNSCtrl'
                    }
                }
            })

            .state('snsMgr.snsDetail', {
                url: '/snsDetail',
                views: {
                    'main@snsMgr': {
                        templateUrl: './controller/snsMgr/snsDetail.html',
                        controller: 'snsDetailCtrl'
                    }
                }
            })


            .state('marketDevelopMgr', {
                url: '/marketDevelopMgr',
                views: {
                    '': {
                        templateUrl: './template/layout.html'
                    },
                    'side@marketDevelopMgr': {
                        templateUrl: './template/menu.html'
                    },
                    'main@marketDevelopMgr': {
                        templateUrl: './controller/marketDevelopMgr/productDevList.html',
                        controller: 'productDevListCtrl'
                    }
                }
            })

            .state('marketDevelopMgr.productDevelopMgr', {
                url: '/productDevelopMgr',
                views: {
                    'main@marketDevelopMgr': {
                        templateUrl: './controller/marketDevelopMgr/productDevList.html',
                        controller: 'productDevListCtrl'
                    }
                }
            })

            .state('marketDevelopMgr.productDevDetail', {
                url: '/productDevDetail',
                views: {
                    'main@marketDevelopMgr': {
                        templateUrl: './controller/marketDevelopMgr/productDevDetail.html',
                        controller: 'productDevDetailCtrl'
                    }
                }
            })
            



    })

});