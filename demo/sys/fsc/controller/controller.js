// define(['app'], function(app){
//   app
//     .controller('MainCtrl', ['$scope', 'menus', function($scope, menus){
//       //console.log(menus);
//       $scope.menus = menus;
//     }])
//     .controller('AccountCtrl', ['$scope', function($scope){

//     }])



// });

define(['./main'
        , './set/index'
        , './safety/safety' //安全设置
        , './login/login'
        , './address/index'
        , './goods/selectSort'
        , './goods/publish'
        , './goods/manage'
        ,'./authentication/index'
        //,'./uploader'
       ], function(angular) {

  //return angular.module('webapp.Ctrl', [])

})