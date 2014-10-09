# @author EgorKluch (EgorKluch@gmail.com)
# @date: 22.09.2014

define ['ContentView', 'text!msgTpl'], (ContentView, msgTpl)->
  ContentView.extend
    msgTpl: _.template msgTpl

    _addError: (title, html, isBlock)->  @_addMessage title, html, isBlock, 'alert-error'
    _addSuccess: (title, html, isBlock)->@_addMessage title, html, isBlock, 'alert-success'
    _addInfo: (title, html, isBlock)->   @_addMessage title, html, isBlock, 'alert-info'

    _addMessage: (title, html, isBlock, className)->
      $('.alerts').append @msgTpl { title, html, isBlock, className }

    _validateRequiredForm: ->
      inputs = $('input', this.$el)
      isValid = true
      _.forEach inputs, (input)=>
        $input = $(input)
        isValid = @_validateRequiredInput($input) and isValid
      return isValid

    _validateRequiredInput: ($input)->
      isValid = !$input.attr('required') or $input.val()
      isValid = !!isValid
      $container = @_getInputContainer $input
      @_markInput $container, isValid
      @_toggleHelper $container, 'required', !isValid
      return isValid

    _markInput: ($container, isValid)->
      $container = @_getInputContainer $container
      $container.toggleClass 'error', not isValid

    _toggleHelper: ($container, error, show)->
      @_getHelper($container, error).toggle show

    _getInputContainer: ($input)->
      $container = $input
      while not $container.hasClass 'control-group'
        $container = $container.parent()
        throw 'Input container not found' if !$container.length
      return $container

    _getHelper: ($container, error)->
      $container = @_getInputContainer $container
      return $('.help-block[data-error="' + error + '"]', $container);
