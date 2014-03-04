	// create the module and name it scotchApp
	var vaquitaApp = angular.module('vaquitaApp', ['ngRoute']);

	// configure our routes
	vaquitaApp.config(function($locationProvider, $routeProvider) {
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
				controller  : 'congratsController'
			})
		});

	// create the controller and inject Angular's $scope
	vaquitaApp.controller('mainController', function($scope) {
	});

	vaquitaApp.controller('aboutController', function($scope) {
	});

	vaquitaApp.controller('congratsController', function($scope,preferenceService) {
		$scope.initPoint = preferenceService.getPreferenceResponse()[2].init_point;
		$scope.description = preferenceService.getPreferenceResponse()[2].items[0].title;
		$scope.partialAmount = preferenceService.getPreferenceResponse()[2].items[0].unit_price;
		$scope.finalAmount = amountService.getTotal();
	});

	vaquitaApp.controller('validateController', function($scope, $http, $location, preferenceService) {
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
						preferenceService.savePreferenceResponse(data);
						amountService.saveTotal($scope.finalAmount);
						$location.path('/congrats');
						$scope.$apply();
					});
				});
			}
		};
	});

	vaquitaApp.factory('preferenceService', function () {
        var preferenceResponse = {};

        return {
            savePreferenceResponse:function (data) {
                preferenceResponse = data;
            },
            getPreferenceResponse:function () {
                return preferenceResponse;
            }
        };
    });

    vaquitaApp.factory('amountService', function () {
        var total = {};

        return {
            saveTotal:function (totalAmount) {
                total = totalAmount;
            },
            getTotal:function () {
                return total;
            }
        };
    });



