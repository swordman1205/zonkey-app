'use strict';

loginModule
	.service('loginService', ['$http', 'ipCookie', 'baseUrl', function($http, ipCookie, baseUrl) {

		var api = {};

		api.login = function(username, password) {
			return $http.get(baseUrl + '/login?username=' + username + '&password=' + password);
		};

		api.saveLocalUser = function(user) {
			ipCookie('user', user);
		}

		return api;

	}]);