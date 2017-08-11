define(['app', './menus'], function(app) {

    app.config(function($stateProvider, $urlRouterProvider, menus, css, blog) {

        $urlRouterProvider.otherwise('/index');

        $stateProvider
            .state('index', {
                url: '/index',
                templateUrl: './view/index.html'
            })
            .state('view', {
                url: '/view',
                templateUrl: './view/demonstrate.html',
                controller: 'viewCtrl'
            })
            //web组件
            .state('module', {
                url: '/module',
                views: {
                    '': {
                        templateUrl: './view/layout.html',
                        controller: 'componentCtrl'
                    },
                    'side@module': {
                        templateUrl: './view/sideMenu.html'
                    },
                    'main@module': {
                        templateUrl: './view/module.main.html'
                    }
                }
            })
            // css 文档 
            .state('css', {
                url: '/css',
                views: {
                    '': {
                        templateUrl: './view/layout.html',
                        controller: 'cssCtrl'
                    },
                    'side@css': {
                        templateUrl: './view/sideMenu.html'
                    },
                    'main@css': {
                        templateUrl: './view/css.main.html'
                    }
                },
            })
            //博客
            .state('blog', {
                url: '/blog',
                views: {
                    '': {
                        templateUrl: './view/layout.html',
                        controller: 'blogCtrl'
                    },
                    'side@blog': {
                        templateUrl: './view/sideMenu.html'
                    },
                    'main@blog': {
                        templateUrl: './view/blog/javascript编码规范.html'
                    }
                },
            });



        //每个web模块的路由设置
        angular.forEach(menus, function(menu, i) {
            // $stateProvider.state('module.' + i, {
            //   url: '/' + i,
            //   views: {
            //     'main@module': {
            //       templateUrl: './view/module.main.html'
            //     }
            //   }
            // });
            angular.forEach(menu.items, function(nav) {
                $stateProvider.state('module.' + nav.url, {
                    url: '/' + nav.url,
                    views: {
                        'main@module': {
                            templateUrl: function() {
                                if (!nav.isFinish) {
                                    alert('正在赶制改模块');
                                    return './view/module.main.html';
                                }
                                return './view/component/' + nav.url + '/readme.html';
                            },
                        }
                    }
                });
            });
        });
        //css模块
        angular.forEach(css, function(cssItems, i) {
            angular.forEach(cssItems.items, function(nav) {
                $stateProvider.state('css.' + nav.url, {
                    url: '/' + nav.url,
                    views: {
                        'main@css': {
                            templateUrl: function() {
                                return './view/css/' + nav.url + '.html';
                            }
                        }
                    }
                });
            });
        });
        //blog
        angular.forEach(blog, function(blogItems, i) {
            angular.forEach(blogItems.items, function(nav) {
                $stateProvider.state('blog.' + nav.url, {
                    url: '/' + nav.url,
                    views: {
                        'main@blog': {
                            templateUrl: function() {
                                return './view/blog/' + nav.name + '.html';
                            }
                        }
                    }
                });
            });
        });
    });

    app.controller('MainCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
        $scope.slide = '';
        $rootScope.switchs = function() {
            $scope.slide = 'switchs';
        };
        $scope.$on('$stateChangeSuccess', function() {
            setTimeout(function() {
                Prism.highlightAll();
            }, 1);

        });
    }]);

    app.controller('cssCtrl', ['$scope', '$rootScope', 'css', function($scope, $rootScope, css) {
        $scope.menus = css;
        $scope.url = 'css';
    }]);
    app.controller('viewCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $('a[href^="http"]').each(function() {
            $(this).attr('target', '_blank');
        });
    }]);
    app.controller('blogCtrl', ['$scope', '$rootScope', 'blog', function($scope, $rootScope, blog) {
        $scope.menus = blog;
        console.log(blog)
        $scope.url = 'blog';
    }]);
    app.controller('componentCtrl', ['$scope', '$rootScope', 'menus', function($scope, $rootScope, menus) {
        $scope.menus = menus;
        $scope.url = 'module';
    }]);
});