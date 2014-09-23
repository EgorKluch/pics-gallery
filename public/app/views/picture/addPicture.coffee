# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

define ['text!tpl/picture/add.ejs', 'Picture'], (tpl)->
  App.ContentFormView.extend
    title: 'Добавить картину'
    tpl: _.template tpl
    enabledValidate: false

    events:
      'keyup input': '_onKeyUp'
      'keyup textarea': '_onKeyUp'

      'change .file': ->
        return if !this.$file.val()
        $('#addPictureForm').submit()


      'click .submit': (e)->
        e.preventDefault()
        @enabledValidate = true
        return if !@_validateRequiredForm()
        data = this.$form.serializeObject()
        data.hash = @fileHash
        App.Picture.add data, (err)=>
          return @_addError 'Ошибка', err if err
          this.$form.trigger 'reset'
          this.$img.removeAttr 'src'

    initialize: ->@render()

    render: ->
      App.ContentFormView.prototype.render.call this, arguments
      this.$form = $('form', @el)
      this.$img = $('img', @el)
      this.$file = $('.file', @el)
      this.$fileUploadResult = $('#fileUploadResult', @el)
      @_initFileUpload()

    _initFileUpload: ->
      this.$fileUploadResult.load =>
        return if !this.$file.val()

        response = this.$fileUploadResult[0].contentWindow.document.body.innerHTML
        # $(response).html() not working, if JSONView plugin enabled
        response = $(response).text()
        response = JSON.parse(response)

        if !response.result
          this.$file.val ''
          return console.error response.errorMessage or 'File upload error'

        @fileHash = response.hash
        this.$img.attr 'src', response.src

    _onKeyUp: (e)->
      input = e.currentTarget
      return if !@enabledValidate or input.type is 'file'
      @_validateRequiredInput $(input)

