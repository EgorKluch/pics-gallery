# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict'

require('../../main/js/core')
require('../../main/js/main')

BootstrapForm = require('../../main/js/BootstrapForm')

$(document).ready ->
  $addPictureForm = $('#addPictureForm')
  $fileInput = $('[type="file"]', $addPictureForm)
  $fileImage = $('img', $addPictureForm)
  fileHash = null

  alertManager = new AlertManager '#alerts'
  form = new BootstrapForm $addPictureForm

  $fileInput.change ->
    return if !$fileInput.val()
    $iFrame = $('<iframe name="iFrame" id="iFrame" style="display: none">');
    $('body').append($iFrame);
    # Use hack for send file
    # Jade template engine not apply create form in form
    # Therefore send #addPictureForm (but on the server used only file info)
    $addPictureForm
      .attr('action', '/picture/upload/')
      .attr('method', 'POST')
      .attr('enctype', 'multipart/form-data')
      .attr('target', 'iFrame')
      .submit()

    $iFrame.load ->
      response = $iFrame[0].contentWindow.document.body.innerHTML
      response = $(response).html();
      response = JSON.parse(response);
      if !response.result
        $fileInput.val ''
        return console.error(response.errorMessage)

      fileHash = response.hash
      $fileImage.attr 'src', response.src

  enabledValidate = false
  onKeyUp = ->
    $this = $(this)
    return if !enabledValidate or $this.attr('type') is 'file'
    name = $this.attr('name')
    isValid = form[name].validateRequiredError()
    form[name].markInput isValid
  $('input', $addPictureForm).keyup onKeyUp
  $('textarea', $addPictureForm).keyup onKeyUp

  $('.btn[data-action="addPicture"]', $addPictureForm).click ->
    enabledValidate = true
    return false if !form.validateRequiredError()
    data = form.getData()
    data.hash = fileHash
    $.ajax {
      data
      dataType: 'json'
      url: '/picture/add'
      type: 'POST'
      success: (response)->
        return alertManager.addError response.errorMessage if response.error
        window.location.href = '/'
      error: (response)->
        error = JSON.parse response.responseText
        alertManager.addError error.errorMessage
    }
