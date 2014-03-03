	// create the module and name it scotchApp
	var vaquitaApp = angular.module('vaquitaApp', ['ngRoute']);

	// configure our routes
	vaquitaApp.config(function($locationProvider, $routeProvider) {
		//$locationProvider.html5Mode(true);
		$routeProvider
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})
			.when('/create', {
				templateUrl : 'pages/create.html',
				controller  : 'mainController'
			})
			.when('/faq', {
				templateUrl : 'pages/faq.html',
				controller  : 'mainController'
			})
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'mainController'
			})
			.when('/congrats', {
				templateUrl : 'pages/congrats.html',
				controller  : 'mainController'
			})

			//$locationProvider.html5Mode(true);	
		});

	// create the controller and inject Angular's $scope
	vaquitaApp.controller('mainController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
	});

	vaquitaApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

	vaquitaApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});

	vaquitaApp.controller('validateController', function($scope, $http, $location) {
		$scope.items = [{email:""}];
        $scope.add = function () {
          $scope.items.push({ 
            email: ""
          });
        };

        $scope.remove = function (idx) {
          $scope.items.splice(idx, 1);
        };

		$scope.submitForm = function() {
			// check to make sure the form is completely valid
			if ($scope.createForm.$valid) {
				MELI.init({client_id: 8258968359213576});
				MELI.login(function() {
					var token = MELI.getToken();
					var jsonToPost =  {'items': [{'id': '123','title': $scope.description, 'quantity': 1, 'unit_price': parseFloat($scope.partialAmount), 'currency_id': 'ARS', 'picture_url': 'http://hagamosunavaquita.com.ar/cowww.png'}]};
	    			var url = "/checkout/preferences";
					MELI.post(url, jsonToPost, function(data) {
						$scope.initPoint = data[2].init_point;
						$location.path('/congrats');
					});
				});
			}
		};
	});



