define(['angular'], function (angular) {
	"use strict";
	//定义模块
	var cfecCommon = angular.module("cfec.common", []);

	cfecCommon

		/**
		 * 修复post请求
		 */
		.config(function ($httpProvider) {

			$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
			var param = function (obj) {
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
			$httpProvider.defaults.transformRequest = [function (data) {
				return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

		})

	/**
	 *	常用工具
	 */
	.factory('commonTool', function () {
		return {
			isEmpty: function (data) {
				return (data == null || data == '' || data == 'undefined');
			},
			// 空对象
			isEmptyObject: function (data) {
				var t;  
			    for (t in data)  
			        return !1;  
			    return !0;  
			},
            filterParam:function(params){
                for(var name in params){
                    if(params[name] == null || params[name] === '' || params[name] == 'undefined'){
                        delete params[name];
                    }
                }
                return params;
            },
            formParam:function(params){
                var rs = {};
                var pageParam = {};
                var whereParam = {};
                for(var key in params){
                    if(key==='page'){
                        pageParam[key] = params[key];
                    }else if (key === 'pageSize'){
                        pageParam[key] = params[key];
                    }else if (key === 'total'){
                        // 丢弃
                    }else if(key==='tabName'){
                        rs.tabName = params[key];
                    }else{
                        whereParam[key] = params[key];;
                    }
                }
                rs.pageStr = pageParam;
                rs.whereStr = whereParam;
                return rs;
            },
            checkExportParam:function(params){
                var flag = false;
                for(var name in params){
                    if(name != "page" && name != 'pageSize' && name != 'total'){
                        flag = true;
                        break;
                    }
                }
                return flag;
            }

		}
	})
	
	/** 
	 * 将变量转为数字
	 */
	.filter('parseIn', function () {
		return function (str) {
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
    .filter('currencyIcon',function(){
        return function(status){
            var statusName = "";
            switch(status){
                case 'USD': statusName="$";break;
                case 'US': statusName="$";break;
                case 'CNY': statusName="￥";break;
                default:statusName = status;break;
            }
        }
    })
    /**
     * 币种名称
     */
    .filter('currencyName',function(){
        return function(status){
            var statusName = "";
            switch(status){
                case 'USD': statusName="美元";break;
                case 'US': statusName="美元";break;
                case 'CNY': statusName="人民币";break;
                default:statusName = status;break;
            }
        }
    })

})