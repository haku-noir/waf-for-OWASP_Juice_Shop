var http = require('http');
var httpProxy = require('http-proxy');
var checker = require('./my_modules/checker');
var logger = require('./my_modules/logger');
var rd = require('./remote_data');

var proxy = httpProxy.createProxyServer();
var port = process.env.PORT || 80;

const requestHandler = (req, res) => {
  logger.printPathname(req);
  logger.printQuery(req);

  if(checker.check(req)){
    res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
    res.write('Block');
    res.end();
  }else{
    res.setHeader('Access-Control-Allow-Origin', '*');
    proxy.web(req, res, {target: rd.server});
  }
}

http.createServer(requestHandler).listen(port);
console.log('Listening http://localhost:' + port);
