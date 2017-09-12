import footer from "components/footer";

//  首页
const home = resolve => require(["@/pages/home"], resolve);
const home_v1 = resolve => require(["@/pages/home_v1"], resolve);

//  搜索页
const search = resolve => require(["@/pages/search/search"], resolve);

//  登录
const login = resolve => require(["@/pages/login"], resolve);

// 分级类目
const categoryFirst = resolve => require(["@/pages/categories/category_first"], resolve);
const categorySecond = resolve => require(["@/pages/categories/category_second"], resolve);
const categoriesThird = resolve => require(["@/pages/categories/category_third"], resolve);

// 类目搜索，后期可能合并到搜索
const categorySearch = resolve => require(["@/pages/categories/category_search"], resolve);

//  商品详情页
const product = resolve => require(["@/pages/product/product"], resolve);

//  店铺详情页
const shop = resolve => require(["@/pages/shop/shop"], resolve);

//  公司简介页面
const companyProfile = resolve => require(["@/pages/shop/children/companyProfile"], resolve);

//  所有商品页
const allProducts = resolve => require(["@/pages/shop/children/allProducts"], resolve);

//  产品、店铺 询盘 
const proInquiry = resolve => require(["@/pages/inquiry/product_inquiry"], resolve);
const shopInquiry = resolve => require(["@/pages/inquiry/shop_inquiry"], resolve);

// 单位页
const unit = resolve => require(["@/pages/unit/unit"], resolve);

// 发送采购需求
const buyingRequest = resolve => require(["@/pages/buying_request"], resolve);
const chooseCategory = resolve => require(["@/pages/buying_request/children/choose_category"], resolve);
const attributeList = resolve => require(["@/pages/buying_request/children/attribute_list"], resolve);
const attributeDetail = resolve => require(["@/pages/buying_request/children/attribute_detail"], resolve);
const postRequestSuccess = resolve => require(["@/pages/buying_request/children/successed"], resolve);

// 个人中心
const me = resolve => require(["@/pages/me"], resolve);

//  管理询盘
const manageInquiryList = resolve => require(["@/pages/me/inquiry_manage/inquiry_list"], resolve);
const inquiryDetail = resolve => require(["@/pages/me/inquiry_manage/inquiry_detail"], resolve);
const sellerProfill = resolve => require(["@/pages/me/inquiry_manage/seller_profill"], resolve);

// 管理采购需求
const manageBuyingRequestList = resolve => require(["@/pages/me/buying_request_manage/buying_request_list"], resolve);
const buyingRequestDetail = resolve => require(["@/pages/me/buying_request_manage/buying_request_detail"], resolve);
const quotationDetail = resolve => require(["@/pages/me/buying_request_manage/quotation_detail"], resolve);

//  个人中心 复用 回复、附件页面
const reply = resolve => require(["@/pages/me/common/reply"], resolve);
const attachment = resolve => require(["@/pages/me/common/attachment"], resolve);

const register = resolve => require(["@/pages/register/register"], resolve);
const selectCountry = resolve => require(["@/pages/register/children/selectCountry"], resolve);

const selectCategories = resolve => require(["@/pages/register/children/selectCategories"], resolve);

//  重置密码
const getAccount = resolve => require(["@/pages/reset_password/getAccount"], resolve);
const accountChoose = resolve => require(["@/pages/reset_password/accountChoose"], resolve);
const resetSuccess = resolve => require(["@/pages/reset_password/resetSuccess"], resolve);
const verifyCode = resolve => require(["@/pages/reset_password/verifyCode"], resolve);
const resetByPhone = resolve => require(["@/pages/reset_password/resetByPhone"], resolve);

// 引导
const versionLead = rs => require(["@/pages/lead/version"], rs);

// 专题页
const topic = resolve => require(["@/pages/topic"], resolve);

// 学生重置密码
const studentRspwd = resolve => require(["@/pages/studentRspwd"], resolve);

// 学生成绩查询
const studentPerformance = resolve => require(["@/pages/studentRspwd/studentPerformance"], resolve);
const studentPerformanceList = resolve => require(["@/pages/studentRspwd/studentPerformanceList"], resolve);

