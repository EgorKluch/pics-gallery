/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 28.12.13
 */

'use strict';

var $ = require('jquery-browserify');

$(document).ready(function() {
  $('#leftBar').css('height', $('#content').height());
});

require('../../user/js/main.js');
