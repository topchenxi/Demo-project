define(['../module'], function(ng) {
    ng
        .factory('systemService', ['$http', 'api', function($http, api) {
            return {
                getUserPaging: function() {
                    var page = {};
                    page.page = 1;
                    page.pageSize = 10;
                    page.groupId = ""; //
                    page.skey = "1"; //
                    page.svalue = ""; //

                    return page;
                },
                getSysUserList: function(params) {
                    return $http.get(api.getSysUserList, {
                        'params': params
                    });
                },
                getSysUserDetail: function(params) {
                    return $http.get(api.getSysUserDetail, {
                        'params': params
                    });
                },
                addSysUser: function(params) {
                    return $http.post(api.addSysUser, params);
                },
                chgSysUSer: function(params) {
                    return $http.post(api.chgSysUSer, params);
                },
                delSysUser: function(params) {
                    return $http.post(api.delSysUser, params);
                },
                chkSysUSerName: function(params) {
                    return $http.get(api.chgSysUSer, {
                        'params': params
                    });
                },
                chgSysUSerPwd: function(params) {
                        return $http.get(api.chgSysUSerPwd, {
                            'params': params
                        });
                    }
                    // 用户分组
                    ,
                getSysUserGrpList: function(params) {
                    return $http.get(api.getSysUserGrpList, {
                        'params': params
                    });
                },
                addSysUserGrp: function(params) {
                    return $http.post(api.addSysUserGrp, params);
                },
                chgSysUSerGrp: function(params) {
                    return $http.post(api.chgSysUSerGrp, params);
                },
                delSysUSerGrp: function(params) {
                    return $http.post(api.delSysUSerGrp, params);
                },
                chkSysUSerGrp: function(params) {
                        return $http.get(api.chkSysUSerGrp, {
                            'params': params
                        });
                    }
                    // 角色管理
                    ,
                getSysRoleList: function(params) {
                    return $http.get(api.getSysRoleList, {
                        'params': params
                    });
                },
                getUserRoleDetail: function(params) {
                    return $http.get(api.getUserRoleDetail, {
                        'params': params
                    });
                },
                addSysRole: function(params) {
                    return $http.post(api.addSysRole, params);
                },
                chgSysRole: function(params) {
                    return $http.post(api.chgSysRole, params);
                },
                delSysRole: function(params) {
                    return $http.post(api.delSysRole, params);
                },
                getSysOpers: function() {
                        return $http.get(api.getSysOpers);
                    }
                    // 操作日志 搜索类型 by ken 20160613
                    ,
                SetSearchTypeArray: function() {
                    var SearchTypeArray = [];
                    SearchTypeArray = [{
                        "title": "操作用户名",
                        "key": 1
                    }, {
                        "title": "角色",
                        "key": 2
                    }, {
                        "title": "登录IP",
                        "key": 3
                    }, {
                        "title": "操作模块",
                        "key": 4
                    }, {
                        "title": "操作类型",
                        "key": 5
                    }, {
                        "title": "操作内容",
                        "key": 6
                    }];
                    return SearchTypeArray;
                },
                getOperationLog: function(params) {
                    return $http.get(api.getOperationLog, {
                        'params': params
                    });
                }
            }
        }])
        .controller('sysUserListCtrl', ['$scope', '$rootScope', '$location', '$controller', 'ngDialog', 'systemService', 'commonService', 'commonTool',
            function($scope, $rootScope, $location, $controller, ngDialog, service, commonService, commonTool) {
                // 继承
                $controller('baseListController', {
                    $scope: $scope
                });
                var tools = $scope.tools;
                var vm = $scope.vm;
                var paging = $scope.paging = service.getUserPaging();
                // 转到第几页
                tools.newpagesize = null;
                var search = $location.search();
                var keyName = "userId"

                tools.init = function() {
                    if (!commonTool.isEmpty(search.groupId)) {
                        paging.groupId = search.groupId * 1; // 转为int
                    }
                    tools.baseInit();
                    // 获取用户分组
                    service.getSysUserGrpList().success(function(rs) {
                        if (rs.status == 'success') {
                            vm.grpList = rs.page.items;
                        }
                    })
                    tools.getList();
                };
                // 1.查询列表
                tools.getList = function() {
                    service.getSysUserList(commonTool.filterParam(paging)).success(function(data) {
                        if (data.status == 'success') {
                            vm.items = data.page.items;
                            paging.total = data.page.total;
                            vm.checkedDatas = [];
                        }
                    });
                };

                tools.init();

                // 2.列表翻页
                tools.getnewpage = function(type) {
                    if (type == 1) { // 跳转到第几页
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) { // 每页显示多少条切换时
                        paging.page = 1;
                    }

                    tools.getList();

                }

                // 3. to 新增页面
                tools.toAddUser = function() {
                    $location.path('/system/userDetail').search({
                        'type': 'ADD'
                    })
                }

                tools.toEdit = function(userId) {
                    $location.path('/system/userDetail').search({
                        'userId': userId
                    })
                }

                // 批量选择
                tools.toggleCheckAll = function(ischecked) {
                    vm.checkedDatas = [];
                    angular.forEach(vm.items, function(item) {
                        item.$checked = ischecked;
                        if (true === ischecked) {
                            vm.checkedDatas.push(item[keyName]);
                        }
                    });
                };
                tools.setCheckedData = function() {
                    var selectionItem = [];
                    angular.forEach(vm.items, function(item) {
                        if (true === item.$checked) {
                            selectionItem.push(item[keyName]);
                        }
                    });
                    vm.checkedDatas = selectionItem;
                }

                // 4.批量删除
                tools.delUser = function() {
                    var ids = vm.checkedDatas.join(',');
                    if (commonTool.isEmpty(ids)) {
                        alert("请先选择操作项!");
                        return;
                    }

                    vm.delConfirmDlg = ngDialog.openConfirm({
                        confirmInfo: '您确定要删除用户?',
                        title: "操作提示",
                        scope: $scope,
                    }).then(function(yes) {
                        service.delSysUser({
                            'userId': ids
                        }).success(function(rs) {
                            if (rs.status == 'success') {
                                $rootScope.alertMsgService.setMessage('操作成功');
                                tools.closeDlg(vm.delConfirmDlg);
                                tools.getList();

                            } else {
                                $rootScope.alertMsgService.setMessage('操作失败：' + data.message, 'warning');
                            }
                        })
                    });

                }

                // 启用、禁用
                tools.chgStatus = function(index, newStatus) {
                    var newStatusName = "禁用";
                    if (newStatus == 1) {
                        newStatusName = "启用";
                    }
                    vm.confirmDlg = ngDialog.openConfirm({
                        confirmInfo: '您确定要' + newStatusName + '该用户?',
                        title: "操作提示",
                        scope: $scope,
                    }).then(function(yes) {
                        var param = {
                            'userId': vm.items[index].userId,
                            'valid': newStatus
                        }
                        service.chgSysUSer(param).success(function(rs) {
                            if (rs.status == 'success') {
                                $rootScope.alertMsgService.setMessage('操作成功');
                                vm.items[index].valid = newStatus;
                                vm.items[index].validType = (vm.items[index].validType.indexOf('启') > -1 ? '禁用' : '启用');
                                // 不重新查列表数据
                            } else {
                                $rootScope.alertMsgService.setMessage('操作失败：' + rs.message, 'warning');
                            }

                        })
                    });


                }

                // 重置密码
                tools.resetPassword = function(userId) {
                    vm.dlgData = {};
                    vm.dlgData.userId = userId;
                    vm.confirmDlg = ngDialog.open({
                        template: 'resetPwdDlgId',
                        title: "重置密码",
                        scope: $scope,
                        controller: ['$scope', function() {
                            tools.chgUserPwdDb = function() {
                                service.chgSysUSerPwd(vm.dlgData).success(function(rs) {
                                    if (rs.status == 'success') {
                                        $rootScope.alertMsgService.setMessage('操作成功');
                                        // 不重新查列表数据
                                        ngDialog.close(vm.confirmDlg);
                                    } else {
                                        $rootScope.alertMsgService.setMessage('操作失败：' + rs.message, 'warning');
                                    }

                                })
                            }
                        }]
                    });
                }

                // 关闭弹出窗口
                tools.closeDlg = function(id) {
                    if (commonTool.isEmpty(id)) {
                        ngDialog.closeAll();
                    } else {
                        ngDialog.close(id);
                    }
                }
            }
        ])
        .controller('sysUserDetailCtrl', ['$scope', '$rootScope', '$location', 'systemService', 'commonTool',
            function($scope, $rootScope, $location, service, commonTool) {

                //获取参数
                var search = $location.search();

                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                var forms = $scope.forms = {};
                vm.item = {};
                // 复选框-角色
                vm.checkRoles = {};

                tools.init = function() {
                    // 修改时需要回显
                    if (search.type != 'ADD') {

                        service.getSysUserDetail({
                            'userId': search.userId
                        }).success(function(rs) {
                            if (rs.status == 'success') {
                                var user = rs.data.user;
                                // 将角色转为checkbox可回显的数据
                                if (!commonTool.isEmpty(rs.data.role)) {
                                    var roles = rs.data.role.split(',');
                                    if (!commonTool.isEmpty(roles)) {
                                        for (var i = 0, l = roles.length; i < l; i++) {
                                            vm.checkRoles[roles[i]] = roles[i] * 1; // 一定要将string 转为 int checkbox才能回显
                                        }
                                    }
                                }
                                // 赋值
                                vm.item.userId = user.userId;
                                vm.item.userName = user.username;
                                vm.originalUserName = user.username;
                                vm.item.userEmail = user.userEmail;
                                vm.originalUserEmail = user.userEmail;
                                vm.item.realName = user.realName;
                                vm.item.mobile = user.mobile;
                                vm.item.telephone = user.telephone;
                                vm.item.groupId = rs.data.group;
                                vm.item.valid = user.valid;

                            }
                        })
                    } else {
                        vm.item.valid = 1;
                    }


                    // get user's group list
                    service.getSysUserGrpList().success(function(rs) {
                        if (rs.status == 'success') {
                            vm.grpList = rs.page.items;
                        }
                    })

                    // get user's role list
                    service.getSysRoleList().success(function(rs) {
                        if (rs.status == 'success') {
                            vm.roleList = rs.page.items;
                        }
                    })
                }

                tools.init();

                tools.saveUser = function() {
                    // 处理复选框的角色
                    var checkedTemp = [];
                    angular.forEach(vm.checkRoles, function(value, key) {
                        if (value != 'false' && value != false) {
                            checkedTemp.push(value);
                        }
                    })
                    vm.item.roles = checkedTemp.join(',');

                    if (search.type == 'ADD') {
                        // add 
                        service.addSysUser(vm.item).success(function(rs) {
                            if (rs.status == 'success') {
                                $rootScope.alertMsgService.setMessage('操作成功');
                                $location.path('/system/userManage').search();
                            } else {
                                $rootScope.alertMsgService.setMessage('操作失败', 'warning');
                            }
                        });
                    } else {
                        // update
                        service.chgSysUSer(vm.item).success(function(rs) {
                            if (rs.status == 'success') {
                                $rootScope.alertMsgService.setMessage('操作成功');
                                $location.path('/system/userManage').search();
                            } else {
                                $rootScope.alertMsgService.setMessage('操作失败', 'warning');
                            }
                        })
                    }
                }
                tools.back = function() {
                    $location.path('/system/userManage');
                }

            }
        ])
        .controller('sysRoleListCtrl', ['$scope', '$rootScope', '$location', '$controller', 'ngDialog', 'systemService', 'commonService', 'commonTool',
            function($scope, $rootScope, $location, $controller, ngDialog, service, commonService, commonTool) {
                // 继承
                $controller('baseListController', {
                    $scope: $scope
                });
                var tools = $scope.tools;
                var vm = $scope.vm;
                var paging = $scope.paging = {
                    pageSize: 10,
                    page: 1
                };
                // 转到第几页
                tools.newpagesize = null;
                tools.baseInit();

                // 1.查询列表
                tools.getList = function() {
                    service.getSysRoleList(commonTool.filterParam(paging)).success(function(data) {
                        if (data.status == 'success') {
                            vm.items = data.page.items;
                            paging.total = data.page.total;
                            vm.selectionItems = [];
                        }
                    });
                };
                tools.getList();
                // 2.列表翻页
                tools.getnewpage = function(type) {
                    if (type == 1) { // 跳转到第几页
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) { // 每页显示多少条切换时
                        paging.page = 1;
                    }

                    tools.getList();

                };

                // 3. to 新增页面
                tools.toAddRole = function() {
                    $location.path('/system/roleDetail').search({
                        'type': 'ADD'
                    });
                };
                tools.toEdit = function(roleId) {
                    $location.path('/system/roleDetail').search({
                        'roleId': roleId
                    });
                };
                // 4.删除
                tools.delRole = function(roleId) {
                    vm.delConfirmDlg = ngDialog.openConfirm({
                        confirmInfo: "您确定要删除该角色？如删除，已使用该角色的用户不再拥有该角色下的权限。",
                        title: "操作提示",
                        scope: $scope
                    }).then(function(yes) {
                        service.delSysRole({
                            'roleID': roleId
                        }).success(function(data) {
                            if (data.status == 'success') {
                                $rootScope.alertMsgService.setMessage('删除角色成功');
                                tools.getList();
                            } else {
                                $rootScope.alertMsgService.setMessage('删除角色失败：' + data.message, 'warning');
                            }
                        })
                    }, function(no) {
                        // 取消
                    });

                }

                // 关闭弹出窗口
                tools.closeDlg = function(id) {
                    if (commonTool.isEmpty(id)) {
                        ngDialog.closeAll();
                    } else {
                        ngDialog.close(id);
                    }
                }
            }
        ])
        .controller('sysRoleDetailCtrl', ['$scope', '$rootScope', '$window', '$location', 'systemService', 'commonTool',
            function($scope, $rootScope, $window, $location, service, commonTool) {

                //获取参数
                var search = $location.search();

                var tools = $scope.tools = {};
                var vm = $scope.vm = {};

                vm.item = {};

                tools.init = function() {
                    tools.getSysOpers();
                    vm.title = "添加角色";
                    if (search.type != 'ADD') {
                        vm.title = "修改角色";
                        // 查询角色详情
                        var param = {};
                        param.roleID = search.roleId;

                        service.getUserRoleDetail(param).success(function(rs) {
                            if (rs.status == 'success') {
                                vm.item = rs.data.role;
                                vm.originalRoleName = rs.data.role.roleName;

                                // if (vm.item.isContact == 1) {
                                //     vm.item.isContactFlag = true;
                                // } else {
                                //     vm.item.isContactFlag = false;
                                // }

                                //  权限信息回显
                                try {
                                    var funcs = ',' + rs.data.functionIds + ',',
                                        oprs = ',' + rs.data.opearIds + ',';
                                    angular.forEach(vm.modules, function(md) {
                                        angular.forEach(md.functionList, function(fc) {
                                            if (funcs.indexOf(',' + fc.functionId + ',') > -1) {
                                                fc._flag = true;
                                            } else {
                                                fc._flag = false;
                                            }
                                            angular.forEach(fc.userOpear, function(op) {
                                                if (oprs.indexOf(',' + op.opearId + ',') > -1) {
                                                    op._flag = true;
                                                } else {
                                                    op._flag = false;
                                                }
                                            })
                                        })
                                    })
                                } catch (e) {
                                    console.log(e);
                                }

                            }
                        })
                    } else {
                        // vm.item.isContactFlag = false;
                        vm.item.isContact = 0;
                    }

                }

                // 切换是否可以查看联系方式状态
                tools.changeIsContact = function(status) {
                    // vm.item.isContactFlag = status == 1 ? true : false;
                    // vm.item.isContact = status == 1 ? 1 : 0;
                    // console.log( vm.item.isContactFlag,vm.item.isContact);
                }

                // 获取权取集合
                tools.getSysOpers = function() {
                    // 存到缓存里
                    if (!commonTool.isEmpty(localStorage) && commonTool.isEmpty(localStorage.sysOprs)) {
                        service.getSysOpers().success(function(rs) {
                            vm.modules = rs.data;
                            try {
                                localStorage.sysOprs = JSON.stringify(vm.modules);
                            } catch (e) {
                                console.log(e);
                            }
                        })
                    } else {
                        vm.modules = JSON.parse(localStorage.sysOprs)
                    }
                }

                tools.init();

                // 勾选模块时的全选效果
                tools.moduleChkAll = function(moduleId) {
                    angular.forEach(vm.modules, function(md) {
                        if (md.moduleId == moduleId) {
                            angular.forEach(md.functionList, function(fc) {
                                // fc.$checked = md.$checked;
                                fc._flag = md._flag;
                                angular.forEach(fc.userOpear, function(op) {
                                    // op.$checked = md.$checked;
                                    op._flag = md._flag;
                                })
                            })
                        }
                    })
                }

                // tools.functionCheckAll = function (moduleId,functionId) {
                //     angular.forEach(vm.modules,function(md) {
                //         if(md.moduleId == moduleId){
                //             angular.forEach(md.functionList,function(fc) {
                //                if(functionId == fc.functionId){
                //                     angular.forEach(fc.userOpear,function (op) {
                //                         op._flag = fc._flag;
                //                     })
                //                }

                //             })
                //         }
                //     })
                // }

                tools.back = function() {
                    $window.history.back();
                }
                tools.saveRole = function() {
                    // 生成 提交参数opearIds 和 functionIds
                    var funcs = [],
                        oprs = [];
                    angular.forEach(vm.modules, function(md) {
                        angular.forEach(md.functionList, function(fc) {
                            angular.forEach(fc.userOpear, function(op) {
                                if (op._flag) {
                                    oprs.push(op.opearId);
                                    fc._flag = true;
                                }
                            })
                            if (fc._flag) {
                                funcs.push(fc.functionId);
                            }
                        })
                    })
                    if (oprs.length == 0 && funcs.length == 0) {
                        $rootScope.alertMsgService.setMessage('请为该角色选择权限', 'info');
                        return;
                    }
                    vm.item.opearIds = oprs.join(',');
                    vm.item.functionIds = funcs.join(',');


                    // if(search.type == 'ADD'){
                    //     service.addSysRole(vm.item).success(function(rs){
                    //         if(rs.status == 'success'){
                    //             $rootScope.alertMsgService.setMessage('操作成功');
                    //             $location.path('/system/roleManage');
                    //         }else{
                    //             $rootScope.alertMsgService.setMessage('操作失败','warning');
                    //         }
                    //     })
                    // }else{
                    vm.item.roleId = search.roleId;
                    service.chgSysRole(vm.item).success(function(rs) {
                            if (rs.status == 'success') {
                                $rootScope.alertMsgService.setMessage('操作成功');
                                $location.path('/system/roleManage').search();
                            } else {
                                $rootScope.alertMsgService.setMessage('操作失败', 'warning');
                            }
                        })
                        // }

                }

            }
        ])
        .controller('sysUserGroupListCtrl', ['$scope', '$rootScope', '$location', '$controller', 'ngDialog', 'systemService', 'commonService', 'commonTool',
            function($scope, $rootScope, $location, $controller, ngDialog, service, commonService, commonTool) {
                // 继承
                $controller('baseListController', {
                    $scope: $scope
                });
                var tools = $scope.tools;
                var vm = $scope.vm;
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    groupName: ''
                };

                // 转到第几页
                tools.newpagesize = null;
                // 分页条数
                tools.baseInit();

                // 1.查询列表
                tools.getList = function() {
                    service.getSysUserGrpList(commonTool.filterParam(paging)).success(function(data) {
                        if (data.status == 'success') {
                            vm.items = data.page.items;
                            paging.total = data.page.total;
                        }
                    });
                };
                tools.getList();
                // 2.列表翻页
                tools.getnewpage = function(type) {
                    if (type == 1) { // 跳转到第几页
                        paging.page = tools.newpagesize;
                        tools.newpagesize = null;
                    } else if (type == 0) { // 每页显示多少条切换时
                        paging.page = 1;
                    }

                    tools.getList();

                }

                // 3.添加分组
                tools.chgGroup = function(groupId, groupName) {
                    vm.dlgData = {};
                    var dlgTile = "添加分组";
                    if (!commonTool.isEmpty(groupId)) {
                        // 修改s
                        dlgTile = "修改分组";
                        vm.dlgData.groupID = groupId;
                        vm.dlgData.groupName = groupName;
                        vm.dlgData.originalGroupName = groupName;
                    }
                    vm.addGroupDlg = ngDialog.open({
                        template: 'addGroupDlgId',
                        // appendClassName: "dialog-activeM",
                        scope: $scope,
                        title: dlgTile,
                        controller: ['$scope', function($scope) {
                            tools.saveGroupDb = function() {
                                if (!commonTool.isEmpty(vm.dlgData.groupID)) {
                                    // 修改
                                    service.chgSysUSerGrp(vm.dlgData).success(function(rs) {
                                        if (rs.status == 'success') {
                                            $rootScope.alertMsgService.setMessage("操作成功");
                                            tools.closeDlg(vm.addGroupDlg);
                                            tools.getList();
                                        } else {
                                            $rootScope.alertMsgService.setMessage("操作失败:" + data.message, 'warning');
                                        }
                                    })
                                } else {
                                    // 添加
                                    service.addSysUserGrp(vm.dlgData).success(function(rs) {
                                        if (rs.status == 'success') {
                                            $rootScope.alertMsgService.setMessage("操作成功");
                                            tools.closeDlg(vm.addGroupDlg);
                                            tools.getList();
                                        } else {
                                            $rootScope.alertMsgService.setMessage("操作失败:" + data.message, 'warning');
                                        }
                                    })
                                }

                            }
                        }]
                    });

                }

                // 4.删除
                tools.delGroup = function(groupID) {
                    // 分组下是否有用户
                    service.chkSysUSerGrp({
                        'groupID': groupID
                    }).success(function(data) {
                        // 没有用户
                        if (data.status == 'success') {
                            vm.delConfirmDlg = ngDialog.openConfirm({
                                confirmInfo: "您确定要删除该分组？",
                                title: "操作提示",
                                scope: $scope
                            }).then(function(yes) {
                                service.delSysUSerGrp({
                                    'groupID': groupID
                                }).success(function(data) {
                                    if (data.status == 'success') {
                                        $rootScope.alertMsgService.setMessage('删除成功');
                                        tools.getList();
                                    } else {
                                        $rootScope.alertMsgService.setMessage('删除失败：' + data.message, 'warning');
                                    }
                                })
                            }, function(no) {
                                // 取消
                            });
                        }
                        // 有用户
                        else {
                            vm.delConfirmDlg = ngDialog.openConfirm({
                                confirmInfo: "该分组下有用户，请先移除用户再做删除。",
                                title: "操作提示",
                                scope: $scope
                            });
                        }
                    })


                }

                // 启用、禁用
                tools.chgStatus = function(index, newStatus) {
                    var param = {
                        'userId': vm.items[index].userId,
                        'valid': newStatus
                    }
                    service.chgSysUSer(param).success(function(rs) {
                        if (rs.status == 'success') {
                            alert('操作成功');
                            vm.items[index].valid = newStatus;
                        }
                    })
                }

                // 关闭弹出窗口
                tools.closeDlg = function(id) {
                    if (commonTool.isEmpty(id)) {
                        ngDialog.closeAll();
                    } else {
                        ngDialog.close(id);
                    }
                }
            }
        ])
        // 操作日志
        .controller('sysOperationLogCtrl', ['$scope', '$rootScope', '$location', '$controller', 'ngDialog', 'systemService', 'commonService', 'commonTool', function($scope, $rootScope, $location, $controller, ngDialog, service, commonService, commonTool) {
            var vm = $scope.vm = {};
            var paging = $scope.paging = {};
            var search = $location.search();
            var tools = $scope.tools = {};


            paging.page = 1;
            paging.pageSize = 10;
            paging.startTime = null;
            paging.endTime = null;
            paging.key = null;
            paging.value = null;

            // 转到第几页
            tools.newpagesize = null;
            // 定义分页数组
            vm.pages = commonService.setPageSizeArray(10, 30, 50);


            var start = {
                format: 'YYYY-MM-DD',
                choose: function(dates) { //选择好日期的回调
                    end.min = dates;
                    paging.startTime = dates;
                },
                clear: function() {
                    paging.startTime = null;
                }
            };
            var end = {
                format: 'YYYY-MM-DD',
                choose: function(dates) { //选择好日期的回调
                    start.max = dates;
                    paging.endTime = dates;
                },
                clear: function() {
                    paging.endTime = null;
                }
            };

            tools.startDate_init = function(elem) {
                start.elem = '#' + elem;
                laydate(start);
            }
            tools.endDate_init = function(elem) {
                end.elem = '#' + elem;
                laydate(end);
            }

            tools.searchtype = service.SetSearchTypeArray();

            // 查询log列表
            tools.getLogList = function() {
                console.log(paging);
                service.getOperationLog(commonTool.filterParam(paging)).success(function(data) {
                    if (data.status == 'success') {
                        vm.items = data.page.items;
                        paging.total = data.page.total;
                        // paging.pageSize = data.page.pageSize;
                        vm.selectionItems = [];
                    } else {
                        console.log("Get Logs Fail");
                    }
                });
            };
            tools.getLogList();

            // 搜索
            tools.search = function() {
                paging.page = 1;
                tools.getLogList();
            };
            // 重置
            tools.reSetLogList = function() {
                paging.page = 1;
                paging.pageSize = 10;
                paging.startTime = null;
                paging.endTime = null;
                paging.key = null;
                paging.value = null;
                tools.getLogList();
            }
            tools.getnewpage = function(type) {
                if (type == 1) { // 跳转到第几页
                    paging.page = tools.newpagesize;
                    tools.newpagesize = null;
                } else if (type == 0) { // 每页显示多少条切换时
                    paging.page = 1;
                }
                tools.getLogList();
            }

        }])
})
