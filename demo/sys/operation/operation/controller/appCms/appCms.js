define(['../module'], function(ng) {
    ng.factory('appCmsService', ['$http', 'api', function($http, api) {
            return {
                // 获取列表
                getHomePageList: function(params) {
                    return $http.get(api.getHomePageList, {
                        'params': params
                    });
                },
                // 获取关键词
                getHotKeyWords: function(params) {
                    return $http.get(api.getHotKeyWords, {
                        'params': params
                    });
                },
                // 保存关键词
                saveHotKeyWords: function(params) {
                    return $http.post(api.saveHotKeyWords, params);
                },
                // 保存APP首页表单
                saveAppIndex: function(params) {
                    return $http.post(api.saveAppIndex, params);
                },
                // 获取产品列表
                getProducts: function(params) {
                    return $http.get(api.getProducts, {
                        'params': params
                    })
                },
                // 获取供应商列表
                getSellerList: function(params) {
                    return $http.get(api.getSellerList, {
                        'params': params
                    })
                },
                // 获取homePage详情
                getHomePage: function(params) {
                    return $http.get(api.getHomePage, {
                        'params': params
                    })
                },
                // 设置为首页
                updateHomepageToActive: function(params) {
                    return $http.get(api.updateHomepageToActive, {
                        'params': params
                    })
                },
                // 删除列表记录
                deleteHomepage: function(params) {
                    return $http.get(api.deleteHomepage, {
                        'params': params
                    })
                },
                // 更新信息
                updateHomepage: function(params) {
                    return $http.post(api.updateHomepage, params);
                },
                // 获取用户反馈列表
                listFeedback: function(params) {
                    return $http.get(api.listFeedback, {
                        'params': params
                    })
                }
            };
        }]).controller('appContentListCtrl', [
            '$scope',
            '$rootScope',
            'ngDialog',
            '$location',
            'appCmsService',
            'commonService',
            'commonTool',
            function(
                $scope,
                $rootScope,
                ngDialog,
                $location,
                appCmsService,
                commonService,
                commonTool) {
                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var paging = $scope.paging = {};
                var homePageParams = {
                    page: 1,
                    pageSize: 10
                };

                // 商品
                vm.keywordOfProduct = {
                    keywords: []
                };

                // 店铺
                vm.keywordOfSeller = {
                    keywords: []
                };

                tools = $.extend(tools, {
                    // 分页
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        tools.getHomePageList();
                    },
                    getHomePageList: function() {
                        appCmsService.getHomePageList(homePageParams)
                            .success(function(data) {
                                vm.items = data.page.items;
                                paging.total = data.page.total;
                                paging.pageSize = data.page.pageSize;
                            })
                    },
                    addAppPage: function() {
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            width: 700,
                            templateUrl: './controller/appCms/selectTempDialog.html',
                            controller: 'selectTempCtrl'
                        })
                    },
                    getHotKeyWords: function() {
                        // searchType   0:商品，1店铺
                        appCmsService.getHotKeyWords({
                            searchType: 0
                        }).success(function(data) {
                            vm.keywordOfProduct = tools.getKeyWordArray(data.data);
                            vm.keywordOfProductId = data.data[0].id;
                        })
                        appCmsService.getHotKeyWords({
                            searchType: 1
                        }).success(function(data) {
                            vm.keywordOfSeller = tools.getKeyWordArray(data.data);
                            vm.keywordOfSellerId = data.data[0].id;
                        })
                    },
                    getKeyWordArray: function(items) {
                        if (items.length <= 0 || commonTool.isEmpty(items[0].keyword)) {
                            return {
                                keywords: []
                            };
                        }
                        items[0].keywords = items[0].keyword.split(',');
                        return items[0];
                    },
                    delKeywordOfProduct: function(index) {
                        vm.keywordOfProduct.keywords.splice(index, 1);
                    },
                    delKeywordOfSeller: function(index) {
                        vm.keywordOfSeller.keywords.splice(index, 1);
                    },
                    addKeyword: function(type) {
                        $scope.type = type;
                        var dialog = ngDialog.openConfirm({
                            appendClassName: "dialog-activeM",
                            scope: $scope,

                            animation: true,
                            width: 500,
                            templateUrl: 'addKeywordTmp.html',
                            controller: 'addKeywordCtrl'
                        }).then(function(yes) {
                            if (type == 0) {
                                if (!tools.isDuplicate(vm.keywordOfProduct.keywords, vm.newKeyWord)) {
                                    vm.keywordOfProduct.keywords.push(vm.newKeyWord);
                                }
                            } else {
                                if (!tools.isDuplicate(vm.keywordOfSeller.keywords, vm.newKeyWord)) {
                                    vm.keywordOfSeller.keywords.push(vm.newKeyWord);
                                }
                            }
                        }, function(no) {

                        });
                    },
                    isDuplicate: function(array, key) {
                        for (var i = 0, len = array.length; i < len; i++) {
                            // console.log(array[i]);
                            if (array[i] == key) return true;
                        }
                        return false;
                    },
                    // 保存热门关键词
                    saveHotKeyWords: function() {
                        var paramsObj = [];
                        var productObj = {
                            id: vm.keywordOfProductId,
                            searchType: 0,
                            keyword: vm.keywordOfProduct.keywords.join(',')
                        }
                        var sellerObj = {
                            id: vm.keywordOfSellerId,
                            searchType: 1,
                            keyword: vm.keywordOfSeller.keywords.join(',')
                        }
                        paramsObj.push(productObj);
                        paramsObj.push(sellerObj);
                        var sendParams = {
                            hotKeyWords: paramsObj
                        }
                        appCmsService.saveHotKeyWords({
                            hotKeyWordStr: JSON.stringify(sendParams)
                        }).success(function(data) {
                            $rootScope.alertMsgService.setMessage("保存成功", 'success');
                        })
                    },
                    // 设置为首页
                    updateHomepageToActive: function(_id) {
                        appCmsService.updateHomepageToActive({
                            id: _id
                        }).success(function(data) {
                            if (data.status == 'success') {
                                $rootScope.alertMsgService.setMessage("设置成功", 'success');
                                tools.getHomePageList();
                            }
                        })
                    },
                    // 删除列表记录Confirm
                    deleteHomepageConfirm: function(_id) {
                        vm.HomePageListDlg = ngDialog.open({
                            template: 'homePageListDel',
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            controller: ['$scope', function($scope) {
                                var id = _id;
                                var tools = $scope.tools;

                                $scope.submit = function() {
                                    tools.deleteHomepage(id);
                                }

                            }]

                        });
                    },
                    // 删除列表记录
                    deleteHomepage: function(_id) {
                        appCmsService.deleteHomepage({
                            id: _id
                        }).success(function(data) {
                            if (data.status == 'success') {
                                $rootScope.alertMsgService.setMessage("删除成功", 'success');
                                ngDialog.closeAll();
                                tools.getHomePageList();
                            }
                        })
                    },
                    close: function() {
                        ngDialog.closeAll();
                    },
                    showPreviewLink: function(id) {
                        $scope.previewLinkId = id;
                        ngDialog.open({
                            appendClassName: "dialog-activeM",
                            scope: $scope,
                            animation: true,
                            title: 'APP首页预览',
                            width: 600,
                            templateUrl: './controller/appCms/showPreviewLinkDialog.html',
                            controller: 'showPreviewLinkCtrl'
                        })
                    }
                });



                (function() {
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);
                    tools.getHomePageList();
                }());
            }
        ]).controller('appEditIndexCtrl', [
            '$scope',
            '$rootScope',
            'ngDialog',
            '$location',
            'appCmsService',
            'commonService',
            'Upload',
            'api',
            'commonTool',
            function(
                $scope,
                $rootScope,
                ngDialog,
                $location,
                appCmsService,
                commonService,
                Upload,
                api,
                commonTool) {

                var tools = $scope.tools = {};
                var search = $location.search();
                var id = search.id;
                var indexPaging = $scope.indexPaging = {};

                // 可添加总条数
                tools.homepageCarouselFigure_limit = 10;
                tools.homepageAdvertisement_limit = 10;
                tools.homepageRecommendProduct_limit = 10;

                $rootScope = $.extend($rootScope, {
                    // 轮播图表单
                    homepageCarouselFigure: '/controller/appCms/formModule/homepageCarouselFigure.html',
                    // 橱窗
                    homepageWindow: '/controller/appCms/formModule/homepageWindow.html',
                    // 图片广告
                    homepageAdvertisement: '/controller/appCms/formModule/homepageAdvertisement.html',
                    // 推荐商品
                    homepageRecommendProduct: '/controller/appCms/formModule/homepageRecommendProduct.html'
                });

                // 数据模板
                var tpl = {
                    subject: null,
                    // 轮播图
                    homepageCarouselFigure: {
                        title: null,
                        subTitle: null,
                        type: 1,
                        homepageDetails: [{
                            contentName: null,
                            contentType: null,
                            contentValue: null,
                            imgUrlAndroidBackend: null,
                            imgUrlAndroidFront: null,
                            imgUrlIosBackend: null,
                            imgUrlIosFront: null,
                            linkText: null,
                            linkUrl: null
                        }]
                    },
                    // 橱窗
                    homepageWindow: {
                        title: null,
                        subTitle: null,
                        type: 2,
                        homepageDetails: [{
                                contentName: null,
                                contentType: null,
                                contentValue: null,
                                imgUrlAndroidBackend: null,
                                imgUrlAndroidFront: null,
                                imgUrlIosBackend: null,
                                imgUrlIosFront: null,
                                linkText: null,
                                linkUrl: null
                            },
                            {
                                contentName: null,
                                contentType: null,
                                contentValue: null,
                                imgUrlAndroidBackend: null,
                                imgUrlAndroidFront: null,
                                imgUrlIosBackend: null,
                                imgUrlIosFront: null,
                                linkText: null,
                                linkUrl: null
                            },
                            {
                                contentName: null,
                                contentType: null,
                                contentValue: null,
                                imgUrlAndroidBackend: null,
                                imgUrlAndroidFront: null,
                                imgUrlIosBackend: null,
                                imgUrlIosFront: null,
                                linkText: null,
                                linkUrl: null
                            }
                        ]
                    },
                    // 广告
                    homepageAdvertisement: {
                        title: null,
                        subTitle: null,
                        type: 3,
                        homepageDetails: [{
                            contentName: null,
                            contentType: null,
                            contentValue: null,
                            imgUrlAndroidBackend: null,
                            imgUrlAndroidFront: null,
                            imgUrlIosBackend: null,
                            imgUrlIosFront: null,
                            linkText: null,
                            linkUrl: null
                        }]
                    },
                    // 推荐商品
                    homepageRecommendProduct: {
                        title: null,
                        subTitle: null,
                        type: 4,
                        homepageDetails: [{
                                contentName: null,
                                contentType: null,
                                contentValue: null,
                                imgUrlAndroidBackend: null,
                                imgUrlAndroidFront: null,
                                imgUrlIosBackend: null,
                                imgUrlIosFront: null,
                                linkText: null,
                                linkUrl: null
                            },
                            {
                                contentName: null,
                                contentType: null,
                                contentValue: null,
                                imgUrlAndroidBackend: null,
                                imgUrlAndroidFront: null,
                                imgUrlIosBackend: null,
                                imgUrlIosFront: null,
                                linkText: null,
                                linkUrl: null
                            }
                        ]

                    }

                }

                tools = $.extend(tools, {
                    // 页面数据初始化
                    pageDataInit: function(paging, attrName) {
                        // indexPaging[attrName].homepageDetails
                        //  $.extend(true, {}, tpl[attrName]['homepageDetails']);
                        if (paging[attrName] == null) {
                            paging[attrName] = $.extend(true, {}, tpl[attrName]);
                        }
                        if (paging[attrName]['homepageDetails'] == null || paging[attrName]['homepageDetails'].length < 1) {
                            paging[attrName]['homepageDetails'] = $.extend(true, {}, tpl[attrName]['homepageDetails']);
                        }
                    },
                    // 获取详情
                    getHomePage: function(_id) {
                        appCmsService.getHomePage({
                            id: _id
                        }).success(function(data) {
                            if (data.status == 'success') {
                                indexPaging = $scope.indexPaging = data.data;
                                tools.pageDataInit($scope.indexPaging, 'homepageAdvertisement');
                                tools.pageDataInit($scope.indexPaging, 'homepageCarouselFigure');
                                tools.pageDataInit($scope.indexPaging, 'homepageWindow');
                                tools.pageDataInit($scope.indexPaging, 'homepageRecommendProduct');
                            }
                        })
                    },
                    /**
                     * uploadImg 上传图片
                     */
                    uploadImg: function(files, attrName, index, width, height) {
                        if (files && files.length > 0) {
                            var file = files[0];
                            if ((!/.*\.(png)|(jpg)|(gif)$/.test(file.name)) || file.size > 2 * 1024 * 1024) {
                                $rootScope.alertMsgService.setMessage("请重新选择图片,上传图片支持格式：png,jpg,gif;文件大小不超过2M", 'warning');
                                return false;
                            }
                            var _attrName = attrName.split('.');
                            Upload.upload({
                                url: api.uploadContract,
                                file: file,
                                attrName: _attrName,
                                index: index,
                                width: width,
                                height: height

                            }).progress(function(evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            }).success(function(data, status, headers, config) {
                                // var imgSrc = data.data.url.replace(/\./, '_' + config.width + 'x' + config.height + '_3.');
                                var imgSrc = data.data.url;
                                indexPaging[config.attrName[0]]['homepageDetails'][config.index][config.attrName[1]] = imgSrc;
                            });
                        }

                    },
                    /**
                     * addItem 增加子元素
                     * attrName[String] 属性名称
                     * addNum[Number] 每次增加数量
                     */
                    addItem: function(attrName) {
                        if (tpl[attrName]['homepageDetails'].length < 2) {
                            var dataTpl = $.extend(true, {}, tpl[attrName]['homepageDetails'][0]);
                            indexPaging[attrName]['homepageDetails'].push(dataTpl);
                        } else {
                            for (var i = 0; i < tpl[attrName]['homepageDetails'].length; i++) {
                                var dataTpl = $.extend(true, {}, tpl[attrName]['homepageDetails'][i]);
                                indexPaging[attrName]['homepageDetails'].push(dataTpl);
                            }
                        }
                    },
                    /**
                     * removeItem 删除子元素
                     * attrName[String] 属性名称
                     * index[Number] 序号
                     */
                    removeItem: function(attrName, index) {
                        var lenLimit = 1;
                        if (attrName == 'homepageRecommendProduct') {
                            lenLimit = 2;
                        }
                        if (indexPaging[attrName]['homepageDetails'].length > lenLimit) {
                            indexPaging[attrName]['homepageDetails'].splice(index, 1);
                        } else {
                            if (attrName == 'homepageRecommendProduct') {
                                $rootScope.alertMsgService.setMessage("推荐商品个数必须为双数", 'warning');
                            } else {
                                $rootScope.alertMsgService.setMessage("必须保留一个子项", 'warning');
                            }
                        }
                    },
                    /**
                     * saveAppIndex 保存APP首页数据
                     */
                    saveAppIndex: function() {
                        var params = $.extend(true, {}, indexPaging);
                        if (!tools.checkParams()) {
                            return false;
                        }
                        if (id != undefined && id != null && id != '') {
                            // 更新
                            appCmsService.updateHomepage({
                                homepageStr: JSON.stringify(params)
                            }).success(function(data) {
                                if (data.status == 'success') {
                                    $rootScope.alertMsgService.setMessage("保存成功", 'success', function() {
                                        window.location.href = '/#/appCms/appContentList';
                                    });
                                }
                            })
                        } else {
                            // 新增
                            appCmsService.saveAppIndex({
                                homepageStr: JSON.stringify(params)
                            }).success(function(data) {
                                if (data.status == 'success') {
                                    $rootScope.alertMsgService.setMessage("保存成功", 'success', function() {
                                        window.location.href = '/#/appCms/appContentList';
                                    });
                                }
                            })
                        }
                    },
                    /**
                     * selectLink 选择链接
                     * attrName[String] 属性名称
                     * index[Number] 序号
                     */
                    selectLink: function(attrName, index) {
                        $scope.tools = tools;
                        $scope.indexPaging = indexPaging;
                        $scope.attrName = attrName;
                        $scope.index = index;
                        ngDialog.open({
                            title: '选择链接',
                            appendClassName: "dialog-activeM selectLinkLayer",
                            scope: $scope,
                            animation: true,
                            width: 900,
                            templateUrl: '/controller/appCms/formModule/selectLink.html',
                            controller: 'selectLinkCtrl'
                        })
                    },
                    /**
                     * removeLink 移除链接
                     * attrName[String] 属性名称
                     * index[Number] 序号 
                     */
                    removeLink: function(attrName, index) {
                        indexPaging[attrName]['homepageDetails'][index].contentType = null;
                        indexPaging[attrName]['homepageDetails'][index].contentValue = null;
                        indexPaging[attrName]['homepageDetails'][index].linkUrl = null;
                        indexPaging[attrName]['homepageDetails'][index].linkText = null;
                    },
                    // 生成橱窗模块标题
                    getModuleTitle: function(index) {
                        switch (index) {
                            case 0:
                                return '图' + (index + 1) + ' 左图';
                            case 1:
                                return '图' + (index + 1) + ' 右上图';
                            case 2:
                                return '图' + (index + 1) + ' 右下图';
                        }
                    },
                    // 生成橱窗模块各个上传图片提示
                    getRecommendedSizeText: function(index, type) {
                        var textList = [{
                            android_front: '建议图片尺寸304px*360px',
                            android_back: '建议图片尺寸304px*360px',
                            ios_front: 'ios文字图，建议图片尺寸304px*100px',
                            ios_back: 'ios背景图，建议图片尺寸304px*360px'
                        }, {

                            android_front: '建议图片尺寸446px*180px',
                            android_back: '建议图片尺寸446px*180px',
                            ios_front: 'ios文字图，建议图片尺寸240px*100px',
                            ios_back: 'ios背景图，建议图片尺寸446px*180px'
                        }, {

                            android_front: '建议图片尺寸446px*180px',
                            android_back: '建议图片尺寸446px*180px',
                            ios_front: 'ios文字图，建议图片尺寸240px*100px',
                            ios_back: 'ios背景图，建议图片尺寸446px*180px'
                        }]
                        return textList[index][type];
                    },
                    checkParams: function() {
                        var data = $.extend(true, {}, indexPaging);
                        if (data.subject == null || data.subject == '') {
                            $rootScope.alertMsgService.setMessage("请填写页面标题", 'warning', function() {
                                $('#appTitle').focus();
                                tools.scrollTo($('#appTitle'));
                            });
                            return false;
                        }
                        // 轮播图
                        if (data['homepageCarouselFigure'].title == null || data['homepageCarouselFigure'].title == '') {
                            $rootScope.alertMsgService.setMessage('请填写' + tools.getCnName('homepageCarouselFigure') + '的标题', 'warning', function() {
                                $('#homepageCarouselFigure .title').focus();
                                tools.scrollTo($('#homepageCarouselFigure .title'));
                            });
                            return false;
                        }
                        for (var a = 0; a < data['homepageCarouselFigure'].homepageDetails.length; a++) {
                            var aDetail = data['homepageCarouselFigure'].homepageDetails[a];
                            for (var key in aDetail) {
                                if (
                                    key == 'contentType' ||
                                    key == 'contentValue' ||
                                    key == 'imgUrlAndroidBackend' ||
                                    key == 'imgUrlIosBackend'
                                ) {
                                    if (aDetail[key] == null || aDetail[key] == undefined || aDetail[key] == '') {
                                        $rootScope.alertMsgService.setMessage('请填写' + tools.getCnName('homepageCarouselFigure') + '第' + (a + 1) + '个模块的' + tools.getAttrType(key), 'warning', function() {
                                            $('#homepageCarouselFigure').find('.uploadModule').eq(a).focus();
                                            tools.scrollTo($('#homepageCarouselFigure').find('.uploadModule').eq(a));
                                        });
                                        return false;
                                    }
                                }
                            }
                        }

                        // 橱窗
                        if (data['homepageWindow'].title == null || data['homepageWindow'].title == '') {
                            $rootScope.alertMsgService.setMessage('请填写' + tools.getCnName('homepageWindow') + '的标题', 'warning', function() {
                                $('#homepageWindow .title').focus();
                                tools.scrollTo($('#homepageWindow .title'));
                            });
                            return false;
                        }
                        for (var a = 0; a < data['homepageWindow'].homepageDetails.length; a++) {
                            var aDetail = data['homepageWindow'].homepageDetails[a];
                            for (var key in aDetail) {
                                if (
                                    key == 'contentType' ||
                                    key == 'contentValue' ||
                                    key == 'imgUrlAndroidBackend' ||
                                    key == 'imgUrlIosBackend' ||
                                    key == 'imgUrlIosFront'
                                ) {
                                    if (aDetail[key] == null || aDetail[key] == undefined || aDetail[key] == '') {
                                        $rootScope.alertMsgService.setMessage('请填写' + tools.getCnName('homepageWindow') + '第' + (a + 1) + '个模块的' + tools.getAttrType(key), 'warning', function() {
                                            $('#homepageWindow').find('.uploadModule').eq(a).focus();
                                            tools.scrollTo($('#homepageWindow').find('.uploadModule').eq(a));
                                        });
                                        return false;
                                    }
                                }
                            }
                        }

                        // 图片广告
                        if (data['homepageAdvertisement'].title == null || data['homepageAdvertisement'].title == '') {
                            $rootScope.alertMsgService.setMessage('请填写' + tools.getCnName('homepageAdvertisement') + '的标题', 'warning', function() {
                                $('#homepageAdvertisement .title').focus();
                                tools.scrollTo($('#homepageAdvertisement .title'));
                            });
                            return false;
                        }
                        for (var a = 0; a < data['homepageAdvertisement'].homepageDetails.length; a++) {
                            var aDetail = data['homepageAdvertisement'].homepageDetails[a];
                            for (var key in aDetail) {
                                if (
                                    key == 'contentType' ||
                                    key == 'contentValue' ||
                                    key == 'imgUrlAndroidBackend' ||
                                    key == 'imgUrlIosBackend' ||
                                    key == 'imgUrlIosFront'
                                ) {
                                    if (aDetail[key] == null || aDetail[key] == undefined || aDetail[key] == '') {
                                        $rootScope.alertMsgService.setMessage('请填写' + tools.getCnName('homepageAdvertisement') + '第' + (a + 1) + '个模块的' + tools.getAttrType(key), 'warning', function() {
                                            $('#homepageAdvertisement').find('.uploadModule').eq(a).focus();
                                            tools.scrollTo($('#homepageAdvertisement').find('.uploadModule').eq(a));
                                        });
                                        return false;
                                    }
                                }
                            }
                        }

                        // 推荐产品
                        if (data['homepageRecommendProduct'].title == null || data['homepageRecommendProduct'].title == '') {
                            $rootScope.alertMsgService.setMessage('请填写' + tools.getCnName('homepageRecommendProduct') + '的标题', 'warning', function() {
                                $('#homepageRecommendProduct .title').focus();
                                tools.scrollTo($('#homepageRecommendProduct .title'));
                            });
                            return false;
                        }
                        for (var a = 0; a < data['homepageRecommendProduct'].homepageDetails.length; a++) {
                            var aDetail = data['homepageRecommendProduct'].homepageDetails[a];
                            for (var key in aDetail) {
                                if (
                                    key == 'contentType' ||
                                    key == 'contentValue' ||
                                    key == 'imgUrlAndroidBackend' ||
                                    key == 'imgUrlIosBackend'
                                ) {
                                    if (aDetail[key] == null || aDetail[key] == undefined || aDetail[key] == '') {
                                        $rootScope.alertMsgService.setMessage('请填写' + tools.getCnName('homepageRecommendProduct') + '第' + (a + 1) + '个模块的' + tools.getAttrType(key), 'warning', function() {
                                            $('#homepageRecommendProduct').find('.uploadModule').eq(a).focus();
                                            tools.scrollTo($('#homepageRecommendProduct').find('.uploadModule').eq(a));
                                        });
                                        return false;
                                    }
                                }
                            }
                        }

                        return true;
                    },
                    getAttrType: function(attrName) {
                        var cnName = '';
                        switch (attrName) {
                            case 'contentName':
                                cnName = '推荐商品名';
                                break;
                            case 'contentType':
                                cnName = '链接';
                                break;
                            case 'contentValue':
                                cnName = '链接';
                                break;
                            case 'imgUrlAndroidBackend':
                                cnName = '安卓背景图';
                                break;
                            case 'imgUrlAndroidFront':
                                cnName = '安卓前景图';
                                break;
                            case 'imgUrlIosBackend':
                                cnName = 'IOS背景图';
                                break;
                            case 'imgUrlIosFront':
                                cnName = 'IOS前景图';
                                break;
                        }
                        return cnName;
                    },
                    getCnName: function(attrName) {
                        var cnName = '';
                        switch (attrName) {
                            case 'homepageCarouselFigure':
                                cnName = '轮播图';
                                break;
                            case 'homepageWindow':
                                cnName = '橱窗';
                                break;
                            case 'homepageAdvertisement':
                                cnName = '图片广告';
                                break;
                            case 'homepageRecommendProduct':
                                cnName = '推荐产品';
                                break;
                        }
                        return cnName;
                    },
                    scrollTo: function(jq) {
                        $(window).scrollTop(jq.offset().top - 100);
                    }
                });

                (function() {
                    // 编辑状态
                    if (id != undefined && id != '' && id != null) {
                        tools.getHomePage(id);
                    } else {
                        /**
                         * 数据源
                         */
                        indexPaging = $scope.indexPaging = $.extend(true, {}, tpl);
                    }
                }());
            }
        ]).controller('selectLinkCtrl', [
            '$scope',
            '$rootScope',
            'ngDialog',
            '$location',
            'appCmsService',
            'commonService',
            'commonTool',
            function(
                $scope,
                $rootScope,
                ngDialog,
                $location,
                appCmsService,
                commonService,
                commonTool) {

                var vm = $scope.vm = {};
                var tools = $scope.tools = {};
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10
                };

                var indexPaging = $scope.indexPaging;
                var attrName = $scope.attrName;
                var index = $scope.index;



                var setTime;

                // 商品tab
                var productPaging = $scope.productPaging = {
                    params: {
                        page: 1,
                        pageSize: 10,
                        isOnline: 1,
                        status: 3
                    },
                    select: [{
                            label: '商品ID',
                            value: 0
                        },
                        {
                            label: '商品名称',
                            value: 1
                        }
                    ],
                    selectType: null,
                    selectValue: null
                };

                // 店铺tab
                var sellerPaging = $scope.sellerPaging = {
                    params: {
                        page: 1,
                        pageSize: 10,
                        auditStatus: 3,
                        exibitor: 0,
                        newShop: 0,
                        otherInfoAuditStatus: 1,
                        paidSeller: 0,
                        sellerAuthAuditStatus: 3,
                        shopStatus: 1,
                        statusTab: -10
                    },
                    select: [{
                            label: '公司中文名',
                            value: 0
                        },
                        {
                            label: '公司英文名',
                            value: 1
                        },
                        {
                            label: '帐号',
                            value: 2
                        },
                        {
                            label: '邮箱',
                            value: 3
                        }
                    ],
                    selectType: null,
                    selectValue: null
                };

                // 商品分类tab
                vm.searchCategoresList = [];
                vm.categoryArray = [];
                vm.hasSelectCate = null;
                $rootScope.hasSelectCate = null;

                // 关键词tab
                var keywordPaging = $scope.keywordPaging = {
                    params: {
                        page: 1,
                        pageSize: 10
                    },
                    searchType: 1,
                    keyword: null,
                    viewLink: null
                }

                tools = $.extend(tools, {
                    // 选取商品列表
                    getProducts: function() {
                        if (productPaging.selectType == 0) {
                            productPaging.params.productId = productPaging.selectValue;
                        } else {
                            productPaging.params.productName = productPaging.selectValue;
                        }
                        appCmsService.getProducts(commonTool.filterParam(productPaging.params)).success(function(data) {
                            vm.items = data.data.items;
                            paging.total = data.page.total;
                            paging.pageSize = data.page.pageSize;
                        });
                    },
                    // 分页
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        if (index == 0) {
                            productPaging.params.page = paging.page;
                            tools.getProducts();
                        } else if (index == 1) {
                            sellerPaging.params.page = paging.page;
                            tools.getSellerList();
                        }
                    },
                    // 获取供应商列表
                    getSellerList: function() {
                        switch (sellerPaging.selectType) {
                            case 0:
                                sellerPaging.params.qKey = 'companyName';
                                break;
                            case 1:
                                sellerPaging.params.qKey = 'companyEnName';
                                break;
                            case 2:
                                sellerPaging.params.qKey = 'username';
                                break;
                            case 3:
                                sellerPaging.params.qKey = 'email';
                                break;
                        }
                        sellerPaging.params.qValue = sellerPaging.selectValue;

                        appCmsService.getSellerList(commonTool.filterParam(sellerPaging.params)).success(function(data) {
                            vm.items = data.data.items;
                            paging.total = data.page.total;
                            paging.pageSize = data.page.pageSize;

                        });
                    },
                    // 选择分类
                    selectCate: function() {
                        commonService.getAllCategorysOfLevel1().success(function(data) {
                            if ('success' == data.status) {
                                vm.firstLevelCate = data.data;
                            }
                        });
                    },
                    isMutiCategoty: function(categoryId) {
                        var array = $rootScope.selectedCategory.categoryOfSuggestAarry;
                        var len = array.length;
                        if (len <= 0) return false;
                        for (var i = 0; i < len; i++) {
                            var item = array[i];
                            if (item.categoryId == categoryId) {
                                $rootScope.selectedCategory.categoryOfSuggestAarry.splice(i, 1);
                                return true;
                            }
                        }
                        return false;
                    },
                    getChildcate: function(parentId) {
                        var obj = '#categoryId' + parentId;
                        $(obj).addClass('active').siblings('li').removeClass('active');
                        commonService.getCategoryChildren({
                            parentId: parentId
                        }).success(function(data) {
                            if ('success' == data.status) {
                                vm.categoryArray = [];
                                vm.categoryArray[0] = data.data;
                            }
                        })
                    },
                    chooseCate: function(item, index) {
                        var obj = '#categoryId' + item.categoryId;
                        $(obj).addClass('active').siblings('li').removeClass('active');
                        /*
                        if (item.isBottom) {
                            $rootScope.hasSelectCate = item;
                            return;
                        }
                        */
                        // 直接选择分类
                        $rootScope.hasSelectCate = item;
                        if (index != undefined) {
                            if (!item.isBottom) {
                                commonService.getCategoryChildren({
                                    parentId: item.categoryId
                                }).success(function(data) {
                                    if ('success' == data.status) {
                                        var len = vm.categoryArray.length;
                                        vm.categoryArray.splice(index + 1, len - index - 1);
                                        vm.categoryArray.push(data.data);
                                    }
                                })
                            }
                        }
                    },
                    delCategory: function() {
                        $rootScope.hasSelectCate = null;
                    },
                    searchCate: function() {
                        searchCategories(vm.cateKeyword);
                    },
                    chxSelectCate: function(item) {
                        var obj = '#search' + item.categoryId;
                        $(obj).addClass('active').siblings('li').removeClass('active');
                        var obj = {
                            categoryId: item.categoryId,
                            categoryEname: item.categoryName
                        }
                        $rootScope.hasSelectCate = obj;
                    },
                    checCatekKeyUp: function() {
                        clearTimeout(setTime);
                        if (commonTool.isEmpty(vm.cateKeyword)) {
                            vm.searchCategoresList = [];
                            return;
                        } else {
                            setTime = setTimeout(searchCategories, 500);
                        }

                    },
                    checkCateKeyUp: function(event) {
                        var keycode = window.event ? event.keyCode : event.which;
                        if (keycode == 13) searchCategories(vm.cateKeyword);
                    },
                    // 生成关键词预览链接
                    creatKeyWordViewLink: function() {
                        var kw = encodeURIComponent(keywordPaging.keyword.replace(/^\ +|\ +$/g, '').replace(/\ +/g, ' ').replace(/[\/\?\~\^]/g, ''));
                        kw = kw.replace(/\%20/g, '+').replace(/\-/g, '%2D').replace(/\//g, '%2F').replace(/\%/g, '%25');
                        kw = kw.replace(/^\ +|\ +$/g, '').replace(/\ /g, '+');
                        if (keywordPaging.searchType == 1) {
                            keywordPaging.viewLink = '/products-directory/' + kw + '.html';
                        } else {
                            keywordPaging.viewLink = '/china-suppliers/' + kw + '.html';
                        }
                    },
                    changeTab: function() {
                        vm.items = [];
                        $scope.paging.page = 1;
                        $scope.paging.pageSize = 10;
                        $scope.paging.total = 0;
                    },
                    select: function(type, item) {
                        /**
                         * type {1: 商品, 2: 店铺, 3: 类目类型, 4: 商品关键词, 5: 类目关键词 }
                         * value {当 contentType = 1, contentValue = 商品id} {当 contentType = 2, contentValue = 卖家id} {当 contentType = 3, contentValue = 类目id;类目名称} {当 contentType = 4, contentValue = 商品关键词} {当 contentType = 5, contentValue = 类目关键词}
                         */
                        indexPaging[attrName]['homepageDetails'][index].contentType = type;
                        switch (type) {
                            case 1:
                                indexPaging[attrName]['homepageDetails'][index].contentValue = item.productId;
                                indexPaging[attrName]['homepageDetails'][index].linkUrl = '/products/oms-' + item.productId + '.html';
                                indexPaging[attrName]['homepageDetails'][index].linkText = item.name;
                                break;
                            case 2:
                                indexPaging[attrName]['homepageDetails'][index].contentValue = item.sellerId;
                                indexPaging[attrName]['homepageDetails'][index].linkUrl = '/china-supplier/' + item.companyId + '.html';
                                indexPaging[attrName]['homepageDetails'][index].linkText = item.companyEnName;
                                break;
                            case 3:
                                if (commonTool.isEmpty($rootScope.hasSelectCate)) {
                                    $rootScope.alertMsgService.setMessage("请选择类目", 'warning');
                                    return;
                                }
                                var categoryId = $rootScope.hasSelectCate.categoryId;
                                var categoryEname = $rootScope.hasSelectCate.categoryEname;
                                var categoryName = $rootScope.hasSelectCate.categoryName;
                                indexPaging[attrName]['homepageDetails'][index].contentValue = categoryId + ';' + categoryEname;
                                indexPaging[attrName]['homepageDetails'][index].linkUrl = '/ec/search/productsCat.html?source=oms&catIds=' + categoryId;
                                indexPaging[attrName]['homepageDetails'][index].linkText = categoryEname;
                                break;
                            case 4:
                                if (keywordPaging.searchType == 1) {
                                    indexPaging[attrName]['homepageDetails'][index].contentType = type;
                                } else {
                                    indexPaging[attrName]['homepageDetails'][index].contentType = 5;
                                }
                                indexPaging[attrName]['homepageDetails'][index].contentValue = keywordPaging.keyword;
                                indexPaging[attrName]['homepageDetails'][index].linkUrl = keywordPaging.viewLink;
                                indexPaging[attrName]['homepageDetails'][index].linkText = keywordPaging.keyword;
                                break;
                        }

                        // 推荐商品
                        if (attrName == 'homepageRecommendProduct') {
                            indexPaging[attrName]['homepageDetails'][index].contentName = indexPaging[attrName]['homepageDetails'][index].linkText;
                        }

                        ngDialog.closeAll();
                    }
                })

                function searchCategories(keyword) {
                    keyword = vm.cateKeyword;
                    if (commonTool.isEmpty(keyword)) {
                        vm.searchCategoresList = [];
                        return;
                    }
                    commonService.searchCategories({
                        keywords: keyword
                    }).success(function(data) {
                        if (data.status == 'success') {
                            vm.searchCategoresList = data.data;
                        }
                    })
                }

                (function() {
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);
                }());

            }
        ]).controller('addKeywordCtrl', [
            '$scope',
            '$rootScope',
            'commonTool',
            function(
                $scope,
                $rootScope,
                commonTool) {

                var tools = $scope.tools;
                var vm = $scope.vm;
                vm.newKeyWord = null;
                // console.log($scope.type);

                tools = $.extend(tools, {
                    submit: function() {
                        if (commonTool.isEmpty(vm.newKeyWord)) {
                            $rootScope.alertMsgService.setMessage("请先填写关键词", 'warning');
                            return;
                        }
                        $scope.confirm();
                    },
                    close: function() {
                        $scope.closeThisDialog();
                    }
                });

            }
        ]).controller('feedBackCtrl', [
            '$scope',
            '$rootScope',
            'commonTool',
            'appCmsService',
            'commonService',
            function(
                $scope,
                $rootScope,
                commonTool,
                appCmsService,
                commonService) {

                var tools = $scope.tools = {};
                var vm = $scope.vm = {};
                var paging = $scope.paging = {
                    page: 1,
                    pageSize: 10,
                    // 1:买家，2:卖家
                    userType: 1
                };

                tools = $.extend(tools, {
                    listFeedback: function() {
                        appCmsService.listFeedback(paging).success(function(data) {
                            if (data.page == null) {
                                vm.items = [];
                                paging.total = 0;
                                paging.pageSize = 10;
                            } else {
                                if (data.page.items == null) {
                                    vm.items = [];
                                    paging.total = 0;
                                    paging.pageSize = 10;
                                } else {
                                    vm.items = data.page.items;
                                    paging.total = data.page.total;
                                    paging.pageSize = data.page.pageSize;
                                }
                            }


                        });
                    },
                    getnewpage: function(type) {
                        if (type == 1) {
                            paging.page = tools.newpagesize;
                            tools.newpagesize = null;
                        } else if (type == 0) {
                            paging.page = 1;
                        }
                        tools.listFeedback();
                    }
                });

                (function() {
                    vm.pages = commonService.setPageSizeArray(10, 30, 50);
                    tools.listFeedback();
                }());

            }
        ])
        .controller('selectTempCtrl', [
            '$scope',
            '$rootScope',
            'ngDialog',
            '$location',
            'appCmsService',
            'commonService',
            'commonTool',
            function(
                $scope,
                $rootScope,
                ngDialog,
                $location,
                appCmsService,
                commonService,
                commonTool) {

                console.log('selectTempCtrl');

            }
        ])
        .controller('showPreviewLinkCtrl', [
            '$scope',
            '$rootScope',
            'ngDialog',
            '$location',
            'appCmsService',
            'commonService',
            'commonTool',
            function(
                $scope,
                $rootScope,
                ngDialog,
                $location,
                appCmsService,
                commonService,
                commonTool) {
                var vm = $scope.vm;
                var tools = $scope.tools;
                var previewLinkId = $scope.previewLinkId;
                if (wapUrl != '') {
                    // 测试
                    vm.previewLink = wapUrl + '?id=' + previewLinkId + '&preview=1';
                    if (ecDomain == 'http://www.e-cantonfair.com') {
                        // 生产
                        vm.previewLink = 'http://m.e-cantonfair.com/?id=' + previewLinkId + '&preview=1#/home';
                    }
                } else {
                    // 生产
                    vm.previewLink = 'http://m.e-cantonfair.com/?id=' + previewLinkId + '&preview=1#/home';
                }

                tools = $.extend(tools, {
                    previewLinkCopySuccess: function(e) {
                        $rootScope.alertMsgService.setMessage("复制成功", 'success');
                        tools.close();
                    },
                    previewLinkCopyError: function(e) {
                        $rootScope.alertMsgService.setMessage("复制失败，尝试刷新页面重试", 'warning');
                        tools.close();
                    }
                });
            }
        ])
        .filter("appUploadImgFilter", function() {
            return function(imgSrc) {
                if (imgSrc) {
                    return imgUrl.replace(/\/$/, '') + imgSrc;
                } else {
                    return 'view/images/appCms/uploadDefault_200_107.jpg'
                }
            };
        })
        .filter('linkFilter', function() {
            return function(link) {
                return ecDomain + link;
            }
        })
        .filter('previewLink', function() {
            return function(id) {
                return wapUrl + '?id=' + id + '&preview=1';
            }
        })
});