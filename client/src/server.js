'use strict';

var express = require('express');
var health = require('express-ping');
var httpProxy = require('http-proxy');
var path = require('path');

var API_HOST = process.env.API_HOST || 'localhost';
var API_PORT = process.env.API_PORT || 2273;
var PORT = process.env.PORT || 2274;

var proxy = new httpProxy.RoutingProxy();

var proxyOptions = {
	host: API_HOST,
	port: API_PORT
};

var app = express();

app.use(health.ping());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization');

    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }
};

app.configure(function() {
    app.use(express.static(path.join(__dirname, './')));
    app.use(allowCrossDomain);
});

app.all('/*',  function (req, res) {
    return proxy.proxyRequest(req, res, proxyOptions);
});

app.listen(PORT, function(){
    console.log('Listening on port', PORT);
    console.log('   Proxy: API_HOST', API_HOST);
    console.log('   Proxy: API_PORT', API_PORT);
});
