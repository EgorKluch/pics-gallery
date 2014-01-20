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

  $('#addPictureButton', $pictureAddForm).click(function () {
    var iFrame = $('<iframe name="iFrame" id="iFrame" style="display: none" />');

    $('body').append(iFrame);

    $pictureAddForm.attr('action', '/picture/add/');
    $pictureAddForm.attr('method', 'POST');
    $pictureAddForm.attr('enctype', 'multipart/form-data');
    $pictureAddForm.attr('target', 'iFrame');
    $pictureAddForm.submit();

    $('#iFrame').load(function () {
      console.log($('#iFrame')[0].contentWindow.document.body.innerHTML);
    });

    return false;
  });
});
