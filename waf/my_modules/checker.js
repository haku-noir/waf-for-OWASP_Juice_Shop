const checkers = {};

const check = (req) => {
  checkers.forEach((checker) => {
    if(checker(req)){
      return true;
    }
  });

  return false;
};

module.exports = {
  checkers,
  check
}
