/**
 *
 * @authors huangqinxian@cf-ec.com
 * @date    2016-07-18 10:16:03
 * @version 1.0
 */

define(['../module'], function(ng) {
    ng.factory('addpurchaseService', ['$http', 'api',
        function($http, api) {
            return {
                addPurchase: function(params) {
                    return $http.post(api.addpurchase, params);
                },
                cfecSendProcurement: function(params) {
                    return $http.get(api.cfecSendProcurement, {
                        'params': params
                    });
                },
                getSuggestCategory: function(params) {
                    return $http.get(api.getSuggestCategory, {
                        'params': params
                    });
                },
                getCategoryProperties: function(params) {
                    return $http.get(api.getCategoryProperties, {
                        'params': params
                    });
                },
                getCategoryPath: function(params) {
                    return $http.get(api.getCategoryPath, {
                        'params': params
                    });
                }
            };
        }
    ])
    ng.controller('addpurchaseCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        'ngDialog',
        '$controller',
        '$location',
        '$uibModal',
        'addpurchaseService',
        'commonService',
        'commonTool',
        'Upload',
        'api',
        function($scope, $rootScope, $window, ngDialog, $controller, $location, $uibModal, addpurchaseService, commonService, commonTool, Upload, api) {

            var newTools = $scope.newTools;
            var apSource = $scope.apSource;
            console.log(apSource);
            var purchaseInfo = $scope.purchaseInfo = {
                publisherId: $scope.publisherId,
                productCategoryId: null,
                productName: null,
                productDes: null,
                attachmentName: null,
                attachmentUrl: null,
                expectPriceUnit: null,
                expectUnit: 'Pieces',
                expectNum: null,
                endTime: null,
                trading: null,
                expectPrice: null,
                portOfArrival: null,
                paymentMethod: null,
                expect: null,
                supplierRequired: null
            };


            var vm = $scope.vm = {};
            var tools = $scope.tools = {};

            $rootScope.hasSelectCate = null;

            vm.priceType = 1;

            $.validator.addMethod('checkNoRepeat', function(str, element) {
                var rs = true; // 校验通过
                // 将所有非字母替换为空格,再以空格分隔
                var strSpace = " " + str.replace(/[^a-zA-Z]+/g, " ") + " ";
                var strs = strSpace.replace(/(^\s*)|(\s*$)/g, '').split(" ");

                if (strs.length < 3) {
                    return rs;
                }
                for (var i = 0; i < strs.length; i++) {
                    var tmp = strs[i];
                    // 连续三次
                    var rp3 = new RegExp('[^A-Za-z](' + tmp + ' ){3,}', 'g');
                    if (rp3.test(strSpace)) {
                        rs = false;
                        break;
                    } else if (strSpace.split(tmp + " ").length >= 4) {
                        // 出现4次
                        var ct = 0;
                        for (var j = i + 1; j < strs.length; j++) {
                            if (strs[j] === tmp) {
                                ++ct;
                                if (ct >= 3) {
                                    rs = false;
                                    break;
                                }
                            }
                        }

                        if (rs === false) {
                            break;
                        }
                    }

                }
                return rs;
            }, 'Keywords stuffing may affect your search ranking.');

            $.validator.addMethod("regNum", function(value, element) {
                return this.optional(element) || /^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value);
            }, "Please enter the Correct number");

            $.validator.addMethod("checkTenTwoNumber", function(value, element) {
                return this.optional(element) || /^[1-9]\d*$/.test(value);
            }, "Please enter the amount of 1~999999999");

            $.validator.addMethod("checkCate", function(value, element) {
                if (value == null || value == undefined || value == '' || value == 'number:-1') return false;
                return true;
            }, "必须填写");

            $.validator.addMethod('checkPurchaseQuantity', function(value, element) {
                return vm.priceType === '2' || !commonTool.isEmpty(purchaseInfo.expectNum);
            }, '必须填写');

            var addpurchaseformVal;

            vm = $.extend(vm, {
                fileArray: [],
            })

            vm.isSubmit = false;

            function File(filename, uploadurl) {
                this.filename = filename;
                this.uploadurl = uploadurl;
            }

            var method = {
                key: "",
                value: "",
                initObjByValue: function(value) {
                    this.value = value;
                    this.flag = false;
                },
                initObj: function(key, value) {
                    this.key = key;
                    this.value = value;
                    this.flag = false;
                },
                getRequirementsArray: function() {
                    var tmpArray = [new this.initObjByValue("Gold Supplier"), new this.initObjByValue("Audited Supplier"), new this.initObjByValue("Verified Supplier")];
                    return tmpArray;
                },
                getExpectationArray: function() {
                    var tmpArray = [new this.initObj("Detailed Specification/Categories", "Detailed Specification/Categories"), new this.initObj("Detailed Price List", "Detailed Price List "), new this.initObj("Certificates", "Certificates"), new this.initObj("Others", "")];
                    return tmpArray;
                },
                getTradeArray: function() {
                    var tmpArray = [new this.initObj("FOB", "FOB"), new this.initObj("EXW", "EXW"), new this.initObj("FAS", "FAS"), new this.initObj("FCA", "FCA"), new this.initObj("CFR", "CFR"), new this.initObj("CPT", "CPT"), new this.initObj("CIF", "CIF"), new this.initObj("CIP", "CIP"), new this.initObj("DES", "DES"), new this.initObj("DAF", "DAF"), new this.initObj("DEQ", "DEQ"), new this.initObj("DDP", "DDP"), new this.initObj("DDU", "DDU"), new this.initObj("CPT", "CPT")];
                    return tmpArray;
                },
                // 方法：格式化时间
                formatDate: function(n) {
                    var time = new Date().getTime() + n * 1000 * 3600 * 24;
                    var d = new Date(time);
                    var str = d.getUTCFullYear() + "-" + ("00" + (d.getUTCMonth() + 1)).slice(-2) + "-" + ("00" + d.getUTCDate()).slice(-2);
                    return str;
                }

            }

            init_data();

            vm.propMatchArray = [];



            var textareaId = 'description';
            var TEXTAREA_DOM = '#' + textareaId;

            // 提示列表
            var MATCH_KEY_DOM = '.match-key-list';

            var MATCH_VAL_DOM = '.match-val-list';

            function init_data() {
                purchaseInfo.endTime = method.formatDate(30);
                vm.requirementsArray = method.getRequirementsArray();
                vm.expectationArray = method.getExpectationArray();


                // 查字典表
                commonService.getDictItems('order_unit,payment_terms').success(function(data) {
                    vm.expectUnitArray = data.order_unit;
                    vm.tradeArray = method.getTradeArray();
                    vm.paymentArray = data.payment_terms;
                    addpurchaseformVal = $('#addpurchaseform').validate({
                        errorElement: "em",
                        errorClass: "error-explain",
                        validClass: "valid-explain",
                        groups: {
                            gs: "purchaseQuantity expectUnit"
                        },
                        rules: {
                            productName: {
                                required: true,
                                maxlength: 250,
                                checkNoRepeat: true
                            },
                            description: {
                                required: true,
                                rangelength: [20, 8000]
                            },
                            sugcategory: {
                                checkCate: true
                            },
                            purchaseQuantity: {
                                checkPurchaseQuantity: true,
                                checkTenTwoNumber: true,
                                number: true
                            },
                            expectPrice: {
                                regNum: true
                            },
                            expiredDate: {
                                required: true
                            },
                            otherText: {
                                maxlength: 250,
                                minlength: 2,
                                // En3: true
                            },
                            portOfArrival: {
                                maxlength: 50,
                                minlength: 2,
                                // En3: true,
                                // symbolEn: true
                            }
                        },
                        messages: {

                        }
                    });
                    $(TEXTAREA_DOM).focus(function() {
                        var categoryId = $rootScope.selectedCategory.categoryId;
                        if (commonTool.isEmpty(categoryId) || categoryId == -1) return;
                        tools.getPropMatchArray();

                    });
                    $(TEXTAREA_DOM).blur(function(event) {
                        vm.propMatchArray = [];
                    });

                    $(document).off('keydown').on('keydown', TEXTAREA_DOM, function(event) {
                        var keyCode = event.keyCode;
                        // Esc:27; UpArrow:38; DwArrow:40 Enter:13 
                        switch (keyCode) {
                            case 13:
                                tools.checkKeyboardEnter(event);
                                break;
                            case 38:
                            case 40:
                                tools.checkKeyboardUpOrDown(event);
                                break;
                            case 27:
                                tools.checkKeyboardEsc(event)
                                break;
                            default:
                                break;
                        }
                    });
                    $(document).off('keyup').on('keyup', TEXTAREA_DOM, function(event) {
                        var keyCode = event.keyCode;
                        switch (keyCode) {
                            case 13:
                            case 38:
                            case 40:
                            case 27:
                                return;
                            default:
                                break;
                        }
                        tools.checkKeyboardCode(event);
                    });

                })
            };



            var notFindObj = {
                categoryCascade: "Don't find?Choose my Category",
                categoryId: -1
            };

            $rootScope.selectedCategory = {
                categoryId: -1,
                categoryOfSuggestAarry: []
            }
            $rootScope.selectedCategory.categoryOfSuggestAarry.push(notFindObj);

            vm.skuList = [];

            tools = $.extend(tools, {
                checkFormValid: function() {
                    var productNameValid = $('#productName').valid(),
                        descriptionValid = $('#description').valid(),
                        categoryIdValid = $('#sugcategory').valid(),
                        purchaseQuantityValid = $('#purchaseQuantity').valid();
                    return productNameValid && descriptionValid && categoryIdValid && purchaseQuantityValid;
                },
                getSkuData: function() {
                    var categoryId = $rootScope.selectedCategory.categoryId;
                    if (commonTool.isEmpty(categoryId)) return;

                    addpurchaseService.getCategoryPath({
                        'categoryId': categoryId,
                        'noIndus': true
                    }).success(function(data) {
                        if (data.status === 'success') {
                            // var newJson = $.extend(true,{}, json);
                            var param = {
                                categoryStructureEn: data.data.categoryStructureEn,
                                productName: purchaseInfo.productName,
                                productCategoryId: categoryId,
                                productDes: $('#description').val(),
                                attachArray: vm.fileArray.slice(0),
                                expectNum: purchaseInfo.expectNum,
                                expectUnit: purchaseInfo.expectUnit,
                                boothProcurement: purchaseInfo.boothProcurement,
                                priceType: vm.priceType
                            };
                            vm.skuList.push(param);
                            // console.log(vm.skuList);
                            tools.clearSkuData();
                        }
                    })
                },
                addSkuItem: function() {
                    if (!this.checkFormValid()) return;
                    this.getSkuData();
                },
                clearSkuData: function() {

                    purchaseInfo.productName = null
                    purchaseInfo.productDes = null;
                    vm.fileArray = [];
                    purchaseInfo.expectNum = null;
                    purchaseInfo.expectUnit = 'Pieces';
                    purchaseInfo.boothProcurement = null;
                    $rootScope.selectedCategory = {
                        categoryId: -1,
                        categoryOfSuggestAarry: []
                    }
                    $rootScope.selectedCategory.categoryOfSuggestAarry.push(notFindObj);
                    vm.priceType = 1;
                },
                setSkuData: function(index) {
                    var item = vm.skuList[index];
                    purchaseInfo.productName = item.productName;
                    purchaseInfo.productDes = item.productDes;
                    vm.fileArray = item.attachArray.slice(0);
                    purchaseInfo.expectNum = item.expectNum;
                    purchaseInfo.expectUnit = item.expectUnit;
                    purchaseInfo.boothProcurement = item.boothProcurement;
                    $rootScope.selectedCategory = {
                        categoryId: item.productCategoryId,
                        categoryOfSuggestAarry: []
                    }
                    var categotyObj = {
                        categoryCascade: item.categoryStructureEn,
                        categoryId: item.productCategoryId
                    };
                    $rootScope.selectedCategory.categoryOfSuggestAarry.push(categotyObj);
                    $rootScope.selectedCategory.categoryOfSuggestAarry.push(notFindObj);
                    console.log(item.priceType);
                    if (item.priceType == 1) {
                        vm.priceType = '1';
                    } else {
                        purchaseInfo.expectNum = null;
                        vm.priceType = '2';
                    }
                    setTimeout(function() {
                        var productNameValid = $('#productName').valid(),
                            descriptionValid = $('#description').valid(),
                            categoryIdValid = $('#sugcategory').valid(),
                            purchaseQuantityValid = $('#purchaseQuantity').valid();
                    }, 1000);
                },
                editSku: function(index) {
                    this.setSkuData(index);
                    vm.skuList.splice(index, 1);

                },
                delSku: function(index) {
                    // vm.skuList.splice(index, 1);
                    ngDialog.openConfirm({
                        title: '提示',
                        template: 'delPurItemDlg',
                        scope: $scope,
                        controller: 'delPurItemCtrl'
                    }).then(function(yes) {
                        vm.skuList.splice(index, 1);
                    }, function(no) {
                        // 取消
                    });
                },
                productNameChange: function() {
                    if (commonTool.isEmpty(purchaseInfo.productName)) {
                        $rootScope.selectedCategory.categoryOfSuggestAarry = [];
                        $rootScope.selectedCategory.categoryOfSuggestAarry.push(notFindObj);
                        $rootScope.selectedCategory.categoryId = -1;
                        return;
                    }

                    addpurchaseService.getSuggestCategory({
                        prefix: purchaseInfo.productName
                    }).success(function(data) {
                        if (data.status === 'success') {
                            $rootScope.selectedCategory.categoryOfSuggestAarry = data.data;
                            $rootScope.selectedCategory.categoryId = data.data[0].categoryId;
                        } else {
                            $rootScope.selectedCategory.categoryOfSuggestAarry = data.data;
                            $rootScope.selectedCategory.categoryId = -1;
                        }

                    })
                },
                categoryChange: function() {
                    if (commonTool.isEmpty($rootScope.selectedCategory.categoryId)) return;
                    if ($rootScope.selectedCategory.categoryId == -1) {
                        this.selectCate();
                    }
                },
                submit: function() {


                    if (!addpurchaseformVal.form()) return;

                    var lastObj = {
                        productName: purchaseInfo.productName,
                        productCategoryId: $rootScope.selectedCategory.categoryId,
                        productDes: $('#description').val(),
                        attachArray: vm.fileArray.slice(0),
                        expectNum: purchaseInfo.expectNum,
                        expectUnit: purchaseInfo.expectUnit,
                        boothProcurement: purchaseInfo.boothProcurement,
                        priceType: vm.priceType
                    };
                    vm.skuList.push(lastObj);


                    var tmpRequirements = [];
                    angular.forEach(vm.requirementsArray, function(item) {
                        if (item.flag) {
                            tmpRequirements.push(item.value);
                        }
                    });

                    var tmpExpectation = [];
                    angular.forEach(vm.expectationArray, function(item) {
                        if (item.flag) {
                            tmpExpectation.push(item.value);
                        }
                    });



                    vm.isSubmit = true;

                    purchaseInfo.boothProcurement = purchaseInfo.boothProcurement ? 1 : 0;

                    purchaseInfo.productDes = $('#description').val();


                    var commonObj = {
                        publisherId: purchaseInfo.publisherId,
                        // Valid Time
                        endTime: purchaseInfo.endTime,
                        // Preferred prices
                        trading: purchaseInfo.trading,
                        expectPrice: purchaseInfo.expectPrice,
                        expectPriceUnit: purchaseInfo.expectPriceUnit,
                        // Port of Destination
                        portOfArrival: purchaseInfo.portOfArrival,
                        // Types of Payment
                        paymentMethod: purchaseInfo.paymentMethod,
                        // Expectation
                        expect: tmpExpectation.join(','),
                        // Supplier requirements
                        supplierRequiredStr: tmpRequirements.join(',')
                    };

                    for (var i = 0, len = vm.skuList.length; i < len; i++) {
                        var item = vm.skuList[i];
                        delete item.categoryStructureEn;

                        var tmpAttachmentName = [];
                        var tmpAttachmentUrl = [];

                        angular.forEach(item.attachArray, function(fileitem) {
                            tmpAttachmentName.push(fileitem.filename)
                            tmpAttachmentUrl.push(fileitem.uploadurl)
                        });

                        item.attachmentName = tmpAttachmentName.join(',');
                        item.attachmentUrl = tmpAttachmentUrl.join(',');
                        delete item.attachArray;

                        if (item.priceType == 1) {
                            item.moq = 0;
                        } else {
                            item.moq = 1;
                            item.expectNum = "";
                            item.expectUnit = "";
                        }

                        delete item.priceType;


                        item.boothProcurement = item.boothProcurement ? 1 : 0;
                        item = $.extend(item, commonObj);
                        console.log(i, item);

                    }

                    if (commonTool.isEmpty(purchaseInfo.publisherId)) {

                        var params = {
                            buyerId: $scope.cfecBuyerId,
                            valid: 1
                        };
                        addpurchaseService.cfecSendProcurement(params).success(function(data) {
                            if (data.status === 'success' && data.type === '200') {
                                var newPublisherId = data.data;
                                var newBuyerId = data.message;
                                for (var i = 0, len = vm.skuList.length; i < len; i++) {
                                    vm.skuList[i].publisherId = newPublisherId;
                                }
                                var pur_params = {
                                    uploadStr: JSON.stringify(vm.skuList)
                                };
                                addpurchaseService.addPurchase(pur_params).success(function(data) {

                                    if (data.status === 'success') {
                                        $rootScope.alertMsgService.setMessage('发布成功', 'success');
                                        $scope.closeThisDialog();
                                        tools.actionAfterSubmitByCfec(newBuyerId);
                                    }
                                })
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    } else {
                        var pur_params = {
                            uploadStr: JSON.stringify(vm.skuList)
                        };
                        addpurchaseService.addPurchase(pur_params).success(function(data) {
                            if (data.status === 'success') {
                                $rootScope.alertMsgService.setMessage('发布成功', 'success');
                                $scope.closeThisDialog();
                                tools.actionAfterSubmitByPalt();
                            } else {
                                $rootScope.alertMsgService.setMessage(data.message, 'warning');
                            }
                        })
                    }
                },
                actionAfterSubmitByPalt: function() {
                    switch (apSource) {

                        case 'buyerDetail':
                            // 买家详情页
                            newTools.getBuyerPurchaseList();
                            break;

                        case 'followList':
                            // 采购商跟进清单
                            newTools.getPaltBuyerInfo($scope.buyerId);
                            break;
                        default:
                            break;
                    }
                },
                actionAfterSubmitByCfec: function(buyerId) {
                    switch (apSource) {

                        case 'cfecBuyerDetail':
                            // 买家详情页
                            window.location.href = "/#/buyer/detail?buyerId=" + buyerId + '&tab=1';
                            break;

                        case 'followList':
                            // 采购商跟进清单
                            newTools.getFollowListOfCfec();
                            $window.open("/#/buyer/detail?buyerId=" + buyerId + '&tab=1');
                            break;
                        default:
                            break;
                    }
                },
                followListCfecAction: function(buyerId) {
                    newTools.getFollowListOfCfec();
                    $scope.buyerId = buyerId;
                    ngDialog.open({
                        template: './controller/buyer/dialogTmp/confirmdDlg.html',
                        width: 500,
                        title: '确认',
                        scope: $scope,
                        controller: 'confirmCfecCtrl'
                    })
                },
                close: function() {
                    $scope.closeThisDialog();
                },
                uploadFile: function(file) {
                    if (commonTool.isEmpty(file)) return;

                    var myFiles = file;
                    if (vm.fileArray.length + myFiles.length > 8) {
                        $rootScope.alertMsgService.setMessage("最多不能超过8个附件", 'warning');
                        return false;
                    }
                    for (var i = 0, len = myFiles.length; i < len; i++) {
                        var fileItem = myFiles[i]
                        if ((!/.*\.(jpg)|(jpeg)|(gif)|(png)|(doc)|(docx)|(xls)|(xlsx)|(ppt)|(pdf)$/.test(fileItem.name)) || fileItem.size > 2 * 1024 * 1024) {
                            $rootScope.alertMsgService.setMessage("请重新支持格式：jpg/jpeg/gif/png/doc/docx/xls/xlsx/ppt/pdf;文件大小不超过2M", 'warning');
                            return false;
                        }
                    }
                    for (var k = 0, len = myFiles.length; k < len; k++) {
                        var fileItem = myFiles[k]
                        Upload.upload({
                            url: api.uploadContract,
                            file: fileItem
                        }).success(function(data, status, headers, config) {
                            var tmpFile = new File(config.file.name.replace(',', ' '), data.data.url);
                            vm.fileArray.push(tmpFile);
                        });
                    }
                },
                delFile: function(index) {
                    vm.fileArray.splice(index, 1);
                },
                selectCate: function() {
                    ngDialog.open({
                        appendClassName: "dialog-activeM",
                        scope: $scope,
                        animation: true,
                        width: 1200,
                        templateUrl: 'showPanel.html',
                        controller: 'purSelectCateCtrl',
                        title: "选择类目"
                    })
                },
                getPropMatchArray: function() {
                    var categoryId = $rootScope.selectedCategory.categoryId;
                    addpurchaseService.getCategoryProperties({
                        'lastCategoryId': categoryId
                    }).success(function(data) {
                        propMatchArray = data.data.properties;
                        vm.propMatchArray = propMatchArray;
                    })

                },
                checkPrice: function() {
                    $('#purchaseQuantity').valid();
                }
            });



            tools = $.extend(tools, {
                isEmpty: function(param) {
                    if (param == null || param == undefined || param == '') {
                        return true;
                    }
                    return false;
                },
                //
                setPropTips: function() {
                    if (propMatchArray == null || propMatchArray == undefined || propMatchArray.length <= 0) {
                        $(TEXTAREA_TIPS_DOM).css("display", "block");
                        $(TEXTAREA_TIPS_DOM).find('p').remove();
                        $(TEXTAREA_TIPS_DOM).append(TEXTAREA_TIPS_COMMON_HTML);
                        return;
                    }
                    var tmpPropTipsHtml = '';
                    tmpPropTipsHtml += TEXTAREA_TIPS_HEAD_HTML;
                    for (var i = 0, len = propMatchArray.length; i < len; i++) {
                        var item = propMatchArray[i];
                        tmpPropTipsHtml += '<p>' + item.propertyEnName + '</p>'
                    }
                    $(TEXTAREA_TIPS_DOM).find('p').remove();
                    $(TEXTAREA_TIPS_DOM).append(tmpPropTipsHtml);
                },
                // 
                getCursorPosition: function() {
                    var oTxt1 = document.getElementById(textareaId);
                    var cursurPosition = -1;
                    if (oTxt1.selectionStart) {
                        // 非IE浏览器
                        cursurPosition = oTxt1.selectionStart;
                    } else {
                        // IE
                        var range = document.selection.createRange();
                        range.moveStart("character", -oTxt1.value.length);
                        cursurPosition = range.text.length;
                    }
                    return cursurPosition;
                },
                MoveCursortoPos: function(pos) {
                    //定位光标到某个位置    
                    var obj = document.getElementById(textareaId);
                    pos = pos ? pos : obj.value.length;
                    if (obj.createTextRange) {
                        var range = obj.createTextRange();
                        range.moveStart("character", pos);
                        range.collapse(true);
                        range.select();
                    } else {
                        obj.setSelectionRange(obj.value.length, pos);
                    }
                    obj.focus();
                },
                // 判断是否是字母
                isLetter: function(value) {
                    return /[a-zA-Z]/g.test(value);
                },
                // 根据特殊字符切割文本
                getSplitArray: function(param) {
                    return param.match(/[a-zA-Z]{1,}/g);
                },

                getPosition: function(str) {
                    var myPosition = {
                        // 宽是通过计算 换行符切割 数组的最后一个 的字符串 到光标的 距离
                        x: 0,
                        // 高是通过换行符的个数来计算
                        y: 0
                    }
                    if (/\n/g.test(str)) {
                        myPosition.y = str.match(/\n/ig).length;
                    } else {
                        myPosition.y = 0;
                    }

                    // console.log(myPosition);
                    if (myPosition.y >= 1) {
                        var target_index = str.lastIndexOf(str.match(/\n/ig)[0]);
                        myPosition.x = str.length - target_index - 1;
                    } else {
                        myPosition.x = str.length;
                    }

                    return myPosition;
                },
                getStrBeforeCursor: function() {
                    return $(TEXTAREA_DOM).val().substring(0, this.getCursorPosition());
                },
                getPropMathKeyList: function(target_str, targetPosition) {
                    if ($(MATCH_KEY_DOM).length) $(MATCH_KEY_DOM).remove();
                    if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();
                    if (propMatchArray == null || propMatchArray.length <= 0) {
                        return;
                    }
                    var matchKeyArray = [];

                    for (var i = 0; i < propMatchArray.length; i++) {
                        var item = propMatchArray[i];
                        if (item.propertyEnName.toLowerCase().indexOf(target_str.toLowerCase()) == 0) {
                            matchKeyArray.push(item.propertyEnName);
                        }
                    }

                    if (matchKeyArray.length <= 0) return;

                    var mathKeyHtml = '';
                    mathKeyHtml += '<ul class="match-key-list"' + 'data-str="' + target_str + '"' + '>';
                    for (var i = 0; i < matchKeyArray.length; i++) {
                        var item = matchKeyArray[i];
                        mathKeyHtml += '  <li>' + item + '</li>';
                    }
                    mathKeyHtml += ' </ul>';

                    $('.form-desc').append(mathKeyHtml);
                    $(MATCH_KEY_DOM).css({
                        top: 30 + targetPosition.y * 20 + 'px',
                        left: 230 + targetPosition.x * 5 + 'px'
                    });

                    $(MATCH_KEY_DOM).find('li').eq(0).addClass('active');

                    $(MATCH_KEY_DOM).find('li').on('click', function(event) {
                        var tmp_str = $(MATCH_KEY_DOM).attr('data-str');
                        var exchange_str = $(this).text();
                        tools.exchangeKeyStr(tmp_str, exchange_str);
                    });
                },
                // 按照最后一个匹配的字符串来替换
                replaceOfLastMatch: function(target, substr, replacement) {
                    return target.substring(0, target.lastIndexOf(substr)) + replacement + target.substring(target.lastIndexOf(substr) + substr.length, target.length);
                },

                exchangeKeyStr: function(substr, replacement) {
                    // 替换符合
                    var sub_textAreaVal = this.replaceOfLastMatch(this.getStrBeforeCursor(), substr, replacement);

                    sub_textAreaVal += $(MATCH_KEY_DOM).length ? ' : ' : ' ';

                    // 替换文本
                    var tmp_textAreaVal = $(TEXTAREA_DOM).val().replace(target_textAreaVal, sub_textAreaVal);
                    // 赋值
                    $(TEXTAREA_DOM).val(tmp_textAreaVal);



                    this.MoveCursortoPos(sub_textAreaVal.length + 1);
                    target_textAreaVal = sub_textAreaVal;

                    if ($(MATCH_KEY_DOM).length) {
                        $(MATCH_KEY_DOM).remove();
                        this.showPropMathValue(replacement, sub_textAreaVal);
                    } else {
                        if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();
                    }

                    return true;
                },
                getMatchPropValueArray: function(replacement) {
                    for (var i = 0, len = propMatchArray.length; i < len; i++) {
                        var item = propMatchArray[i];
                        if (item.propertyEnName == replacement) {
                            return item.propertyValues;
                        }
                    }
                    return [];
                },
                showPropMathValue: function(replacement, sub_textAreaVal) {
                    if ($(MATCH_KEY_DOM).length) $(MATCH_KEY_DOM).remove();
                    if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();

                    var matchValArray = this.getMatchPropValueArray(replacement);
                    if (matchValArray.length <= 0) return;
                    var position = this.getPosition(sub_textAreaVal);
                    var mathValHtml = '';
                    mathValHtml += '<ul class="match-val-list"' + 'data-str="' + '' + '"' + '>';
                    for (var i = 0; i < matchValArray.length; i++) {
                        var item = matchValArray[i];
                        mathValHtml += '  <li>' + item.propertyValueEn + '</li>';
                    }
                    mathValHtml += ' </ul>';
                    $('.form-desc').append(mathValHtml);
                    $(MATCH_VAL_DOM).find('li').eq(0).addClass('active');
                    $(MATCH_VAL_DOM).css({
                        top: 30 + position.y * 20 + 'px',
                        left: 230 + position.x * 5 + 'px'
                    });
                    $(MATCH_VAL_DOM).find('li').on('click', function(event) {
                        var exchange_str = $(this).text();
                        tools.exchangeKeyStr('', exchange_str);
                    });

                },
                checkKeyboardEnter: function(event) {
                    if (!$(MATCH_KEY_DOM).length && !$(MATCH_VAL_DOM).length) return false;

                    var DOM = $(MATCH_KEY_DOM).length ? MATCH_KEY_DOM : MATCH_VAL_DOM;
                    var tmp_str = $(DOM).attr('data-str');
                    var exchange_str = $(DOM).find('.active').html();
                    tools.exchangeKeyStr(tmp_str, exchange_str);
                    event.preventDefault();
                    return true;
                },
                checkKeyboardUpOrDown: function(event) {
                    if (!$(MATCH_KEY_DOM).length && !$(MATCH_VAL_DOM).length) return false;

                    var DOM = $(MATCH_KEY_DOM).length ? MATCH_KEY_DOM : MATCH_VAL_DOM;
                    var matchKeyArray = $(DOM).find('li');
                    var currentIndex = matchKeyArray.index($(DOM).find('.active'));
                    var targetIndex = (event.keyCode == 40 ? currentIndex + 1 : currentIndex - 1 + matchKeyArray.length) % matchKeyArray.length;
                    matchKeyArray.eq(targetIndex).addClass('active').siblings('li').removeClass('active');
                    event.preventDefault();
                    return true;
                },
                checkKeyboardEsc: function(event) {
                    if ($(MATCH_KEY_DOM).length) $(MATCH_KEY_DOM).remove();
                    if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();
                    return true;;
                },
                checkKeyboardCode: function(event) {

                    var textAreaVal = $(TEXTAREA_DOM).val();

                    if (this.isEmpty(textAreaVal)) {
                        if ($(MATCH_KEY_DOM).length) $(MATCH_KEY_DOM).remove();
                        if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();
                        return;
                    }

                    target_cursorPosition = parseInt(this.getCursorPosition());

                    target_textAreaVal = textAreaVal.substring(0, target_cursorPosition);

                    var lastLetter = target_textAreaVal.substring(target_textAreaVal.length - 1, target_textAreaVal.length);

                    if (!this.isLetter(lastLetter)) {
                        // console.log('最后一个是特殊字符，不处理');
                        if ($(MATCH_KEY_DOM).length) $(MATCH_KEY_DOM).remove();
                        if ($(MATCH_VAL_DOM).length) $(MATCH_VAL_DOM).remove();
                        return;
                    }

                    var splitArray = this.getSplitArray(target_textAreaVal);

                    if (splitArray.length <= 0) return;

                    var targetPosition = tools.getPosition(target_textAreaVal);
                    tools.getPropMathKeyList(splitArray[splitArray.length - 1], targetPosition);


                }
            })


        }
    ])

    ng.controller('confirmCfecCtrl', ['$scope', function($scope) {

        var buyerId = $scope.buyerId;

        var vm = $scope.vm = {
            hasReson: false,

            messages: '提交成功，此广交会采购商也成功转为平台采购商',

            submitMsg: '去看看',

            cancelMsg: '取消',

            submit: function() {
                window.location.href = "/#/buyer/detail?buyerId=" + buyerId + '&tab=1';
            },
            close: function() {
                $scope.closeThisDialog();
            }
        };
    }])

    ng.controller('purSelectCateCtrl', [
        '$scope', '$rootScope', 'ngDialog',
        '$controller', '$location', 'addpurchaseService',
        'commonService', 'commonTool',
        function(
            $scope, $rootScope, ngDialog,
            $controller, $location, addpurchaseService,
            commonService, commonTool) {

            var vm = $scope.vm = {};
            var tools = $scope.tools = {};

            vm.searchCategoresList = [];
            vm.categoryArray = [];
            vm.hasSelectCate = null;
            $rootScope.hasSelectCate = null;

            var setTime;

            tools = $.extend(tools, {
                submit: function() {
                    if (commonTool.isEmpty($rootScope.hasSelectCate)) {
                        $rootScope.alertMsgService.setMessage("请选择类目", 'warning');
                        return;
                    }
                    var categoryId = $rootScope.hasSelectCate.categoryId;

                    this.isMutiCategoty(categoryId);

                    addpurchaseService.getCategoryPath({
                        'categoryId': categoryId,
                        'noIndus': true
                    }).success(function(data) {
                        if (data.status === 'success') {
                            var item = data.data;
                            var tmpObj = {
                                categoryCascade: item.categoryStructureEn,
                                categoryId: item.lastCategory
                            };
                            $rootScope.selectedCategory.categoryId = categoryId;

                            $rootScope.selectedCategory.categoryOfSuggestAarry.unshift(tmpObj);

                        } else {

                        }
                    })

                    $scope.closeThisDialog();
                    $('#sugcategory-error').hide();
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
                close: function() {
                    $('#sugcategory').valid();
                    $scope.closeThisDialog();
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
                    if (item.isBottom) {
                        $rootScope.hasSelectCate = item;
                        return;
                    }
                    commonService.getCategoryChildren({
                        parentId: item.categoryId
                    }).success(function(data) {
                        if ('success' == data.status) {
                            var len = vm.categoryArray.length;
                            vm.categoryArray.splice(index + 1, len - index - 1);
                            vm.categoryArray.push(data.data);
                        }
                    })
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
                }

            });

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
                        for (var i = 0; i < vm.searchCategoresList.length; i++) {
                            vm.searchCategoresList[i].categoryTreeHtml = vm.searchCategoresList[i].categoryTree.join('>>');
                        }
                    }
                })
            }

            init_data();

            function init_data() {
                commonService.getAllCategorysOfLevel1().success(function(data) {
                    if ('success' == data.status) {
                        vm.firstLevelCate = data.data;
                    }
                });
            }
        }
    ])


    ng.filter("checkIcon", function() {
        return function(attachmentPath) {
            var fileType = attachmentPath.substring(attachmentPath.lastIndexOf(".") + 1, attachmentPath.length);
            switch (fileType) {
                case "doc":
                case "docx":
                    return "icon-attaType-doc";
                case "png":
                case "jpg":
                case "jpeg":
                case "gif":
                    return "icon-attaType-img";
                case "ppt":
                case "pptx":
                    return "icon-attaType-ppt";
                case "pdf":
                    return "icon-attaType-pdf";
                case "xls":
                case "xlsx":
                    return "icon-attaType-xls";
                default:
                    return "";
            }
            return "";
        };
    })

    ng.controller('delPurItemCtrl', ['$scope', function($scope) {
        var tools = $scope.tools = $.extend(tools, {
            delSubmit: function() {
                $scope.confirm()
            },
            delClose: function() {
                $scope.closeThisDialog();
            }
        })
    }])

    ng.filter("toEnNumber", function() {
        return function(index) {
            var indexArray = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
            return indexArray[parseInt(index)];
        };
    })

    ng.filter("joinStr", function() {
        return function(arr) {
            var indexArray = arr;
            return indexArray.join(',');
        };
    })

});