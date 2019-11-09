var url = require('url');

const printURL = (req) => {
  console.log(`${req.method} ${req.url}`);
}

const printPathname = (req) => {
  let url_parse = url.parse(req.url, true);
  if(url_parse.pathname === '/search/socket.io/') console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
  console.log(`${req.method} ${url_parse.pathname}`);
}

const printQuery = (req) => {
  let url_parse = url.parse(req.url, true);
  console.log(`${req.method} ${JSON.stringify(url_parse.query)}`);
}

module.exports = {
  printURL,
  printPathname,
  printQuery
};
