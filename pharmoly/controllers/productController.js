app.controller('ProductController', function($scope, $http, SUPABASE_URL, SUPABASE_KEY) {

  var config = {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY
    }
  };

  $scope.cart         = JSON.parse(localStorage.getItem("cart")) || [];
  $scope.sortType     = "";
  $scope.filterRating = "";
  $scope.filterPrice  = "";

  $scope.addToCart = function(product) {
    $scope.cart.push(product);
    localStorage.setItem("cart", JSON.stringify($scope.cart));
  };

  $scope.applyFilter = function() {
    var arr = angular.copy($scope.products);
    if ($scope.filterRating) {
      var selected = parseInt($scope.filterRating);
      arr = arr.filter(function(p) { return p.rating === selected; });
    }
    if ($scope.filterPrice) {
      var parts = $scope.filterPrice.split("-");
      arr = arr.filter(function(p) { return p.price >= parseFloat(parts[0]) && p.price <= parseFloat(parts[1]); });
    }
    $scope.filteredProducts = arr;
    $scope.sortProducts();
  };

  $scope.sortProducts = function() {
    var arr = angular.copy($scope.filteredProducts);
    if ($scope.sortType === "priceLow")  arr.sort(function(a,b){ return a.price - b.price; });
    if ($scope.sortType === "priceHigh") arr.sort(function(a,b){ return b.price - a.price; });
    if ($scope.sortType === "nameAsc")   arr.sort(function(a,b){ return a.name.localeCompare(b.name); });
    if ($scope.sortType === "nameDesc")  arr.sort(function(a,b){ return b.name.localeCompare(a.name); });
    $scope.filteredProducts = arr;
  };

  $scope.clearFilters = function() {
    $scope.filterRating = "";
    $scope.filterPrice  = "";
    $scope.filteredProducts = angular.copy($scope.products);
    $scope.sortProducts();
  };

  $scope.loadProducts = function(category) {
    var url = SUPABASE_URL + "/products?select=*";
    if (category) { url += "&category=eq." + category; }
    $http.get(url, config).then(function(res) {
      $scope.products         = res.data;
      $scope.filteredProducts = res.data;
      $scope.applyFilter();
    });
  };

  $scope.loadFeatured = function() {
    $http.get(SUPABASE_URL + "/products?featured=eq.true&select=*", config).then(function(res) {
      $scope.featuredProducts = res.data;
    });
  };

  $scope.loadProducts();
  $scope.loadFeatured();

});