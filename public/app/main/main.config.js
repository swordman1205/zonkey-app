'use strict';

mainModule
    .config(['$stateProvider', function($stateProvider) {
    	$stateProvider
    		.state('main', {
    			url: '',
    			abstract: true,
    			templateUrl: 'app/main/main.html',
    			controller: 'mainCtrl',
    			controllerAs: 'vm',
                resolve: {
                    users: ['mainService', function(mainService) {
                        return mainService.getAllUsers().then(function(response) {
                            return response.data;
                        });
                    }]
                }
    		})
    }]);