export default [{
        path: "/",
        component: footer,
        children: [{
                path: "",
                redirect: "/home"
            },
            {
                path: "/home",
                name: "home",
                component: home,
                meta: {
                    isKeepAlive: true
                } // 激活 keep-alive
            },
            // home_v1
            {
                path: '/home_v1',
                name: 'home_v1',
                component: home_v1,
                meta: {
                    isKeepAlive: true
                }
            },
            {
                path: "/me",
                name: "me",
                component: me,
                meta: {
                    isKeepAlive: true
                }
            }
        ]
    },
    // 搜索页
    {
        path: "/search/:productKeyWord?",
        name: "search",
        component: search,
        meta: {
            isKeepAlive: true
        }
    },
    // 一级类目页
    {
        path: "/categoryFirst",
        name: "categoryFirst",
        component: categoryFirst,
        meta: {
            isKeepAlive: true
        }
    },
    // 二级类目页
    {
        path: "/categorySecond/:categoryId/:categoryEname",
        name: "categorySecond",
        component: categorySecond,
        meta: {
            isKeepAlive: true
        }
    },
    // 三级类目页
    {
        path: "/categoriesThird/:categoryId/:categoryEname",
        name: "categoriesThird",
        component: categoriesThird,
        meta: {
            isKeepAlive: true
        }
    },
    // 类目搜索页
    {
        path: "/categorySearch/:categoryId?/:categoryEname?",
        name: "categorySearch",
        component: categorySearch,
        meta: {
            isKeepAlive: true
        }
    },
    // 商品详情页
    {
        path: "/product/:productId",
        name: "product",
        component: product,
        meta: {
            isKeepAlive: true
        }
    },
    // 店铺详情页
    {
        path: "/shop/:sellerId",
        name: "shop",
        component: shop,
        meta: {
            isKeepAlive: true
        }
    },
    // 店铺所有商品
    {
        path: "/allProducts/:sellerId",
        name: "allProducts",
        component: allProducts,
        meta: {
            isKeepAlive: true
        }
    },

    // 店铺询盘
    {
        path: "/shopInquiry/:companyName/:userId",
        name: "shopInquiry",
        component: shopInquiry
    },
    {
        path: "/companyProfile/:companyId",
        name: "companyProfile",
        component: companyProfile,
        meta: {
            isKeepAlive: true
        }
    },
    // 登录
    {
        path: "/login/:type?",
        name: "login",
        component: login
    },
    // 注册
    {
        path: "/register",
        name: "register",
        component: register,
        meta: {
            isKeepAlive: true
        }
    },
    // 选择国家
    {
        path: "/selectCountry",
        name: " selectCountry",
        component: selectCountry
    },
    // 选择类目
    {
        path: "/selectCategories",
        name: " selectCategories",
        component: selectCategories
    },
    // 询盘
    {
        path: "/inquiry/:productId",
        name: "inquiry",
        component: proInquiry,
        meta: {
            isKeepAlive: true
        }
    },
    // 单位
    {
        path: "/unit",
        name: "unit",
        component: unit,
        meta: {
            isKeepAlive: true
        }
    },
    // 发布采购需求
    {
        path: "/buyingRequest/:from?",
        name: "buyingRequest",
        component: buyingRequest,
        meta: {
            isKeepAlive: true
        }
    },
    // 询盘类目
    {
        path: "/chooseCategory/:productName?",
        name: "chooseCategory",
        component: chooseCategory
    },
    // 询盘类目属性
    {
        path: "/attributeList",
        name: "attributeList",
        component: attributeList,
        meta: {
            isKeepAlive: true
        }
    },
    // 需求类目属性
    {
        path: "/attributeDetail/:propertyEnName/:propertyValues/:index?",
        name: "attributeDetail",
        component: attributeDetail
    },
    // 成功发送采需
    {
        path: "/postRequestSuccess",
        name: "postRequestSuccess",
        component: postRequestSuccess,
        meta: {
            isKeepAlive: true
        }
    },
    // 管理询盘列表
    {
        path: "/manageInquiryList",
        name: "manageInquiryList",
        component: manageInquiryList,
        meta: {
            isKeepAlive: true
        }
    },
    // 询盘详情
    {
        path: "/inquiryDetail/:messageId",
        name: "inquiryDetail",
        component: inquiryDetail
    },
    // 询盘个人简介
    {
        path: "/sellerProfill/:userId",
        name: "sellerProfill",
        component: sellerProfill
    },
    // 回复
    {
        path: "/reply/:messageId/:receiverId/:type?/:subject?",
        name: "reply",
        component: reply
    },
    // 管理采购需求
    {
        path: "/manageBuyingRequestList/",
        name: "manageBuyingRequestList",
        component: manageBuyingRequestList,
        meta: {
            isKeepAlive: true
        }
    },
    // 管理采购需求详情
    {
        path: "/buyingRequestDetail/:procurementId",
        name: "buyingRequestDetail",
        component: buyingRequestDetail
    },
    // 报价详情
    {
        path: "/quotationDetail/:quotedId/:companyId/:companyName",
        name: "quotationDetail",
        component: quotationDetail
    },
    // 查看附件
    {
        path: "/attachment",
        name: "attachment",
        component: attachment
    },
    // 密码重置
    {
        path: "/getAccount",
        name: "getAccount",
        component: getAccount
    },
    {
        path: "/accountChoose",
        name: "accountChoose",
        component: accountChoose,
        meta: {
            isKeepAlive: true
        }
    },
    {
        path: "/resetSuccess",
        name: "resetSuccess",
        component: resetSuccess
    },
    {
        path: "/verifyCode",
        name: "verifyCode",
        component: verifyCode
    },
    {
        path: "/resetByPhone",
        name: "resetByPhone",
        component: resetByPhone
    },
    {
        path: "/lead",
        name: "version",
        component: versionLead
    },
    // 专题页
    {
        path: "/topic/:topicId",
        name: "topic",
        component: topic
    },
    // 学生重置密码
    {
        path: "/studentRspwd",
        name: "studentRspwd",
        component: studentRspwd
    },
    // 学生业绩
    {
        path: "/sp",
        name: "studentPerformance",
        component: studentPerformance
    },
    {
        path: "/spList/:id",
        name: "studentPerformanceList",
        component: studentPerformanceList
    }
];