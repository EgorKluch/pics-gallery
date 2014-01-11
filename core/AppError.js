/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 07.01.14
 */

var util = require("util");

/**
 * @param {String|Error} err
 * @param {Number} [errorCode=0]
 * @param {Number} [status=500]
 * @constructor
 */
var AppError = function (err, errorCode, status) {
  this.stack = null;

  if (err instanceof AppError) return err;

  if (err instanceof Error) {
    this.message = err.message;
    this.code = err.code;
  } else {
    Error.call(this, err);
    this.message = err;
  }

  if (!this.stack) {
    Error.captureStackTrace(this, AppError);
  }

  this.errorCode = errorCode ? errorCode : 0;
  this.status = status ? status : 500;
};

util.inherits(AppError, Error);

AppError.prototype.getData = function () {
  return {
    result: 0,
    errorCode: this.errorCode,
    errorMessage: this.message
  };
};

module.exports = AppError;
