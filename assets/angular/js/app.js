
// the main APP loads the two dependencies:
// - ngRoute: a standard angular module
// - pluginControllers: our custom module

var porfolioApp = angular.module('porfolioApp', ['ngRoute',
  'porfolioControllers', 'porfolioDirectives' , 'oc.lazyLoad', 'angular-flexslider']);


// define our routes with the $routeProvider from ngRoute
porfolioApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl : 'assets/angular/partials/home.html',
        controller  : 'HomeCtrl'
      }).
      when('/projects', {
        templateUrl: 'assets/angular/partials/projects-list.html',
        controller: 'ProjectsCtrl'
      }).
      when('/projects/:projectTitle', {
        templateUrl: 'assets/angular/partials/projects-detail.html',
        controller: 'ProjectDetailCtrl'
      }).
      when('/experience', {
        templateUrl: 'assets/angular/partials/experience-list.html',
        controller: 'ExperienceCtrl'
      }).
      when('/contact', {
        templateUrl: 'assets/angular/partials/contact.html',
        controller: 'ContactCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


// custom filters
porfolioApp.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});