# @author EgorKluch (EgorKluch@gmail.com)
# @date: 21.09.2014

define ['text!tpl/picture/add.ejs', 'text!tpl/main/msgTpl.ejs'], (tpl, msgTpl)->
  App.ContentView.extend
    title: 'Добавить картину'
    tpl: _.template tpl
    msgTpl: _.template msgTpl

    initialize: ->
      @render()

    render: ->
      this.$el.html @tpl()
      @updateTitle()
      @_initFileUpload()

    _initFileUpload: =>
      fileHash = null
      $file = $('[type="file"]', this.$el)
      $file.change ->
        return if !$file.val()
        $('#addPictureForm').submit()

        $fileUploadResult = $('#fileUploadResult')
        $fileUploadResult.load ->
          response = $fileUploadResult[0].contentWindow.document.body.innerHTML
          # $(response).html() not working, if JSONView plugin enabled
          response = $(response).text()
          response = JSON.parse(response)
          if !response.result
            $file.val ''
            return console.error response.errorMessage or 'File upload error'

          fileHash = response.hash
          $('img', this.$el).attr 'src', response.src
