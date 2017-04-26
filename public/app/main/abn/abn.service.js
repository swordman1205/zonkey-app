'use strict';

abnModule
	.service('abnService', ['$http', 'ipCookie', 'baseUrl', '$q', function($http, ipCookie, baseUrl, $q) {

		var api = {};

		api.getDossier = function(id) {
			return $http({
				url: baseUrl + "/dossier?id=" + id,
				method: 'GET'
			});
		}

		api.getCurrentUser = function() {
			return ipCookie('user');
		}

		api.getFileInfo = function(file_id) {
			return $http({
				url: baseUrl + "/attachments/" + file_id,
				method: 'GET',
				cache: true
			});
		}

		api.submitGrab = function(data) {
			return $http({
				url: baseUrl + "/grab",
				method: 'POST',
				data: data
			});
		}

		return api;

	}]);