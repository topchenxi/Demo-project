define(['app'], function(app) {
  var url = 'http://192.168.200.115:8081';
  //var url = 'http://192.168.200.179:8080';
  //var url = 'http://192.168.10.56:8080';

  //var url = 'http://127.0.0.1:3000'
  app
    .constant('menus', [
      {
        'id': 1,
        'title': '首页',
		'titleEn': 'Home Page',  
        'path': 'index',
        'template': 'index/index.html',
        'controller': 'IndexCtrl'
      }, {
        'id': 2,
        'title': '安全设置',
		'titleEn': 'Safety',
        'desc': '卖家信息设置',
        'path': 'safety',
        'template': 'safety/index.html',
        'controller': 'safetyCtrl',
        'items': [
        ],
        'hideItems': [
          {
            'id': 21,
            'title': '找回安全问题',
			'titleEn': 'Find',
            'path': 'find',
            'template': 'safety/find.html',
            'controller': 'findCtrl'
          },{
            'id': 26,
            'title': '修改邮箱',
			'titleEn': 'Change Email',
            'path': 'changeemail',
            'template': 'safety/changEmail.html',
            'controller': 'ModifyemailCtrl'
          }, {
            'id': 27,
            'title': '修改手机',
			'titleEn': 'Change Mobile',
            'path': 'changemobile',
            'template': 'safety/changemobile.html',
            'controller': 'changemobileCtrl'
          }, {
            'id': 28,
            'title': '修改密码',
			'titleEn': 'Change Password',
            'path': 'changepwd',
            'template': 'safety/changepwd.html',
            'controller': 'changepwdCtrl'
          }
        ]
      }, {
        'id': 3,
        'title': '资料设置',
		'titleEn': 'Info Setting',
        'desc': '卖家信息设置',
        'path': 'sets',
        'template': 'set/user.html',
        'controller': 'User1Ctrl',
        'items': [

          {
            'id': 31,
            'title': '个人资料',
			'titleEn': 'Personal Info',
            'path': 'user',
            'template': 'set/user.html',
            'controller': 'UserCtrl'
          }, {
            'id': 32,
            'title': '公司资料',
			'titleEn': 'Company Info',
            'path': 'company',
            'template': 'set/company.html',
            'controller': 'CompanyCtrl'
          }
          // , {
          //   'id': 25,
          //   'title': '商业规则',
          //   'path': 'sygz',
          //   'template': 'set/sygz.html',
          //   'controller': 'SygzCtrl'
          // }
        ]
      }, {
        'id': 5,
        'title': '地址管理',
		'titleEn': 'Addr Manage',
        'path': 'address',
        'template': 'address/address.html',
        'controller': 'AddressCtrl',
        'items': [

          {
            'id': 51,
            'title': '发货地址',
			'titleEn': 'Shipping Addr',
            'path': 'receiving',
            'template': 'address/index.html',
            'controller': 'AddressCtrl'
          }, {
            'id': 52,
            'title': '退货地址',
			'titleEn': 'Retrun Addr',
            'path': 'returns',
            'template': 'address/returns.html',
            'controller': 'returnsAddressCtrl'
          }
        ]
      },
      // {
      //   'id': 4,
      //   'title': '店铺管理',
      //   'path': 'shop-manage',
      //   'template': 'set/shop-manage.html',
      //   'controller': 'ShopmanageCtrl'
      // },
      {
        'id': 6,
        'title': '身份认证',
		'titleEn': 'Authentication',
        'path': 'authentication',
        'template': 'authentication/index.html',
        'controller': 'AuthenticationCtrl',
        'hideItems': [
          {
            'id': 61,
            'title': '申请',
			'titleEn': 'Apply',
            'path': 'apply',
            'template': 'authentication/apply2.html',
            'controller': 'ApplyCtrl'
          },
          {
            'id': 62,
            'title': '待审核页面',
			'titleEn': 'Wait Audit',
            'path': 'audit',
            'template': 'authentication/audit.html',
            'controller': 'AuditCtrl'
          }
        ]
      },
      {
        'id': 7,
        'title': '商品管理',
		'titleEn': 'Product Manage',
        'desc': '商品上传及管理',
        'path': 'goods',
        'template': 'goods/index.html',
        'controller': 'GoodsCtrl',
        'items': [
          {
            'id': 71,
            'title': '添加新商品',
			'titleEn': 'Add Product',
            'desc': '选择类目',
            'path': 'selectSort',
            'template': 'goods/selectSort.html',
            'controller': 'SelectSortCtrl',
          }, {
            'id': 73,
            'title': '商品管理',
			'titleEn': 'Product Manage',
            'desc': '商品上传及管理',
            'path': 'manage',
            'template': 'goods/manage.html',
            'controller': 'GoodsManageCtrl',
          }
        ],
        'hideItems':[
          {
            'id': 74,
            'title': '添加新商品',
			'titleEn': 'Add Product',
            'desc': '商品上传及管理',
            'path': 'publish',
            'template': 'goods/publish.html',
            'controller': 'GoodsAddCtrl',
          },
          {
            'id': 75,
            'title': '添加类似商品',
			'titleEn': 'Add Similar Product',
            'desc': '商品上传及管理',
            'path': 'add',
            'template': 'goods/add.html',
            'controller': 'SimilarAddCtrl',
          },
          {
            'id': 76,
            'title': '不符合上传上传商品条件提示',
			'titleEn': 'Tips',
            'desc': '商品上传及管理',
            'path': 'validate',
            'template': 'goods/validate.html',
            'controller': 'TipsCtrl',
          },{
            'id': 72,
            'title': '修改商品',
			'titleEn': 'Modify Product',
            'desc': '商品上传及管理',
            'path': 'modify',
            'template': 'goods/modify.html',
            'controller': 'GoodsModifyCtrl',
          },{
            'id': 77,
            'title': '商品预览',
			'titleEn': 'View Product',
            'desc': '商品预览',
            'path': 'preview',
            'template': 'goods/preview.html',
            'controller': 'GoodsModifyCtrl',
          }
        ]
      }
    ])
    .constant('api', {
      'paths' : url
      ,'imgPath': 'http://192.168.10.17'
	  ,'logPath':'http://192.168.200.179:8080/seller_center/login/ajaxUserLogin.do'
      /** 公共的 **/
      //获取国家列表
      ,'getCountryCode': url + '/seller_center/category/loadAllCountry.cf'
      //获取省市区
      ,'getDistrict': url + '/seller_center/category/getDistrictInfo.cf'
      //获取全部行业列表
      ,'getCategorys': url + '/seller_center/category/loadIndusCategorys.cf'
      //由行业类目加载一级类目
      ,'getCategorysByIndusId': url + '/seller_center/category/loadRootCategorysByIndusId.cf'
      //由父类目加载下一级类目
      ,'getCategorysByParentId': url + '/seller_center/category/loadCategorysByParentId.cf'
      //由末端类目ID获取 整个对应类目的信息(industry,parentCategory,category)
      ,'getCatagoryStructureByCategoryId': url + '/seller_center/category/loadCatagoryStructureByCategoryId.cf'
      //图片上传
      ,'uploadImage': url + '/seller_center/fdfsUpload/uploadSingleImage.cf'
      //下载文件
      ,'download': url + '/seller_center/fdfsUpload/download.cf'
      //删除文件
      ,'delFile':url + '/seller_center/fdfsUpload/delFile.cf'

      /** 账号设置 **/
      //检查卖家是否设置安全问题
      ,'validatSellerHasSecurityIssues' : url + '/seller_center/sellerAccountSetting/validatSellerHasSecurityIssues.cf'
      //获取卖家设置的安全问题
      ,'getIssuesInfoForUser' : url + '/seller_center/sellerAccountSetting/getIssuesInfoForUser.cf'
      //保存安全问题
      ,'saveSecurityIssuesInfo': url +　'/seller_center/sellerAccountSetting/saveSecurityIssuesInfo.cf'
      //发送重置安全问题邮箱
      ,'sendMailForResetIssues' : url + '/seller_center/sellerAccountSetting/sendMailForResetIssues.cf'
      //验证用户安全问题回答
      ,'validatSecurityAnswer': url + '/seller_center/sellerAccountSetting/validatSecurityAnswer.cf'
      //获取卖家账户信息
      ,'getSellerAccountInfo': url + '/seller_center/sellerAccountSetting/getSellerAccountInfo.cf'
      //修改邮箱, 手机 ;
      ,'changeEmailORMobile': url + '/seller_center/sellerAccountSetting/changeEmailORMobile.cf'
      //修改密码
      ,'changePass': url + '/seller_center/sellerAccountSetting/changePass.cf'
      //修改成功后通知邮件
      ,'sendSuccessEmail': url + '/seller_center/sellerAccountSetting/sendSuccessEmail.cf'
      //发送手机验证码
      ,'sendAuthCode': url + '/seller_center/sellerAccountSetting/changeEmailORMobile.cf'

      /** 资料设置模块 **/
      //获取卖家个人信息
      ,'fetchSellerInfo': url + '/seller_center/informationSetting/fetchSellerInfo.cf'
      //保存或更新卖家个人信息
      ,'saveSellerInfo': url + '/seller_center/informationSetting/saveSellerInfo.cf'
      //获取卖家公司信息接口
      ,'fetchCompanyInfo': url + '/seller_center/informationSetting/fetchCompanyInfo.cf'
      //保存公司信息
      ,'saveCompanyInfo': url + '/seller_center/informationSetting/saveCompanyInfo.cf'
      //获取商业规则信息
      ,'fetchBizRuleInfo': url + '/seller_center/informationSetting/fetchBizRuleInfo.cf'
      //新增或更新商业规则信息
      ,'saveBizRuleInfo': url + '/seller_center/informationSetting/saveBizRuleInfo.cf'

      /** 地址管理模块 **/
      //查询卖家地址
      ,'fetchSellerAddrInfo': url + '/seller_center/addressSetting/fetchSellerAddrInfo.cf'
      //保存或更新卖家地址信息
      ,'saveSellerAddrInfo': url + '/seller_center/addressSetting/saveSellerAddrInfo.cf'
      //删除卖家地址
      ,'deleteSellerAddrInfo': url + '/seller_center/addressSetting/deleteSellerAddrInfo.cf'

      /** 商品上传及管理 **/
      //由商品id查询商品对应的详情
      ,'getProductById': url + '/seller_center/product/fetchProductById.cf'
      //保存商品，新增或更新，保存商品数据，商品详情数据，商品所选择的属性值
      ,'saveProduct': url + '/seller_center/product/saveProduct.cf'
      //商品状态更新操作
      ,'updateProductStatus': url + '/seller_center/product/updateProductStatus.cf'
      //获取用户曾经使用过的类目列表
      ,'getUserCategoryOnceUsed': url + '/seller_center/category/getUserCategoryOnceUsed.cf'
      //由末端类目加载对应的属性和属性值
      ,'getPropertisByCatagoryId': url + '/seller_center/category/loadPropertisByCatagoryId.cf'
      //获取产品
      , 'getProducts': url + '/seller_center/product/getPageProductList.cf'
      //获取产品数量
      , 'getProductCount': url + '/seller_center/product/getProductCountByStatus.cf'

      /** 卖家身份认证 **/
      //获取卖家身份资料
      ,'getIdentity': url + '/seller_center/identity.cf'
      //添加卖家身份认证申请资料
      ,'saveIdentity': url + '/seller_center/identity/save.cf'
      //修改卖家身份资料
      ,'updateIdentity': url + '/seller_center/identity/update.cf'
    })
    .factory('publicApi', ['$http', 'api', function($h, api){

       // console.log($h);
      return {
        //获取国家
        county: function(){
          return $h.get(api.getCountryCode, {cache:true});
        },
        //获取城市
        getCity: function(params){
          return $h.get(api.getDistrict,{params:{'districtSplit':params}});
        }
      };
    }])
    .factory('commonServer', ['$timeout', function($timeout){
      return {
        //用jquery写
        msg: function(content){
          //
          var tipContainer = $('.tip-container');
          if (tipContainer.length === 0) {
            $('body').append('<div class="tip-container tip-container-left"></div>');
            tipContainer = $('.tip-container');
          }
          var html = $('<div class="tip-item"><span class="glyphicon glyphicon-exclamation-sign"></span> '+content+'</div>');

          tipContainer.append(html);
          $timeout(function(){
            //console.log(html);
            html.fadeOut(600);
          }, 3000);
        }
      };
    }]);
});

