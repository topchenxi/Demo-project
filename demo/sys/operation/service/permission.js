// 身份验证
// 权限控制

define(['app'], function(app){
  // app.run(function(permissions,$http,api,$rootScope){
  //    // 获取该用户的菜单/操作权限
  //   $http.get(api.getUserOpers).success(function(rs){
  //     if(rs.status=='success'){
  //      permissions.setPermissions(rs.data);
  //      // 菜单
  //      $rootScope.leftMenu = rs.data;
  //     }
  //   })
    
  // })

  //用户
  app.factory('userService', function(){
    var userInfo = JSON.parse(localStorage.userInfo),
        user = {};
    if ('success' !== userInfo.status) {
      user.isLogin = false;
    } else {

      user = userInfo.data
      user.name = userInfo.data.username;
      user.isLogin = true;
    }
    return user
  })

  //在取得当前用户的权限集合后,我们将这个集合存档到对应的一个service中
  app.factory('permissions', ['$rootScope','api','commonTool', function($rootScope,api,commonTool){
    return {
      permissionList:null,
      setPermissions : function(permissions) {
        this.permissionList = permissions;
        //通过$broadcast广播事件,当权限发生变更的时候.
        $rootScope.$broadcast('permissionsChanged')
      },
      setFunctionStates:function(){
        if(!commonTool.isEmpty($rootScope.functionStates)){
          return;
        }
        // 所有菜单的state 集合 $rootScope.functionStates
        if(!commonTool.isEmpty(localStorage) && commonTool.isEmpty(localStorage.sysOprs)) {
        
            // 用jquery 的同步请求
            $.ajax({
              url: api.getSysOpers,
              async: false
            }).success(function(data){
                var rs = JSON.parse(data);
                try{
                  localStorage.sysOprs = JSON.stringify(rs.data);
                  var sysOps = rs.data,functionStates = [],mod=null,func=null;
                  for(var i=0,il=sysOps.length;i<il;i++){
                      mod=sysOps[i];
                      for(var j=0,jl=mod.functionList.length;j<jl;j++){
                          func = mod.functionList[j];
                          functionStates.push(func.functionUrl)
                      }
                  }
                  $rootScope.functionStates = ','+functionStates.join(',')+',';
                }catch(e){
                  console.log(e);
                }
            })
        }else{
            var sysOps = JSON.parse(localStorage.sysOprs);
            var functionStates = [],mod=null,func=null;
            for(var i=0,il=sysOps.length;i<il;i++){
                mod=sysOps[i];
                for(var j=0,jl=mod.functionList.length;j<jl;j++){
                    func = mod.functionList[j];
                    functionStates.push(func.functionUrl)
                }
            }
            $rootScope.functionStates = ','+functionStates.join(',')+',';
        }
      }
    }
  }]);

  //

})

