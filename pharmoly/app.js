var app = angular.module('pharmolyApp', ['ngRoute']);

// Supabase config — shared across all controllers
app.constant('SUPABASE_URL', 'https://dqcddwgtbiowtymwxtur.supabase.co/rest/v1');
app.constant('SUPABASE_KEY', 'sb_publishable_TND3y-Rt4NF0o50wJiTRbw_bhBR5WIS');

// Global controller for index.html — shows user name on all pages
app.controller('AppController', function($scope) {
  var profile = JSON.parse(localStorage.getItem('profile') || '{}');
  $scope.userName = profile.name || null;

  // Watch localStorage for changes when user saves profile
  window.addEventListener('storage', function() {
    var p = JSON.parse(localStorage.getItem('profile') || '{}');
    $scope.$apply(function() { $scope.userName = p.name || null; });
  });
});

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller:  'HomeController'
    })
    .when('/products', {
      templateUrl: 'views/products.html',
      controller:  'ProductController'
    })
    .when('/cart', {
      templateUrl: 'views/cart.html',
      controller:  'CartController'
    })
    .when('/profile', {
      templateUrl: 'views/profile.html',
      controller:  'ProfileController'
    })
    .otherwise({ redirectTo: '/' });
});