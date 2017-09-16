define(['../module'], function(ng) {

    ng.factory('marketDevMgrService', ['$http', 'api', function($http, api) {


        const getProductDevList = params => $http.get(api.getProductDevList, { params: params });
        const getProductDevDetail = params => $http.get(api.getProductDevDetail, { params: params });

        const auditProductDev = params => $http.post(api.auditProductDev, params);

        return {
            getProductDevList,
            getProductDevDetail,
            auditProductDev
        };
    }])
    ng.controller('productDevListCtrl', ['$scope', '$rootScope', '$location', 'commonTool', 'ngDialog', 'marketDevMgrService', 'commonService',
        function($scope, $rootScope, $location, commonTool, ngDialog, marketDevMgrService, commonService) {
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
                    this.currentStatus = this.paging.aduitStatus;
                }
                initDefault() {
                    super.initDefault();
                    this.searchTypeArray = this.setSearchTypeArray();
                }
                initTab(aduitStatus = '') {
                    this.currentStatus = aduitStatus;
                    this.reset();
                    this.getList();
                }
                getList() {
                    marketDevMgrService.getProductDevList(commonTool.filterParam(this.paging)).success(data => {
                        this.list = data.data.items;
                        this.total = data.data.total;
                    })
                }
                reset() {
                    super.reset();
                    this.paging.aduitStatus = this.currentStatus;
                }
                setSearchTypeArray() {
                    return [
                        new SearchType('公司中文名称', 2),
                        new SearchType('公司英文名称', 3),
                        new SearchType('商品名称', 1),
                    ];
                }
            }

            let defaultPaging = {
                // (审核状态(2待审核 3审核通过 -1不通过))
                'aduitStatus': 2,
                'pushDateStart': null,
                'pushDateEnd': null,
                'planFinshTimeStart': null,
                'planFinshTimeEnd': null,
                'page': 1,
                'pageSize': 10,
                // key=1 商品名称 key=2公司中文 key=3公司英文 
                'key': null,
                'value': null
            };

            let vm = $scope.vm = new SellerList(defaultPaging);

        }
    ])


    ng.controller('productDevDetailCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'marketDevMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            marketDevMgrService,
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
                    marketDevMgrService.getProductDevDetail({
                        'marketTabloidId': this.id
                    }).success(data => {
                        this.info = data.data;
                    })
                }

                toAudit(aduitStatus) {
                    $scope.ids = this.id;
                    $scope.aduitStatus = aduitStatus;
                    $scope.tools = this;
                    ngDialog.open({
                        template: 'confirmDlg',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: 'productDevAuditCtrl'
                    })

                }
            }

            let vm = $scope.vm = new Detail(id);
        }
    ])


    ng.controller('productDevAuditCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'marketDevMgrService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            marketDevMgrService,
            commonService
        ) {
            let tools = $scope.tools;

            class Audit {
                constructor(params) {
                    this.params = params;
                }
                submit() {
                    if (this.params.aduitStatus == -1 && commonTool.isEmpty(this.params.reason)) {
                        $rootScope.alertMsgService.setMessage("请先填写原因", 'warning');
                        return;
                    }
                    marketDevMgrService.auditProductDev(commonTool.filterParam(this.params)).success(data => {
                        if (data.status === 'success') {
                            tools.getSnsDetail();
                            $rootScope.alertMsgService.setMessage("审核成功");
                            $scope.closeThisDialog();
                        } else {
                            $rootScope.alertMsgService.setMessage("审核失败", 'warning');
                        }
                    })

                }
                close() {
                    $scope.closeThisDialog();
                }
            };
            const params = {
                'marketTabloidId': $scope.ids,
                'aduitStatus': $scope.aduitStatus
            };
            let vm = $scope.vm = new Audit(params);

        }
    ])





})