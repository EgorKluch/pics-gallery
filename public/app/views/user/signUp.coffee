# @author EgorKluch (EgorKluch@gmail.com)
# @date: 22.09.2014

define ['text!tpl/user/signUp.ejs'], (tpl)->
  App.ContentFormView.extend
    title: 'Регистрация'
    tpl: _.template tpl
    enabledValidate: false

    events:
      'keyup input': (e)->
        el = e.currentTarget
        return if !@enabledValidate
        @._validateRequiredInput $(el)
        @._validateReapeatPasswordError()

      'click .submit': (e)->
        e.preventDefault()
        @enabledValidate = true

        isValid = @_validateRequiredForm()
        isValid = @._validateReapeatPasswordError() and isValid
        return if !isValid

        data = this.$form.serializeObject()
        app.callApi 'user/signUp', data, (err, response)=>
          return @_addError 'Ошибка', err if err
          app.trigger 'signIn', { user: response.user }
          app.navigate '/'


    _validateReapeatPasswordError: ->
      $container = @_getInputContainer this.$repeatePassword
      if !this.$repeatePassword.val()
        @_toggleHelper $container, 'repeatPassword', false
        return true
      isInvalid = this.$password.val() isnt this.$repeatePassword.val()
      @_markInput $container, !isInvalid
      @_toggleHelper $container, 'repeatPassword', isInvalid
      return not isInvalid

    initialize: ->@render()

    render: ->
      App.ContentView.prototype.render.call this, arguments
      this.$password = $('input[name="password"]', @el)
      this.$repeatePassword = $('input[name="repeatPassword"]', @el)
      this.$form = $('form', @el)
