define(['angular'], function(angular) {
    "use strict";
    //定义模块
    var cfecCommon = angular.module("cfec.common", []);

    cfecCommon

        /**
         * 修复post请求
         */
        .config(function($httpProvider) {

            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            var param = function(obj) {
                var query = '',
                    name = {},
                    value, fullSubName, subName = {},
                    subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null)
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };
            $httpProvider.defaults.transformRequest = [function(data) {
                return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
            }];

        })

        /**
         *	常用工具
         */
        .factory('commonTool', function() {
            return {
                isEmpty: function(data) {
                    return (data == null || data == '' || data == 'undefined');
                },
                // 空对象
                isEmptyObject: function(data) {
                    var t;
                    for (t in data)
                        return !1;
                    return !0;
                },
                filterParam: function(p) {
                    var params = {};
                    angular.copy(p, params);
                    if (params.hasOwnProperty('total')) {
                        delete params['total'];
                    }
                    for (var name in params) {
                        if (params[name] == null || params[name] === '' || params[name] == 'undefined') {
                            delete params[name];
                        }
                    }
                    return params;
                },
                formParam: function(params) {
                    var rs = {};
                    var pageParam = {};
                    var whereParam = {};
                    for (var key in params) {
                        if (key === 'page') {
                            pageParam[key] = params[key];
                        } else if (key === 'pageSize') {
                            pageParam[key] = params[key];
                        } else if (key === 'total') {
                            // 丢弃
                        } else if (key === 'tabName') {
                            rs.tabName = params[key];
                        } else {
                            whereParam[key] = params[key];;
                        }
                    }
                    rs.pageStr = pageParam;
                    rs.whereStr = whereParam;
                    return rs;
                },
                checkExportParam: function(params) {
                    var flag = false;
                    for (var name in params) {
                        if (name != "page" && name != 'pageSize' && name != 'total') {
                            flag = true;
                            break;
                        }
                    }
                    return flag;
                },
                formatDate: function(date, fmt) { //author: meizz 
                    var _this = date;
                    var o = {
                        "M+": _this.getMonth() + 1, //月份 
                        "d+": _this.getDate() //日 
                        // "h+": _this.getHours(), //小时 
                        // "m+": _this.getMinutes(), //分 
                        // "s+": _this.getSeconds(), //秒 
                        // "q+": Math.floor((_this.getMonth() + 3) / 3), //季度 
                        // "S": _this.getMilliseconds() //毫秒 
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                },
                lstorage: function() {

                    let storage = 'localStorage';
                    // 判断浏览器是否支持 localStorage
                    let isSupportLs = (function() {
                        try {
                            return window.JSON && (storage in window) && window[storage] !== null
                        } catch (e) {
                            return false;
                        }
                    })();

                    var _getItem = function(key) {
                        return window[storage].getItem(key);
                    };
                    var _setItem = function(key, value) {
                        try {
                            window[storage].setItem(key, value);
                        } catch (e) {
                            console.log(e);
                        }
                    };
                    var _removeItem = function(key) {
                        window[storage].removeItem(key);
                    };

                    return {
                        getItem: function(key) {
                            if (!isSupportLs || !key) return null;
                            return _getItem(key);
                        },
                        setItem: function(key, item) {
                            if (!isSupportLs || !key) return false;

                            item = item || '';
                            _setItem(key, JSON.stringify(item));
                            return true;
                        },
                        removeItem: function(key) {
                            if (!isSupportLs || !key) return false;
                            _removeItem(key);
                        }
                    }

                }

            }
        })

        /** 
         * 将变量转为数字
         */
        .filter('parseIn', function() {
            return function(str) {
                if (typeof str === 'number') {
                    return str
                } else {
                    return parseInt(str, 10);
                }
            }
        })
        /**
         * 币种符号
         */
        .filter('currencyIcon', function() {
            return function(status) {
                var statusName = "";
                switch (status) {
                    case 'USD':
                        statusName = "$";
                        break;
                    case 'US':
                        statusName = "$";
                        break;
                    case 'CNY':
                        statusName = "￥";
                        break;
                    default:
                        statusName = status;
                        break;
                }
            }
        })
        /**
         * 币种名称
         */
        .filter('currencyName', function() {
            return function(status) {
                var statusName = "";
                switch (status) {
                    case 'USD':
                        statusName = "美元";
                        break;
                    case 'US':
                        statusName = "美元";
                        break;
                    case 'CNY':
                        statusName = "人民币";
                        break;
                    default:
                        statusName = status;
                        break;
                }
            }
        })

})