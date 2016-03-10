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

    // list checkbox filters

    $scope.skillsCheckboxes = [
      'AJAX',
      'AngularJS',
      'Apache',
      'Compass',
      'CSS',
      'Drupal',
      'Freemarker',
      'Gulp',
      'JavaScript',
      'jQuery',
      'JSON',
      'Less',
      'Local Storage',
      'NodeJS',
      'NW.js',
      'PhantomJS',
      'php',
      'requireJS',
      'Sass',
      'Stylus',
      'Wordpress'
    ];

    $scope.selectedSkills = [
    ],

    // toggle selection for a given fruit by name
    $scope.toggleSelection = function toggleSelection(skill) {
      var index = $scope.selectedSkills.indexOf(skill);

      // if it's selected - remove it on click
      if (index > -1) {
        $scope.selectedSkills.splice(index, 1);
      }

      // if its not selected add it on click
      else {
        $scope.selectedSkills.push(skill);
      }

      console.log($scope.selectedSkills);

    };

    $scope.skillFilter = function(project)
    { 
        
        // show all if every box is unchecked
        if($scope.selectedSkills.length === 0){
          return true;
        } else{
          // check if the skill is matched
          for(i=0; i<$scope.selectedSkills.length; i++){

            if ($.inArray($scope.selectedSkills[i], project.skills) < 0) {
              // console.log('not selected');
              return false;
            }

          }
          return true;
        }

    };


  }]);

porfolioControllers.controller('ProjectDetailCtrl', ['$scope', '$routeParams', '$http', '$sce','$location', '$anchorScroll',

  function($scope, $routeParams, $http,  $sce,  $location, $anchorScroll) {


    // default slideshow: as no slider
    $scope.slides = false;

    // project title
    $scope.projectTitle = $routeParams.projectTitle;

    // load model and set default options
    $http.get('assets/angular/json/projects/' + $routeParams.projectTitle + '.json').success(function(data) {
      $scope.project = data;
      $scope.skillOnShow = 'javascript';

      if(data.slideShow !== undefined){
        $scope.slides = data.slideShow;
      }

    });


    $scope.descUrl = "/assets/angular/html/projects/" + $scope.projectTitle + ".html";




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

porfolioControllers.controller('ContactCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    
    

  }]);