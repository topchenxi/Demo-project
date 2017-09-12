define(['./module'], function(ng) {
    ng
        .factory('alertMsgService', ['$timeout',
            function($timeout) {
                return {
                    message: null,
                    type: null,
                    setMessage: function(msg, type, func) {

                        this.message = msg;
                        this.type = type;

                        //提示框显示最多1秒消失
                        var _self = this;
                        $timeout(function() {
                            _self.clear();
                            if (typeof func == 'function' && func != undefined) {
                                func();
                            }
                        }, 1000);
                    },
                    clear: function() {
                        this.message = null;
                        this.type = null;
                    }
                };
            }
        ])
        .factory('mainService', ['$http', 'api',
            function($http, api) {
                return {
                    login: function(params) {
                        return $http.post(api.login, params);
                    },
                    getPermission: function() {
                        return $http.get(api.getUserOpers);
                    },
                    logout: function() {
                        return $http.get(api.logout);
                    }
                };
            }
        ])

    .config(function($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    })


    .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'mainService', 'alertMsgService', '$state',
        function($scope, $rootScope, $location, mainService, alertMsgService, $state) {

            $rootScope = $.extend($rootScope, {
                // 权限控制是否启用
                isPermissionActive: true,
                // 收缩菜单flag，true时为收缩
                isShrink: false,
                // 顶部全局时间
                currentDate: Date.parse(new Date()),
                // message弹出提示
                alertMsgService: alertMsgService,
                // 分页公共模版
                paginationTemplate: "/controller/index/pagination.html",
                // new class 分页公共模版
                paginationTemp: "/controller/index/paginationTemp.html"
            });

            $scope = $.extend($scope, {
                // 一级菜单，点击收起下次菜单
                menuAction: function() {
                    $(event.target).parents("li").toggleClass('active');
                },
                // 退出帐号
                exitAccount: function() {
                    mainService.logout().success(function(data) {
                        localStorage.removeItem('UserMessage');
                        $rootScope.leftMenu = [];
                        $location.path('/login');
                    }).error(function(data) {
                        $rootScope.alertMsgService.setMessage("退出失败", 'warning');
                    })
                },
                // 收缩菜单
                changeShrink: function(bool) {
                    $rootScope.isShrink = bool;
                }
            });

            function init_data() {
                // 加载用户名
                if (localStorage.UserMessage != null) {
                    var UserMessage = JSON.parse(localStorage.UserMessage);
                    $rootScope.MainUserName = UserMessage.data.login;
                }
            };

            init_data();

        }
    ])

    /**
     * 处理请求登陆及响应失败时的过滤器
     */
    .factory('TokenInterceptor', function($q, $window, $location, $rootScope, userService) {
        return {
            request: function(config) {

                config.headers = config.headers || {};
                if ($window.localStorage.isLogin) {
                    config.headers.Authorization = 'Bearer ' + $window.localStorage.isLogin;
                }
                return config;
            },

            requestError: function(rejection) {
                return $q.reject(rejection);
            },

            /* Set Authentication.isLogin to true if 200 received */
            response: function(response) {

                if (response != null && response.status == 200 && $window.localStorage.isLogin && !userService.isLogin) {
                    userService.isLogin = true;
                }
                return response || $q.when(response);
            },

            /* Revoke client authentication if 401 is received */
            responseError: function(rejection) {
                if (rejection != null && rejection.status === 401) {
                    delete $window.localStorage.isLogin;
                    userService.isLogin = false;
                    top.location.href = "/#/login";
                    // $location.path("/login");
                    //} else if (404 == rejection.status) { // 找不到资源时的返回状态
                    //  alert("The Server Is Busy,Please Try Later...");
                    //} else if (400 == rejection.status) { // 服务器不理解请求的语法
                    //  alert("Your Request Is Incorrect,Please Try Again...");
                } else if (500 == rejection.status) {
                    $rootScope.alertMsgService.setMessage("The Server Is Tired,Please Try Later...", 'warning');
                }

                return $q.reject(rejection);
            }
        };
    })

    .run(function($rootScope, $location, mainService, permissions, $state, $window, api) {
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {

                if (toState.name == 'login') return;
                if (localStorage.UserMessage) {
                    var UserMessage = JSON.parse(localStorage.UserMessage);
                    var isLogin = ('success' === UserMessage.status) ? 1 : 0;
                    if (isLogin) {
                        $rootScope.isLogin = true;
                    } else {
                        event.preventDefault();
                        $state.go("login");

                    }
                } else {
                    $rootScope.isLogin = false;
                    event.preventDefault();
                    $state.go("login");
                }

                function dealPermission() {
                    if (!$rootScope.isPermissionActive ||
                        (typeof $rootScope.functionStates == 'string' && toState.name.indexOf('.') > -1 && $rootScope.functionStates.indexOf(',' + toState.name + ',') < 0)) {
                        return;
                    }
                    // index 都有权取
                    if (toState.name != 'index') {
                        // 判断是否有菜单访问权取
                        var urlStates = toState.name.split('.'),
                            hasPermission = false;
                        if (urlStates.length == 1) {
                            for (var i = 0, il = $rootScope.leftMenu.length; i < il; i++) {
                                mod = $rootScope.leftMenu[i];
                                if (mod.url == urlStates[0]) {
                                    hasPermission = true;
                                    break;
                                }
                            }
                        } else {
                            for (var i = 0, il = $rootScope.leftMenu.length; i < il; i++) {
                                if (hasPermission) break;
                                mod = $rootScope.leftMenu[i];
                                if (mod.url == urlStates[0]) {
                                    for (var j = 0, jl = mod.functionList.length; j < jl; j++) {
                                        func = mod.functionList[j];
                                        if (func.functionUrl.replace('/', '.') == toState.name) {
                                            hasPermission = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        // 如果没有，提示并转到首页
                        if (!hasPermission) {
                            $rootScope.alertMsgService.setMessage("对不起，你没有相应的访问权取", 'info');
                            event.preventDefault();
                            $state.go("index");
                        }
                    }
                }




                if ($rootScope.isLogin) {
                    permissions.setFunctionStates();
                    // 用户权限
                    if (typeof $rootScope.leftMenu == 'undefined' || $rootScope.leftMenu.length == 0) {

                        // 用jquery 的同步请求
                        $.ajax({
                            url: api.getUserOpers,
                            async: false
                        }).success(function(data) {
                            var rs = JSON.parse(data);
                            if (rs.status == 'success') {
                                $rootScope.userOpers = rs.data;
                                permissions.setPermissions(rs.data);
                                // 菜单
                                $rootScope.leftMenu = rs.data;

                                dealPermission();
                            } else {
                                $rootScope.alertMsgService.setMessage("获取用户权限失败", 'warning');
                            }
                        }).error(function(xhr, textStatus, errorThrown) {
                            if (xhr.status == 401) {
                                top.location.href = "/#/login";
                            }
                        })

                    } else {
                        dealPermission();
                    }
                }
            });
    })

    .filter('setImgSize', function() {
        return function(sImg, width, height, type) {
            width = width ? width : '180';
            height = height ? height : '180';
            type = type ? 　type : '3';
            var img;
            if (sImg) {
                img = sImg.split(',')[0];
                img = imgUrl + img.slice(0, img.lastIndexOf('.')) + '_' +
                    width + 'x' + height + '_' + type + img.slice(img.lastIndexOf('.'));
            } else {
                img = '/view/images/default-img.jpg';
            }
            return img;
        };
    })

    .filter('serverFile', function() {
        return function(filePath) {
            return imgUrl + filePath;
        };
    })

    .filter('ngcDate', function() {
        return function(date, formatStr) {
            var myDate = new Date(date);
            var str = formatStr;
            var Week = ['日', '一', '二', '三', '四', '五', '六'];
            str = str.replace(/yyyy|YYYY/, myDate.getFullYear());
            str = str.replace(/yy|YY/, (myDate.getYear() % 100) > 9 ? (myDate.getYear() % 100).toString() : '0' + (myDate.getYear() % 100));
            str = str.replace(/MM/, (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1).toString() : '0' + (myDate.getMonth() + 1));
            str = str.replace(/M/g, (myDate.getMonth() + 1));
            str = str.replace(/w|W/g, Week[myDate.getDay()]);
            str = str.replace(/dd|DD/, myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate());
            str = str.replace(/d|D/g, myDate.getDate());
            str = str.replace(/hh|HH/, myDate.getHours() > 9 ? myDate.getHours().toString() : '0' + myDate.getHours());
            str = str.replace(/h|H/g, myDate.getHours());
            str = str.replace(/mm/, myDate.getMinutes() > 9 ? myDate.getMinutes().toString() : '0' + myDate.getMinutes());
            str = str.replace(/m/g, myDate.getMinutes());
            str = str.replace(/ss|SS/, myDate.getSeconds() > 9 ? myDate.getSeconds().toString() : '0' + myDate.getSeconds());
            str = str.replace(/s|S/g, myDate.getSeconds());
            return str;
        };
    })

    .filter('menuIcon', function() {
        return function(moduleId) {
            switch (moduleId) {
                case 9:
                    return "icon-user";
                case 10:
                    return "icon-shop";
                case 11:
                    return "icon-shop";
                case 12:
                    return "icon-shangpin";
                case 13:
                    return "icon-order";
                case 14:
                    return "icon-contract";
                case 15:
                    return "icon-shop";
                case 16:
                    return "icon-xiangmu";
                case 17:
                    return "icon-shop";
                case 18:
                    return "icon-gold";
                case 19:
                    return "icon-shuju";
                case 20:
                    return "icon-shop";
                case 21:
                    return "icon-shop";
                case 22:
                    return "icon-car";
                case 23:
                    return "icon-medal";
                case 24:
                    return "icon-shezhi";
                case 26:
                    return "icon-leadexpress";
                case 27:
                    return "icon-advertisement";
                case 29:
                    return "icon-inquiry";
                default:
                    return "icon-shop";
            }
        };
    })


});
