### 文档结构
src/    
    common/  
        js/ 
          common.js    主要存放一些共用的url链接   
          global.js   应该合并到common.js
          rem.js    整个项目的适配文件，整个项目都用rem为单位      
          util.js   存放公共方法，目前只封装的本地存储   
        stylus/         
          images   图片   
          mixins                    
   components/   存放一些共用组件   
          down_layer  app引导下载的共用组件
          header  头部组件 
          footer.vue  底部导航组件 
   pages/  存放所有页面
      buying_request/  发布采购需求
          index.vue  发布采购需求首页
          imgages
          children/  发布采购需求的一些子页面
              attribute_detail.vue  属性详情
              attribute_list.vue  属性列表
              choose_category.vue  选择类目
              successed.vue  发布成功页面
      categories/  分级类目
          category_fist.vue    一级类目页
          category_second.vue  二级类目页
          category_third.vue   三级类目页
          category_search.vue  类目搜索页
      home/  首页
          index.vue  首页
      inquiry/  询盘页包括店铺询盘、商品询盘
          product_inquiry.vue  商品询盘页
          shop_inquiry.vue  店铺询盘页
      login/  登录页
          index.vue  登录页面
      me/  个人中心页面 包括采购需求管理和询盘管理
          index.vue  个人中心首页
          buying_request_manage/  采购需求管理
             buying_request_list.vue  采购需求列表页
             buying_request_detail.vue  采购需求详情页
             quotaion_detail.vue  报价详情页
          inqyiry_manage/  询盘管理
             inquiry_list.vue  询盘列表页
             inquiry_detail.vue  询盘详情页
             seller_profill.vue   卖家简介页
          common/  一些共用的页面
             attachment.vue  附件查看页
             reply.vue  回复页   
      product/  商品详情
          product.vue  商品详情页
          children  商品详情的组件页
              productDetail.vue  上滑查看更多的组件页
      register/  注册
          register.vue  注册页
          children/  注册页子页面
              selectContry.vue  选择国家页面
      reset_password/  密码修改
              accuntChoose.vue  选择账号页面
              getAccount.vue  获取账号
              resetByPhone.vue  通过手机修改账号
              resetSuccess.vue  共用的重置成功页面
              verifyCode.vue  验证码页面
      search/  搜索
          search.vue  搜索页
          children/
               searchDefault.vue  搜索的Tab组件
      shop/ 店铺详情
          shop.vue  店铺详情页
          children/ 店铺详情的一些子页面
               allProducts.vue  店铺的所有产品页
               companyProfile.vue  公司介绍页
      unit/ 共用的选择单位
           unit.vue  共用的选择单位页
   router  路由文件
   store   vuex
   app.vue  根组件 
   main.js  入口文件  


### @一些细节@

 **`路径问题`**
 
 路径可以在  webpack.base.conf.js这个文件里设置别名,在css里无效
 @ 表示 src/
 assets 表示 src/assets/
 components 表示 src/components/
 pages 表示  src/pages/
 common 表示 src/common/

---
**`路由问题`**

 通过  meta: { isKeepAlive: true } or  meta: { isKeepAlive: false } 来控制是否将页面保存在内存中
 
---
**`单位问题`**

 基本都使用rem作为单位，换算规则是  设计尺寸/40 

---
**`头部组件问题`**

 弃用header组件，统一引用index.vue这个头部组件，部分页面已更改。

---
### `用到的第三方组件`
1. `mint-ui`      http://mint-ui.github.io/#!/zh-cn
2. `axios`       https://www.npmjs.com/package/axios
3. `vue-axios`    https://www.npmjs.com/package/vue-axios
---


### 启动项目
npm run dev
### 文件打包
npm run build
