# @author EgorKluch (EgorKluch@gmail.com)
# @date: 22.09.2014

define ['text!userSignInTpl', 'User'], (tpl)->
  App.ContentFormView.extend
    tpl: _.template tpl
    title: 'Авторизация'
    enabledValidate: false

    events:
      'keyup input': (e)->
        return if !@enabledValidate
        @_validateRequiredInput $(e.currentTarget)

      'click .submit': (e)->
        e.preventDefault()
        @enabledValidate = true
        return if !@_validateRequiredForm()
        data = this.$form.serializeObject()
        App.User.signIn data, (err)=>
          @_addError 'Ошибка', err if err


    initialize: ->
      @render()
      app.on 'signIn', ->app.navigate '/'

    render: ->
      App.ContentView.prototype.render.call this, arguments
      this.$form = $('form', @el)
