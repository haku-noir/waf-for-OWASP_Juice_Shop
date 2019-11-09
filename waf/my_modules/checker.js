var url = require('url');

const queryChecker = (req) => {
  let url_parse = url.parse(req.url, true);

  if(url_parse.pathname === "/rest/products/search"
      && url_parse.query["q"].indexOf("'") !== -1){
    return true;
  }
  return false;
}

const checkers = {
  queryChecker
};

const check = (req) => {
  let attack = false;

  Object.keys(checkers).some((key) => {
    let checker = checkers[key];

    if(checker(req)){
      attack = true;
      return attack;
    }

    return attack;
  });

  return attack;
};

module.exports = {
  checkers,
  check
}
