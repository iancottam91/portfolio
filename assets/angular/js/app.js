
// the main APP loads the two dependencies:
// - ngRoute: a standard angular module
// - pluginControllers: our custom module

var pluginApp = angular.module('pluginApp', ['ngRoute',
  'pluginControllers', 'oc.lazyLoad']);


// define our routes with the $routeProvider from ngRoute
pluginApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl : '/assets/angular/partials/home.html',
        controller  : 'HomeCtrl'
      }).
      when('/plugins', {
        templateUrl: '/assets/angular/partials/plugin-list.html',
        controller: 'PluginsCtrl'
      }).
      when('/plugins/:pluginTitle', {
        templateUrl: '/assets/angular/partials/plugin-detail.html',
        controller: 'PluginDetailCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);


// custom filters
pluginApp.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});