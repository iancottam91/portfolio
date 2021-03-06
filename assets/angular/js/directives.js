  // the controller is used to link the the model to the view. 
// it handles interactions with the view and updates the model accordingly


var porfolioDirectives = angular.module('porfolioDirectives', []);


porfolioDirectives.directive('sitePanel', function() {
    return {
      restrict: 'E',
      scope: {
        details: '=details'
      },
      templateUrl: '/assets/angular/partials/directives/site-panel.html'
    };
  });