/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 20.01.14
 */

'use strict';

require('../../main/src/main.js');

var $ = require('jquery-browserify');

var Core = require('../../../core/js/Core.js');

var core = new Core();


$(document).ready(function () {
  var $pictureAddForm = $('#pictureAddForm');
  $('.pictureAdd', $pictureAddForm).click(function () {
    $pictureAddForm[0].submit();
    return false;
  });
});
