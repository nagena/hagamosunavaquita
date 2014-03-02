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
				controller  : 'aboutController'
			})
			.when('/faq', {
				templateUrl : 'pages/faq.html',
				controller  : 'aboutController'
			})
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'contactController'
			})	});

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

	vaquitaApp.controller('validateController', function($scope) {
		$scope.submitForm = function() {

			// check to make sure the form is completely valid
			if ($scope.createForm.$valid) {
				MELI.init({client_id: 8258968359213576});
				MELI.login(function() {
					var token = MELI.getToken();
				});
				alert(token);
			}

		};
	});
	