

import {RECORD_USERINFO} from "./mutation-types.js";
import {CHANGE_KEYWORD} from "./mutation-types.js";
import {RECORD_UNIT} from "./mutation-types.js";
import {CHANGE_CATEGORY_ENTRY} from "./mutation-types.js";
import {RECORD_REQUEST_CATEGORY} from "./mutation-types.js";
import {RECORD_PROPERIES} from "./mutation-types.js";
import {RECORD_REQUEST_PARAMS} from "./mutation-types.js";
import {SEND_REQUEST_SUCCESS} from "./mutation-types.js";
import {CLEAR_PROPERIES} from "./mutation-types.js";
import {RECORD_COUNTRY} from "./mutation-types.js";
import {REFRESH_INQUIRE} from "./mutation-types.js";
import {REFRESH_REQUEST} from "./mutation-types.js";
import {RECORD_SCROLL} from "./mutation-types.js";
import {RECORD_SUP_SCROLL} from "./mutation-types.js";
import {HOME_TO_SEARCH} from "./mutation-types.js";
import {RECIRD_ACCOUNT_STATUS} from "./mutation-types.js";
import {BACK_LOGIN} from "./mutation-types.js";
import {CHANGE_INQUIRY_HOME} from "./mutation-types.js";
import {TOGGLE_DOWN_LAYER} from "./mutation-types.js";

import Vue from "vue";

import {localStorage} from "common/js/util.js";

export default {

  [RECORD_USERINFO](state, userInfo) {
    
    // 记录用户信息
    if (userInfo === void 0) {
      localStorage.remove("localUserInfo");
      state.userInfo = {isLogin: false};
    } else {
      state.userInfo.isLogin = true;
      state.userInfo = Object.assign({}, state.userInfo, userInfo);
      localStorage.set("localUserInfo", state.userInfo);
    }
  },

  [CHANGE_KEYWORD](state, keyword) {
    // 搜索热词
    state.keyword = keyword;
  },

  [RECORD_UNIT](state, unit) {
    // 单位
    state.unit = unit;
  },

  [CHANGE_CATEGORY_ENTRY](state, status) {
    // 选择类目入口，首页或者采购需求选择类目页
    state.flag_categoryEntry = status;
  },

  [RECORD_REQUEST_CATEGORY](state, categoryInfo) {
    // 记录采购需求类目
    state.categoryName = categoryInfo.categoryName;
    state.categoryId = categoryInfo.categoryId;
  },

  [RECORD_PROPERIES](state, _properties) {
    // 记录采购需求属性
    Vue.set(state.properties, _properties.index, _properties.property);
  },

  // 清空采购需求属性
  [CLEAR_PROPERIES](state) {
    state.properties = {};
  },

  // 记录询盘参数
  [RECORD_REQUEST_PARAMS](state, _requestParams) {
    state.requestParams = Object.assign(
      {},
      state.requestParams,
      _requestParams
    );
  },

  // 修改采需发送状态
  [SEND_REQUEST_SUCCESS](state, status) {
    state.requestStatus = status;
  },
  // 记录国家信息
  [RECORD_COUNTRY](state, country) {
    if (!country) {
      state.country = null;
    } else {
      state.country = Object.assign({}, state.country, country);
    }
  },
  // 刷新询盘
  [REFRESH_INQUIRE](state, status = 1) {
    status === 1
      ? (state.refreshInquire = true)
      : (state.refreshInquire = false);
  },
  // 刷新采购需求
  [REFRESH_REQUEST](state, status = 1) {
    status === 1
      ? (state.refreshRequest = true)
      : (state.refreshRequest = false);
  },
  // 记录滚动位置
  [RECORD_SCROLL](state, scrollTop) {
    state.recordProScroll = scrollTop;
  },
  // 记录sup滚动位置
  [RECORD_SUP_SCROLL](state, scrollSupTop) {
    state.recordSupScroll = scrollSupTop;
  },
  // 从首页跳转搜索页
  [HOME_TO_SEARCH](state, type = true) {
      state.flag_HomeToSearch = type;
  },
  // 更新账号
[RECIRD_ACCOUNT_STATUS](state, status=false) {
   state.accountStatus = status;
},
 // 返回登录页
[BACK_LOGIN](state, status) {
  state.backLogin = status;
},
  // 首页询盘入口
  [CHANGE_INQUIRY_HOME](state, status = true) {
    if (status) {
      state.inquireHome = true;
    } else {
      state.inquireHome = false;
    }
  },
// toggle 
  
//  显示引导下载app开关
  [TOGGLE_DOWN_LAYER](state) {
     state.flag_showGetApp = false;
  }
};
