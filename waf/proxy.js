var http = require('http');
var httpProxy = require('http-proxy');
var logger = require('./my_modules/logger');
var rd = require('./remote_data');

var proxy = httpProxy.createProxyServer();
var port = process.env.PORT || 80;

function requestHandler(req, res) {
  logger.printPathname(req);
  logger.printQuery(req);

  res.setHeader('Access-Control-Allow-Origin', '*');
  proxy.web(req, res, {target: rd.server});
}

http.createServer(requestHandler).listen(port);
console.log('Listening http://localhost:' + port);
