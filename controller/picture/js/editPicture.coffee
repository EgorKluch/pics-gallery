# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict'


require('../../main/js/core')
require('../../main/js/main')

BootstrapForm = require('../../main/js/BootstrapForm')

$(document).ready ->
  $editPictureForm = $('#editPictureForm')
  pictureId = $('.attribute[data-id="pictureId"]').attr 'data-value'

  alertManager = new AlertManager '#alerts'
  form = new BootstrapForm $editPictureForm

  enabledValidate = false
  onKeyUp = ->
    $this = $(this)
    return if !enabledValidate or $this.attr('type') is 'file'
    name = $this.attr('name')
    isValid = form[name].validateRequiredError()
    form[name].markInput isValid
  $('input', $editPictureForm).keyup onKeyUp
  $('textarea', $editPictureForm).keyup onKeyUp

  $('.btn[data-action="editPicture"]', $editPictureForm).click ->
    enabledValidate = true
    return false if !form.validateRequiredError()
    $.ajax {
      data: form.getData()
      dataType: 'json'
      url: '/picture/' + pictureId + '/edit'
      type: 'POST'
      success: (response)->
        return console.error response.errorMessage if response.error
        window.location.href = '/'
      error: (response)->
        error = JSON.parse(response.responseText);
        console.error(error.errorMessage);
    }

  $('.btn[data-action="deletePicture"]', $editPictureForm).click ->
    $.ajax {
      dataType: 'json'
      url: '/picture/' + pictureId + '/delete'
      type: 'POST'
      success: (response)->
        return alertManager.addError 'Ошибка', response.errorMessage if response.error
        window.location.href = '/'
      error: (response)->
        error = JSON.parse response.responseText
        alertManager.addError 'Ошибка', error.errorMessage
    }
