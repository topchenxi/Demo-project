define(['../module'], function(ng) {
  ng
    .factory('HomeService', ['$http', 'api', function($http, api) {
      return {};
    }])



  //主页
  .controller('HomeCtrl', ['$scope', '$location', 'HomeService', 'commonService', 'commonTool',
    function($scope, $location, buyerService, HomeService, commonTool) {

      console.log('111111');

    }
  ])



})