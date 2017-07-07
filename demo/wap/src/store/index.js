import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";
import actions from "./action";
import getters from "./getters";

Vue.use(Vuex);


const state = {
  
  userInfo: {
    isLogin: false
  },
  keyword: "", // 热词搜索
  unit: "Pieces",

  categoryName: "Please choose a category", // 采需类目
  categoryId: null, // 采需类目Id
  properties: {},
  requestParams: {}, // 采需参数
  requestStatus: false, // 采需发送状态
  country: null, // 记录注册国家
  refreshInquire: false, // 刷新询盘
  refreshRequest: false, // 刷新采购需求
  recordProScroll: 0, // 记录商品滚动位置
  recordSupScroll: 0, // 记录供应商滚动位置
  accountStatus: false, // 更新账号
  backLogin: false, // 控制登录页的cancel返回me还是go(-1)
  inquireHome: false, // 询盘管理首页入口

  flag_categoryEntry: false, // 判断类目入口 false:首页  true:采需类目选择页  
  flag_HomeToSearch: false, // 从首页跳转搜索页
  flag_showGetApp: true  //  是否显示下载app弹窗
};







export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
