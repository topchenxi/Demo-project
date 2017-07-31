define(['../module'], function(ng) {

  ng
    .factory('selectServer', ['$http', 'api', function($http, api) {
      return {
        //获取顶级类目
        getCategorys: function() {
          return $http.get(api.getCategorys);
        },
        //由行业类目加载一级类目
        getCategorysByIndusId: function(indusId) {
          return $http.get(api.getCategorysByIndusId, {
            params: {
              'indusId': indusId
            }
          });
        },
        //由父类目加载下一级类目
        getCategorysByParentId: function(parentId) {
          return $http.get(api.getCategorysByParentId, {
            params: {
              'parentId': parentId
            }
          });
        }
      };
    }])
    .controller('SelectSortCtrl', ['$scope', '$location', '$state', 'selectServer',
      function($scope, $location, $state, selectServer) {
        $scope.title = "选择类目";

        //顶级类目
        $scope.a = {};
        //一级类目
        $scope.b = {};
        //中间类目
        $scope.midders = [];
        //是否发布商品
        $scope.isSelect = false;
        //类目面包屑
        $scope.aCatCrumbs = [];
        //选择的类目id
        var selectCatId;

        //获取顶级类目
        selectServer.getCategorys()
          .success(function(data) {
            if ('success' === data.status) {
              $scope.a = data.data;
            } else {
              alert(data.message);
            }
          });

        //获取行业类目下一级类目
        $scope.getb = function(indusId, name) {

          selectServer.getCategorysByIndusId(indusId)
            .success(function(data) {
              if ('success' === data.status) {

                $scope.b = data.data;
                $scope.midders = [];

                //生成面包屑
                $scope.aCatCrumbs = []; //清空标题数组;
                $scope.aCatCrumbs.push(name);
                $scope.catCrumbs = $scope.aCatCrumbs.join('>');

                $scope.isSelect = false;

              } else {
                alert(data.message);
              }
            });
        };

        $scope.getc = function(parentId, name) {
          selectServer.getCategorysByParentId(parentId)
            .success(function(data) {
              if ('success' === data.status) {
                $scope.midders = [];
                $scope.midders.push(data.data);

                //生成面包屑
                $scope.aCatCrumbs.splice(1); //删除顶级菜单后面的名字
                $scope.aCatCrumbs.push(name);
                $scope.catCrumbs = $scope.aCatCrumbs.join('>');

                $scope.isSelect = true;
                selectCatId = parentId;
              } else {
                alert(data.message);
              }
            });
        };
        $scope.getd = function(parentId, name, index) {
          selectServer.getCategorysByParentId(parentId)
            .success(function(data) {
              if ('success' === data.status) {
                $scope.midders.splice(index+1);
                data.data && $scope.midders.push(data.data);

                //生成面包屑
                $scope.aCatCrumbs.splice(index+2); //删除中间类目后面的菜单
                $scope.aCatCrumbs.push(name);
                $scope.catCrumbs = $scope.aCatCrumbs.join('>');

                selectCatId = parentId;
                console.log(index+4);
                $scope.containerWidth = {'width': (index+4)*210 + 'px'};
              } else {
                alert(data.message);
              }
            });
        };

        $scope.goPublish = function() {
            if ($scope.isSelect) {
              console.log('ddd');
              $location.path('/goods/publish').search({
                'categoryId':selectCatId
              });
            }
          };
      }
    ]);
});