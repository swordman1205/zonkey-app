'use strict';

angular
    .module('app', [    	
    	'ui.router',
    	'ui.bootstrap',
        'ipCookie',
        'datatables',
        'ngFileUpload',
        'mentio',
        //'googlechart',
    	'app.login',
    	'app.main'
    ])

    // .config(['$locationProvider', function($locationProvider) {
    //     $locationProvider.html5Mode({
    //         enabled: true,
    //         requireBase: false
    //     }).hashPrefix('!');
    // }])

    .config(['$urlRouterProvider', function($urlRouterProvider) {
        $urlRouterProvider.otherwise(function($injector){
            var $state = $injector.get('$state');
            $state.go('main.home');
        });
    }])

    .run(['$rootScope', '$state', 'ipCookie', '$stateParams', function($rootScope, $state, ipCookie, $stateParams) {
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        	console.log('error!');
            $state.go('main.home');
        });

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (toState.name == 'login' && ipCookie('user')) {
                event.preventDefault();
                $state.go('main.home');
            }

            if (toState.name != 'login' && !ipCookie('user')) {
                event.preventDefault();
                $state.go('login');
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState.name == 'main.abn' && !$stateParams.dossier_id) {
                event.preventDefault();
                $state.go('main.home');
            }
        });
    }])

    .constant('baseUrl', 'https://zonkey.herokuapp.com');
    //.constant('baseUrl', '//localhost:3000');