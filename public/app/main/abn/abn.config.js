'use strict';

abnModule
    .config(['$stateProvider', function($stateProvider) {
    	$stateProvider
    		.state('main.abn', {
    			url: '/abn/:dossier_id',
                params: {
                    active_tab: 0
                },
    			templateUrl: 'app/main/abn/abn.html',
    			controller: 'abnCtrl',
    			controllerAs: 'vm',
    			resolve: {
    				dossierInfo: ['$stateParams', 'abnService', '$state', function($stateParams, abnService, $state) {
    					if ($stateParams.dossier_id) {
    						return abnService.getDossier($stateParams.dossier_id).then(function(response) {
    							return response.data;
    						});
    					} else {
    						return {};
    					}
			        }]
    			}
    		})
    }]);