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
      'jQuery',
      'JavaScript',
      'JSON',
      'php',
      'Drupal',
      'Sass ',
      'Compass',
      'Less',
      'AngularJS',
      'EmberJS',
      'Wordpress',
      'apache',
      'NWjs',
      'CSS_Regression_Testing',
      'AJAX',
      'Local_Storage',
      'Freemarker',
      'stylus'
    ];

    $scope.selectedSkills = [
      'jQuery',
      'JavaScript',
      'JSON',
      'php',
      'Drupal',
      'Sass ',
      'Compass',
      'Less',
      'AngularJS',
      'EmberJS',
      'Wordpress',
      'apache',
      'NWjs',
      'CSS_Regression_Testing',
      'AJAX',
      'Local_Storage',
      'Freemarker',
      'stylus'
    ],

    // better to have this the other way round i think - like asos


    // if NONE of the skills matching a project and selected, then remove the project from the array
    $scope.skillFilter = function(projects){

      if ($scope.selectedSkills.length > 0) {

        console.log(projects.skills.length);

        for(i=0;i<projects.skills.length;i++){   


          // return to filter out
          // (more complex as shop is skill is not unique for each project!)

          // if the skill is not in selectedSkills, check the next one, on the last go return if there are no matches.

          // if the skill is in selected skills:
          if ($.inArray(projects.skills[i], $scope.selectedSkills) >= 0) {
            // one match is enough, that's good, break from the loop and dont remove the project

             console.log('match for:');
             console.log(projects.skills[i]);
             console.log(projects.title);

            break;
          } else {
            // if you get to the final skill and that doesnt match, then return and remove the project from the array
            if(i == projects.skills.length - 1){
              return
            }
          }

        }

      }

      return projects
    }

    // toggle selection for a given fruit by name
    $scope.toggleSelection = function toggleSelection(fruitName) {
      var idx = $scope.selectedSkills.indexOf(fruitName);

      // is currently selected
      if (idx > -1) {
        $scope.selectedSkills.splice(idx, 1);
      }

      // is newly selected
      else {
        $scope.selectedSkills.push(fruitName);
      }

      console.log($scope.selectedSkills);

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

    $scope.changeSkill = function(val){
      $scope.skillOnShow = val;
      console.log(val);
    }

    $scope.desc = "true";

    $scope.selectedClass = function(){
      return 'selected';
    }


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