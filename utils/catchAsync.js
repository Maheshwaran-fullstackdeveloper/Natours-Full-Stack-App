//Higher order function to eliminate try catch block repetition
module.exports = (fn) => {
  // Using return so that the inner function is called when express requests it and avoids calling it immediately
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err)); // Function call
  };
};
