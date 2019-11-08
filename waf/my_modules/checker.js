const checkers = {};

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
