app.controller('HomeController', function($scope, $http, SUPABASE_URL, SUPABASE_KEY) {

  var config = {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY
    }
  };

  $scope.cartCount  = JSON.parse(localStorage.getItem('cart') || '[]').length;
  $scope.subscribed = false;
  $scope.Math = Math;

  $scope.trustBadges = [
    { icon:"fa-solid fa-shield-halved", title:"100% Authentic",  desc:"All products are verified and genuine" },
    { icon:"fa-solid fa-truck",         title:"Fast Delivery",   desc:"Same-day dispatch on orders before 2pm" },
    { icon:"fa-solid fa-rotate-left",   title:"Easy Returns",    desc:"30-day hassle-free return policy" },
    { icon:"fa-solid fa-headset",       title:"24/7 Support",    desc:"Our team is always here to help you" }
  ];

  $scope.categories = [
    {name:"Baby",      icon:"fa-solid fa-baby",        cat:"baby"},
    {name:"Beauty",    icon:"fa-solid fa-spa",          cat:"beauty"},
    {name:"Grocery",   icon:"fa-solid fa-cart-plus",    cat:"grocery"},
    {name:"Health",    icon:"fa-solid fa-heart-pulse",  cat:"health"},
    {name:"Herbs",     icon:"fa-solid fa-leaf",         cat:"herbs"},
    {name:"Medicines", icon:"fa-solid fa-pills",        cat:"medicines"}
  ];

  $scope.testimonials = [
    { name:"Sarah M.",  role:"Regular Customer",  rating:5, comment:"Amazing quality products and super fast delivery. My go-to pharmacy online!", avatar:"https://i.pravatar.cc/150?img=47" },
    { name:"James K.",  role:"Verified Buyer",    rating:5, comment:"Great prices and the fish oil supplement is genuinely top notch. Highly recommend.", avatar:"https://i.pravatar.cc/150?img=12" },
    { name:"Lina T.",   role:"Health Enthusiast", rating:4, comment:"Love the variety of products. The protein powder arrived quickly and tastes great!", avatar:"https://i.pravatar.cc/150?img=32" }
  ];

  $scope.products = [];

  $http.get(SUPABASE_URL + "/home_products?select=*", config).then(function(res) {
    $scope.products = res.data;
  });

  $scope.addToCart = function(product) {
    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    $scope.cartCount++;
  };

  $scope.subscribe = function() {
    if ($scope.email) { $scope.subscribed = true; $scope.email = ''; }
  };

});