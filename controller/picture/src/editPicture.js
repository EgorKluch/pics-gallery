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
    $pictureEditForm[0].submit();
    return false;
  });

  $('#deletePictureButton', $pictureEditForm).click(function () {
    var id = $('#pictureId', $pictureEditForm).val();

    core.doRequest('/picture/delete', { id: id }, function(response) {
      if (!response.result) return console.error(response.errorMessage);
      location.reload();
    });
    return false;
  });

});
