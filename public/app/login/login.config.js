'use strict';

loginModule	
    .config(['$stateProvider', function($stateProvider) {
    	$stateProvider
    		.state('login', {
    			url: '/login',
    			templateUrl: 'app/login/login.html',
    			controller: 'loginCtrl',
    			controllerAs: 'vm'
    		})
    }]);