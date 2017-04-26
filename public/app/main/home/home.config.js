'use strict';

homeModule
    .config(['$stateProvider', function($stateProvider) {
    	$stateProvider
    		.state('main.home', {
    			url: '/home',
    			templateUrl: 'app/main/home/home.html',
    			controller: 'homeCtrl',
    			controllerAs: 'vm',
    			resolve: {
    				allDossiers: ['homeService', function(homeService) {    					
    					return homeService.getAllDossiers().then(function(response) {
				        	return response.data;
				        });
			        }]
    			}
    		})
    }]);