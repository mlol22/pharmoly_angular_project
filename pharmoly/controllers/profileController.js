app.controller('ProfileController', function($scope, $http, SUPABASE_URL, SUPABASE_KEY) {

  var config = {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY
    }
  };

  $scope.profile     = {};
  $scope.draft       = {};
  $scope.orders      = [];
  $scope.saving      = false;
  $scope.saveSuccess = false;
  $scope.editMode    = false;
  $scope.submitted   = false;
  $scope.errors      = [];


  var saved = localStorage.getItem('profile');
  if (saved) { $scope.profile = JSON.parse(saved); }

  
  $scope.validEmail = function(email) {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  $scope.validPhone = function(phone) {
    if (!phone) return true; // phone is optional
    return /^[\+\d\s\-\(\)]{7,20}$/.test(phone);
  };

  // Enter edit mode — copying current profile to draft for editing
  $scope.startEdit = function() {
    $scope.draft       = angular.copy($scope.profile);
    $scope.editMode    = true;
    $scope.submitted   = false;
    $scope.errors      = [];
    $scope.saveSuccess = false;
  };

  // Cancel edit  revert to orginal profile
  $scope.cancelEdit = function() {
    $scope.editMode  = false;
    $scope.submitted = false;
    $scope.errors    = [];
    $scope.draft     = {};
  };

  
  $scope.saveProfile = function() {
    $scope.submitted = true;
    $scope.errors    = [];

    if (!$scope.draft.name)                          $scope.errors.push('Full name is required.');
    if (!$scope.validEmail($scope.draft.email))      $scope.errors.push('A valid email is required.');
    if ($scope.draft.phone && !$scope.validPhone($scope.draft.phone)) $scope.errors.push('Phone number is not valid.');

    if ($scope.errors.length > 0) return;

    $scope.saving = true;

    $scope.profile = angular.copy($scope.draft);
    localStorage.setItem('profile', JSON.stringify($scope.profile));
    window.dispatchEvent(new Event('storage'));

    $scope.saving      = false;
    $scope.saveSuccess = true;
    $scope.editMode    = false;
    $scope.submitted   = false;

    setTimeout(function() {
      $scope.$apply(function() { $scope.saveSuccess = false; });
    }, 3000);

 
    fetch(SUPABASE_URL + "/users", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify({
        name:    $scope.profile.name,
        email:   $scope.profile.email,
        phone:   $scope.profile.phone   || null,
        address: $scope.profile.address || null
      })
    }).catch(function() {});
  };

  
  function loadOrders(email) {
    if (!email) { $scope.orders = []; return; }

    $http.get(SUPABASE_URL + "/products?select=*", config).then(function(res) {
      var productMap = {};
      res.data.forEach(function(p) { productMap[p.id] = p.image; });

      $http.get(SUPABASE_URL + "/orders?user_email=eq." + email + "&order=created_at.desc", config).then(function(res) {
        $scope.orders = res.data.map(function(order) {
          order.items = (order.items || []).map(function(item) {
            item.image = productMap[item.product_id] || null;
            return item;
          });
          return order;
        });
      });
    });
  }

  loadOrders($scope.profile.email);

  $scope.$watch('profile.email', function(newEmail, oldEmail) {
    if (newEmail && newEmail !== oldEmail) {
      loadOrders(newEmail);
    }
  });

});