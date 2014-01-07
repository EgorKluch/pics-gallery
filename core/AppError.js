/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 07.01.14
 */

var util = require("util");

var AppError = function (errorCode, message) {
  Error.call(this, message);
  Error.captureStackTrace(this, AppError);

  this.errorCode = errorCode;
  this.message = message;
};

util.inherits(AppError, Error);

AppError.prototype.getData = function () {
  return {
    result: 0,
    errorCode: this.errorCode,
    message: this.message
  };
};

module.exports = AppError;
