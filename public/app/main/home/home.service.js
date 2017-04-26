'use strict';

homeModule
	.service('homeService', ['$http', 'ipCookie', 'baseUrl', function($http, ipCookie, baseUrl) {

		var api = {};

		api.getAllDossiers = function() {
			return $http.get(baseUrl + "/dossiers");
		};

		return api;

	}]);