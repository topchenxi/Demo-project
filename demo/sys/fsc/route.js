define(['app'], function(app) {

  app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, menus) {

    $urlRouterProvider.otherwise('/index');

    $stateProvider
    //首页
      .state('index', {
        url: '/index',
        views: {
          '': {
            templateUrl: './template/layout.html'
          },
          'side@index': {
            templateUrl: './template/menu.html'
          },
          'main@index': {
            templateUrl: './controller/index/index.html',
          }
        }

      })
      //登入
      .state('login', {
        url: '/login',
        templateUrl: './controller/login/login.html',
        controller: 'loginCtrl'
      })

    //**安全设置 start { **/
    // 安全设置
    .state('safety', {
        url: '/safety',
        views: {
          '': {
            templateUrl: './template/layout.html'
          },
          'side@safety': {
            templateUrl: './template/menu.html'
          },
          'main@safety': {
            templateUrl: './controller/safety/index.html',
            controller: 'safetyCtrl'
          }
        }
      })
      //修改密码
      .state('safety.changepwd', {
        url: '/changepwd',
        views: {
          'main@safety': {
            templateUrl: './controller/safety/changepwd.html',
            controller: 'changepwdCtrl'
          }
        }
      })
      //修改手机
      .state('safety.changemobile', {
        url: '/changemobile',
        views: {
          'main@safety': {
            templateUrl: './controller/safety/changemobile.html',
            controller: 'changemobileCtrl'
          }
        }
      })
      //修改邮箱
      .state('safety.changeemail', {
        url: '/changeemail',
        views: {
          'main@safety': {
            templateUrl: './controller/safety/changeemail.html',
            controller: 'changeemailCtrl'
          }
        }
      })
      //找回安全问题
      .state('safety.find', {
        url: '/find',
        views: {
          'main@safety': {
            templateUrl: './controller/safety/find.html',
            controller: 'findCtrl'
          }
        }
      })
      //设置安全问题
      .state('safety.set', {
        url: '/set',
        views: {
          'main@safety': {
            templateUrl: './controller/safety/set.html',
            controller: 'setCtrl'
          }
        }
      })
      //** }end**/


    //资料设置
    .state('sets', {
      url: '/sets',
      views: {
        '': {
          templateUrl: './template/layout.html'
        },
        'side@sets': {
          templateUrl: './template/menu.html'
        },
        'main@sets': {
          templateUrl: './controller/set/user.html',
          controller: 'UserCtrl'
        }
      }
    })

    /**地址管理 start{**/
    //收货地址
    .state('address', {
        url: '/address',
        views: {
          '': {
            templateUrl: './template/layout.html'
          },
          'side@address': {
            templateUrl: './template/menu.html'
          },
          'main@address': {
            templateUrl: './controller/address/receiving.html',
            controller: 'receivingCtrl'
          }
        }
      })
      //收货地址
      .state('address.receiving', {
        url: '/receiving',
        views: {
          'main@address': {
            templateUrl: './controller/address/receiving.html',
            controller: 'receivingCtrl'
          }
        }
      })
      //退货地址
      .state('address.returns', {
        url: '/returns',
        views: {
          'main@address': {
            templateUrl: './controller/address/returns.html',
            controller: 'returnsCtrl'
          }
        }
      })
      /**}end 地址管理 **/

    //卖家申请
    .state('applySeller', {
        url: '/applySeller',
        views: {
          '': {
            templateUrl: './template/layout.html'
          },
          'side@applySeller': {
            templateUrl: './template/menu.html'
          },
          'main@applySeller': {
            templateUrl: './controller/applySeller/index.html'
          }
        }
      })
      //商品
      .state('goods', {
        url: '/goods',
        views: {
          '': {
            templateUrl: './template/layout.html'
          },
          'side@goods': {
            templateUrl: './template/menu.html'
          },
          'main@goods': {
            templateUrl: './controller/goods/manage.html',
            controller: 'GoodsManageCtrl'
          }
        }
      })
      .state('goods.success', {
        url: '/success',
        views: {
          'main@goods': {
            templateUrl: './controller/goods/submitAudit.html',
            controller: 'successCtrl'
          }
        }
      })

    //身份认证
    .state('authentication', {
        url: '/authentication',
        views: {
          '': {
            templateUrl: './template/layout.html'
          },
          'side@authentication': {
            templateUrl: './template/menu.html'
          },
          'main@authentication': {
            //templateUrl : './controller/authentication/index.html',
            controller: 'EntryCtrl'
          }
        }
      })
      .state('authentication.apply', {
        url: '/apply',
        views: {
          'main@authentication': {
            templateUrl: './controller/authentication/index.html',
            controller: 'ApplyCtrl'
          }
        }
      })
      .state('authentication.apply2', {
        url: '/apply2',
        views: {
          'main@authentication': {
            templateUrl: './controller/authentication/apply2.html',
            controller: 'Apply1Ctrl'
          }
        }
      })

    .state('authentication.audit', {
      url: '/audit',
      views: {
        'main@authentication': {
          templateUrl: './controller/authentication/audit.html',
          controller: 'AuditCtrl'
        }
      }
    })



    angular.forEach(menus, function(menu) {
      //设置子分类
      if ('set' === menu.path) {
        angular.forEach(menu.items, function(nav) {
          $stateProvider.state('set.' + nav.path, {
            url: '/' + nav.path,
            views: {
              'main@set': {
                templateUrl: './controller/' + nav.template,
                controller: nav.controller
              }
            }
          })
        })
        angular.forEach(menu.hideItems, function(nav) {
          $stateProvider.state('set.' + nav.path, {
            url: '/' + nav.path,
            views: {
              'main@set': {
                templateUrl: './controller/' + nav.template,
                controller: nav.controller
              }
            }
          })
        })
      }

      //设置子分类
      if ('sets' === menu.path) {
        angular.forEach(menu.items, function(nav) {
          $stateProvider.state('sets.' + nav.path, {
            url: '/' + nav.path,
            views: {
              'main@sets': {
                templateUrl: './controller/' + nav.template,
                controller: nav.controller
              }
            }
          })
        })
        angular.forEach(menu.hideItems, function(nav) {
          $stateProvider.state('sets.' + nav.path, {
            url: '/' + nav.path,
            views: {
              'main@sets': {
                templateUrl: './controller/' + nav.template,
                controller: nav.controller
              }
            }
          })
        })
      }
      //商品子分类
      if ('goods' === menu.path) {
        angular.forEach(menu.items, function(nav) {
          $stateProvider.state('goods.' + nav.path, {
            url: '/' + nav.path,
            views: {
              'main@goods': {
                templateUrl: './controller/' + nav.template,
                controller: nav.controller
              }
            }
          })
        })
        angular.forEach(menu.hideItems, function(nav) {
          $stateProvider.state('goods.' + nav.path, {
            url: '/' + nav.path,
            views: {
              'main@goods': {
                templateUrl: './controller/' + nav.template,
                controller: nav.controller
              }
            }
          })
        })
      }
    })
  })

});