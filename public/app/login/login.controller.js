'use strict';

loginModule
	.controller('loginCtrl', ['loginService', '$timeout', '$state', function(loginService, $timeout, $state) {

		var vm = this;

		angular.extend(vm, {
			isLoginSuccess: false,
			isLoginFailed: false,
			user: {},
			login: function() {
				loginService.login(vm.user.username, vm.user.password).then(function(response) {
					if (typeof response.data == 'string') {
						vm.isLoginFailed = true;

						$timeout(function() {
							vm.isLoginFailed = false;
						}, 2000);
					} else {
						var user = response.data;
						vm.isLoginSuccess = true;
						loginService.saveLocalUser(user);

						$timeout(function() {
							$state.go('main.home');
						}, 2000);
					}
				});
			}
		});
		
	}]);