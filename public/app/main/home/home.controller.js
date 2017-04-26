'use strict';

homeModule
	.controller('homeCtrl', ['$state', 'DTOptionsBuilder', 'DTColumnBuilder', '$q', '$scope', 'homeService', 'allDossiers', 'users', function($state, DTOptionsBuilder, DTColumnBuilder, $q, $scope, homeService, allDossiers, users) {

		var vm = this;

		var status = ["Nieuw", "voorleggen", "Gesloten", "Comments toegevoegd", "File attached"];

		angular.extend(vm, {
			dtOptions1: DTOptionsBuilder.fromFnPromise(function() {
		        var defer = $q.defer();
		        var openDossiers = _.filter(allDossiers, function(dossier) {
	        		return dossier.latest_history.status != 2;
	        	});
	            defer.resolve(_.map(openDossiers, function(dossier) {
	            	return {
	            		_id: dossier._id,
	            		bc_number: dossier.bc_number,
	            		name: dossier.latest_history.user,
	            		status: status[dossier.latest_history.status]
	            	};
	            }));
		        return defer.promise;
		    }).withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
		    	$('td', nRow).unbind('click');
		        $('td', nRow).bind('click', function() {
		            $scope.$apply(function() {
		                vm.rowClickHandler(aData);
		            });
		        });
		        return nRow;
		    }),
		    dtOptions2: DTOptionsBuilder.fromFnPromise(function() {
		        var defer = $q.defer();
	        	var closeDossiers = _.filter(allDossiers, function(dossier) {
	        		return dossier.latest_history.status == 2;
	        	});
	            defer.resolve(_.map(closeDossiers, function(dossier) {
	            	return {
	            		_id: dossier._id,
	            		bc_number: dossier.bc_number,
	            		name: dossier.latest_history.user
	            	};
	            }));
		        return defer.promise;
		    }),
		    rowClickHandler: function(info) {
		    	$state.go('main.abn', {
		    		dossier_id: info._id
		    	});
		    },
		    dtColumns1: [
		        DTColumnBuilder.newColumn('bc_number').withTitle('BC Number'),
		        DTColumnBuilder.newColumn('name').withTitle('Naam'),
		        DTColumnBuilder.newColumn('status').withTitle('Status')
		    ],
		    dtColumns2: [
		        DTColumnBuilder.newColumn('bc_number').withTitle('BC Number'),
		        DTColumnBuilder.newColumn('name').withTitle('Naam')
		    ],
		    userLevelOptions: ['Bankier', 'Fiatteur', 'Kwaliteitsdesk', 'CDD']
		});	
	}]);