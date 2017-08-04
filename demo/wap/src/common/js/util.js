import { publicParams } from "common/js/common";

export const localStorage = {};

let storage = window.localStorage;

// 存储 localStorage
localStorage.set = (name, content) => {
    if (!name) return;
    if (typeof content !== "string") {
        content = JSON.stringify(content);
    }
    storage.setItem(name, content);
};

// 获取 localStorage
localStorage.get = name => {
    if (!name) return;
    return storage.getItem(name);
};

//  移除 localStorage
localStorage.remove = name => {
    if (!name) return;
    storage.removeItem(name);
};
// 公共方法
export const CFEC = {};
CFEC.addConfig = (json) => {
    let j = json;
    // 区分数据源是json还是formData
    if (json.constructor == FormData) {
        j.append('appFlag', publicParams.appFlag);
        j.append('appVersion', publicParams.appVersion);
    } else {
        j.appFlag = publicParams.appFlag;
        j.appVersion = publicParams.appVersion;
    }
    return j;
}

CFEC.getUrlParam = (name) => {
    //构造一个含有目标参数的正则表达式对象  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    //匹配目标参数  
    var r = window.location.search.substr(1).match(reg);

    return r ? decodeURIComponent(r[2]) : null;

}