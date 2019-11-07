var http = require('http');
var httpProxy = require('http-proxy');
var rd = require('./remote_data');

var port = process.env.PORT || 80;

function requestHandler(req, res) {
  var proxy = httpProxy.createProxyServer();

  res.setHeader('Access-Control-Allow-Origin', '*');
  proxy.web(req, res, {target: rd.server});
}

http.createServer(requestHandler).listen(port);
console.log('Listening http://localhost:' + port);
