/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 28.12.13
 */

'use strict';

var $ = require('jquery-browserify');

var Core = function () {
  if (Core.instance) {
    return Core.instance;
  }
  Core.instance = this;

  $('#leftBar').css('height', $('#content').height());

  return this;
};

Core.prototype.doRequest = function (url, data, callback, returnResponse) {
  if (!data) data = {};
  if (returnResponse === undefined) returnResponse = true;
  if (this.token) data.token = this.token;
  $.ajax({
    dataType: 'json',
    url: url,
    method: 'POST',
    data: data,
    success: function (response) {
      if (response.error) {
        console.error(response);
        return;
      }
      if (callback) {
        response = returnResponse ? response : undefined;
        callback(response);
      }
    }
  });
};

module.exports = Core;
