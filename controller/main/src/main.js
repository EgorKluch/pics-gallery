/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 28.12.13
 */

'use strict';
/*
var $ = require('jquery-browserify');

var Core = require('../../../core/js/Core.js');
var core = new Core();


$(document).ready(function() {
  $('#leftBar').css('height', $('#content').height());

  $('.deletePictureButton').click(function () {
    try {
      var $this = $(this);
      var href = $this.attr('href');
      core.doRequest(href, function (response) {
        if (!response.result) return console.error(response.errorMessage);
        $this.parent().parent().parent().parent().parent().parent().remove();
      });
    } catch (e) {
      console.error(e);
    }
    return false;
  });
});
*/
require('../../user/js/main.js');
