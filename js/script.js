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

	vaquitaApp.controller('congratsController', function($scope,preferenceService, amountService) {
		$scope.initPoint = preferenceService.getPreferenceResponse()[2].init_point;
		$scope.description = preferenceService.getPreferenceResponse()[2].items[0].title;
		$scope.partialAmount = preferenceService.getPreferenceResponse()[2].items[0].unit_price;
		$scope.finalAmount = amountService.getTotal();
	});

	vaquitaApp.controller('validateController', function($scope, $http, $location, preferenceService, amountService) {
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
				login();
				createEvent();
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

    // Funcion para logarse con Facebook.
	function login() {
	  fb.login(function(){ 
	    if (fb.logged) {
		    
	    } else {
	      alert("No se pudo identificar al usuario");
	    }
	  });
	};

	// Funcion para publicar un mensaje en tu muro
	function publish () {
	    fb.publish({
	      message : "Probando la vaquita",
	      picture : "http://blog.ikhuerta.com/wp-content/themes/ikhuerta3/images/ikhuerta.jpg",
	      link : "http://blog.ikhuerta.com/simple-facebook-graph-javascript-sdk",
	      name : "Simple Facebook Graph Javascript SDK",
	      description : "Facebook Graph es una nueva forma de conectar tu web Facebook. Con este script es muy fácil conseguirlo :)"
	    },function(published){ 
	      if (published)
	       alert("publicado!");
	      else
	       alert("No publicado :(, seguramente porque no estas identificado o no diste permisos");
	    }, false, 'me/feed');  
	}

	function createEvent() {
	    fb.publish({
	      privacy_type : "SECRET",
	      name : "Hagamos una vaquita",
	      start_time : "2013-05-31T00:52:01+0000",
	      description : $("#description").val()
	    },function(published, response){ 
	      if (published){
	       	alert("publicado!");
	       	FB.api('/'+response.id+'/invited?users=1089675556,1271422896', 'post', null, null);
	       }
	      else
	       alert("No publicado :(, seguramente porque no estas identificado o no diste permisos");
	    }, false, 'me/events');  
	}

