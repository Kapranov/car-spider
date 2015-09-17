var app = angular.module('app', [
  'lbServices',
  'ui.router',
  'ui.select2',
  'ui-rangeSlider'
]);

app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: 'views/app.html',
        abstract: true
      })
      .state('app.products', {
        url: '/products',
        template: '<ui-view></ui-view>',
        abstract: true
      })
      .state('app.products.list', {
        url: '/list',
        templateUrl: 'views/products.html',
        controllerAs: 'ctrl',
        controller: function(products) {
          this.products = products;
          this.search = "";
        },
        resolve: {
          products: function(Product) {
            return Product.find({
              filter: {
                where: {
                  status: 'published'
                },
                include: ['brand', 'publisher']
              }
            }).$promise;
          }
        }
      })
      .state('app.products.edit', {
        url: '/edit',
        template: '<h1>Edit!</h1>'
      })
      .state('app.products.view', {
        url: '/:productId',
        template: '<cs-product product="ctrl.product"></cs-product>',
        controllerAs: 'ctrl',
        controller: function(product) {
          this.product = product;
        },
        resolve: {
          product: function($stateParams, Product) {
            return Product.findOne({
              filter: {
                where: {
                  id: $stateParams.productId
                },
                include: ['brand', 'publisher']
              }
            }).$promise;
          }
        }
      })
      .state('app.brands', {
        url: '/brands',
        template: '<ui-view></ui-view>',
        abstract: true
      })
      .state('app.brands.list', {
        url: '/brands/list',
        templateUrl: 'views/brands.html',
        controllerAs: 'ctrl',
        controller: function(brands) {
          this.brands = brands;
        },
        resolve: {
          brands: function(Brand) {
            return Brand.find({
              filter: {
                include: ['products']
              }
            }).$promise.then(function(brands) {
                return brands.filter(function(brand) {
                  return brand.products.length
                })
              });
          }
        }
      })
      .state('app.brands.view', {
        url: '/:brandId',
        template: '<cs-brand brand="ctrl.brand"></cs-brand>',
        controllerAs: 'ctrl',
        controller: function(brand) {
          this.brand = brand;
        },
        resolve: {
          brand: function($stateParams, Brand) {
            return Brand.findOne({
              filter: {
                where: {
                  id: $stateParams.brandId
                },
                include: ['products']
              }
            }).$promise;
          }
        }
      });

    $urlRouterProvider.otherwise('/app/products/list');
  }]);


app.controller('AppCtrl', function($scope) {
  var currentYear = new Date().getFullYear();
  $scope.items = [];
  $scope.yearLimit = currentYear;
  for (var i = 1900; i < currentYear + 1; i++) $scope.items.push(i);
});

app.controller('BrandController', ['$scope', '$http', function($scope, $http) {
  $http.get('/api/v1/brands/').success(function(brandData) {
    $scope.brand = brandData;
  });
  $scope.select2Options = {
    allowClear:true
  };
}]);

app.controller('ProductController', ['$scope', '$http', function($scope, $http) {
  // var productId = 1;
  // $http.get('/api/v1/products/' + productId).success(function(productData) {
  $http.get('/api/v1/products/').success(function(productData) {
    $scope.product = productData;
  });
  $scope.minPrice = 100;
  $scope.maxPrice = 999;

  $scope.productMinPrice = $scope.minPrice;
  $scope.productMaxPrice = $scope.maxPrice;
}]);

app.directive('input', function() {
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function(scope, element, attrs, ngModel) {
      if ('type' in attrs && attrs.type.toLowerCase() === 'range') {
        ngModel.$parsers.push(parseFloat);
      }
    }
  };
});

app.directive('yearDrop', function() {
  var currentYear = new Date().getFullYear();
  return {
    link: function(scope,element,attrs){
      scope.years = [];
      for (var i = +attrs.offset; i < +attrs.range + 1; i++){
        scope.years.push(currentYear + i);
      }
      scope.selected = currentYear;
    },
    template: '<select ng-model="selected" ng-options="y for y in years" style="width:230px"></select>'
  }
});

app.directive('csProduct', function() {
  return {
    templateUrl: 'views/cs-product.html',
    scope: {
      product: '='
    }
  }
});

app.directive('csBrand', function() {
  return {
    templateUrl: 'views/cs-brand.html',
    scope: {
      brand: '='
    }
  }
});
