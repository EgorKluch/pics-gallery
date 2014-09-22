# @author EgorKluch (EgorKluch@gmail.com)
# @date: 22.09.2014

define ['text!tpl/user/signIn.ejs'], (tpl)->
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
        app.callApi 'user/signIn', data, (err, response)=>
          return @_addError 'Ошибка', err if err
          app.trigger 'signIn', { user: response.user }
          app.navigate '/'

    initialize: ->@render()

    render: ->
      App.ContentView.prototype.render.call this, arguments
      this.$form = $('form', @el)
