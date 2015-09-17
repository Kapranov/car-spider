var request = require('request');
var cheerio = require('cheerio');

module.exports = function(Maintenance) {

  Maintenance.fetch = function() {
    return new Promise(function(resolve, reject) {

      var self = this;

      console.log('Fetching the sites!');

      var Publisher = Maintenance.app.models.Publisher;

      var result = {
        count: {
          success: 0,
          failure: 0
        }
      };

      Publisher.find()
        .then(function(publishers) {

          return Promise.all(publishers.map(function(publisher) {

            return Maintenance.fetchPublisher(publisher);
            //  .then(function(res) {
            //    console.log('fetchPublisher res: ' + res);
            //    result.count.success++;
            //  }
            //).catch(function(err) {
            //    console.log('fetchPublisher err: ' + err);
            //    result.count.failure++;
            //  }
            //);

          }));

        })
        .then(function(promiseAll) {
          console.log('promiseAll', promiseAll);
        })
        .then(function() {
          resolve(null, self.result);
        })
        .catch(function(err) {
          reject(err);
        });


    });
  };

  Maintenance.publishers = {
    snellers: true,
    prinsesclusivo: true,
    firstgearcars: true
  };

  Maintenance.fetchPublisher = function(publisher) {
    return new Promise(function(resolve, reject) {
      var slug = publisher.slug;

      if (Maintenance.publishers[slug] === undefined) {
        return reject('Unknown fetcher for publisher ' + slug);
      }
      if(publisher.endpoint === undefined) {
        return reject('Unknown endpoint for publisher ' + slug);
      }

      console.log(publisher);

      request(publisher.endpoint, function(err, response, body) {
        if (err) reject(err);

        var parsed = parsePublisherResult()

      });


      setTimeout(function() {
        resolve('Fetching from publisher ' + slug);
      }, 1000);

    });

  };


  function cleanString(str) {
    str = str.replace(/\t/g, '');
    str = str.replace(/\n/g, '');
    str = str.trim();
    return str;
  }

  function parsePublisherResult(publisher, body) {
    var result = null;
    //
    //var $ = cheerio.load(body);
    //
    //
    //switch (publisher) {
    //  case 'snellers':
    //    var items = $('div.occassions a');
    //    items.each(function(idx) {
    //      var item = $(items[idx]);
    //
    //      var url = site.base + item.attr('href');
    //      var image = item.find('img').attr('src');
    //      var title = cleanString(item.find('.model').text());
    //      var desc = cleanString(item.find('.model').text());
    //      var price = cleanString(item.find('.price').text());
    //
    //      if (price == 'Verkocht') {
    //        price = null;
    //      }
    //
    //      var result = {
    //        name: title,
    //        description: desc,
    //        url: url,
    //        image: image,
    //        price: price,
    //        details: {}
    //      };
    //
    //      if (price) {
    //        contents.push(result);
    //      }
    //    });
    //    break;
    //}

    return result;
  }

};
