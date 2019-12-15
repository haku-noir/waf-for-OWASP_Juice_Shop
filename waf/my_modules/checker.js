const url = require('url');

const queryChecker = req => new Promise((resolve, reject) => {
  let check_items = require('../datas/query-check.json');
  let url_parse = url.parse(req.url, true);

  let attack = false;
  check_items.some(check_item => {
    if(url_parse.pathname === check_item.pathname && url_parse.query[check_item.query]
        && url_parse.query[check_item.query].indexOf(check_item.value) !== -1){
      attack = true;
    }

    if(attack) reject();

    return attack;
  });

  resolve();
});

const checkers = {
  queryChecker
};

const check = req => new Promise((resolve, reject) => {
  Promise.all([
    queryChecker(req)
  ]).then(() => resolve()).catch(() => reject())
});

module.exports = {
  checkers,
  check
}
