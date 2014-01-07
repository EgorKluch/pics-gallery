/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 31.12.13
 */

'use strict';

var Core = function () {
  Core.prototype.token = null;
  Core.prototype.userId = null;
};

Core.prototype.doRequest = function(url, data, callback) {
  if (data == null) data = {};

  if (this.token != null) {
    data.token = this.token;
  }

  return $.ajax({
    dataType: 'json',
    url: url,
    type: 'POST',
    data: data,
    success: callback,
    error: function () {
      throw(arguments);
    }
  });
};

module.exports = Core;
