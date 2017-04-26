'use strict';

abnModule
	.controller('abnCtrl', ['abnService', '$state', 'dossierInfo', '$uibModal', 'Upload', 'baseUrl', 'users', '$stateParams', 'homeService', function(abnService, $state, dossierInfo, $uibModal, Upload, baseUrl, users, $stateParams, homeService) {

		var vm = this;

		angular.extend(vm, {
			activeTab: $stateParams.active_tab,
			dossier: dossierInfo,
			users: users,
			user: abnService.getCurrentUser(),
			monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			getUser: function(user_id) {
				return _.find(vm.users, function(usr) { return usr._id == user_id; });
			},
      isSidebar: false,
			addComment: function(category_name) {
				var modalInstance = $uibModal.open({
			      animation: true,
			      templateUrl: 'commentModal.html',
			      controller: 'CommentModalCtrl',
			      controllerAs: '$ctrl',
			      size: 'md',
			      resolve: {
			        data: function() {
			        	return {
			        		dossier: vm.dossier,
			        		category: category_name,
			        		users: vm.users
			        	};
			        }
			      }
			    });
			},
			downloadImage: function(file_id) {
				abnService.getFileInfo(file_id).then(function(response) {
					var url = 'data:' + response.data.file_type + ';base64,' + response.data.file_data;

					var a = $("<a>")
                          .attr("href", url)
                          .attr("target", "_blank")
                          .appendTo("body");

                  	a[0].click();

                  	a.remove();
				});
			},
			getFullDates: function(dateStr) {
				return new Date(dateStr);
			},
			getCommentDate: function(dateStr) {
				var date = new Date(dateStr);
				if (isNaN(date.getFullYear())) {
					return dateStr;
				} else {
					return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
				}
			},
			getNote: function(user_id, attachments, status) {
				var notes = [{
                  message:"Dossier is aangemaakt.", // status : 0 dossier is created
                  action: 'Geladen vanuit de WFT tool'
                }, {
                  message:"Dossier is Verstuur.", // status : 1 dossier is submitted
                  action: 'Verstuur door ' + (vm.getUser(user_id)? vm.getUser(user_id).name : 'Systeem')
                }, {
                  message:"Dossier is gesloten.", // status : 2 dossier is closed
                  action: 'Gesloten door ' + (vm.getUser(user_id)? vm.getUser(user_id).name : 'Systeem')
                }, {
                  message:"Heeft comment(s) toegevoegd.", // status : 3 update with comment
                  action: 'Klik hier voor de comment(s)'
                }, {
                  message:"Heeft bestanden toegevoegd.", // status : 4 update with attachment
                  action: (attachments? (_.find(vm.dossier.attachments, function(file) { return file._id == attachments; }).file_name || 'Untitled.png') : 'Untitled.png')
                }];

                return notes[status];
			},
			upload: function(file, category) {
				Upload.upload({
		            url: baseUrl + '/upload',
		            data: {
		            	files: file, 
		            	'userId': vm.user._id,
		            	'category': category,
		            	'dossierId': vm.dossier._id,
		            	'userName': vm.user.username
		            }
		        }).then(function (response) {
		           	$state.reload();
		        });
			},
			activateTab: function(status) {
				if (status == 3) {
					vm.activeTab = 1;
				} else if (status == 4) {
					vm.activeTab = 0;
				}
			},
			grabScreen: function(category_name) {
				var modalInstance = $uibModal.open({
			      animation: true,
			      templateUrl: 'grabModal.html',
			      controller: 'GrabModalCtrl',
			      controllerAs: '$ctrl',
			      size: 'md',
			      resolve: {
			        data: function() {
			        	return {
			        		dossier: vm.dossier,
			        		category: category_name,
			        		username: vm.user.username
			        	};
			        }
			      }
			    });
			},
			outputPDF: function() {
				var doc = new jsPDF()

				doc.text('Hello world!', 10, 10)
				doc.output('dataurlnewwindow');
			},
      dummyUpload: function() {
        // slience is golden
      },
      toggleSidebar: function() {
        vm.isSidebar = !vm.isSidebar;
      }
		});		

		// For each orgchart box, provide the name, manager, and tooltip to show.
		homeService.getAllDossiers().then(function(response){
			var rows = [];
	    	var dossiers = response.data;
	      	_.forEach(dossiers, function(dossier){
	      		if (dossier._id == $stateParams.dossier_id) {
	      			rows.push({
	      				c:[
	      					{ v:dossier.bc_number }, 
	      					{ v:dossier.parentBC }
	      				], 
	      				p: { style: "border: 2px solid #e3ca4b;background-color: #fff7ae;background: -webkit-gradient(linear, left top, left bottom, from(#fff7ae), to(#eee79e));background: -moz-gradient(linear, left top, left bottom, from(#fff7ae), to(#eee79e));background: gradient(linear, left top, left bottom, from(#fff7ae), to(#eee79e));" }
	      			});
	      		} else {
		      		rows.push({
	      				c:[
	      					{ v:dossier.bc_number }, 
	      					{ v:dossier.parentBC }
	      				]
	      			});
		      	}
	      	});

			google.charts.load('current', {packages:["orgchart"]});
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				var tree = {
					cols : [
			          {label: "Name", pattern: "", type: "string"},
			          {label: "Manager", pattern: "", type: "string"}
			        ],
			        rows: rows
				};
				var data = new google.visualization.DataTable(tree);

				// Create the chart.
				var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
				// Draw the chart, setting the allowHtml option to true for the tooltips.
				chart.draw(data);

				google.visualization.events.addListener(chart, 'select', selectHandler);

				function selectHandler() {
					var bcNumber = data.getFormattedValue(chart.getSelection()[0].row, 0);
					var dossierId = _.find(dossiers, function(dossier){
						return dossier.bc_number == bcNumber
					})._id;
					$state.go('main.abn', {
						dossier_id: dossierId
					});
				}
			}
		});

	}]);

