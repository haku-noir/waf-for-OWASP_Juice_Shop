var http = require('http');
var httpProxy = require('http-proxy');
var url = require('url');
var rd = require('./remote_data');

var proxy = httpProxy.createProxyServer();
var port = process.env.PORT || 80;

function requestHandler(req, res) {
  url_parse = url.parse(req.url, true);
  console.log(url_parse);

  res.setHeader('Access-Control-Allow-Origin', '*');
  proxy.web(req, res, {target: rd.server});
}

http.createServer(requestHandler).listen(port);
console.log('Listening http://localhost:' + port);
