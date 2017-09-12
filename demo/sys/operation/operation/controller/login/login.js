define(['../module'], function(ng) {
    ng.factory('loginService', ['$http', 'api',
            function($http, api) {
                return {
                    login: function(params) {
                        return $http.post(api.login, params);
                    },
                    account: function() {
                        return $http.get(api.account);
                    }
                };
            }
        ])
        .controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$uibModal', 'loginService', 'commonService', 'commonTool',
            function($scope, $rootScope, $location, $uibModal, loginService, commonService, commonTool) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};

                tools = $.extend(tools, {
                    isLogin: function() {
                        $rootScope.isLogin = false;
                    },
                    // 点击登录
                    checkLogin: function() {
                        if (commonTool.isEmpty(vm.username)) {
                            $rootScope.alertMsgService.setMessage("请输入帐号", 'warning');
                            return;
                        }
                        if (commonTool.isEmpty(vm.password)) {
                            $rootScope.alertMsgService.setMessage("请输入密码", 'warning');
                            return;
                        }
                        var params = {
                            username: vm.username,
                            password: vm.password
                        }
                        loginService.login(params).error(function(data) {
                            if (commonTool.isEmpty(data.error)) {
                                $rootScope.alertMsgService.setMessage("登录失败", 'warning');
                                return;
                            }
                            var error_message = tools.checkCode(data.error.code);
                            $rootScope.alertMsgService.setMessage(error_message, 'warning');
                        }).success(function(data) {
                            loginService.account().success(function(data) {
                                localStorage.UserMessage = JSON.stringify(data);
                                $rootScope.MainUserName = data.data.login;
                                $rootScope.isLogin = true;
                                $location.path('/index');
                            })
                        })
                    },
                    // 隐藏提示框
                    hideAlert: function() {
                        $rootScope.alertMsgService.clear();
                    },
                    // 判断登录返回错误码
                    checkCode: function(code) {
                        switch (code) {
                            case 101:
                                return "账户名与密码不匹配，请重新输入";
                            case 104:
                                return "帐号没激活";
                            case 105:
                                return "帐号类型不允许（非广交会内部帐号不能登录）";
                            case 106:
                                return "帐号被锁";
                            default:
                                return "登录失败";
                        }
                    },
                    checkKeyUp: function(e) {
                        var keycode = window.event ? e.keyCode : e.which;
                        if (keycode == 13) this.checkLogin();
                    }
                });

                tools.isLogin();


            }
        ])
});
