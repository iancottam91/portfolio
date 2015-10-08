// the controller is used to link the the model to the view. 
// it handles interactions with the view and updates the model accordingly


var pluginControllers = angular.module('pluginControllers', []);



pluginControllers.controller('HomeCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    

  }]);


pluginControllers.controller('PluginsCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    
    // can load JSON data with built in http service: https://docs.angularjs.org/tutorial/step_05
    $http.get('assets/angular/json/plugins.json').success(function(data) {
      $scope.plugins = data;
    });


  }]);

pluginControllers.controller('PluginDetailCtrl', ['$scope', '$routeParams', '$http', '$ocLazyLoad', '$sce', 

  function($scope, $routeParams, $http, $ocLazyLoad, $sce) {

    $scope.plugin = {
      "html" : ""
    };


    // load default option
    $http.get('assets/angular/json/plugins/timeline.json').success(function(data) {
      $scope.plugin.html = $sce.trustAsHtml(data.options.default.html);  
      window.setTimeout($scope.callTimeline, 1);
    });


    // load the timeline script & call code
    if($routeParams.pluginTitle === "timeline"){

      $scope.plugin.title = $routeParams.pluginTitle;    

      $ocLazyLoad.load('assets/js/plugins/timeline.js').then(function(){
        $("#timeline-wrapper").addSlider({"timerValue": 40, "sliderStep": 2, "keyNavigation": 1,"viewPos": "right"}).parent().css({
          opacity: 1,
          height: 'auto'
        });
      });

    }

    $scope.callTimeline = function(){
      $("#timeline-wrapper").addSlider({"timerValue": 40, "sliderStep": 2, "keyNavigation": 1,"viewPos": "right"}).parent().css({
        opacity: 1,
        height: 'auto'
      });
    }
    

    // need to get these options from the data model (JSON)
    $scope.option = {
      availableOptions: [
        {id: 'default', name: 'Default'},
        {id: 'single', name: 'Single'},
        {id: 'scroll', name: 'Scroll'}
      ],
      selectedOption: {id: 'default', name: 'Default'} //This sets the default value of the select in the ui
    }; 

    $scope.changeOption = function(a){

      var htmlProperty = $scope.option.selectedOption.id;

      $http.get('assets/angular/json/plugins/timeline.json').success(function(data) {
        $scope.plugin.html = $sce.trustAsHtml(data.options[htmlProperty].html);  
        window.setTimeout($scope.callTimeline, 1);
      });

    }

  }]);