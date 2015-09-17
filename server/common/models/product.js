var utils = require('loopback-datasource-juggler/lib/utils');

module.exports = function (Product) {

  var self = this;
  this.brands = [];

  Product.validatesUniquenessOf('url');

  Product.observe('before save', function (ctx, next) {
    if (ctx.isNewInstance) {
      ctx.instance.handleNewInstance(ctx.instance).then(function (instance) {
        return ctx.instance.rateNewInstance(instance)
      }).then(function (instance) {
        ctx.instance = instance;
        next();
      }).catch(next);
    } else {
      next();
    }
  });

  // Run the tasks on a new instance
  Product.prototype.handleNewInstance = function handleNewInstance(data, cb) {
    cb = cb || utils.createPromiseCallback();
    this.findBrandName(data).then(function (res) {
      return res;
    }).then(function (res) {
      cb(null, res);
    }).catch(cb);
    return cb.promise;
  };

  // Rate the new instance after the tasks ran
  Product.prototype.rateNewInstance = function rateNewInstance(data, cb) {
    cb = cb || utils.createPromiseCallback();
    process.nextTick(function () {
      if (data.brandId) {
        data.status = 'published';
      } else {
        data.status = 'waiting';
      }
      if (!data.description) {
        data.description = data.name;
      }
      cb(null, data);
    });
    return cb.promise;
  };

  // Search for brand name
  Product.prototype.findBrandName = function findBrandName(product, cb) {
    cb = cb || utils.createPromiseCallback();

    Product.app.models.Brand.find().then(function (brands) {
      // Loop through all brands
      brands.map(function (brand) {
        // Figure out brandId
        if (product.brandId === null) {
          // Loop through all aliases
          brand.alias.map(function (alias) {
            var searchName = product.name.toLowerCase();
            var searchAlias = alias.toLowerCase();
            // See if we can map it
            if (searchName.includes(searchAlias)) {
              product.brandId = brand.id;
              product.details = {matchWord: searchAlias}
            }
          });
        }
      });
      return product;
    }).then(function (product) {
      cb(null, product);
    }).catch(cb);
    return cb.promise;
  }

};
