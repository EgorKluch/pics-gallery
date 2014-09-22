# @author EgorKluch (EgorKluch@gmail.com)
# @date: 22.09.2014

define ['views/main/content'], (ContentView)->
  ContentView.extend
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
        isValid = @_validateRequiredInput($input) && isValid
      return isValid

    _validateRequiredInput: ($input)->
      isValid = !$input.attr('required') or $input.val()
      $container = @_getInputContainer $input
      $container.toggleClass isValid
      @_getHelper($input, 'required', $container).toggle !isValid
      return isValid

    _getInputContainer: ($input)->
      $container = $input
      while not $container.hasClass 'control-group'
        $container = $container.parent()
        throw 'Input container not found' if !$container.length
      return $container

    _getHelper: ($input, error, $container)->
      $container = @_getInputContainer $input if !$container
      return $('.help-block[data-error="' + error + '"]', $container);