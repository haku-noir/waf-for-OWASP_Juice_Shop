var url = require('url');

const queryChecker = (req) => {
  let check_items = require('../datas/query-check.json');
  let url_parse = url.parse(req.url, true);

  let attack = false;
  check_items.forEach((check_item) => {
    if(url_parse.pathname === check_item.pathname
        && url_parse.query[check_item.query].indexOf(check_item.value) !== -1){
      attack = true;
    }

    return attack;
  });

  return attack;
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
    }

    return attack;
  });

  return attack;
};

module.exports = {
  checkers,
  check
}
