define(['angular'], function(angular, UM) {
    var ngcPlugin = angular.module('ngc.plugin', []);
    /**
     * 使用示例
     * <ele ngc-lay-date min-date="{{model.1}}" max-date="{{model.2}}">
     */
    ngcPlugin.directive('ngcLayDate', function($timeout) {
        return {
            require: '?ngModel',
            restrict: 'A',
            scope: {
                ngModel: '=',
                maxDate: '@',
                minDate: '@',
                enabledDate: '@'
            },
            link: function(scope, element, attr, ngModel) {
                var _date = null,
                    _config = {};
                // 渲染模板完成后执行
                $timeout(function() {
                    _config = {
                        elem: '#' + attr.id,
                        format: attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD',
                        max: attr.hasOwnProperty('maxDate') ? attr.maxDate : '',
                        min: attr.hasOwnProperty('minDate') ? attr.minDate : '',
                        enabledMark: attr.hasOwnProperty('enabledDate') ? attr.enabledDate : '',
                        istime: attr.hasOwnProperty('istime'),
                        choose: function(data) {
                            scope.$apply(read);
                            // console.log(attr.id);

                        },
                        clear: function() {
                            ngModel.$setViewValue(null);
                        }
                    };
                    _date = laydate(_config);

                    // console.log(_date);

                    if (attr.hasOwnProperty('maxDate')) {
                        attr.$observe('maxDate', function(val) {
                            _config.max = val;
                        })
                    }
                    if (attr.hasOwnProperty('minDate')) {
                        // console.log(scope.minDate);
                        attr.$observe('minDate', function(val) {
                            _config.min = val;
                        })
                    }
                    if (attr.hasOwnProperty('enabledDate')) {
                        attr.$observe('enabledDate', function(val) {
                            _config.enabledMark = val;
                        })
                    }

                    // Specify how UI should be updated
                    ngModel.$render = function() {
                        element.val(ngModel.$viewValue || '');
                    };
                    // Listen for change events to enable binding
                    element.on('blur keyup change', function() {
                        scope.$apply(read);
                        // if(attr.hasOwnProperty('minDate')){
                        //     _date.min=attr.minDate;
                        // }
                        // if(attr.hasOwnProperty('maxDate')){
                        //     _date.max=attr.maxDate;
                        // }

                    });
                    read(); // initialize
                    // Write data to the model
                    function read() {
                        var val = element.val();
                        ngModel.$setViewValue(val);
                    }
                }, 0);
            }
        };
    });
    /**
     * 具体操作权限，如 审核通过，编辑等
     * 调用方法<ele ngc-permission="modelcode_fuctioncode_operationcode"></ele> 
     * modelcode取自模块表url，fuctioncode取自菜单表url,operationcode取自操作表 opearCode
     */
    ngcPlugin.directive('ngcPermission', function($animate, $compile, permissions, $rootScope) {
        return {
            multiElement: true,
            transclude: 'element',
            priority: 595, // 优先级低于 ng-if
            terminal: true,
            restrict: 'A',
            $$tlb: true,
            link: function($scope, $element, $attr, ctrl, $transclude) {

                var permissionCode = $attr.ngcPermission,
                    block, childScope, previousElements;
                var permissionList = permissions.permissionList;
                permission = $attr.ngcPermission.trim();
                var hasFlag = false,
                    mod, func, opr;
                // console.log(permissionList.length);
                if (permissionList == null || typeof permissionList == 'undefined') {
                    hasFlag = true;
                }
                if (!hasFlag && $rootScope.isPermissionActive) {
                    for (var i = 0, il = permissionList.length; i < il; i++) {
                        mod = permissionList[i];
                        if (mod.url == permissionCode.split('_')[0]) {
                            for (var j = 0, jl = mod.functionList.length; j < jl; j++) {
                                func = mod.functionList[j];
                                if (func.functionUrl.replace('.', '') == permissionCode.split('_')[1]) {
                                    for (var k = 0, kl = func.userOpear.length; k < kl; k++) {
                                        opr = func.userOpear[k];
                                        if (opr.opearCode == permissionCode.split('_')[2]) {
                                            hasFlag = true;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                } else {
                    hasFlag = true; //显示操作按键
                }

                // console.log(hasFlag);
                if (hasFlag) {
                    if (!childScope) {
                        $transclude(function(clone, newScope) {
                            childScope = newScope;
                            clone[clone.length++] = $compile.$$createComment('end ngcPermission', $attr.ngcPermission);
                            block = {
                                clone: clone
                            };
                            $animate.enter(clone, $element.parent(), $element);
                        });
                    }
                } else {
                    if (previousElements) {
                        previousElements.remove();
                        previousElements = null;
                    }
                    if (childScope) {
                        childScope.$destroy();
                        childScope = null;
                    }
                    if (block) {
                        previousElements = getBlockNodes(block.clone);
                        $animate.leave(previousElements).then(function() {
                            previousElements = null;
                        });
                        block = null;
                    }
                }

            }
        };
    });
    ngcPlugin.directive('ngcAlertMsg', [function() {
        return {
            restrict: 'EA',
            templateUrl: 'directive/alertMsg.html',
            scope: {
                message: "=",
                type: "="
            },
            link: function(scope, element, attrs) {

                scope.hideAlert = function() {
                    scope.message = null;
                    scope.type = null;
                };

            }
        };
    }]);
    /**
     * 带筛选功能的下拉框
     * 使用方法 <select ngc-select-search name="select1" ng-options="">
     * 说明[ select 一定要有name,ng-options 属性]
     */
    ngcPlugin.directive('ngcSelectSearch', function($animate, $compile, $parse) {

        function parseOptions(optionsExp, element, scope) {
            // ngOptions里的正则
            var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
            // 1: value expression (valueFn)
            // 2: label expression (displayFn)
            // 3: group by expression (groupByFn)
            // 4: disable when expression (disableWhenFn)
            // 5: array item variable name
            // 6: object item key variable name
            // 7: object item value variable name
            // 8: collection expression
            // 9: track by expression
            var match = optionsExp.match(NG_OPTIONS_REGEXP);
            if (!(match)) {
                console.log('ng-options 表达式有误')
            }
            var valueName = match[5] || match[7];
            var keyName = match[6];
            var displayFn = $parse(match[2]);
            var keyFn = $parse(match[1]);
            var valuesFn = $parse(match[8]);

            var labelArray = [],
                idArray = [],
                optionValues = [];
            scope.$watch(match[8], function(newValue, oldValue) {
                if (newValue && newValue.length > 0) {
                    optionValues = valuesFn(scope) || [];
                    labelArray = [];
                    idArray = []
                    for (var index = 0, l = optionValues.length; index < l; index++) {
                        var it = optionValues[index];
                        if (match[2] && match[1]) {
                            var localIt = {};
                            localIt[valueName] = it;
                            var label = displayFn(scope, localIt);
                            var dataId = keyFn(scope, localIt);
                            labelArray.push(label);
                            idArray.push(dataId);
                        }
                    }

                    scope.options = {
                        'optionValues': optionValues,
                        'labelArray': labelArray,
                        'idArray': idArray
                    }
                }
            });
        }
        return {
            restrict: 'A',
            require: ['ngModel'],
            priority: 100,
            replace: false,
            scope: true,
            template: '<div class="chose-container">' +
                '<div class="chose-single"><span class="j-view"></span><i class="glyphicon glyphicon-remove"></i></div>' +
                '<div class="chose-drop chose-hide j-drop">' +
                '<div class="chose-search">' +
                '<input class="j-key" type="text" autocomplete="off">' +
                '</div>' +
                '<ul class="chose-result">' +
                // '<li ng-repeat="'+repeatTempl+'" data-id="'+keyTempl+'" >{{'+ valueTempl+'}}</li>'+
                '</ul>' +
                '</div>' +
                '</div>',
            link: {
                pre: function selectSearchPreLink(scope, element, attr, ctrls) {

                    var tmplNode = $(this.template).first();

                    var modelName = attr.ngModel,
                        name = attr.name;
                    tmplNode.attr('id', name + '_chosecontianer');

                    $animate.enter(tmplNode, element.parent(), element);
                },
                post: function selectSearchPostLink(scope, element, attr, ctrls) {
                    var choseNode = element.next(); //$('#'+attr.name +'_chosecontianer');
                    choseNode.addClass(attr.class);
                    element.addClass('chose-hide');
                    // 当前选中项
                    var ngModelCtrl = ctrls[0];
                    if (!ngModelCtrl || !attr.name) return;

                    parseOptions(attr.ngOptions, element, scope);
                    var rs = {};

                    function setView() {
                        var currentKey = ngModelCtrl.$modelValue;
                        if (isNaN(currentKey) || !currentKey) {
                            currentKey = '';
                            choseNode.find('.j-view:first').text('请选择');
                            choseNode.find('i').addClass('chose-hide');
                        }
                        if ((currentKey + '').length > 0 && rs.idArray != undefined) {
                            for (var i = 0, l = rs.idArray.length; i < l; i++) {
                                if (rs.idArray[i] == currentKey) {
                                    choseNode.find('.j-view:first').text(rs.labelArray[i]);
                                    choseNode.find('i').removeClass('chose-hide');
                                    break;
                                }
                            }
                        }
                    }

                    function setViewAndData() {
                        if (!scope.options) {
                            return;
                        }
                        rs = scope.options;
                        setView();
                    }
                    scope.$watchCollection('options', setViewAndData);
                    scope.$watch(attr.ngModel, setView);


                    function getListNodes(value) {
                        var nodes = [];
                        value = $.trim(value);
                        for (var i = 0, l = rs.labelArray.length; i < l; i++) {
                            var strTemp = typeof rs.labelArray[i] != 'string' ? String(rs.labelArray[i]) : rs.labelArray[i];

                            if (strTemp.substring(0, value.length).trim().toLowerCase() == value.toLowerCase()) {
                                nodes.push($('<li>').data('id', rs.idArray[i]).text(strTemp));
                            } else {
                                if (strTemp.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                                    nodes.push($('<li>').data('id', rs.idArray[i]).text(strTemp));
                                }
                            }
                        }
                        return nodes;

                    }
                    choseNode.on('keyup', '.j-key', function() {
                        // 搜索输入框keyup，重新筛选列表
                        var value = $(this).val();
                        choseNode.find('ul:first').empty().append(getListNodes(value));
                        return false;
                    }).on('click', function() {
                        $.each($('.j-drop'), function(index, val) {
                            if (!$(this).hasClass('chose-hide')) {
                                $(this).addClass('chose-hide');
                            }
                        });
                        choseNode.find('.j-drop').removeClass('chose-hide');
                        if (choseNode.find('.j-view:first').text() != '请选择') {
                            choseNode.find('i').removeClass('chose-hide');
                        }
                        choseNode.find('ul:first').empty().append(getListNodes(choseNode.find('.j-key').val()));
                        choseNode.find('.j-key').focus();
                        return false;
                    }).on('click', 'ul>li', function() {
                        var _this = $(this);
                        ngModelCtrl.$setViewValue(_this.data('id'));
                        ngModelCtrl.$render();
                        choseNode.find('.j-drop').addClass('chose-hide');
                        // 修复第一次选择由于validate执行顺序问题产生验证的BUG
                        element.blur();
                        return false;

                    }).on('click', 'i', function() {
                        ngModelCtrl.$setViewValue('');
                        ngModelCtrl.$render();
                        choseNode.find('.j-view:first').text('请选择');
                        choseNode.find('.j-drop').removeClass('chose-hide');
                        choseNode.find('.j-drop').find('.j-key').val('').focus();
                        var value = choseNode.find('.j-drop').find('.j-key').val();
                        choseNode.find('.j-drop').find('ul:first').empty().append(getListNodes(value));
                        return false;

                    });
                    $(document).on("click", function() {
                        $('.j-drop').addClass('chose-hide');
                        choseNode.find('i').addClass('chose-hide');
                    });

                }
            }
        };
    });
    /**
     * 常用短语保存功能
     * 使用方法 <input ngc-auto-input type="text" class="input-cfec" placeholder="" ng-model="" >
     */
    ngcPlugin.directive('ngcAutoInput', function($animate) {

        return {
            restrict: 'A',
            require: ['ngModel'],
            priority: 100,
            replace: false,
            scope: true,
            template: '<div class="autoInput-container">' +
                '<a href="javascript:void(0)" class="autoInput-add" style="display:none" title="保存为常用输入内容">增加</a>' +
                '<ul class="autoInput-result" style="display:none">' +
                // '<li ng-repeat="'+repeatTempl+'" >{{'+ valueTempl+'}}</li>'+
                '</ul>' +
                '</div>',
            link: {
                // 输出DOM
                pre: function autoInputPreLink(scope, element, attr, ctrls) {
                    var tmplNode = $(this.template).first();

                    var modelName = attr.ngModel,
                        name = attr.name;
                    tmplNode.attr('id', name + '_autoinputcontianer');

                    $animate.enter(tmplNode, element.parent(), element);
                },
                post: function autoInputPostLink(scope, element, attr, ctrls) {
                    var splitStr = '/$/';

                    var node = element;
                    var list = element.next();
                    var parent = element.parent();
                    var ul = list.find('ul');

                    parent.addClass('autoInput-parent');

                    // 计算位置偏移
                    var listLeft = node.position().left;
                    var listTop = node.position().top + node.outerHeight() - 1;
                    var addLeft = node.outerWidth() + 3;

                    if (parent.hasClass('oms-search')) {
                        listLeft = listLeft + 104;
                        addLeft = list.width() + 3;
                        listTop = 29;
                    } else {
                        if (parent.find('label').length) {
                            listTop = 53;
                        }
                    }

                    list.css({
                        'top': listTop + 'px',
                        'left': listLeft + 'px'
                    });
                    list.find('.autoInput-add').css({
                        'left': addLeft + 'px'
                    })

                    // 初始化赋值
                    var historyArr;

                    node.on('click', function() {

                        if (localStorage.inputHistory == undefined || localStorage.inputHistory == '') {
                            historyArr = [];
                        } else {
                            historyArr = localStorage.inputHistory.split(splitStr);
                        }

                        creatNodes(historyArr, ctrls);

                        $.each($('.autoInput-container'), function(index, val) {
                            if (!$(this).find('ul').is(':hidden')) {
                                $(this).find('ul').hide();
                            }
                            if (!$(this).find('.autoInput-add').is(':hidden')) {
                                $(this).find('.autoInput-add').hide();
                            }
                        });
                        // 输入框
                        if (historyArr.length) {
                            ul.show();
                        }

                        if (checkAllHide()) {
                            ul.find('li').show();
                        }

                        if (node.val().length > 0) {
                            list.find('.autoInput-add').show();
                        } else {
                            list.find('.autoInput-add').hide();
                        }
                        return false;
                    })

                    $(document).on("click", function(e) {
                        // console.log(e.target.className == 'iconfont del');
                        if (e.target.className != 'iconfont del') {
                            if (!ul.is(':hidden')) {
                                list.find('.autoInput-add').hide();
                                ul.hide();
                            }
                        }
                    });

                    node.on('keyup', function() {
                        if (node.val().length > 0) {
                            list.find('.autoInput-add').show();
                        } else {
                            list.find('.autoInput-add').hide();
                        }

                        // 输入筛选
                        searchNodes(node.val());

                        return false;
                    })
                    list.find('.autoInput-add').on('click', function() {
                        if (node.val().length > 0) {
                            if (historyArr.indexOf(node.val()) == -1) {
                                historyArr.unshift(node.val());
                                localStorage.inputHistory = historyArr.join(splitStr);
                                creatNodes(historyArr, ctrls);
                                if (ul.is(':hidden')) {
                                    ul.show();
                                }
                            }
                        }
                        return false;
                    })

                    function searchNodes(value) {
                        var val = value.trim();
                        var count = 0;
                        for (var i = 0; i < historyArr.length; i++) {
                            var word = historyArr[i].substring(0, val.length).trim().toLowerCase();
                            if (word == val.toLowerCase()) {
                                ul.find('li').eq(i).show();
                                count += 1;
                            } else {
                                var allword = historyArr[i].trim().toLowerCase();
                                if (allword.indexOf(val) != -1) {
                                    ul.find('li').eq(i).show();
                                    count += 1;
                                } else {
                                    ul.find('li').eq(i).hide();
                                }
                            }
                        }
                        if (count < 1) {
                            ul.hide();
                        } else {
                            ul.show();
                        }
                    }

                    // 生成node节点
                    function creatNodes(arr, ctrls) {
                        var nodes = [];
                        for (var i = 0, l = arr.length; i < l; i++) {
                            nodes.push('<li title="' + arr[i] + '"><span>' + arr[i] + '</span><a href="javascript:void(0)" class="iconfont del" title="删除">&#xe60b;</a></li>');
                        }
                        ul.empty().append(nodes);

                        // 绑定li点击事件
                        ul.find('li span').off('click').on('click', function() {
                            node.val($(this).text());
                            ctrls[0].$setViewValue($(this).text());
                            ul.hide();
                            list.find('.autoInput-add').hide();
                        })

                        ul.find('li .del').on('click', function() {
                            var li = $(this).parents('li');
                            var val = li.find('span').text();
                            var index = historyArr.indexOf(val);
                            if (index != -1) {
                                historyArr.splice(index, 1);
                                localStorage.inputHistory = historyArr.join(splitStr);
                                li.remove();
                                ctrls[0].$setViewValue('');
                                if (historyArr.length < 1) {
                                    ul.hide();
                                }
                            }

                            if (checkAllHide()) {
                                ul.hide();
                            }

                        })
                    }

                    // 检测是否全部隐藏
                    function checkAllHide() {
                        if (ul.find('li:hidden').length == ul.find('li').length) {
                            return true;
                        } else {
                            return false;
                        }
                    }

                }
            }
        };
    });
    /**
     * 兼容input回车 触发搜索
     * 使用方法  <input ngc-monitor-enter action="tools.search" type="text"  />
     */
    ngcPlugin.directive('ngcMonitorEnter', function() {
        let options = {
            restrict: 'A',
            link: function($scope, $element, $Attributes, $ctrls) {
                function enterAction() {
                    var actionFuntionString = $Attributes.action || " ";
                    array = actionFuntionString.split('.');
                    if (array.length == 2) {
                        if ($scope[array[0]] && $scope[array[0]][array[1]]) {
                            var foo = $scope[array[0]][array[1]];
                            if (typeof foo == 'function') {
                                foo.call($scope[array[0]]);
                            }
                        }
                    } else if ($scope.tools && $scope.tools.search) {
                        var searchFoo = $scope.tools.search;
                        if (typeof searchFoo == 'function') {
                            searchFoo.call($scope.tools);
                        }
                    } else if ($scope.vm && $scope.vm.search) {
                        var searchFoo = $scope.vm.search;
                        if (typeof searchFoo == 'function') {
                            searchFoo.call($scope.vm);
                        }
                    }
                }
                $element.keyup(function(event) {
                    if (event.keyCode != 13) return;
                    enterAction();
                });

            }
        };
        return options;
    })
    return ngcPlugin;
});