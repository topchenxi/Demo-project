define(['../module'], function(ng) {
    ng
        .factory('homePageService', ['$http', 'api', function($http, api) {
            return {};
        }])



    //主页
    .controller('homePageCtrl', [
        '$scope', '$rootScope','$location', 'homePageService',
        'mainService', 'commonService', 'commonTool',
        function($scope, $rootScope,$location, homePageService, mainService, commonService, commonTool) {

            var tools = $scope.tools = {};

            var vm = $scope.vm = {};

            vm.totalItem = 0;

            tools = $.extend(tools, {
                toPage: function(url) {
                    $location.path(url);
                }
            });

            function init_data() {
                // 加载菜单
                // mainService.account().success(function(data) {
                //     if ('success' == data.status) {
                //         if (data.data.commmonModuleDTOList != null) {
                //             $rootScope.leftMenu = data.data.commmonModuleDTOList;
                //         }
                //     } else {
                //         $rootScope.alertMsgService.setMessage("获取菜单失败", 'warning');
                //     }
                // });
            };

            init_data();

        }
    ])



})
