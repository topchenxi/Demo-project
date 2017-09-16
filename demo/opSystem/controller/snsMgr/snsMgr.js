define(['../module'], function(ng) {

    ng.factory('snsMgrService', ['$http', 'api', function($http, api) {
        const getSnsSellerList = params => $http.get(api.getSnsList, { params: params });
        const getSnsSystemList = params => $http.get(api.getSnsList, { params: params });
        const getSnsDetail = params => $http.get(api.getSnsDetail, { params: params });
        const getSnsPromotionTop10s = params => $http.get(api.getSnsPromotionTop10s, { params: params });
        const publishSns = params => $http.post(api.publishSns, params);
        const delSns = params => $http.post(api.delSns, params);
        const auditSns = params => $http.post(api.auditSns, params);
        const updateSnsPromotionTop10 = params => $http.post(api.updateSnsPromotionTop10, params);
        const addSnsPromotion = (params, type) => $http.post(type == 2 ? api.addSnsPromotion : api.updateSnsPromotion, params);
        return {
            getSnsSellerList,
            getSnsSystemList,
            getSnsDetail,
            getSnsPromotionTop10s,
            delSns,
            publishSns,
            auditSns,
            updateSnsPromotionTop10,
            addSnsPromotion
        };
    }])
    ng.controller('snsSellerListCtrl', ['$scope', '$rootScope', '$location', 'commonTool', 'ngDialog', 'snsMgrService', 'commonService',
        function($scope, $rootScope, $location, commonTool, ngDialog, snsMgrService, commonService) {
            let List = commonService.getListClass();
            class SearchType {
                constructor(key, value) {
                    this.key = key;
                    this.value = value;
                }
            }
            class SellerList extends List {
                constructor(defaultPaging = {}) {
                    super(defaultPaging);
                    this.currentStatus = this.paging.auditStatus;
                }
                initDefault() {
                    super.initDefault();
                    this.searchTypeArray = this.setSearchTypeArray();
                }
                initTab(auditStatus = '') {
                    this.currentStatus = auditStatus;
                    this.reset();
                    this.getList();
                }
                getList() {
                    this.showOperateFlag = false;
                    this.allChecked = false;
                    let params = Object.assign({}, this.paging);
                    if (commonTool.isEmpty(params.selectedValue)) delete params.selectedQueryId;
                    snsMgrService.getSnsSellerList(commonTool.filterParam(params)).success(data => {
                        this.list = data.page.items;
                        this.total = data.page.total;
                    })
                }
                reset() {
                    super.reset();
                    this.paging.auditStatus = this.currentStatus;
                }
                toAuditByMulti(auditStatus) {
                    super.toAuditByMulti(auditStatus, 'id');
                }
                auditStatus(ids, auditStatus) {
                    $scope.ids = ids;
                    $scope.auditStatus = auditStatus;
                    $scope.tools = this;
                    $scope.type = 'list';
                    ngDialog.open({
                        template: 'confirmDlg',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: 'snsAuditCtrl'
                    })
                }
                setSearchTypeArray() {
                    return [new SearchType('公司中文名称', 1), new SearchType('公司英文名称', 2), new SearchType('邮箱', 3), new SearchType('sellerId', 4)];
                }
            }

            let defaultPaging = {

                // 搜索
                'selectedQueryId': null,
                'selectedValue': null,

                // sns 类型
                'type': 0,
                // 创建时间
                'startTime': null,
                'endTime': null,

                'auditStatus': 1,

                'page': 1,
                'pageSize': 10
            };

            let vm = $scope.vm = new SellerList(defaultPaging);

        }
    ])

    ng.controller('snsAuditCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'snsMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            snsMgrService,
            commonService
        ) {
            let tools = $scope.tools;
            class Reason {
                constructor(key, value) {
                    this.key = key;
                    this.value = value;
                }
            }
            class Audit {
                constructor(params, type) {
                    this.params = params;
                    this.type = type;
                    this.reasonList = [
                        new Reason(1, '涉及敏感的宗教、政治等内容'),
                        new Reason(2, '涉及敏感的黄色内容'),
                        new Reason(3, '内容侵犯版权或知识权、含有人身攻击或恶意的评论或政治、宗教讨论'),
                        new Reason(4, '其他')
                    ];
                }
                reasonChange() {
                    vm.params.reason = this.selectKey != 4 ? this.getReasonByKey(this.selectKey) : '';
                }
                getReasonByKey(key) {
                    for (let i = 0, len = this.reasonList.length; i < len; i++) {
                        const item = this.reasonList[i];
                        if (item.key == key) {
                            return item.value;
                        }
                    }
                }
                submit() {
                    console.log(1);
                    if (this.params.auditStatus == 2 && commonTool.isEmpty(this.params.reason)) {
                        $rootScope.alertMsgService.setMessage("请先填写原因", 'warning');
                        return;
                    }
                    snsMgrService.auditSns(commonTool.filterParam(this.params)).success(data => {
                        if (data.status === 'success') {
                            if (this.type == 'detail') {
                                tools.getSnsDetail();
                            } else {
                                tools.getList();
                            }
                            $rootScope.alertMsgService.setMessage("审核成功");
                            $scope.closeThisDialog();
                        } else {
                            $rootScope.alertMsgService.setMessage("审核失败", 'warning');
                        }
                    })

                }
                close() {
                    console.log(2);
                    $scope.closeThisDialog();
                }
            };
            const params = {
                'ids': $scope.ids,
                'auditStatus': $scope.auditStatus
            };
            const type = $scope.type;
            let vm = $scope.vm = new Audit(params, type);

        }
    ])

    ng.controller('snsSystemListCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'snsMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            snsMgrService,
            commonService
        ) {

            let List = commonService.getListClass();

            class SystemList extends List {
                constructor(defaultPaging = {}) {
                    super(defaultPaging);
                }
                getList() {
                    snsMgrService.getSnsSystemList(commonTool.filterParam(this.paging)).success(data => {
                        this.list = data.page.items;
                        this.total = data.page.total;
                    })
                }
                addSNS() {
                    $location.path('/snsMgr/addSNS')
                }
                publishSns(id) {
                    let _self = this;
                    ngDialog.open({
                        template: 'snsConfirmDlg',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            let vm = $scope.vm = {
                                btnFlag: false,
                                message: '确定发布该条SNS文章推广?',
                                submit: function() {
                                    this.btnFlag = true;
                                    snsMgrService.publishSns({
                                        'id': id
                                    }).success(data => {
                                        if (data.status === "success") {
                                            _self.getList();
                                            $scope.closeThisDialog();
                                            $rootScope.alertMsgService.setMessage("发布成功", 'success');
                                        } else {
                                            $rootScope.alertMsgService.setMessage("发布失败", 'warning');
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
                delSystemSns(id) {
                    let _self = this;
                    ngDialog.open({
                        template: 'snsConfirmDlg',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: ['$scope', function($scope) {
                            let vm = $scope.vm = {
                                btnFlag: false,
                                message: '确定删除该条SNS文章推广?',
                                submit: function() {
                                    this.btnFlag = true;
                                    snsMgrService.delSns({
                                        'id': id
                                    }).success(data => {
                                        if (data.status === "success") {
                                            _self.getList();
                                            $scope.closeThisDialog();
                                            $rootScope.alertMsgService.setMessage("删除成功", 'success');
                                        } else {
                                            $rootScope.alertMsgService.setMessage("删除失败", 'warning');
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
            }

            let defaultPaging = {
                // 类型
                'type': 1,
                // 创建时间
                'startTime': null,
                'endTime': null,

                'auditStatus': null,

                'subject': null,

                'page': 1,
                'pageSize': 10
            };

            let vm = $scope.vm = new SystemList(defaultPaging);

        }
    ])


    ng.controller('addSNSCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'snsMgrService',
        'commonService',
        'Upload',
        'api',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            snsMgrService,
            commonService,
            Upload,
            api
        ) {


            $rootScope.selectSellerItem = null;

            let id = $location.search().id;

            class Seller {
                constructor(sellerId, companyName, userId) {
                    this.sellerId = sellerId;
                    this.companyName = companyName;
                    this.userId = userId;
                }
            }



            class EditInfo {
                constructor(id = "") {
                    this.id = id;
                    this.info = {};
                    this.imageUrlArray = [];
                    this.init();
                }
                init() {
                    this.validate();
                    if (this.id) {
                        this.getSnsDetail()
                    } else {
                        this.setInfo();
                    }
                }
                getSnsDetail() {
                    snsMgrService.getSnsDetail({
                        'id': this.id
                    }).success(data => {
                        if (data.status === "success") {
                            let info = data.data.subject;
                            this.setInfo(info.subject, info.content, info.url);
                            $rootScope.selectSellerItem = new Seller(info.sellerId, info.companyCnName, info.userId);
                        }
                    })
                }
                setInfo(title = '', content = '', attachmentUrl = '') {
                    this.info.title = title;
                    this.info.content = content;
                    this.info.attachmentUrl = attachmentUrl;
                    if (this.info.attachmentUrl) {
                        this.imageUrlArray = this.info.attachmentUrl.split(',');
                    }
                }
                validate() {
                    // /^[^\u4e00-\u9fa5]*$/g; 英文和数字
                    // /^[A-Za-z]+$/g; 英文
                    $.validator.addMethod('enCode', function(value, element) {
                        let reg = /^[^\u4e00-\u9fa5]*$/g;
                        return reg.test(value);
                    }, '请输入英文和数字');

                    const options = {
                        errorElement: "em",
                        errorClass: "error-explain",
                        validClass: "valid-explain",
                        rules: {
                            title: {
                                required: true,
                                rangelength: [1, 50],
                                enCode: true
                            },
                            content: {
                                required: true,
                                rangelength: [20, 2000],
                                enCode: true
                            }
                        },
                        messages: {
                            title: {
                                required: '必填项',
                                rangelength: $.validator.format("长度控制在 {0} 到 {1} 字符")
                            },
                            content: {
                                required: '必填项',
                                rangelength: $.validator.format("长度控制在 {0} 到 {1} 字符")
                            }
                        }
                    };
                    this.validFrom = $('#editSNSform').validate(options);
                }
                uploadImg(files) {
                    if (!files || !files.length) return;
                    let file = files[0];
                    if ((!/.*\.(png)|(PNG)|(jpg)|(JPG)|(gif)|(GIF)$/.test(file.name)) || file.size > 2 * 1024 * 1024) {
                        $rootScope.alertMsgService.setMessage("请重新选择图片,上传图片支持格式：png,jpg,gif;文件大小不超过2M", 'warning');
                        return false;
                    }
                    Upload.upload({
                        url: api.uploadContract,
                        file: file
                    }).success(data => this.imageUrlArray.push(data.data.url));

                }
                delSeller() {
                    $rootScope.selectSellerItem = null;
                }
                delImage(index) {
                    this.imageUrlArray.splice(index, 1);
                }
                isRequired() {
                    if (!this.validFrom.form()) return false;
                    if (!this.imageUrlArray.length) {
                        $rootScope.alertMsgService.setMessage("请上传图片", 'warning');
                        return false;
                    }
                    return true;
                }
                publishInfo() {
                    if (!this.isRequired()) return;
                    this.postInfo(3);
                }
                saveSraft() {
                    if (!this.isRequired()) return;
                    this.postInfo(1);
                }
                postInfo(auditStatus = 3) {
                    this.info.auditStatus = auditStatus;
                    this.info.attachmentUrl = this.imageUrlArray.join(',') || '';
                    if (this.id) this.info.id = this.id;
                    this.info.sellerId = $rootScope.selectSellerItem ? $rootScope.selectSellerItem.sellerId : '-1';
                    this.info.userId = $rootScope.selectSellerItem ? $rootScope.selectSellerItem.userId : '-1';
                    let params = Object.create(this.info);

                    params.subject = params.title;
                    delete params.title;
                    params.url = params.attachmentUrl;
                    delete params.attachmentUrl;

                    snsMgrService.addSnsPromotion(params, this.id ? 1 : 2).success(data => {
                        if (data.status === 'success') {
                            $rootScope.alertMsgService.setMessage((auditStatus == 3 ? '发布' : '保存') + "成功", 'success');
                            $location.url('/snsMgr/systemList');
                        }
                    })
                }
                cancel() {
                    $location.url('/snsMgr/systemList');
                }
                selectSeller() {
                    ngDialog.open({
                        template: "addSeller.html",
                        title: "添加供应商",
                        width: 980,
                        scope: $scope,
                        controller: 'addSNSSellerCtrl'
                    })
                }

            }

            let vm = $scope.vm = new EditInfo(id);

        }
    ])

    ng.controller('addSNSSellerCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'snsMgrService',
        'sellerServer',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            snsMgrService,
            sellerServer,
            commonService
        ) {

            let List = commonService.getListClass();

            class searchType {
                constructor(key, value) {
                    this.key = key;
                    this.value = value;
                }
            }

            class Seller {
                constructor(sellerId, companyName, userId) {
                    this.sellerId = sellerId;
                    this.companyName = companyName;
                    this.userId = userId;
                }
            }

            class SellerList extends List {
                constructor(params) {
                    super(params);
                    this.searchTypeArray = this.getSearchTypeArray();
                }
                getList() {
                    sellerServer.getSellerList(commonTool.filterParam(this.paging)).success(data => {
                        this.list = data.data.items;
                        this.total = data.data.count;
                    })
                }
                getSearchTypeArray() {
                    return [
                        new searchType('公司中文名称', 'companyName'),
                        new searchType('公司英文名称', 'companyEnName'),
                        new searchType('供应商ID', 'sellerId')
                    ];
                }
                selected(item) {
                    let seller = new Seller(item.sellerId, item.companyName, item.userId);
                    $rootScope.selectSellerItem = seller;
                    $scope.closeThisDialog();
                }
            }

            let params = {
                'qKey': null,
                'qValue': null,
                'page': 1,
                'pageSize': 10,
                'shopStatus': 3
            };

            let vm = $scope.vm = new SellerList(params);
        }
    ])



    ng.controller('snsDetailCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'snsMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            snsMgrService,
            commonService
        ) {

            let id = $location.search().id;

            class Detail {
                constructor(id = "") {
                    this.id = id;
                    this.init();
                }

                init() {
                    this.getSnsDetail();
                }

                getSnsDetail() {
                    snsMgrService.getSnsDetail({
                        'id': this.id
                    }).success(data => {
                        this.info = data.data.subject;
                        this.auditRecord = data.data.auditRecord;
                    })
                }

                toAudit(auditStatus) {
                    $scope.ids = this.id;
                    $scope.auditStatus = auditStatus;
                    $scope.tools = this;
                    $scope.type = 'detail';
                    ngDialog.open({
                        template: 'confirmDlg',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: 'snsAuditCtrl'
                    })

                }
            }

            let vm = $scope.vm = new Detail(id);
        }
    ])



    ng.controller('positionEditCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'snsMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            snsMgrService,
            commonService
        ) {

            let params = {
                // 有限时间(开始)
                availableStart: null,
                // 有限时间(结束)
                availableEnd: null,
                // ids
                snsPromotionIds: ""
            };

            class PItem {
                constructor(id = "") {
                    this.id = id;
                }
            };

            class Position {
                constructor(params = {}) {
                    this.list = [];
                    this.info = Object.create(params);
                    this.init();
                }
                init() {
                    this.list.push(new PItem());
                    this.getSnsPromotionTop10s();
                }
                getSnsPromotionTop10s() {
                    snsMgrService.getSnsPromotionTop10s().success(data => {
                        if (data.status === 'success' && data.data && data.data.length) {
                            const top10List = data.data;
                            this.list = [];
                            top10List.forEach(item => {
                                this.list.push(new PItem(item.snsPromotionId));
                            })
                            this.info = Object.create({
                                // 有限时间(开始)
                                availableStart: top10List[0].availableStart,
                                // 有限时间(结束)
                                availableEnd: top10List[0].availableEnd,
                                // ids
                                snsPromotionIds: ""
                            });
                        }
                    })
                }
                addItem() {
                    if (this.list.length >= 10) return;
                    this.list.push(new PItem());
                }
                delItem(item) {
                    if (!item) return;
                    let index = this.list.indexOf(item);
                    this.list.splice(index, 1);
                }
                checkUnique() {
                    var array = this.list.map(item => {
                        return item.id.toString();
                    })
                    return (new Set(array)).size == this.list.length;
                }
                isRequired() {
                    if (!this.info.availableStart || !this.info.availableEnd) {
                        $rootScope.alertMsgService.setMessage("请选择有效时间", 'warning');
                        return false;
                    }
                    for (let i = 0, len = this.list.length; i < len; i++) {
                        if (!this.list[i].id) {
                            $rootScope.alertMsgService.setMessage("请填写文章ID", 'warning');
                            return false;
                        }
                    }
                    if (!this.checkUnique()) {
                        $rootScope.alertMsgService.setMessage("重复文章id", 'warning');
                        return false;
                    }
                    return true;
                }
                saveInfo() {
                    if (!this.isRequired()) return;

                    this.info.snsPromotionIds = this.list.map(item => item.id).join(',');
                    snsMgrService.updateSnsPromotionTop10(this.info).success((data) => {
                        if (data.status === "success") {
                            $rootScope.alertMsgService.setMessage("保存成功");
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message);
                        }
                    })
                }
            };

            let pos = $scope.pos = new Position(params);
        }
    ])

    ng.filter('snsAuditStatusFilter', function() {
        return function(auditStatus) {
            switch (auditStatus) {
                case 1:
                    return '待审核';
                case 2:
                    return '审核不通过';
                case 3:
                    return '审核通过';
                default:
                    return '';
            }
        };
    });

    ng.filter('snsSysAuditStatusFilter', function() {
        return function(auditStatus) {
            switch (auditStatus) {
                case 1:
                    return '草稿';
                case 3:
                    return '已发布';
                default:
                    return '';
            }
        };
    });



})