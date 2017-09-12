// define(['app'], function(app){
//   app
//     .controller('MainCtrl', ['$scope', 'menus', function($scope, menus){
//       //console.log(menus);
//       $scope.menus = menus;
//     }])
//     .controller('AccountCtrl', ['$scope', function($scope){

//     }])



// });

define([
    './main',

    './login/login',

    '../filter/commonFilter',

    './index/homePage',

    './buyer/index',
    './buyer/cfecIndex',
    './buyer/followList',
    './buyer/addBuyer',
    './buyer/addpurchase',
    './buyer/myfollow',
    './buyer/followManage',
    './buyer/trackingList',
    './buyer/myFollowHistory',

    './seller/index',
    './seller/qualificationAudit',
    './seller/sellerInfoAudit',
    './seller/trackingList',
    './seller/shopDiagnosis',
    './seller/exhibition',
    './seller/eShop',
    './seller/fans',
    './purchase/purchaseReq',
    './purchase/quoteManage',
    './inquiryMgr/inquiry',
    // './order/order',
    // './contract/contract',
    './goods/goods',
    './reportMgr/reportMgr',
    // './financeFunds/consumeApproval',
    // './financeFunds/sellerVirtualAccount',
    './sellerAccount/sellerAccount',
    // './brandMgr/brand',
    // './tradeManager/tradeManager',
    // './logistics/logistics',
    './member/memberManage',
    './system/userManager',
    './keywordAdMgr/index',
    './edm/index',
    './appCms/appCms',
    './appCms/messageMgr',
    './smsMgr/smsMgr',
    './activityMgr/activityMgr',
    './keywordMgr/keywordMgr'
], function(angular) {
    //return angular.module('webapp.Ctrl', [])
});