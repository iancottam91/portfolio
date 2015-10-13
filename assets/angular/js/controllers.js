// the controller is used to link the the model to the view. 
// it handles interactions with the view and updates the model accordingly


var porfolioControllers = angular.module('porfolioControllers', []);



porfolioControllers.controller('HomeCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {

    $http.get('assets/angular/json/projects.json').success(function(data) {
      $scope.sites = data;
    });

  }])
;


porfolioControllers.controller('ProjectsCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    
    // can load JSON data with built in http service: https://docs.angularjs.org/tutorial/step_05
    $http.get('assets/angular/json/projects.json').success(function(data) {
      $scope.projects = data;
    });


  }]);

porfolioControllers.controller('ProjectDetailCtrl', ['$scope', '$routeParams', '$http', '$ocLazyLoad', '$sce', 

  function($scope, $routeParams, $http, $ocLazyLoad, $sce) {



    // load default option
    $http.get('assets/angular/json/projects/fca-handbook.json').success(function(data) {
      $scope.project = data;
    });
  


  }]);

porfolioControllers.controller('ExperienceCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    


  }]);

porfolioControllers.controller('ExperienceDetialCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    
    

  }]);