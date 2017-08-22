define(['./module'], function (ng) {

	ng
	/**
	 * 将过淲器注入
	 */
		.config(function ($httpProvider) {
			$httpProvider.interceptors.push('TokenInterceptor');
		})
		/**
		 * 将过淲器注入
		 */
		.config(function ($httpProvider) {
			$httpProvider.interceptors.push('TokenInterceptor');
		})
		.controller('MainCtrl', [
      '$scope', '$rootScope', '$location', '$state', '$translate', 'menus',
      function ($scope, $rootScope, $location, $state, $translate, menus) {

				if (localStorage.userInfo != null && localStorage.userInfo != 'undefined' && localStorage.userInfo.length > 50) {
					var userInfo = JSON.parse(localStorage.userInfo);
					//$rootScope.isLogin = ('success' === userInfo.status) ? 1 : 0;
					$rootScope.isLogin = 1;
					$rootScope.userInfo = userInfo;


				} else {
					$rootScope.isLogin = 0;
				}

				if (!$rootScope.isLogin) {
					$location.path('/login');
				}

				$scope.menus = menus;

				$scope.logout = function () {
					localStorage.removeItem('token');
					localStorage.removeItem('userInfo');
					$location.path('/login');
				}

				//选择语言
				$scope.lang = window.localStorage.lang || 'zh';
				$scope.switchLange = function (lang) {
					// console.log(lang)
					$translate.use(lang);
					window.localStorage.lang = lang;
					//window.location.reload();
				}

				//第一次加载
				$('.main-loading').hide();
				$('.main-con').fadeIn(600);

    }])

	/**
	 * 处理请求登陆及响应失败时的过滤器
	 */
	.factory('TokenInterceptor', function ($q, $window, $location, userService) {
		return {
			request: function (config) {

				config.headers = config.headers || {};
				if ($window.localStorage.isLogin) {
					config.headers.Authorization = 'Bearer ' + $window.localStorage.isLogin;
				}
				return config;
			},

			requestError: function (rejection) {
				return $q.reject(rejection);
			},

			/* Set Authentication.isLogin to true if 200 received */
			response: function (response) {

				if (response != null && response.status == 200 && $window.localStorage.isLogin && !userService.isLogin) {
					userService.isLogin = true;
				}
				return response || $q.when(response);
			},

			/* Revoke client authentication if 401 is received */
			responseError: function (rejection) {
				if (rejection != null && rejection.status === 401 && ($window.localStorage.isLogin || userService.isLogin)) {
					delete $window.localStorage.isLogin;
					userService.isLogin = false;
					$location.path("/login");
				} else if (404 == rejection.status) { // 后台有异常时会设置的返回状态
					alert("The Server Is Busy,Please Try Later...");
				} else if (400 == rejection.status) { // 服务器不理解请求的语法
					alert("Your Request Is Incorrect,Please Try Again...");
				} else if (500 == rejection.status) {
					alert("The Server Is Tired,Please Try Later...");
				}

				return $q.reject(rejection);
			}
		};
	})

	/**
	 * 加载图片并设置图片大小
	 */
	.filter('setImgSize', function () {
			return function (sImg, width, height, type) {
				width = width ? width : '180';
				height = height ? height : '180';
				type = type ? 　type : '2';
				var img;
				if (sImg) {
					img = sImg.split(',')[0];
					img = 'http://192.168.10.17' + img.slice(0, img.lastIndexOf('.')) + '_' +
						width + 'x' + height + '_' + type + img.slice(img.lastIndexOf('.'));
				} else {
					img = '/pubpage/view/images/default-img.jpg';
				}
				return img;
			};
		})
		.run(function ($rootScope, $location, $state, $window) {
			//监听路由， 路由上的依权限访问
			//bug： 有时不执行 $location.path("/login") 语句， 以修复
			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

				if (toState.name == 'login') return; // 如果是进入登录界面则允许
				// 如果用户不存在
				if (!$rootScope.isLogin) {
					event.preventDefault(); // 取消默认跳转行为
					$state.go("login"); //跳转到登录界面
				}
			});
		})

});