define(['../module'], function(ng) {
    ng.factory('fansService', ['$http', 'api', function($http, api) {
        return {
            getFansList: function(paramsTmp) {
                let params = Object.assign({}, paramsTmp);
                if (params.searchKey && params.searchValue) {
                    switch (params.searchKey) {
                        // 1:公司中文名称 2:公司英文名称 3:届数 4:sellerId
                        case '1':
                            params.companyName = params.searchValue;
                            break;
                        case '2':
                            params.companyEnName = params.searchValue;
                            break;
                        case '3':
                            params.fairNo = params.searchValue;
                            break;
                        case '4':
                            params.sellerId = params.searchValue;
                            break;
                    }
                    delete params.searchKey;
                    delete params.searchValue;
                }
                return $http.get(api.getFansList, {
                    'params': params
                });
            },
            // 获取届数
            getArrayOfCfecTimes: function() {
                return $http.get(api.getArrayOfCfecTimes);
            },
            // 绑定互粉通
            addSellerFans: function(params) {
                return $http.post(api.addSellerFans, params);
            },
            // 修改互粉通
            updateSellerFans: function(params) {
                return $http.post(api.updateSellerFans, params);
            },
            // 获取供应商
            getSellerList: function(params) {
                return $http.get(api.getSellerList, {
                    'params': params
                })
            },
            // 互粉通详情
            getSellerFansDetail: function(params) {
                return $http.get(api.getSellerFansDetail, {
                    'params': params
                })
            }
        }
    }])

    ng.controller('fansCtrl', [
        '$scope',
        'commonTool',
        'fansService',
        'commonService',
        function(
            $scope,
            commonTool,
            fansService,
            commonService
        ) {

            let defaultPaging = {
                page: 1,
                pageSize: 10,

                searchKey: null,
                searchValue: null,
                // 届数
                fairNo: null
            };

            let List = commonService.getListClass();

            class FanList extends List {
                constructor(defaultPaging) {
                    super(defaultPaging);
                    // 搜索类型数组
                    this.companyTypeArray = [];
                    // 届数数组
                    this.cfecTimesArray = [];
                    this.init();
                }
                init() {
                    this.setCompanyTypeArray();
                    this.setCfecTimesArray();
                }
                getList() {
                    let self = this;
                    fansService.getFansList(this.paging).success(function(data) {
                        if (data.status === 'success') {
                            self.list = data.data.items;
                            self.total = data.data.total;
                        }
                    })
                }
                setCompanyTypeArray() {
                    class SearchType {
                        constructor(key, value) {
                            this.key = key;
                            this.value = value;
                        }
                    }
                    this.companyTypeArray = [
                        new SearchType('公司中文名称', '1'),
                        new SearchType('公司英文名称', '2')
                    ];
                }
                setCfecTimesArray() {
                    let self = this;
                    fansService.getArrayOfCfecTimes().success(function(data) {
                        self.cfecTimesArray = data.data.sessionList;
                    })
                }
            };

            let vm = $scope.vm = new FanList(defaultPaging);

        }
    ])


    ng.controller('BindFansCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'fansService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            fansService,
            commonService
        ) {

            let search = $location.search();

            $rootScope.hasSelectList = [];

            let defaultInfo = {
                sellerIds: null,
                fairNo: null,
                level: 10,
                sendTotal: 30
            };

            class Level {
                constructor(key, value) {
                    this.key = key;
                    this.value = value;
                }
            }

            class FanInfo {
                constructor() {
                    this.info = Object.assign({}, defaultInfo);
                    this.isNotify = false;
                    this.levelList = [];
                    this.init();
                }

                init() {
                    this.isNotify = $location.search().type == 1;

                    this.setArrayOfCfecTimes();
                    this.levelList = this.setLevelList();

                    if (this.isNotify) {
                        this.getSellerFansDetail();
                    }
                }

                selectSeller() {
                    let self = this;
                    ngDialog.open({
                        template: 'addSeller.html',
                        controller: 'fansSelectSellerCtrl',
                        width: 900,
                        title: '选择供应商',
                        scope: $scope
                    })
                }

                chxLevel() {
                    var value = null;
                    switch (this.info.level) {
                        case 10:
                            value = 30;
                            break;
                        case 20:
                            value = 50;
                            break;
                        case 30:
                            value = 100;
                            break;
                        default :

                            break;
                    }
                    if (value) {
                        this.info.sendTotal = value;
                    }
                }

                getSellerFansDetail() {
                    let fansId = $location.search().fansId;
                    if (!fansId) return;
                    let self = this;
                    fansService.getSellerFansDetail({
                        'fansId': fansId
                    }).success(function(data) {
                        if (data.status === 'success') {
                            console.log(data.data.sellerFans);
                            let keyArray = "level,fairNo,sendTotal".split(',');
                            keyArray.forEach((value, index) => {
                                self.info[value] = data.data.sellerFans[value];
                            });
                        }
                    })
                }

                delSelectSeller(index) {
                    $rootScope.hasSelectList.splice(index, 1);
                }

                setLevelList() {
                    return [new Level('初级版', 10), new Level('中级版', 20), new Level('高级版', 30)];
                }
                setArrayOfCfecTimes() {
                    let self = this;
                    fansService.getArrayOfCfecTimes().success(function(data) {
                        if (data.status === 'success') {
                            self.cfecTimesArray = data.data.sessionList;
                            self.info.fairNo = self.cfecTimesArray[0].sesId;
                        }
                    })
                }
                updateInfo() {
                    delete this.info.sellerIds;
                    this.info.fansId = $location.search().fansId;
                    this.updateInfoHttp(this.info);
                }
                addInfo() {
                    let array = $rootScope.hasSelectList;
                    if (!array.length) {
                        $rootScope.alertMsgService.setMessage('请选择供应商', 'warning');
                        return;
                    }
                    if (commonTool.isEmpty(this.info.sendTotal)) {
                        $rootScope.alertMsgService.setMessage('请填写扫描上限数', 'warning');
                        return;
                    }

                    if (Number(this.info.sendTotal) <= 0) {
                        $rootScope.alertMsgService.setMessage('扫描上限数必需大于0', 'warning');
                        return;
                    }
                    let sellerIdArray = [];
                    angular.forEach(array, function(item) {
                        sellerIdArray.push(item.sellerId);
                    })

                    this.info.sellerIds = sellerIdArray.join(',');
                    // console.log(this.info);
                    this.addInfoHttp(this.info);
                }
                addInfoHttp(params) {
                    fansService.addSellerFans(params).success(function(data) {
                        if (data.status === 'success') {
                            let message = '';
                            if (data.data) {
                                let list = data.data;
                                list.forEach(v => {
                                    message += `${v.companyId} ${v.opRemark} `;
                                })
                            }
                            message = message ? message : data.message;
                            $rootScope.alertMsgService.setMessage(message, 'success');
                            $location.url('/seller/fans');
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                }
                updateInfoHttp(params) {
                    fansService.updateSellerFans(params).success(function(data) {
                        if (data.status === 'success') {
                            $rootScope.alertMsgService.setMessage(data.message, 'success');
                            $location.url('/seller/fans');
                        } else {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        }
                    })
                }
                back() {
                    $location.url('/seller/fans');
                }
            }

            let vm = $scope.vm = new FanInfo();

        }
    ])


    ng.controller('fansSelectSellerCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'fansService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            fansService,
            commonService
        ) {

            class Seller {
                constructor(sellerId, companyName) {
                    this.sellerId = sellerId;
                    this.companyName = companyName;
                }
            }

            class SearchType {
                constructor(key, value) {
                    this.key = key;
                    this.value = value;
                }
            }

            class sellerList {
                constructor(defaultPaging, array) {
                    this.paging = Object.assign({}, defaultPaging);
                    this.list = [];
                    this.pages = [];
                    this.init();
                    this.selectSellerList = Array.from(array);
                }
                init() {
                    this.getSellerList();
                    this.pages = commonService.setPageSizeArray(10, 30, 50);
                    this.searchTypeArray = this.setSearchTypeArray();
                }
                setSearchTypeArray() {
                    return [new SearchType('公司中文名称', 'companyName'), new SearchType('公司英文名称', 'companyEnName'), new SearchType('供应商ID', 'sellerId')];
                }
                getSellerList() {
                    let self = this;
                    fansService.getSellerList(commonTool.filterParam(this.paging)).success(function(data) {
                        if (data.status === 'success') {
                            self.list = data.data.items;
                            self.total = data.data.count;
                            self.initList();
                        }
                    })
                }
                initList() {
                    for (let i = 0, len = this.list.length; i < len; i++) {
                        let item = this.list[i];
                        item.isSelected = false;
                        for (let j = 0, jlen = this.selectSellerList.length; j < jlen; j++) {
                            let selectItem = this.selectSellerList[j];
                            if (selectItem.sellerId == item.sellerId) {
                                item.isSelected = true;
                            }
                        }
                    }
                }
                getnewpage(type) {
                    if (type == 1) {
                        this.paging.page = this.newpagesize;
                        this.newpagesize = null;
                    } else if (type == 0) {
                        this.paging.page = 1;
                    }
                    this.getSellerList();
                }
                selected(item) {
                    item.isSelected = !item.isSelected;
                    if (item.isSelected) {
                        this.selectSellerList.push(new Seller(item.sellerId, item.companyName));
                    } else {
                        for (let i = 0, len = this.selectSellerList.length; i < len; i++) {
                            let sellerItem = this.selectSellerList[i];
                            if (item.sellerId == sellerItem.sellerId) {
                                this.selectSellerList.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
                search() {
                    this.paging.page = 1;
                    this.getSellerList();
                }
                reset() {
                    this.paging = Object.assign({}, defaultPaging);
                }
                save() {
                    $rootScope.hasSelectList = Array.from(this.selectSellerList);
                    $scope.closeThisDialog();
                }
                cancel() {
                    $scope.closeThisDialog();
                }
            }

            let defaultPaging = {
                page: 1,
                pageSize: 10,

                qKey: null,
                qValue: null
            };

            let vm = $scope.vm = new sellerList(defaultPaging, $rootScope.hasSelectList);
        }
    ])


    ng.controller('fansDetailCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        'commonTool',
        'ngDialog',
        'fansService',
        'commonService',
        function(
            $scope,
            $rootScope,
            $location,
            commonTool,
            ngDialog,
            fansService,
            commonService
        ) {

            class FansDetail {
                constructor(fansId) {
                    this.fansId = fansId;
                    this.info = null;
                    this.logList = [];
                    this.init();
                }

                init() {
                    this.getSellerFansDetail();
                }

                getSellerFansDetail() {
                    if (!this.fansId) return;
                    let self = this;
                    fansService.getSellerFansDetail({
                        'fansId': this.fansId
                    }).success(function(data) {
                        if (data.status === 'success') {
                            self.info = data.data.sellerFans;
                            self.logList = data.data.log.items;
                        }
                    })
                }

            }

            let fansId = $location.search().fansId;

            let vm = $scope.vm = new FansDetail(fansId);
        }
    ])


    ng.filter('levelFilter', function() {
        return function(level) {
            switch (level) {
                case 10:
                    return '初级版';
                case 20:
                    return '中级版';
                case 30:
                    return '高级版';
                default:
                    return '';
            }
        }
    })



})