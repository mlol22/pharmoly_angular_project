var app = angular.module('pharmolyApp', ['ngRoute']);

// Supabase config — shared across all controllers
app.constant('SUPABASE_URL', 'https://dqcddwgtbiowtymwxtur.supabase.co/rest/v1');
app.constant('SUPABASE_KEY', 'sb_publishable_TND3y-Rt4NF0o50wJiTRbw_bhBR5WIS');

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
    .when('/products/:category', {
  templateUrl: 'views/products.html',
  controller:  'ProductController'
})
.when('/products', {
  templateUrl: 'views/products.html',
  controller:  'ProductController'
})
    .otherwise({ redirectTo: '/' });
    
});
