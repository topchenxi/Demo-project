define(['../module'], function(ng) {
  ng
    .factory('publishService', ['$http', 'api', function($http, api){
      return {
        //获取行业分类
        getCatagory: function(categoryId){
          return $http.get(api.getCatagoryStructureByCategoryId, {params:{'categoryId': categoryId}});
        },
        //获取商品的内容
        getProductById: function(productId) {
          return $http.get(api.getProductById, {params: {'productId':productId}});
        },
        //保存商品
        saveProduct: function(params) {
          return $http.post(api.saveProduct, params);
        },
        //获取单位
        getUnit: function(){
          return $http.get('/pubpage/fsc/service/getUnit.json');
        },
        getAtts: function(id){
          return $http.get(api.getPropertisByCatagoryId, {params:{categoryId:id}});
        }
      };
    }])
    .controller('GoodsAddCtrl', ['$scope', '$sce', '$location','Upload', 'publishService', 'api',
      function($scope, $sce, $location, Upload, publishService, api) {
        $scope.title = '发布产品';
        $scope.category = '选择的类目';
            //商品基本数据
        var pro = $scope.pro = {},
            //工具的对象，比如让单位，
            tools = $scope.tools = {},
            //获取参数
            search = $location.search();
            //
            $scope.attsValue = null;
        //商品描述

        //获取分类
        pro.categoryId = parseInt(search.categoryId);
        if (!pro.categoryId) {
          alert('请选择分类');
        }

        //获取产品id
        if(search.productId) {
          pro.productId = parseInt(search.productId);
        }
        //卖家id
        pro.sellerId = $scope.userInfo.sellerId;
        //产品图片
        pro.imgs = [];
        //价格区间 初始
        pro.productPrices = [{
          'productId':1,
          'numberStart':null,
          'numberEnd':null,
          'price':null,
          'unit':null,
          'monetaryUnit':null
        }];

        //获取行业类目
        publishService.getCatagory(pro.categoryId)
        .success(function(data){
          tools.ctgrys=[];
          console.log('=getCatagory==' + data.data)
          if ('success' === data.status && data.data) {
            var ctg = {};
            //console.log('0',data.data[0]);
            ctg.id=data.data[0].indusCategory.indusId;
            ctg.name = data.data[0].indusCategory.indusName;
            ctg.order = 0;
            tools.ctgrys.push(ctg);

            $.each(data.data, function(i){
              ctg = {};
              //console.log('i',data.data[i]);
              ctg.order = data.data[i].categoryType;
              ctg.id=data.data[i].categoryId;
              ctg.name = data.data[i].categoryName;
              console.log('i',ctg);
              tools.ctgrys.push(ctg);
            });

           // tools.categoryName = data.data.indusName + '>' + data.data.parentName + '>' + data.data.categoryName;
          }
        });

        //获取属性
        publishService.getAtts(pro.categoryId)
        .success(function(data){
          if ('success' === data.status && data.data && data.data.properties) {
            //属性
            tools.atts = [];
            //规格
            tools.standard = [];
            var properties = data.data.properties;
            $.each(properties, function(i){
              if(0 === properties[i].propertyDisplayType) {
                tools.atts.push(properties[i]);
              } else if (1 === properties[i].propertyDisplayType){
                tools.standard.push(properties[i]);
              }
            });
          }
        });

        //获取单位
        publishService.getUnit()
        .success(function(data){
          if ('success' === data.status) {
            //计量单位
            tools.unit = data.data.indivOrderUtils;
            //货币单位
            tools.currncyUtils = data.data.currncyUtils;
          }
        });
        //如果有产品id， 先获取数据 则修改
        if (pro.productId && typeof pro.productId === 'number') {
          publishService.getProductById(pro.productId)
          .success(function(data){
            if ('success' === data.status) {
              pro = $.extend(pro, data.data);
              //属性
              delete pro.properties;
              if (pro.imgs) {
                pro.imgs = pro.imgs.split(',');
              } else {
                pro.imgs = [];
              }
              //属性赋值
              if(pro.dictProductCategoryDTO && pro.dictProductCategoryDTO.properties && pro.dictProductCategoryDTO.properties.length > 0) {
                var proAttrVal = pro.dictProductCategoryDTO.properties;
                $.each(proAttrVal, function(i){
                  // 属性
                  if(0 === proAttrVal[i].propertyDisplayType) {
                    $('.ngAtts-' + proAttrVal[i].propertyId).val(proAttrVal[i].propertyValues[0].propertyValueId);
                  } else
                  // 规格
                  if (1 === proAttrVal[i].propertyDisplayType){
                    for (var x = 0; x < proAttrVal[i].propertyValues.length; x++) {
                      $('.ngStandard-' + proAttrVal[i].propertyValues[x].propertyValueId).attr('checked', true);
                    }
                  }
                });
              }
              delete pro.propertyKeyValues;

              //类型与单位词典库保持一致；
              pro.minOrderUnit = pro.minOrderUnit.toString();
            }
          });
        }





        /**
         * 添加产品区间, 判断是否填对
         * @param {[type]} params1 [价格区间的值]
         * @param {[type]} params2 [价格区间的值]
         * @param {[type]} params3 [价格区间的值]
         * @param {[type]} params4 [价格区间的值]
         * @param {[type]} params5 [价格区间的值]
         */
        $scope.addFobPrices = function(params1, params2, params3, params4, params5) {
          console.log(params1,params2,params3,params4,params5);
          if(params1 || params2 || params3 || params4 || params5) {
            alert('请先填写正确该价格区间的值');
            return false;
          }

          pro.productPrices[pro.productPrices.length] = {
            'productId': pro.productPrices.length + 1,
            'numberStart':null,
            'numberEnd':null,
            'price':null,
            'unit':null,
            'monetaryUnit':null
          };
        };

        //上传图片
        //定义图片
        $scope.$watch('files', function() {
          $scope.upload($scope.files);
        });
        $scope.upload = function(files) {
          if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              console.log(file);
              Upload.upload({
                url: api.uploadImage,
                file: file
              }).progress(function(evt) {
                //进度
                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                 console.log(progressPercentage);
              }).success(function(data, status, headers, config) {
                //$scope.log = 'file ' + config.file.name + 'uploaded. Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                //$scope.$apply();
                if ('success' === data.status) {
                  pro.imgs.push(data.data.url);
                }
              });
            }
          }
        };
        /**
         * 删除图片
         * @param  {[int]} index [图片索引]
         * @return {[type]}       [description]
         */
        tools.delImg = function(index){
          pro.imgs.splice(index,1);
        };


        $scope.submit = function(){
          //处理数据格式

          //属性 转为字符串形式， 已逗号分隔
          var ngAtts = $('.ngAtts');
          var ngStandard = $('.ngStandard');
          var sPro = $.extend('',pro);
          sPro.propertyValueIds = [];
          if (ngAtts.length > 0) {
            $.each(ngAtts, function(i){
              sPro.propertyValueIds.push(ngAtts.eq(i).val());
            });
          }
          if (ngStandard.length > 0) {
            $.each(ngStandard, function(i){
              if (this.checked) {
                sPro.propertyValueIds.push(ngStandard.eq(i).val());
              }
            });
          }
          sPro.propertyValueIds = sPro.propertyValueIds.join(',');

          //价格区间
          //sPro.productPrices = JSON.stringify(sPro.productPrices);
          $.each(sPro.productPrices, function(i){
            sPro.productPrices[i].unit = parseInt(sPro.productPrices[i].unit);
            sPro.productPrices[i].monetaryUnit = parseInt(sPro.productPrices[i].monetaryUnit);
          });
          sPro.minOrderUnit = parseInt(sPro.minOrderUnit);

          //图片
          sPro.imgs = sPro.imgs.join(',');

          //转数值
          //隐私状态
          sPro.privacyStatus = parseInt(sPro.privacyStatus);
          //多图
          sPro.manyImg = parseInt(sPro.manyImg);
          //有效期
          sPro.productValid = parseInt(sPro.productValid);
          sPro.price = parseInt(sPro.price);

          //

          //保存产品
          publishService.saveProduct(angular.toJson(sPro))
          .success(function(data){
            if ('success' === data.status) {
              $location.path('/goods/success').search({'categoryId':pro.categoryId, 'productId':data.data.productId});
            } else {
              alert("操作失败:"+data.message);
            }
          });
        };
      }
    ])
    .controller('successCtrl', ['$scope', '$location',
      function($scope, $location){
        var url = $location.search();
        $scope.productId = url.productId;
        $scope.chgPro = function(){
          $location.path('goods/publish').search({'categoryId':url.categoryId, 'productId':url.productId});
        };
        $scope.addPro = function(){
          $location.path('goods/publish').search({'categoryId':url.categoryId});
        };
      }
    ]);
});