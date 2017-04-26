'use strict';

mainModule
	.controller('mainCtrl', ['mainService', '$timeout', '$state', 'socket', 'users', function(mainService, $timeout, $state, socket, users) {

		var vm = this;

		angular.extend(vm, {
			user: mainService.getCurrentUser(),
			isLeftBarCollapse: false,
			isDropdown: false,
			notifications: [],
			unreadNumber: 0,
			initNotifications: function() {
				mainService.getNotifications().then(function(response) {
                    vm.notifications = response.data;
                    vm.unreadNumber = _.filter(response.data, function(ele) {
                    	return ele.is_read == false;
                    }).length;
                });
			},
			getUserById: function(user_id) {
				return _.find(users, function(user) {
					return user._id == user_id;
				});
			},
			toggleLeftBar: function() {
				vm.isLeftBarCollapse = !vm.isLeftBarCollapse;
			},
			checkCurrentState: function(state) {
				return $state.includes(state);
			},
			logout: function() {
				mainService.removeLocalUser();
				$timeout(function() {
					$state.go('login');
				}, 0);
			},
			markAsRead: function(id, dossierId, isRead) {
				if (isRead) {
					$state.go('main.abn', {
						dossier_id: dossierId,
						active_tab: 1
					});
				} else {
					mainService.markAsRead(id).then(function(response){
						vm.initNotifications();
						$state.go('main.abn', {
							dossier_id: dossierId,
							active_tab: 1
						});
					});
				}
			}
		});

		vm.initNotifications();

		socket.on('notification', function(data) {
			vm.initNotifications();
		});
		
	}]);