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
  var $pictureEditForm = $('#pictureEditForm');

  $('#editPictureButton', $pictureEditForm).click(function () {
    var iFrame = $('<iframe name="iFrame" id="iFrame" style="display: none" />');

    $('body').append(iFrame);


    $pictureEditForm.attr('action', $(this).attr('href'));
    $pictureEditForm.attr('method', 'POST');
    $pictureEditForm.attr('enctype', 'multipart/form-data');
    $pictureEditForm.attr('target', 'iFrame');
    $pictureEditForm.submit();

    $('#iFrame').load(function () {
      var response = $('#iFrame')[0].contentWindow.document.body.innerHTML;
      response = $(response).html();
      response = JSON.parse(response);

      if (!response.result) {
        alert('Извините, произошла ошибка');
        return console.error(response.errorMessage);
      }

      alert('Картина успешно изменина');
      location.reload();
    });
    return false;
  });

  $('#deletePictureButton', $pictureEditForm).click(function () {
    var id = $('#pictureId', $pictureEditForm).val();

    core.doRequest($(this).attr('href'), { id: id }, function(response) {
      if (!response.result) return console.error(response.errorMessage);
      location.reload();
    });
    return false;
  });

});
