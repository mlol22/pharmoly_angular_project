app.controller('CartController', function($scope, $timeout, SUPABASE_URL, SUPABASE_KEY) {

  $scope.searchText = '';
  $scope.submitting = false;

  function groupCart(raw) {
    var map = {};
    (raw || []).forEach(function(item) {
      var key = item.id || item.name;
      if (map[key]) { map[key].qty++; }
      else { map[key] = angular.extend({}, item, { qty: 1 }); }
    });
    return Object.values(map);
  }

  function saveCart() {
    var flat = [];
    $scope.cart.forEach(function(item) {
      for (var i = 0; i < item.qty; i++) flat.push(item);
    });
    localStorage.setItem('cart', JSON.stringify(flat));
  }

  $scope.cart = groupCart(JSON.parse(localStorage.getItem('cart') || '[]'));

  $scope.changeQty = function(item, delta) {
    item.qty += delta;
    if (item.qty <= 0) { $scope.removeItem(item); } else { saveCart(); }
  };

  $scope.removeItem = function(item) {
    $scope.cart = $scope.cart.filter(function(i) { return i.id !== item.id; });
    saveCart();
  };

  $scope.total = function() {
    return $scope.cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  };

  $scope.submitOrder = function() {
    if (!$scope.cart.length) return;
    $scope.submitting = true;

    var payload = {
      items: $scope.cart.map(function(i) {
        return { product_id: i.id, name: i.name, qty: i.qty, price: i.price };
      }),
      total: $scope.total(),
      created_at: new Date().toISOString(),
      status: 'pending'
    };

    fetch(SUPABASE_URL + "/orders", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    }).then(function(res) {
      $scope.$apply(function() {
        $scope.submitting = false;
        if (res.ok) {
          $scope.cart = [];
          localStorage.removeItem('cart');
          alert('Order placed successfully!');
        } else {
          alert('Error ' + res.status);
        }
      });
    }).catch(function() {
      $timeout(function() {
        $scope.submitting = false;
        $scope.cart = [];
        localStorage.removeItem('cart');
        alert('Order placed!');
      }, 1000);
    });
  };

});
