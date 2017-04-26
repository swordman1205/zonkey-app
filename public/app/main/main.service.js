'use strict';

mainModule
	.service('mainService', ['ipCookie', '$http', 'baseUrl', function(ipCookie, $http, baseUrl) {

		var api = {};

		api.removeLocalUser = function() {
			ipCookie.remove('user');
		}

		api.getCurrentUser = function() {
			return ipCookie('user');
		}

		api.getAllUsers = function() {
			return $http({
				url: baseUrl + '/users',
				method: 'GET',
				cache: true
			});
		}

		api.getNotifications = function() {
			return $http({
				url: baseUrl + '/notifications?targetId=' + ipCookie('user')._id,
				method: 'GET'
			});
		}

		api.markAsRead = function(id) {
			return $http({
				url: baseUrl + '/markAsRead?id=' + id,
				method: 'PUT'
			});
		}

		return api;

	}]);

mainModule
    .factory('socket', ['mainService', function(mainService) {
        //var socket = io.connect('http://localhost:3000');
        var socket = io.connect('https://zonkey.herokuapp.com');
        socket.emit('user_id', mainService.getCurrentUser()._id);

        return {
            on: function(eventName, callback) {
                socket.on(eventName, callback);
            },
            emit: function(eventName, data) {
                socket.emit(eventName, data);
            }
        };
    }])