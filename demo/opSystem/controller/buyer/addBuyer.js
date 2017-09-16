/**
 *
 * @authors huangqinxian@cf-ec.com
 * @date    2016-07-12 16:48:03
 * @version 1.0
 */

define(['../module'], function(ng) {
    ng.factory('addBuyerService', ['$http', 'api',
        function($http, api) {
            return {
                saveBuyer: function(params) {
                    return $http.post(api.addBuyer, params);
                }
            };
        }
    ])
    ng.controller('addBuyerCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        '$controller', '$location', '$uibModal',
        'addBuyerService', 'commonService', 'commonTool',
        'Upload', 'api',
        function(
            $scope, $rootScope, ngDialog,
            $controller, $location, $uibModal,
            addBuyerService, commonService, commonTool,
            Upload, api) {
            var buyerInfo = $scope.buyerInfo = {
                address: null,
                annualTurnover: null,
                businessType: null,
                buyerPhoto: null,
                companyAddress: null,
                companyCountryId: null,
                companyDesc: null,
                companyFoundYear: null,
                companyLogo: null,
                companyName: null,
                companyType: null,
                companyNature: null,
                companyWebsite: null,
                companyZipCode: null,
                countryId: null,
                firstName: null,

                gender: 1,
                productType: null,
                mobile: null,
                registeredCapital: null,
                skype: null,
                staffSize: null,
                region: null,
                area: null,
                telephone: null,
                userEmail: null,
                username: null,
                yearBuyingAmt: null,
                zipCode: null,
                followBuyerLevel: '3',
                isFollowing: '1',
                followContent: null,
                flag: 1,
                mobileValidation: null,
                emailValidation: null
            }

            var vm = $scope.vm = {};
            // 存放方法
            var tools = $scope.tools = {};

            $rootScope.categoryArray = [];

            $.validator.addMethod('iswechat', function(value, element) {
                var wechat = /^[a-zA-Z0-9_-]*$/;
                return this.optional(element) || wechat.test(value);
            }, '只能包含数字、字母、下划线，中横线');

            var addbuyerformVal = $('#addbuyerform').validate({
                errorElement: "em",
                errorClass: "error-explain",
                validClass: "valid-explain",
                // success: "valid-explain",
                groups: {
                    gs_mobel: "buyerCountryCode buyerMobile",
                    gs_tel: "buyerRegion buyerArea buyerTelephone",
                    gs_follow: "followSignType followSignWay"
                },
                rules: {
                    userEmail: {
                        required: true,
                        email: true
                    },
                    firstName: {
                        required: true,
                        enStirng: true
                    },
                    address: {
                        enCode: true
                    },
                    countryId: {
                        required: true
                    },
                    companyName: {
                        required: true,
                        enCode: true
                    },
                    companyCountryId: {
                        required: true
                    },
                    zipCode: {
                        enNumberCode: true
                    },
                    companyZipCode: {
                        enNumberCode: true
                    },
                    skype: {
                        enCode: true
                    },
                    companyDesc: {
                        enCode: true
                    },

                    followBuyerLevel: {
                        required: true
                    },
                    buyerCountryCode: {
                        number: true
                    },
                    buyerMobile: {
                        number: true
                    },
                    buyerRegion: {
                        number: true
                    },
                    buyerArea: {
                        number: true
                    },
                    buyerTelephone: {
                        number: true
                    },
                    otherContact: {
                        maxlength: 30
                    },
                    buyerwhatsapp: {
                        maxlength: 20
                    },
                    buyerwechat: {
                        iswechat: true,
                        minlength: 5
                    }
                },
                messages: {

                }
            })

            vm = $.extend(vm, {
                gender: '1',
                countryArray: []
            });
            tools = $.extend(tools, {
                selectChange: function(name) {
                    var tmpObj = 'select[name="' + name + '"]';
                    $(tmpObj).valid();
                },
                saveBuyerInfo: function() {
                    console.log(buyerInfo);
                    if (!addbuyerformVal.form()) return;

                    if (commonTool.isEmpty(buyerInfo.countryId) || commonTool.isEmpty(buyerInfo.companyCountryId)) {
                        $rootScope.alertMsgService.setMessage('请选择国家', 'warning');
                        return;
                    }

                    buyerInfo.companyNature = method.getValInArray('companyNatureVal').join(',');
                    buyerInfo.companyType = method.getValInArray('companyTypeVal').join(',');

                    var tmpCateArr = [];
                    angular.forEach($rootScope.categoryArray, function(item) {
                        tmpCateArr.push(item.categoryId);
                    });
                    buyerInfo.productType = tmpCateArr.join(',');

                    buyerInfo.businessCooper = buyerInfo.businessCooper ? 1 : 0;
                    buyerInfo.otherExhibition = buyerInfo.otherExhibition ? 1 : 0;
                    buyerInfo.username = buyerInfo.userEmail;
                    buyerInfo.otherContact = buyerInfo.otherContact;
                    buyerInfo.wechat = buyerInfo.wechat;
                    buyerInfo.whatsapp = buyerInfo.whatsapp;
                    addBuyerService.saveBuyer(buyerInfo).success(function(data) {
                        if (data.type == "21") {
                            $rootScope.alertMsgService.setMessage(data.message, 'warning');
                        } else {
                            $location.path('/buyer/myfollow');
                        }
                    })
                },
                uploadImg: function(files, attrName) {
                    if (files && files.length > 0) {
                        var file = files[0];
                        if ((!/.*\.(png)|(PNG)|(jpg)|(JPG)|(gif)|(GIF)$/.test(file.name)) || file.size > 2 * 1024 * 1024) {
                            $rootScope.alertMsgService.setMessage("请重新选择图片,上传图片支持格式：png,jpg,gif;文件大小不超过2M", 'warning');
                            return false;
                        }
                        Upload.upload({
                            url: api.uploadContract,
                            file: file,
                            attrName: attrName

                        }).progress(function(evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        }).success(function(data, status, headers, config) {
                            buyerInfo[config.attrName] = data.data.url;
                        });
                    }

                },
                showPanel: function() {
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 660,
                        templateUrl: 'showPanel.html',
                        controller: 'showPanelCtrl',
                        title: "选择类目"
                    })
                },

            });


            var method = {
                key: "",
                value: "",
                // 定义对象
                myObject: function(key, value) {
                    this.key = key;
                    this.value = value;
                },
                getCompanyFoundYearArray: function() {
                    var currentYear = (new Date()).getFullYear();
                    var tmpArr = [];
                    for (var i = 1960; i <= currentYear; i++) {
                        tmpArr.push(new this.myObject(i, i));
                    }
                    return tmpArr;
                },
                getCompanyNatureArray: function() {
                    return [new this.myObject('制造商及大批发商', 101001), new this.myObject('中小批发商群体', 101002), new this.myObject('小零售商群体', 101003), new this.myObject('小贸易商群体', 101004), new this.myObject('其它群体', 101999)];
                },
                getCompanyTypeArray: function() {
                    return [new this.myObject('采购办事处', 100001), new this.myObject('制造商', 100002), new this.myObject('贸易公司', 100003), new this.myObject('批发商/经销商', 100004), new this.myObject('零售商', 100005), new this.myObject('经纪人/顾问委员会', 100006), new this.myObject('政府及机构', 100007), new this.myObject('其他', 100999)];
                },
                getYearBuyingAmtArray: function() {
                    return [new this.myObject('100万美元以下', 102001), new this.myObject('100-1000万美元', 102002), new this.myObject('1000-5000万美元', 102003), new this.myObject('5000万美元-1亿美元', 102004), new this.myObject('1亿美元或以上', 102005)];
                },
                getStaffSizeArray: function() {
                    return [new this.myObject('任意', 104000), new this.myObject('小于100', 104001), new this.myObject('100-499', 104002), new this.myObject('500-999', 104003), new this.myObject('1000-5000', 104004), new this.myObject('5000或以上', 104005)];
                },
                getRegisteredCapitalArray: function() {
                    return [new this.myObject('任意', 105000), new this.myObject('小于100万美元', 105001), new this.myObject('100-500万美元', 105002), new this.myObject('500-2000万美元', 105003), new this.myObject('2000-5000万美元', 105004), new this.myObject('5000万-1亿美元', 105005), new this.myObject('1-10亿美元', 105006), new this.myObject('10亿美元或以上', 105007)];
                },
                getAnnualTurnoverArray: function() {
                    return [new this.myObject('任意', 103000), new this.myObject('小于100万美元', 103001), new this.myObject('100-1000万美元', 103002), new this.myObject('1000-5000万美元', 103003), new this.myObject('5000万美元-1亿美元', 103004), new this.myObject('1亿美元或以上', 103005)];
                },
                getBusinessTypeArray: function() {
                    return [new this.myObject('生产企业', 1), new this.myObject('外贸企业', 1), new this.myObject('工贸企业', 1), new this.myObject('内贸企业', 1), new this.myObject('其他企业', 1)];
                },
                initFollowSign: function() {
                    return [
                        new this.myObject('Not a Buyer', 1),
                        new this.myObject('Bounce Email', 2),
                        new this.myObject('Buying Lead', 3),
                        new this.myObject('Phone Call Connected', 4),
                        new this.myObject('Phone Call Disconnected', 5),
                        new this.myObject('Not speak English', 6),
                        new this.myObject('Whatsapp', 7),
                        new this.myObject('Wechat', 8),
                        new this.myObject('Skype', 9),
                        new this.myObject('SNS', 10),
                        new this.myObject('Email', 11),
                        new this.myObject('No Instant Messenger', 12),
                        new this.myObject('Others', 13)
                    ];
                },
                getValInArray: function(name) {
                    var jqObj = 'input[name="' + name + '"]:checked';
                    var tmpArr = [];
                    $(jqObj).each(function(index, el) {
                        tmpArr.push($(el).val());
                    });
                    return tmpArr;
                }
            };

            init_data();

            function init_data() {
                commonService.getCountries().success(function(data) {
                    vm.countryArray = data.data;
                })
                vm.companyFoundYearArray = method.getCompanyFoundYearArray();
                vm.companyTypeArray = method.getCompanyTypeArray();
                vm.companyNatureArray = method.getCompanyNatureArray();
                vm.yearBuyingAmtArray = method.getYearBuyingAmtArray();
                vm.staffSizeArray = method.getStaffSizeArray();
                vm.registeredCapitalArray = method.getRegisteredCapitalArray();
                vm.annualTurnoverArray = method.getAnnualTurnoverArray();
                vm.businessTypeArray = method.getCompanyTypeArray();
                vm.newfollowSignWayArray = method.initFollowSign();
            }


        }
    ])

    ng.controller('showPanelCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        '$controller', '$location', 'addBuyerService',
        'commonService', 'commonTool',
        function(
            $scope, $rootScope, ngDialog,
            $controller, $location, addBuyerService,
            commonService, commonTool) {


            var vm = $scope.vm = {};
            var tools = $scope.tools = {};
            var tmpCateArray = [];

            tools = $.extend(tools, {
                submit: function() {
                    $('.ngdialog').css('overflow', 'auto');
                    ngDialog.closeAll();
                },
                close: function() {
                    $('.ngdialog').css('overflow', 'auto');
                    $rootScope.categoryArray = tmpCateArray;
                    ngDialog.closeAll();
                },
                getChildcate: function(parentId) {
                    commonService.getCategoryChildren({
                        parentId: parentId
                    }).success(function(data) {
                        if ('success' == data.status) {
                            vm.Childcate = data.data;
                        }
                    })
                },
                chooseCate: function(item) {
                    if ($rootScope.categoryArray.length >= 3) {
                        $rootScope.alertMsgService.setMessage('最多选择三个分类', 'warning');
                        return;
                    }
                    for (var i = 0; i < $rootScope.categoryArray.length; i++) {
                        if (item.categoryId == $rootScope.categoryArray[i].categoryId) {
                            return;
                        }
                    }

                    $rootScope.categoryArray.push(item);
                },
                delCategory: function(item) {
                    for (var i = 0; i < $rootScope.categoryArray.length; i++) {
                        if (item.categoryId == $rootScope.categoryArray[i].categoryId) {
                            $rootScope.categoryArray.splice(i, 1);
                            return;
                        }
                    }
                }
            });
            init_data();

            function init_data() {
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if ('success' == data.status) {
                        vm.firstLevelCate = data.data;
                        $('.ngdialog').css('overflow', 'hidden');
                    }
                });
                // 记录原来选择的类目
                for (var i = 0; i < $rootScope.categoryArray.length; i++) {
                    tmpCateArray.push($rootScope.categoryArray[i]);
                }
            }

        }
    ])

    ng.filter("getCategoryName", function() {
        return function(item) {
            if (item.length == 0) return;
            var tmpArr = [];
            for (var i = 0; i < item.length; i++) {
                tmpArr.push(item[i].categoryName);
            }
            return tmpArr.join(',');
        };
    })
    ng.filter('ngcSetImgSize', function() {
        return function(sImg, width, height, type, imgtype) {
            width = width ? width : '180';
            height = height ? height : '180';
            type = type ? 　type : '3';
            var img;
            if (sImg) {
                img = sImg.split(',')[0];
                img = imgUrl + img.slice(0, img.lastIndexOf('.')) + '_' +
                    width + 'x' + height + '_' + type + img.slice(img.lastIndexOf('.'));
            } else {
                if (imgtype == 1) {
                    img = '/view/images/default-user-logo.png'
                } else if (imgtype == 2) {
                    img = '/view/images/default-company-logo.jpg'
                } else {
                    img = '/view/images/default-img.jpg';
                }

            }
            return img;
        };
    })



});