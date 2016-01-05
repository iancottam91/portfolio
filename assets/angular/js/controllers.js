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

porfolioControllers.controller('ProjectDetailCtrl', ['$scope', '$routeParams', '$http', '$sce','$location', '$anchorScroll',

  function($scope, $routeParams, $http,  $sce,  $location, $anchorScroll) {


    $scope.slides = false;

    $scope.projectTitle = $routeParams.projectTitle;

    // load default option
    $http.get('assets/angular/json/projects/' + $routeParams.projectTitle + '.json').success(function(data) {
      $scope.project = data;
      $scope.skillOnShow = 'javascript';

      if(data.slideShow !== undefined){
        $scope.slides = data.slideShow;
      }

    });

    $scope.descUrl = "/assets/angular/html/projects/" + $scope.projectTitle + ".html";

    $scope.changeSkill = function(val){
      $scope.skillOnShow = val;
      console.log(val);
    }

    $scope.desc = "true";


    // the structure of the JSON is tricky to get right, we might need to access a file, by it's skill name. This is the thinking behind fca-handbook.json



    // handle click to change logo information

    // Have a central skill id to img JSON/info

    // Have a per project skill usage description
  


  }]);

porfolioControllers.controller('ExperienceCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {

    
    // can load JSON data with built in http service: https://docs.angularjs.org/tutorial/step_05
    $http.get('assets/angular/json/experience.json').success(function(data) {
      $scope.experiences = data;
    });

  }]);

porfolioControllers.controller('ExperienceDetialCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    
    

  }]);