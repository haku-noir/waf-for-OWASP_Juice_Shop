const http = require('http');
const httpProxy = require('http-proxy');
const checker = require('./my_modules/checker');
const logger = require('./my_modules/logger');
const rd = require('./datas/remote_data');

const port = process.env.PORT || 80;

const proxy = httpProxy.createProxyServer();
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
