define(['../module'], function(ng){
  ng
    .factory('manageService', ['$http', 'api',
      function($http, api){
        return {
          //获取商品
          getProducts : function(params) {
            return $http.get(api.getProducts, {'params': params});
          },
          //更新状态
          // status: 审核通过：3，审核中：2 ,审核不通过：-1，删除：-3
          // productDuration=new Date()   更新有效期
          // Newest =1 更新wei 新品
          // IsOnline=-1 更新为下架
          updateStatus : function(params) {
            return $http.post(api.updateProductStatus, params);
          },
          //获取产品属性
          getProductCount: function(sellerId){
            return $http.get(api.getProductCount, {'params': {'sellerId': sellerId}});
          }
        };
      }
    ])
    .controller('GoodsManageCtrl', ['$scope', '$location', 'manageService',
      function($scope, $location, manageService){
        $scope.title = '商品管理';
        $scope.tab = {
          'title1': '已上架',
          'title2': '待审核',
          'title3': '审核未通过',
          'title4': '已下架'
        };

        //产品数据
        var vm = $scope.vm = {};
        //页面其他数据，方法
        var tools = $scope.tools = {};
        //初始分页信息
        var paging = $scope.paging = {
          'sellerId': $scope.userInfo.sellerId,
          'status': 3, //状态
          'page':0,
          'pageSize':5,

          'isOnline': 1, //
          'toDuration': 1,
          /*搜索参数*/
          'productCode': null, //产品编号
          'productValid': null, //产品有效期天数
          'onlineStart': null, //产品上线时间开始
          'onlineEnd': null, //产品上线时间结束
          'keywords':null //产品关键字
        };

        //产品数量
        tools.productCount = {
          online: 0, //上架
          toAudit: 0, //代审核
          noPass: 0, //审核未通过
          unline: 0, //下架
        }

        tools.productValid = [
          {
            'value': 3,
            'title': '3天内过期'
          },
          {
            'value': 7,
            'title': '7天内过期'
          },
          {
            'value': 30,
            'title': '30天内过期'
          }
        ];
         $scope.clear = function(){  //当运行clear的时候将dt置为空
            $scope.company.establishYear = null;
        }
        $scope.open = function($event){  // 创建open方法 。 下面默认行为并将opened 设为true
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        }
        $scope.disabled = function(date , mode){
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
        }

        $scope.maxDate = new Date();

        $scope.dateOptions = {
            formatYear : 'yy',
            startingDay : 1
        }

        //获取产品数量
        tools.getProductCount = (function(){
          manageService.getProductCount($scope.userInfo.sellerId)
          .success(function(data){
            if ('success' === data.status) {
              tools.productCount =  data.data;
              tools.count = tools.productCount.online;
            }
          })
        }())

        //获取数据
        tools.getProducts = function(){
          //判断是否上架产品
          if (3 == paging.status && 1 == paging.isOnline) {
            paging.toDuration = 1; //产品有效
          } else if(3 == paging.status && -1 == paging.isOnline) {
            paging.toDuration = null;
          }else{
            paging.isOnline = null;
            paging.toDuration = null;
          };

          manageService.getProducts(paging)
          .success(function(data){
            if ('success' === data.status) {
              //产品列表
              vm.items = data.data.items;
              //总数
              paging.total = data.data.total;
            }
          });
        };
        tools.getProducts();

        // 条件搜索重置
        tools.reset = function(){
          paging.productCode = null; //产品编号
          paging.productValid = null; //产品有效期天数
          paging.onlineStart = null; //产品上线时间开始
          paging.onlineEnd = null; //产品上线时间结束
          paging.keywords = null; //产品关键字
          //获取数据
          tools.getProducts();
        }

        //更新有效期
        tools.update = function(){
          if(vm.selectionItme.length === 0) {
            alert('请选择商品');
            return;
          }
          if(confirm('确认更新有效期')) {
            var params = {'idsSplit':vm.selectionItme.join(','), 'productDurations': new Date()};
            manageService.updateStatus({product: JSON.stringify(params)})
              .success(function(){
                alert('更新有效期成功');
              });
          }
        };
        //标识新品
        tools.newPro = function(){
          if(vm.selectionItme.length === 0) {
            alert('请选择商品');
            return;
          }
          if(confirm('确认标识新品')) {
            var params = {'idsSplit':vm.selectionItme.join(','),'newest':1};
            manageService.updateStatus({product: JSON.stringify(params)})
              .success(function(data){
                if ('success' === data.status) {
                  alert('更新成功');
                };
              });
          }
        };
        //批量下架
        tools.offShelf = function(){
          if(vm.selectionItme.length === 0) {
            alert('请选择商品');
            return;
          }
          if(confirm('确认下架产品')) {
            var params = {'idsSplit':vm.selectionItme.join(','),'isOnline':-1};
            manageService.updateStatus({product: JSON.stringify(params)})
              .success(function(data){
                if ('success' === data.status) {
                  alert('下架成功');
                  tools.productCount.online = tools.productCount.online - vm.selectionItme.length;
                  tools.productCount.unline = tools.productCount.unline + vm.selectionItme.length;
                };
              });
          };
        };
        //批量上架
        tools.onShelf = function(){
          if(vm.selectionItme.length === 0) {
            alert('请选择商品');
            return;
          }
          if(confirm('确认上架产品')) {
            var params = {'idsSplit':vm.selectionItme.join(','),'isOnline':1};
            manageService.updateStatus({product: JSON.stringify(params)})
              .success(function(data){
                if ('success' === data.status) {
                  alert('上架成功');
                  tools.productCount.online = tools.productCount.online + vm.selectionItme.length;
                  tools.productCount.unline = tools.productCount.unline - vm.selectionItme.length;
                };
              });
          };
        };
        //批量删除
        tools.del = function(){
          if(vm.selectionItme.length === 0) {
            alert('请选择商品');
            return;
          }
          if(confirm('确认删除。')) {
            var params = {'idsSplit':vm.selectionItme.join(','),'status':-3};
            manageService.updateStatus({product: JSON.stringify(params)})
              .success(function(data){
                if ('success' === data.status) {
                  alert('删除成功');
                };
              });
          }
        };
        //tools.updateProStatue

        /**
         * 修改产品
         * @param  {int} categoryId [类目]
         * @param  {int} productId  [产品id]
         */
        tools.chgPro = function(categoryId,productId){
          $location.path('/goods/publish').search({'categoryId':categoryId,'productId':productId});
        };
        /**
         * 添加类似商品
         * @param {int} categoryId [类目id]
         */
        tools.addPro = function(categoryId){
          console.log(categoryId);
          $location.path('/goods/publish').search({'categoryId':categoryId});
        };

        /**
         * 单个的产品下线
         * @param  {[int]} productId [产品id]
         * @param  {[int]} index     [产品索引]
         */
        tools.offLine = function(productId,index) {
          if(confirm('确认下架产品?')){
            var params = {'idsSplit':productId,'isOnline':-1};
            manageService.updateStatus({product: JSON.stringify(params)})
              .success(function(data){
                if ('success' === data.status) {
                  alert('下架产品成功');
                  vm.items.splice(index, 1);
                  tools.productCount.online = tools.productCount.online - 1;
                  tools.productCount.unline = tools.productCount.unline + 1;
                }
              });
          }
        };
        /**
         * 单个的产品上线
         * @param  {[type]} productId [产品id]
         * @param  {[type]} index     [产品索引]
         */
        tools.onLine = function(productId,index) {
          if(confirm('确认上架产品?')){
            var params = {'idsSplit':productId,'isOnline':1};
            manageService.updateStatus({product: JSON.stringify(params)})
              .success(function(data){
                if ('success' === data.status) {
                  alert('上架产品成功');
                  vm.items.splice(index, 1);
                  tools.productCount.online = tools.productCount.online + 1;
                  tools.productCount.unline = tools.productCount.unline - 1;
                }
              });
          }
        }


        $scope.$watch('paging.status', function(newValue){
          switch (newValue) {
            case 2:
              tools.title = '待审核产品';
              tools.count = tools.productCount.toAudit;
              tools.hasOffLine = true;
              break;
            case -1:
              tools.title = '审核不通过商品';
              tools.count = tools.productCount.noPass;
              tools.hasOffLine = true;
              break;
          }
        });
        $scope.$watch('paging.isOnline', function(newValue){
          switch (newValue) {
            case 1:
              tools.title = '上架产品';
              tools.count = tools.productCount.online;
              tools.hasOffLine = false;
              tools.hasOnLine = false;
              break;
            case -1:
              tools.title = '下架产品';
              tools.count = tools.productCount.unline;
              tools.hasOffLine = true;
              tools.hasOnLine = true;
          }
        });

        //全选
        vm.checkAll = function(checked) {
          angular.forEach(vm.items, function(item) {

            item.$checked = checked;
            if (true === checked) {
              vm.selectionItme.push(item.productId);
            }
          });
          if (true !== checked){
            vm.selectionItme = [];
          }
        };

        //定义所选择的项目
        vm.selectionItme = [];
        //获取所选的
        vm.selection = function(){
          var selectionItme = [];
          angular.forEach(vm.items, function(item) {
            if (item.$checked === true) {
              selectionItme.push(item.productId);
            }
          });
          vm.selectionItme = selectionItme;
        };



      }
    ])
    .filter('setImgSize', function(){
      return function(sImg, width, height, type){
        width = width ? width : '180';
        height = height ? height : '180';
        type = type ?　type : '2';
        var img;
        if (sImg){
          img = sImg.split(',')[0];
          img = 'http://192.168.10.17' + img.slice(0, img.lastIndexOf('.')) + '_' +
                 width +'x'+ height + '_' +type + img.slice(img.lastIndexOf('.'));
        } else {
          img = '/pubpage/view/images/default-img.jpg';
        }
        return img;
      };
    });

});