abnModule.filter('category', function() {
	return function(value, category_name) {
		return _.filter(value, function(item) {
			return item.category == category_name;
		});
	}
});

abnModule.controller('CommentModalCtrl', ['$uibModalInstance', 'data', 'abnService', '$state', 'baseUrl', '$timeout', 'socket', function ($uibModalInstance, data, abnService, $state, baseUrl, $timeout, socket) {
  var $ctrl = this;

  var selectedUsers = [];

  angular.extend($ctrl, {
  	 users: [],
  	 searchPeople: function() {
  	 	$ctrl.users = [];
  	 	$timeout(function() {  	 		
        	$ctrl.users = _.filter(data.users, function(user) {
        		return user._id != abnService.getCurrentUser()._id;
        	});
  	 	}, 0);
     },
     getPeopleText: function(item) {
     	selectedUsers.push(item.username);
        return '@' + item.username;
     },
  	 ok: function () {
  	 	var commentForm = new FormData();
      	commentForm.append('userId', abnService.getCurrentUser()._id);
      	commentForm.append('dossierId', data.dossier._id);
      	commentForm.append('commentText', $ctrl.message);
      	commentForm.append('category', data.category);
      	commentForm.append('userName', abnService.getCurrentUser().name);

      	var targetUsername = null;

      	_.forEach(selectedUsers, function(user) {
	  		if ($ctrl.message.indexOf('@' + user) > -1) {
	  			targetUsername = user;
	  		}
	  	});

	  	if (targetUsername) {
	        socket.emit('comment', {
	        	dossier: data.dossier._id,
	        	target: _.find(data.users, function(user){
	        		return user.username == targetUsername;
	        	})._id,
	        	sender: abnService.getCurrentUser()._id
	        });
		}

      	$.ajax({
	        type: "post",
	        url: baseUrl + "/comment",   
	        crossDomain: true,
	        processData: false,
	        contentType: false,
	        data: commentForm,
	        success: function(result) {
	        	$state.reload();
	            $uibModalInstance.close();
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown) { 
	          // error handling
	        } 
	    }, "json");
	 },
	 cancel: function () {
     	$uibModalInstance.dismiss('cancel');
  	 }
  })

}]);

abnModule.controller('GrabModalCtrl', ['$uibModalInstance', 'data', 'abnService', '$state', 'baseUrl', '$timeout', function ($uibModalInstance, data, abnService, $state, baseUrl, $timeout) {
  var $ctrl = this;

  angular.extend($ctrl, {
  	 imageUrl: null,
  	 ok: function () {
      	var grabForm = new FormData();
      	grabForm.append('userId', abnService.getCurrentUser()._id);
      	grabForm.append('dossierId', data.dossier._id);
      	grabForm.append('category', data.category);
      	grabForm.append('url', $ctrl.imageUrl);
      	grabForm.append('fileName', $ctrl.fileName);
      	grabForm.append('userName', data.username);

      	// abnService.submitGrab(grabData).then(function(response) {
      	// 	$state.reload();
      	// 	$uibModalInstance.close();
      	// }, function(err) {
      	// 	alert('Can not grab screen from the url');
      	// });

      	$.ajax({
	        type: "post",
	        url: baseUrl + "/grab",   
	        crossDomain: true,
	        processData: false,
	        contentType: false,
	        data: grabForm,
	        success: function(result) {
	        	$state.reload();
	            $uibModalInstance.close();
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown) { 
	          // error handling
	        } 
	    }, "json");
	 },
	 cancel: function () {
     	$uibModalInstance.dismiss('cancel');
  	 }
  })

}]);