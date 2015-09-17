var Promise = require("bluebird");

module.exports = function(app, cb) {

  var samples = [{
    model: 'Publisher',
    file: '../sample-data/publishers.json'
  }, {
    model: 'Brand',
    file: '../sample-data/brands.json'
  }, {
    model: 'Product',
    file: '../sample-data/products.json'
  }, {
    model: 'Cronjob',
    file: '../sample-data/cronjobs.json'
  }];

  Promise.each(samples, function(sample) {
    var Model = app.models[sample.model];
    var items = require(sample.file);
    console.log('Initialize data for %s', sample.model);
    return Promise.map(items, function(item) {
      return Model.create(item);
    });
  }).then(function() {
    cb();
  }).catch(cb);

};
