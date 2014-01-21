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
      var response = $('#iFrame')[0].contentWindow.document.body.innerHTML;
      response = $(response).html();
      response = JSON.parse(response);
      
      if (!response.result) {
        alert('Изините, произошла ошибка');
        return console.error(response.errorMessage);
      }
      JSON.parse(response);
      alert('Картина успешно создана');
      location.reload();
    });
    return false;
  });
});
