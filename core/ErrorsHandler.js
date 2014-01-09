/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 07.01.14
 */

var Core = require('./Core');
var AppError = require('./AppError');

var core = new Core();

var ErrorsHandler = function () {
  if (ErrorsHandler.instance) return ErrorsHandler.instance;

  return ErrorsHandler.instance = this;
};

ErrorsHandler.prototype.initialize = function (app) {
  app.use(function(err, req, res, next){
    console.log('\n\n');
    console.error(err.stack);
    console.log('\n\n');

    if (err instanceof AppError) {
      res.status(500);
      res.json(err.getData());
    }
    else {
      next(new AppError(0, 'Unknown error'));
    }
  });
};

module.exports = ErrorsHandler;
