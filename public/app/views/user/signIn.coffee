# @author EgorKluch (EgorKluch@gmail.com)
# @date: 22.09.2014

define ['text!tpl/user/signIn.ejs', 'text!tpl/main/msgTpl.ejs'], (tpl, msgTpl)->
  App.ContentFormView.extend
    tpl: _.template tpl
    msgTpl: _.template msgTpl
    title: 'Авторизация'
    enabledValidate: true

    initialize: ->@render()

    render: ->
      this.$el.html @tpl()
      @updateTitle()

      self = this
      $('input', this.$el).keyup ->
        return if !self.enabledValidate
        self._validateRequiredInput $(this)

      $('.btn[data-action="signIn"]', this.$el).click (e)=>
        e.preventDefault()
        @enabledValidate = true
        return if !@_validateRequiredForm()
        data = $('form', this.$el).serializeObject()
        app.callApi 'user/signIn', data, (err, response)=>
          return @_addError 'Ошибка', err if err
          app.trigger 'signIn', { user: response.user }
          app.navigate '/'
