define(['app'], function(app) {
    var tempUrl = "http://172.17.160.5:8080/mockjsdata/9";
    app.constant('api', {
        'paths': url,

        /* 
           公共接口
         */
        // 获取国家列表
        'getDistrictArea': url + '/oms/countrys/districtArea.cf',
        'getCountryCode': url + '/oms/countrys.cf',
        // 省市
        'getProvince': url + '/oms/countrys/province.cf',
        'getCity': url + '/oms/countrys/getDistrictInfo.cf',
        // 获取全部行业列表
        'getIndustrys': coommerurl + '/seller_center/category/loadIndusCategorys.cf',
        // 由行业类目加载一级类目
        'getCategorysByIndusId': coommerurl + '/seller_center/category/loadRootCategorysByIndusId.cf',
        // 获取省市区
        'getDistrict': coommerurl + '/seller_center/category/getDistrictInfo.cf',
        // 图片上传
        'uploadImage': coommerurl + '/seller_center/fdfsUpload/uploadSingleImage.cf',
        // 下载文件
        'download': coommerurl + '/seller_center/fdfsUpload/download.cf',
        // 删除文件
        'delFile': coommerurl + '/seller_center/fdfsUpload/delFile.cf',
        // 获取数据字典，参数：key=groupname1,groupname2
        'getDictItems': url + '/oms/commonData/list.cf',
        // 获取二级来源接口
        // { sourceType: 1, source: 1 }
        // sourceType 为代表来源类型（1 采购商，2 供应商，3 采购需求，4询盘）
        // source 为一级来源的值type2的值
        'getSecondSourceType': url + '/oms/commonData/getSourceFourType.cf',



        /* 
           [[ 采购商接口
         */
        // 获取采购商列表
        getBuyers: url + '/oms/buyer.cf',
        // 查看采购商信息详情
        getBuyerDetail: url + '/oms/buyer/detail.cf',
        // 查看广交会采购商信息详情
        getCfecBuyerDetail: url + '/oms/buyer/cantonfair/detail.cf',
        // 修改采购商状态:审核通过,审核不通过
        chgBuyerAudit: url + '/oms/admin/buyer/audit.cf',
        // 获取采购商来源列表
        getBuyerSourceType: url + '/oms/buyer/getSourceType.cf',
        // 修改采购商信息
        notifyBuyer: url + '/oms/buyer/manage/updatebuyer.cf',
        // 添加采购商
        addBuyer: url + '/oms/buyer/manage/addbuyer.cf',


        // 获取分配给我的采购商
        getMyFollowOfPlatform: url + '/oms/buyer/follow/my.cf',
        // 获取分配给我的采购商
        getMyFollowOfCantonfair: url + '/oms/buyer/cantonfair/my.cf',

        // 分配给我的采购商 -- 加入跟进清单 -- 平台采购商
        addListOfPlat: url + '/oms/userFollowingBuyer/followBuyer.cf',
        // 分配给我的采购商 -- 加入跟进清单 -- 广交会采购商
        addListOfCfec: url + '/oms/userFollowingOperBuyer/followOperBuyer.cf',

        // 分配给我的采购商 -- 从清单移除 -- 平台采购商
        removeListOfPlat: url + '/oms/userFollowingBuyer/unfollowBuyer.cf',
        // 分配给我的采购商 -- 从清单移除 -- 广交会采购商
        removeListOfCfec: url + '/oms/userFollowingOperBuyer/unfollowOperBuyer.cf',

        // 采购商跟进清单 -- 添加跟进记录 -- 平台采购商
        addFollowRecordOfPlat: url + '/oms/buyer/follow/add.cf',
        // 采购商跟进清单 -- 添加跟进记录 -- 广交会采购商
        addFollowRecordOfCfec: url + '/oms/buyer/cantonfair/add.cf',



        // 跟进采购商管理列表 未跟进
        getFollowBuyersByNo: url + '/oms/buyer/follow/notfollow.cf',
        // 跟进采购商管理列表 已跟进
        getFollowBuyersByYes: url + '/oms/buyer/follow/followup.cf',

        // 平台采购商 -- 未分配(未跟进)
        getBuyerPlatUnassigned: url + '/oms/buyerAssignment/unassigned.cf',
        // 平台采购商 -- 已分配(已跟进)
        getBuyerPlatAssigned: url + '/oms/buyerAssignment/assigned.cf',
        // 平台采购商 -- 未分配--批量分配
        saveBuyerPlatFollower: url + '/oms/buyerAssignment/saveFollower.cf',
        // 平台采购商 -- 已分配--更新公司跟进人
        batchUpdateBuyerPlatFollower: url + '/oms/buyerAssignment/batchUpdateFollower.cf',
        // 平台采购商 -- 未分配--删除公司跟进人
        delBuyerPlatFollower: url + '/oms/buyerAssignment/delFollower.cf',

        // 广交会采购商 -- 未分配(未跟进)
        getBuyerCfecUnassigned: url + '/oms/operBuyerAssignment/unassigned.cf',
        // 广交会采购商 -- 已分配(已跟进)
        getBuyerCfecAssigned: url + '/oms/operBuyerAssignment/assigned.cf',
        // 广交会采购商 -- 未分配--批量分配
        saveBuyerCfecFollower: url + '/oms/operBuyerAssignment/saveFollower.cf',
        // 广交会采购商 -- 已分配--更新公司跟进人
        batchUpdateBuyerCfecFollower: url + '/oms/operBuyerAssignment/batchUpdateFollower.cf',
        // 广交会采购商 -- 未分配--删除公司跟进人
        delBuyerCfecFollower: url + '/oms/operBuyerAssignment/delFollower.cf',

        // 采购商跟进清单 -- 平台采购商
        getFollowListOfPlat: url + '/oms/userFollowingBuyer/followingBuyers.cf',
        // 采购商跟进清单 -- 广交会采购商
        getFollowListOfCfec: url + '/oms/userFollowingOperBuyer/followingOperBuyers.cf',

        // 我的跟进历史 -- 平台采购商--采购商
        getHistoryPlatBuyer: url + '/oms/userFollowingBuyer/followHistory.cf',
        // 我的跟进历史 -- 平台采购商--采购需求
        getHistoryPurchase: url + '/oms/procurement/queryMyFollowProcurement.cf',
        // 我的跟进历史 -- 平台采购商--询盘
        getHistoryInquiry: url + '/oms/standMessageOMS/queryMyFollowInquiry.cf',
        // 我的跟进历史 -- 广交会采购商--采购商
        getHistoryCfecBuyer: url + '/oms/userFollowingOperBuyer/followHistory.cf',


        // 获取跟进人列表
        getFollowUserList: url + '/oms/user/listusers.cf',
        // 修改跟进人
        notifyFollowBuyer: url + '/oms/buyer/follow/updateFollower.cf',
        // 根据产品名字获取suggestCategory
        getSuggestCategory: url + '/oms/product/category/suggestCategory2.cf',
        // 根据产品类目选择
        getCategoryProperties: url + '/oms/product/category/categoryProperties.cf',
        // 类目路径
        getCategoryPath: url + '/oms/product/category/getCatagoryStructureByCategoryId.cf',
        // 代发采购需求
        addpurchase: url + '/oms/admin/procurement/save.cf',
        // 跟进记录
        followRecord: url + '/oms//buyer/follow/record.cf',
        // 编辑优先级
        followUpdate: url + '/oms/buyer/follow/update.cf',
        // 添加跟进记录
        followAdd: url + '/oms/buyer/follow/add.cf',
        // 禁用启用采购商
        buyerforbidden: url + '/oms/admin/buyer/forbidden.cf',
        // 设为测试用户
        chxTestBuyerStatus: url + '/oms/admin/buyer/updateBuyerAccount.cf',

        // 修改广交会采购商
        updateCfecBuyer: url + '/oms/buyer/cantonfair/updatebuyer.cf',
        //广交会采购商跟进记录
        cfecFollowRecord: url + '/oms/buyer/cantonfair/record.cf',
        // 添加广交会采购商跟进纪录
        cfecFollowAdd: url + '/oms/buyer/cantonfair/add.cf',
        // 代发采购需求请求
        cfecSendProcurement: url + '/oms/buyer/cantonfair/sendProcurement.cf',

        // 新增标签记录
        saveMarkInfo: url + '/oms/buyer/saveMarkInfo.cf',

        // 删除标签记录
        delMarkInfo: url + '/oms/buyer/deleteBuyerVisitRecord.cf',


        /* 
           采购商接口 ]]
         */


        /* 
           [[ 采购需求管理接口
         */
        // 获取采购需求来源
        'getPurchaseSource': url + '/oms/procurement/getSourceType.cf',
        // 获取采购需求列表
        'getPurchaseList': url + '/oms/procurement/getPurchaseList.cf',
        // 审核采购需求
        'chgPurchaseStatus': url + '/oms/procurement/chgPurchaseStatus.cf',
        // 修改采购需求
        'updatePurchase': url + '/oms/admin/procurement/update.cf',
        // 修改采购需求分类
        'updatePurchaseCategory': url + '/oms/admin/procurement/updateCat.cf',
        // 获取采购需求详情
        'getPurchaseDetail': url + '/oms/procurement/getPurchaseDetail.cf',
        'getPchsLastMatchSuppliers': url + '/oms/procurementMatch/findFinalMatchedProcurement.cf',
        'getPchsDeledSuppliers': url + '/oms/procurementMatch/findExperiedMatchedSupplier.cf',
        'getPchsQuoteSuppliers': url + '/oms/procurementMatch/findSupplierBySearchQuote.cf',
        'getPchsSplContactMsg': url + '/oms/standMessageOMS/getContectList.cf',
        // 采购需求匹配--列表
        'getPchsMatchList': url + '/oms/procurementMatch/queryProcurementMatch.cf',
        // 采购需求匹配--匹配到的供应商
        'getPchsMatchSuppliers': url + '/oms/procurementMatch/querySupplierMatch.cf',
        // 采购需求匹配--查询供应商列表
        'getPchsQrySuppliers': url + '/oms/procurementMatch/querySupplier.cf',
        // 采购需求匹配--提交人工干预的结果
        'confirmPchsManualMatch': url + '/oms/procurementMatch/confirmManualMatch.cf',
        // 采购需求匹配--供应商的商品类目
        'getSellerProductCategory': url + '/oms/procurementMatch/queryProductCategory.cf',
        // 采购需求匹配--oms去除重复问题标签
        'delPurchaseTag': url + '/oms/procurement/removeTag.cf',
        // 采购需求详细页 —— 供应商跟进商机
        'getBusinessTrace_purchase': url + '/oms/procurement/getBusinessTrace.cf',
        // 采购需求详细页 —— 采购商跟进商机
        'buyerFollowRecord': url + '/oms/buyer/follow/buyerFollowRecord.cf',
        // 采购需求详细页 供应商回复情况
        queryMatchSupplierReplyInfo: url + '/oms/procurement/queryMatchSupplierReplyInfo.cf',
        // 检测供应商是否存在结果中
        isExistSupplierList: url + '/oms/procurementMatch/isExistSupplierList.cf',
        // 采购需求二次干预匹配提交
        confirmManualMatchAgain: url + '/oms/procurementMatch/confirmManualMatchAgain.cf',
        // 采购需求详情 获取重复采购需求列表
        findRepeatProcurements: url + '/oms/procurement/findRepeatProcurements.cf',
        // 屏蔽采购需求
        hiddenPurchase: url + '/oms/procurement/hidden.cf',
        // 零匹配原因获取
        getZeroMatchReason: url + '/oms/commonData/getZeroMatchReason.cf',
        /* 
           采购需求管理接口 ]]
        */

        /* 
            [[ 询盘管理接口
          */
        // 获取询盘列表
        'getInquiryList': url + '/oms/standMessageOMS/getMessageEntityList.cf',
        // 获取询盘详情
        'getInquiryDetail': url + '/oms/standMessageOMS/getMessageDetail.cf',
        // 审核询盘
        'chgInquiryAuditStatus': url + '/oms/standMessageOMS/chgMessageState.cf',
        // 获取询盘不通过原因
        'getInquiryAuditReason': url + '/oms/standMessageOMS/getAuditUnpassReason.cf',
        // 删除询盘标签
        'removeInquryTag': url + '/oms/standMessageOMS/removeTag.cf',
        // 获取来源
        'getMsgSourceType': url + '/oms/standMessageOMS/getSourceType.cf',
        // 询盘跟进商机查看
        'getBusinessTrace': url + '/oms/standMessageOMS/getBusinessTrace.cf',
        // 询盘详情——对话内容——询盘对话——刷新
        'refreshMessageEmailState': url + '/oms/standMessageOMS/refreshMessageEmailState.cf',
        // 询盘详情——对话内容——询盘回复——刷新
        'refreshMessageReplyEmailState': url + '/oms/standMessageOMS/refreshMessageReplyEmailState.cf',

        /* 
           询盘管理接口 ]]
        */


        /* 
           [[ 商品管理接口
         */
        // 获取商品列表
        'getProducts': url + '/oms/seller/products.cf',
        // 查看商品信息详情
        'getProductDetail': url + '/oms/seller/products/detail.cf',
        // 修改商品状态
        'chgProductStatus': url + '/oms/admin/seller/products/audit.cf',
        // 获取审核不通过的原因列表
        'getProUnpassReasons': url + '/oms/seller/products/getUnPassType.cf',
        // 获取行业
        'GoodgetIndustry': url + '/oms/product/industrys.cf',
        // 获取分类
        'GoodgetCategory': url + '/oms/product/category/rootCategory.cf',
        // 获取子分类
        'GoodgetChildCategory': url + '/oms/product/category/childrenCategory.cf',
        /* 
           商品管理接口 ]]
         */

        /* 
           [[ 订单管理接口
         */
        // 获取订单状态
        'getOrderStatusList': url + '/oms/order/getOrderStatusListToOms.cf',
        'getOrderList': url + '/oms/order/getOrderListByOms.cf',
        'getOrderDetail': url + '/oms/order/getOrderDetailToOms.cf',
        'getOrderDetailForOffline': url + '/oms/order/getOrderDetailForOffline.cf',
        /* 
           订单管理接口 ]]
         */

        /* 
           财务资金管理接口
         */
        'getPayMethod': url + '/oms/order/getPayMethod.cf',
        'getAuditPerson': url + '/oms/order/getAuditPerson.cf',
        'getComsumeApprList': url + '/oms/order/getOrderPayList.cf',
        // 消费
        'updateOrderPayStatus': url + '/oms/order/updateOrderPayStatus.cf',
        // 是否全额付款
        "isFullPayment": url + '/oms/order/isFullPayment.cf',
        // 全额付款的审核
        "updateFullPaymentStatus": url + '/oms/order/updateFullPaymentStatus.cf',
        // 核实
        "fullPaymentComplete": url + '/oms/order/fullPaymentComplete.cf',
        'getComsumeApprDetail': url + '/oms/order/orderPayDetail.cf',
        'getWithdrawCashList': url + '/oms/withdrawcash/getWithdrawCashList.cf',
        // 提现
        'getWithdrawCashDetail': url + '/oms/withdrawcash/withdrawCashDetail.cf',
        'getExchangeRate': url + '/oms/withdrawcash/getRate.cf',
        'setExchangeRate': url + '/oms/withdrawcash/setRate.cf',
        'updateWithdrawCashStatus': url + '/oms/withdrawcash/updateWithdrawCashStatus.cf',
        'withdrawConfirmPay': url + '/oms/withdrawcash/comfirmPay.cf',
        'getSellerVAcountList': url + '/oms/vAmountManager/getvirualAmountList.cf',
        // 卖家虚拟账户
        'getSellerVAcountMain': url + '/oms/vAmountManager/virualAmountDetail.cf',
        'getTTLogList': url + '/oms/bocTTpaylog/bocTTpayLogList.cf',
        // 汇款
        'getTTLogDetail': url + '/oms/bocTTpaylog/bocTTpayLogDetail.cf',
        // ?outRef=106
        'exportTTLogList': url + '/oms/bocTTpaylog/exportBocTTpayLog.cf',
        'getLCLogList': url + '/oms/bocLCpaylog/bocLCpayLogList.cf',
        // 信用证
        'getLCLogDetail': url + '/oms/bocLCpaylog/bocLCpayLogDetail.cf',
        // ?creditId=1
        'exportLCLogList': url + '/oms/bocLCpaylog/exportBocLCpayLog.cf',


        /* 
            合同模板管理接口
         */
        'getContractTempl': url + '/oms/contract/getTemplateList.cf',
        'uploadContract': url + '/oms/admin/contract/uploadSingleFile.cf',
        'addContract': url + '/oms/admin/contract/addTemplate.cf',
        'updateStatusContractTemplate': url + '/oms/admin/contract/updateStatusTemplate.cf',
        'getPreviewContract': url + '/oms/contract/previewContract.cf',


        /* 
            物流订单管理接口
         */
        'getLogistList': url + '/oms/shipping.cf',
        'getLogistDetail': url + '/oms/shipping/detail.cf',
        'exportLogistList': url + '/oms/shipping/export.cf',


        /* 
            [[ 卖家管理接口
         */
        // 获取卖家来源
        'getSourceList': url + '/oms/seller/getSourceType.cf',
        // 获取卖家列表
        'getSellerList': url + '/oms/seller.cf',
        // 获取卖家详情
        'getSellerDetail': url + '/oms/seller/detail.cf',
        // 卖家工厂信息
        'getSellerFactoryInfo': url + '/oms/factory/view.cf',
        'chgSellerFactoryInfo': url + '/oms/factory/save.cf',
        // 卖家营业信息
        'getSellerBusinessInfo': url + '/oms/market/business/view.cf',
        'chgSellerBusinessInfo': url + '/oms/market/business/save.cf',
        // 卖家出口信息
        'getSellerExportInfo': url + '/oms/market/export/view.cf',
        'chgSellerExportInfo': url + '/oms/market/export/save.cf',
        // 卖家贸易条款信息
        'getSellerTradeInfo': url + '/oms/market/trade/view.cf',
        'chgSellerTradeInfo': url + '/oms/market/trade/save.cf',
        // 获取卖家资质申请列表
        'getSellerIdentity': url + '/oms/seller/identity.cf',
        // 获取卖家资质申请信息
        'getSellerIdentityDetail': url + '/oms/seller/identity/detail.cf',
        // 修改卖家资质信息
        'saveSellerIdentity': url + '/oms/admin/seller/identity/update.cf',
        // 修改卖家信息审核状态
        'chgSellerAudit': url + '/oms/admin/seller/audit.cf',
        // 修料卖家资质申请状态
        'chgSellerIdentityAudit': url + '/oms/admin/seller/identity/audit.cf',
        // 卖家信息列表
        'getSellerInfoList': url + "/oms/seller/enhancement/list.cf",
        'chgSellerInfoAudit': url + "/oms/seller/admin/enhancement/audit.cf",
        'getSellerInfoAuditRecord': url + "/oms/seller/enhancement/auditrecord.cf",
        'showMoreCompanyImage': url + "/oms/seller/enhancement/more.cf",
        // 卖家详情 匹配的采购需求
        'findMatchedProcurement': url + "/oms/sellerMatcher/findMatchedProcurement.cf",
        // 卖家详情 采购需求
        'findProcurementBySearchQuote': url + "/oms/sellerMatcher/findProcurementBySearchQuote.cf",
        // 获取店铺诊断列表
        'getDiagnosisList': url + '/oms/seller/score/list.cf',
        // 跟新店铺诊断评分
        'updateDiagnosisScore': url + '/oms/seller/score/update.cf',
        // 一键登录
        'oneClickLogin': url + '/oms/simulateLogin/processLogin.cf',
        // 记录一键登录操作日志
        'oneClickLoginLog': url + '/oms/simulateLogin/recordLog.cf',
        // 重置密码
        'resetPassword': url + '/oms/admin/seller/modifypassword.cf',
        // 设为测试用户
        'chxTestSellerStatus': url + '/oms/admin/seller/updateSellerAccount.cf',

        // 设为报价免审用户
        'setFreeAuditQuote': url + '/oms/seller/setFreeAuditQuote.cf',

        // e店通开通列表
        'getEShopList': url + '/oms/eshop/eshoplist.cf',
        // 获取e店通信息
        'getEShopDetail': url + '/oms/eshop/geteshop.cf',
        // e店通（添加/保存）
        'saveEShopInfo': url + '/oms/eshop/saveeshop.cf',
        // 删除e店通
        'delEShopInfo': url + '/oms/eshop/deleteeshop.cf',
        // 审核
        'chxEShopStatus': url + '/oms/eshop/auditeshop.cf',
        // 获取e店通操作日志
        'getEShopLog': url + '/oms/eshop/geteshoploglist.cf',
        // 获取公司当前套餐
        'getCurrentPackage': url + '/oms/seller/package/getCurrentPackageByCompanyId.cf',
        // 修改卖家部分信息（email,mobile,companyName,companyEnName,mainCategoryId）
        'updateSellerInfo': url + '/oms/admin/seller/updateSellerInfo.cf',
        // 互粉通列表
        'getFansList': url + '/oms/fans/getSellerList.cf',
        // 绑定互粉通
        'addSellerFans': url + '/oms/fans/addSellerFans.cf',
        // 修改互粉通
        'updateSellerFans': url + '/oms/fans/updateSellerFans.cf',
        // 互粉通详情
        'getSellerFansDetail': url + '/oms/fans/sellerFansDetail.cf',


        /* 
           卖家管理接口 ]]
         */

        /* 
           帮助中心管理接口
         */
        // 帮助中心分类列表
        // 'getClassifyList': url + '/oms/faq/content/listRootFaqCategory.cf'
        // 'getClassifyList': url + '/oms/faq/content/listRootFaqCategory.cf',
        // 子分类列表
        // 'getChildClassifyList': url + '/oms/faq/content/listFaqCategoryByParentId.cf',
        // 保存分类
        // 'saveClassify': url + '/oms/faq/content/saveFaqCategory.cf',
        // 删除分类
        // 'delClassify': url + '/oms/faq/content/deleteFaqCategoryByIds.cf',
        // 帮助中心内容列表
        // 'getContentList': url + '/oms/faq/content/listFaqContentByCategoryId.cf',
        // 添加内容
        // 'saveContent': url + '/oms/faq/content/saveFaqContent.cf',
        // 删除内容
        // 'delContent': url + '/oms/faq/content/deleteFaqContentByIds.cf',
        // 发布内容
        // 'pubContent': url + '/oms/faq/content/publishFaqContentByIds.cf',
        // 序列号是否存在
        // 'checkSerialNumber': url + '/oms/faq/content/validateSerialNumber.cf',

        /* 
           登录接口
         */
        // 登录
        'login': url + '/oms/login',
        // 注销
        'logout': url + '/oms/logout',
        // 获取帐号信息
        'account': url + '/oms/account.cf',


        // 查找所有类目
        'getAllCategory': url + '/oms/product/category/fetchCategoryByParams.cf?pageSize=1000',
        // 所有一级类目  
        'getAllCategorysOfLevel1': url + '/oms/report/getAllCategorysOfLevel1.cf',
        // 搜索采购需求分类  
        'searchCategories': url + '/oms/product/category/searchTree.cf',


        /* 
           [[ 报表管理接口
         */
        // 卖家注册
        'getSellerRegList': url + '/oms/report/sellerRegister.cf',
        // 卖家登陆
        'getSellerLoginList': url + '/oms/report/sellerLogin.cf',
        // 卖家产品
        'getSellerProductList': url + '/oms/report/sellerProduct.cf',
        // 采购商注册
        'getBuyerRegList': url + '/oms/report/buyerRegister.cf',
        // 采购商登陆
        'getBuyerLoginList': url + '/oms/report/buyerLogin.cf',
        // 是否有数据
        'chkSellerRegister': url + "/oms/reportValidate/sellerRegister.cf",
        'chkSellerLogin': url + "/oms/reportValidate/sellerLogin.cf",
        'chkSellerProduct': url + "/oms/reportValidate/sellerProduct.cf",
        'chkBuyerRegister': url + "/oms/reportValidate/buyerRegister.cf",
        'chkBuyerLogin': url + "/oms/reportValidate/buyerLogin.cf",
        // 导出
        'expSellerRegList': url + '/oms/report/exportSellerRegister.cf',
        'expSellerLoginList': url + '/oms/report/exportSellerLogin.cf',
        'expSellerProductList': url + '/oms/report/exportSellerProduct.cf',
        'expBuyerRegList': url + '/oms/report/exportBuyerRegister.cf',
        'expBuyerLoginList': url + '/oms/report/exportBuyerLogin.cf',

        // 公司性质
        'getCompanyNature': url + '/oms/report/getCompanyNature.cf',
        // 所有套餐
        'getAllSellerPackage': url + '/oms/seller/getAllSellerPackage.cf',
        // 卖家商品
        getSellerProducts: url + '/oms/seller/products/listSummaryProducts.cf',
        // 店铺信息
        getShopinfo: url + '/oms/seller/shopinfo.cf',
        // 会员套餐
        getMemberPackage: url + '/oms/seller/package/special.cf',
        /* 
           报表管理接口 ]]
         */

        /* 
           [[ 套餐管理接口
         */
        // 套餐类型设置
        'getMemPackageList': url + '/oms/seller/package.cf',
        'addPackageList': url + '/oms/seller/package/addPackageList.cf',
        'getMemPackageDetail': url + '/oms/seller/package/detail.cf',
        'updateMemPackage': url + '/oms/seller/package/addOrUpdate.cf',
        'getPackageLevels': url + '/oms/seller/package/packageType.cf',
        // 会员套餐开通
        'getFreeMemList': url + "/oms/seller/package/general.cf",
        'getFreeMemCount': url + "/oms/seller/package/generalcount.cf",
        'fmSetPackage': url + "/oms/seller/package/addsellerpackagerecord.cf",
        // 在约会员  
        'getContMemCount': url + "/oms/seller/package/specialcount.cf",
        'getContMemList': url + "/oms/seller/package/special.cf",
        'contMemSetPackage': url + "/oms/seller/package/setpackagerecord.cf",
        'contMemRenewPackage': url + "/oms/seller/package/renewpackage.cf",
        'contMemDetail': url + "/oms/seller/package/packagerecord.cf",
        /* 
           套餐管理接口 ]]
         */

        /* 
           [[ 系统管理接口
         */
        // 用户管理
        'getSysUserList': url + '/oms/user/listusers.cf',
        'getSysUserDetail': url + '/oms/user/detailUser.cf',
        'addSysUser': url + '/oms/user/insertuser.cf',
        'chgSysUSer': url + '/oms/user/updateuser.cf',
        'delSysUser': url + '/oms/user/deleteuser.cf',
        'chkSysUSerName': url + '/oms/user/checkusername.cf',
        'chgSysUSerPwd': url + '/oms/user/resetpwd.cf',
        // 用户分组
        'getSysUserGrpList': url + "/oms/usergroup/listGroup.cf",
        'addSysUserGrp': url + "/oms/usergroup/insertGroup.cf",
        'chgSysUSerGrp': url + "/oms/usergroup/updategroup.cf",
        'delSysUSerGrp': url + '/oms/usergroup/deletegroup.cf',
        'chkSysUSerGrp': url + "/oms/usergroup/chekcgroup.cf",
        // 检查用户组下是否有成员
        // 角色管理
        'getSysRoleList': url + "/oms/role/listroles.cf",
        'getUserRoleDetail': url + "/oms/role/detailRole.cf",
        // 'addSysRole': url + "/oms/role/insertrole.cf",
        'chgSysRole': url + "/oms/role/insertOrUpdateRole.cf",
        'delSysRole': url + "/oms/role/deleterole.cf",
        // 操作日志
        'getOperationLog': url + "/oms/log/list.cf",
        'getSysOpers': url + '/oms/user/getAllOpears.cf',
        'getUserOpers': url + "/oms/user/getUserOpears.cf",
        /* 
           系统管理接口 ]]
         */

        /* 
           [[ 卖家账户接口 
         */
        // 人民币和外币账号管理
        'RMBAccount': url + '/oms/bankCard.cf',
        // 人民币和外币账号详情管理
        'RMBDetail': url + '/oms/bankCard/detail.cf',
        // 人民币和外币审核详情弹出窗——填写审核不通过原因
        'postRMBDetail': url + '/oms/admin/bankCard/audit.cf',
        /* 
           卖家账户接口 ]]
         */


        /* 
           [[ 报价管理接口 
         */
        // 获取报价列表
        getQuoteList: url + '/oms/quotePrice/getQuotePriceList.cf',
        // 修改报价状态
        chxQuoteStatus: url + '/oms/quotePrice/chgQuotePriceStatus.cf',
        // 获取报价详情
        getQuoteDetail: url + '/oms/quotePrice/getQuotePriceDetail.cf',
        // 报价详情——刷新邮件状态接口
        refreshQuotePriceEmailState: url + '/oms/quotePrice/refreshQuotePriceEmailState.cf',
        // 获取报价审核不通过的原因 params:{ modular : 2 }
        getUnpassReason: url + '/oms/standMessageOMS/getAuditUnpassReason.cf',

        /* 
           报价管理接口 ]]
         */
        /* 
         [[ 重发邮件接口
         */
        reSendQutoteEmail: url + '/oms/notice/sendQutotePriceEmail.cf',
        reSendInqueryEmail: url + '/oms/notice/sendInqueryEmail.cf',
        reSendInqueryReplyEmail: url + '/oms/notice/sendInqueryReplyEmail.cf',
        /* 
        重发邮件接口]]
         */
        /* 
           [[ 关键词广告管理 
         */
        getAds: url + '/oms/ad/getAdList.cf',
        // 获取商品列表
        getAdProducts: url + '/oms/ad/getProductById.cf',
        // 保存广告
        addOrUpdate: url + '/oms/ad/addOrUpdate.cf',
        // 获取对应广告位的时间排期表
        getAdTime: url + '/oms/ad/getADTime.cf',
        // 获取广告明细
        getAdManagerDetail: url + '/oms/ad/getAdManagerDetail.cf',
        // 更新广告状态
        updateStatus: url + '/oms/ad/updateStatus.cf',
        // 更新记录
        getAdAuditRecoed: url + '/oms/ad/getAdAuditRecoed.cf',
        /* 
            关键词广告管理 ]]
         */

        /* 
           [[ EDM邮件推广 
         */
        // EDM列表
        getEdm: url + '/oms/promotionmail/promotionmailinfolist.cf',
        // EDM详情
        getEdmDetail: url + '/oms/promotionmail/promotionmailinfo.cf',
        // EDM详情审核记录
        getPromotionmailchecklist: url + '/oms/promotionmail/promotionmailchecklist.cf',
        // 更新EDM状态
        updateEdmStatus: url + '/oms/promotionmail/promotionmailcheck.cf',
        // EDM发票列表
        getEdmInvoice: url + '/oms/promotion/pay/invoice.cf',
        // 导出发票报表 Excel
        invoiceReport: url + '/oms/invoiceReport/exportExcel.cf',
        // EDM发票状态更新
        updateInvoiceStatus: url + '/oms/promotion/pay/sign.cf',
        // EDM资金流水列表
        getEdmFundsFlow: url + '/oms/promotion/pay/recharge.cf',
        // 导出资金流水报表 Excel
        rechargeReport: url + '/oms/rechargeReport/exportExcel.cf',
        // 确认或者批量确认资金流水
        confirmEdmFundsFlow: url + '/oms/promotion/pay/confirm.cf',
        // 消费记录列表
        comsumeRecordList: url + '/oms/promotion/pay/all.cf',
        // 消费记录详细
        getComsumeRecordDetail: url + '/oms/promotion/pay/consumDetail.cf',
        // 消费记录 -- 报价
        getQuoteEquityList: url + '/oms/promotion/pay/getQuoteEquityList.cf',
        // 更新邮件发送状态
        updateMailSendStatus: url + '/oms/promotionmail/promotionMailSend.cf',
        // 更新报告发送状态
        updateReportStatus: url + '/oms/promotionmail/promotionMailReport.cf',
        // 增值信息
        addedValueInfo: url + '/oms/promotion/pay/addedValueInfo.cf',
        /* 
            EDM邮件推广 ]]
         */

        /* 
           [[ 关键词 
         */
        // 产品关键词列表
        getProductKwList: url + '/oms/productKW/searchKeyWord.cf',
        // 产品关键词详情
        getProductKwDetail: url + '/oms/productKW/kwDetail.cf',
        // 增加、修改产品关键词
        addOrUpdateProductKw: url + '/oms/productKW/addOrUpdate.cf',
        // 删除产品关键词
        deleteProductKw: url + '/oms/productKW/updateStatus.cf',
        // 导出产品关键词
        exportProductKw: url + '/oms/productKW/exportBySearch.cf',
        // 导入产品关键词
        importProductKw: url + '/oms/productKW/loadTemplate.cf',

        // 供应商关键词列表
        getSellerKwList: url + '/oms/sellerKW/searchKeyWord.cf',
        // 供应商关键词详情
        getSellerKwDetail: url + '/oms/sellerKW/kwDetail.cf',
        // 增加、修改供应商关键词
        addOrUpdateSellerKw: url + '/oms/sellerKW/addOrUpdate.cf',
        // 增加、修改供应商关键词
        deleteSellerKw: url + '/oms/sellerKW/updateStatus.cf',
        // 导出供应商关键词
        exportSellerKw: url + '/oms/sellerKW/exportBySearch.cf',
        // 导入供应商关键词
        importSellerKw: url + '/oms/sellerKW/loadTemplate.cf',

        /* 
            关键词 ]]
         */

        /* 
           [[ 采购商互动行为跟踪 
        */
        // 采购商互动行为跟踪列表
        getbuyerTrackingList: url + '/oms/buyer/trace/queryTraceStat.cf',
        // 采购需求未二次回复列表
        getPurchaseReplyList: url + '/oms/buyer/trace/queryTwoUnReplyProcurement.cf',
        // 询盘未二次回复列表
        getInquiryReplyList: url + '/oms/buyer/trace/queryTwoUnReplyInquiry.cf',
        // 采购商 批量跟进商机
        saveBusinessTraceByBatch: url + '/oms/buyer/trace/saveBusinessTraceByBatch.cf',
        // 采购商 跟进商机
        saveBuyerBusinessTrace: url + '/oms/buyer/trace/saveBusinessTrace.cf',
        // 采购商 跟进标识
        getBusinessTraceFlag: url + '/oms/buyer/trace/getBusinessTraceFlag.cf',
        // 获取采购商修改密码链接
        getResetPasswordLink: url + '/oms/buyer/getResetPasswordLink.cf',
        // 导出
        exportBuyerList: url + '/oms/buyer/trace/report.cf',


        /* 
            采购商互动行为跟踪 ]]
        */


        /* 
           [[ 供应商互动行为跟踪 
        */
        // 供应商互动行为跟踪列表
        getsellerTrackingList: url + '/oms/sellerInteraction/list.cf',
        // 采购需求未一次回复列表，供应商详情页 - 跟进记录列表
        getsellerFollowDetail: url + '/oms/seller/follow/record.cf',
        // 供应商互动行为跟踪 - 采购需求未一次回复列表
        getsellerTimesUnreplyProcurement: url + '/oms/sellerInteraction/getAllSeller1TimesUnreplyProcurement.cf',
        // 供应商互动行为跟踪 - 询盘未一次回复列表
        getsellerTimesUnreplyInquiry: url + '/oms/sellerInteraction/getAllSeller1TimesUnreplyInquiry.cf',
        // 添加供应商跟进记录
        addsellerFollowRecord: url + '/oms/seller/follow/addlist.cf',
        // 添加采购需求跟进商机
        saveBusinessTrace: url + '/oms/procurement/saveBusinessTrace.cf',
        // 添加询盘跟进商机
        saveBusinessTrace_inquiry: url + '/oms/standMessageOMS/saveBusinessTrace.cf',

        /* 
            供应商互动行为跟踪 ]]
        */

        /* 
            [[ 供应商 展会通 
         */
        // 获取届数
        getArrayOfCfecTimes: url + '/oms/promotionSeller/getLatestSession.cf',
        // 获取展会通绑定列表
        getExhibitionList: url + '/oms/promotionSeller/getSellerList.cf',
        // 获取展会通绑详情
        getExhibitionDetail: url + '/oms/promotionSeller/getSellerDetail.cf',
        // 保存绑定展会通
        saveBindExhibition: url + '/oms/promotionSeller/addFairPromotion.cf',
        // 展会通消息审核列表
        getExhibitionMsgList: url + '/oms/promotionPlan/getPlanList.cf',
        // 展会通消息审核详情
        getExhibitionMsgDetail: url + '/oms/promotionPlan/getPlanDetail.cf',
        // 展会通消息审核
        updatePlanAuditStatus: url + '/oms/promotionPlan/planAuditStatus.cf',
        // 校验Ibeacon唯一性
        getIsHasIbeaconId: url + '/oms/promotionSeller/getIsHasIbeaconId.cf',

        /* 
            供应商 展会通 ]]
        */

        /* 
             [[ App 后台内容管理 
          */

        getHomePageList: url + '/oms/app/list.cf',

        getHotKeyWords: url + '/oms/app/getLatestHotKeyWords.cf',

        saveHotKeyWords: url + '/oms/app/saveHotKeyWord.cf',

        saveAppIndex: url + '/oms/app/saveHomepage.cf',

        getHomePage: url + '/oms/app/getHomePage.cf',

        updateHomepageToActive: url + '/oms/app/updateHomepageToActive.cf',

        deleteHomepage: url + '/oms/app/deleteHomepage.cf',

        updateHomepage: url + '/oms/app/updateHomepage.cf',

        listFeedback: url + '/oms/app/listFeedback.cf',

        // 消息推送
        addMsgPush: url + '/oms/pushMessage/push.cf',
        // app消息推送列表
        getMsgList: url + '/oms/pushMessage/getMessageList.cf',
        // 获取消息点击量
        getMessageStatisc: url + '/oms/pushMessage/getMessageStatisc.cf',
        // 获取标签库列表
        getTagDictList: url + '/oms/pushMessage/tagDict.cf',
        // 新建标签库
        addTagDict: url + '/oms/pushMessage/insertTagDict.cf',
        // 删除标签库标签
        delTagDict: url + '/oms/pushMessage/deleteTagDict.cf',
        // 用户标签列表
        getUserTagList: url + '/oms/pushMessage/tagList.cf',
        // 插入用户标签
        addUserTagList: url + '/oms/pushMessage/insertTag.cf',

        /* 
             App 后台内容管理 ]]
         */

        /* 
           [[ 短信管理 
        */
        // 短信列表
        getSMSList: url + '/oms/sms/forign/querySmsTask.cf',
        // 短信详情
        getSMSDetail: url + '/oms/sms/forign/getSmsTaskDetail.cf',
        // 短信模版
        loadSmsTpl: url + '/oms/sms/forign/loadSmsTpl.cf',
        // 发送短信
        sendSMS: url + '/oms/sms/forign/sendSMS.cf',
        /* 
             短信管理 ]]
         */


        /* 
           [[ 活动管理 
        */
        // 活动列表
        getActivitiesList: url + '/oms/event/list.cf',
        // 详情
        getActivitiesDetail: url + '/oms/event/detailEvent.cf',
        // 审核
        auditActivity: url + '/oms/event/auditEvent.cf',
        // 保存修改活动
        saveActivityInfo: url + '/oms/event/saveEventTabloids.cf',

        // 活动报名列表
        getEnrollList: url + '/oms/event/list.cf',

        // 线上活动素材报名列表
        getOnlineEnrollList: url + '/oms/eventMaterial/list.cf',

        // 线上活动报名列表
        getOfflineEnrollList: url + '/oms/eventApply/list.cf',

        // 用户报名详情-线下
        getOfflineSellerDetail: url + '/oms/eventApply/detail.cf',
        // 报名审核 -- 线上 eventMaterialId
        auditApplyOnline: url + '/oms/eventMaterial/auditeventMaterial.cf',
        // 报名审核 -- 线下 eventApplyId
        auditApplyOffline: url + '/oms/eventApply/auditEventApply.cf'

        /* 
             活动管理 ]]
         */

    });
});
