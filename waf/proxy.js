var http = require('http');
var httpProxy = require('http-proxy');
var checker = require('./my_modules/checker');
var logger = require('./my_modules/logger');
var rd = require('./datas/remote_data');

var port = process.env.PORT || 80;

var proxy = httpProxy.createProxyServer();
proxy.on('error', (err, req, res) => res.end());

const requestHandler = (req, res) => {
  logger.printPathname(req);
  logger.printQuery(req);

  checker.check(req)
    .then(() => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      proxy.web(req, res, {target: rd.server});
    })
    .catch(err => {
      res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
      res.write('Block');
      res.end();
    });
}

http.createServer(requestHandler).listen(port);
console.log('Listening http://localhost:' + port);
