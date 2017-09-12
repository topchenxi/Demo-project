define(['../module'], function(ng) {
    ng.factory('productTagService', ['$http', 'api', function($http, api) {
        const getProductTagList = params => $http.get(api.getProductTagList, {
            'params': params
        });
        const getTagInfo = params => $http.get(api.getTagInfo, {
            'params': params
        });
        const getProductListByTag = params => $http.get(api.getProductListByTag, {
            'params': params
        });
        const delProductTag = params => $http.post(api.delProductTag, params);
        const saveOrUpdateTagInfo = params => $http.post(api.saveOrUpdateTagInfo, params);
        const removeTagProduct = params => $http.post(api.removeTagProduct, params);
        return {
            getProductTagList,
            getTagInfo,
            getProductListByTag,
            delProductTag,
            saveOrUpdateTagInfo,
            removeTagProduct
        };
    }])
    ng.controller('productTagCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$location',
        'productTagService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog, $location, productTagService, commonService, commonTool) {
            let List = commonService.getListClass();
            class ProductTag extends List {
                constructor(defaultPaging) {
                    super(defaultPaging);
                }
                getList() {
                    productTagService.getProductTagList(commonTool.filterParam(this.paging)).success(data => {
                        if (data.status === 'success') {
                            this.list = data.data.items;
                            this.total = data.data.total;
                        }
                    });
                }
                addProductTag() {
                    $location.url('/goods/saveOrUpdateTag');
                }
                delProductTag(tagId) {
                    if (!tagId) return;
                    let _this = this;
                    ngDialog.open({
                        template: './controller/seller/dialogTmp/confirmdDlg.html',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            var vm = $scope.vm = {
                                messages: '您确定要删除标签吗？(提示：删除标签后，产品的标签将失效。)',
                                btnFlag: false,
                                submit: function() {
                                    vm.btnFlag = true;
                                    productTagService.delProductTag({
                                        'tagId': tagId
                                    }).success(data => {
                                        if (data.status === 'success') {
                                            _this.getList();
                                            _this.showMsg("删除成功", 'warning');
                                            $scope.closeThisDialog();
                                        } else {
                                            _this.showMsg("删除失败", 'warning');
                                            vm.btnFlag = false;
                                        }
                                    })
                                },
                                close: function() {
                                    $scope.closeThisDialog();
                                }
                            };
                        }]
                    })
                }
            };
            const defaultPaging = {
                'page': 1,
                'pageSize': 10
            };
            let vm = $scope.vm = new ProductTag(defaultPaging);
        }
    ])

    ng.controller('saveOrUpdateTagCtrl', [
        '$scope',
        '$rootScope',
        'ngDialog',
        '$location',
        'productTagService',
        'commonService',
        'commonTool',
        function($scope, $rootScope, ngDialog, $location, productTagService, commonService, commonTool) {
            let vm;
            const tagId = $location.search().tagId;
            class AttachFile {
                constructor(fileName, fileUrl) {
                    this.fileName = fileName;
                    this.fileUrl = fileUrl;
                }
            }
            class TagInfo {
                constructor(defaultParams) {
                    this.params = defaultParams;
                    if (!commonTool.isEmpty(this.params.tagId)) this.init();
                }
                init() {
                    vm = $scope.vm = new ProductList(defaultPaging);
                    this.getTagInfo();
                }
                getTagInfo() {
                    productTagService.getTagInfo({
                        'tagId': this.params.tagId
                    }).success(data => {
                        if (data.status === 'success') {
                            this.params.productIds = data.data.productIds;
                            this.params.tagName = data.data.productTag.tagName;
                            this.params.tagDesc = data.data.productTag.tagDesc;
                        }
                    })
                }
                valid() {
                    if (commonTool.isEmpty(this.params.tagName)) {
                        this.showMsg("请输入标签名称", 'warning');
                        return false;
                    }
                    if (commonTool.isEmpty(this.params.tagDesc)) {
                        this.showMsg("请输入标签描述", 'warning');
                        return false;
                    }
                    if (commonTool.isEmpty(this.params.productIds) && !this.attachFile) {
                        this.showMsg("请输入商品ID", 'warning');
                        return false;
                    }
                    if (!commonTool.isEmpty(this.params.productIds) && !/[0-9,]/g.test(this.params.productIds)) {
                        this.showMsg("商品ID格式不对，只能包含数字及英文逗号", 'warning');
                        return false;
                    }
                    return true;
                }
                save() {
                    if (!this.valid()) return;
                    if (this.attachFile) this.params.url = this.attachFile.fileUrl;
                    productTagService.saveOrUpdateTagInfo(commonTool.filterParam(this.params)).success(data => {
                        if (data.status === 'success') {
                            this.showMsg('保存成功');
                            $location.url('/goods/productTag');
                        } else {
                            this.showMsg(data.message, 'warning');
                        }
                    })
                }
                back() {
                    $location.url('/goods/productTag');
                }
                uploadFile(files) {
                    if (commonTool.isEmpty(files) || !files.length) return;
                    let myFile = files[0];
                    if ((!/.*\.(txt)|(TXT)$/.test(myFile.name)) || myFile.size > 2 * 1024 * 1024) {
                        this.showMsg("请重新上传,支持格式：txt;文件大小不超过2M", 'warning');
                        return false;
                    }
                    commonService.upload(myFile).success((data, status, headers, config) => {
                        this.attachFile = new AttachFile(config.file.name, data.data.url);
                    });
                }
                delFile() {
                    this.attachFile = null;
                }
                showMsg(message, type = 'success') {
                    $rootScope.alertMsgService.setMessage(message, type);
                }
            }
            let List = commonService.getListClass();
            class ProductList extends List {
                constructor(defaultPaging) {
                    super(defaultPaging)
                }
                getList() {
                    productTagService.getProductListByTag(commonTool.filterParam(this.paging)).success(data => {
                        if (data.status === 'success') {
                            this.list = data.data.items;
                            this.total = data.data.total;
                        }
                    })
                }
                delProduct(productId) {
                    productTagService.removeTagProduct({
                        'tagId': this.paging.tagId,
                        'productId': productId
                    }).success(data => {
                        if (data.status === 'success') {
                            tagInfo.showMsg('移除成功');
                            this.getList();
                            tagInfo.getTagInfo();
                        }
                    })
                }
            }
            const defaultParams = {
                // 标签编号
                'tagId': tagId || '',
                // 标签名称
                'tagName': null,
                // 标签描述
                'tagDesc': null,
                // 商品ID(英文逗号间隔)
                'productIds': null,
                // 商品ID(附件)
                'url': null
            };
            const defaultPaging = {
                // 标签编号
                'tagId': tagId || '',
                // 分页
                'page': 1,
                'pageSize': 10
            };
            let tagInfo = $scope.tagInfo = new TagInfo(defaultParams);
        }
    ])

})