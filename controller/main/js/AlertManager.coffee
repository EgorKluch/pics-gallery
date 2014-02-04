#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 04.02.14

'use strict'

AlertManager = (container)->
  @container = $(container)
  return this


AlertManager.prototype.addError = (title, html, isBlock)->
  this.addAlert title, html, isBlock, 'alert-error'

AlertManager.prototype.addSuccess = (title, html, isBlock)->
  this.addAlert title, html, isBlock, 'alert-success'

AlertManager.prototype.addInfo = (title, html, isBlock)->
  this.addAlert title, html, isBlock, 'alert-info'


AlertManager.prototype.addAlert = (title, html, isBlock, className)->
  $alert = $('<div>')
  $alert.append '<button type="button" class="close" data-dismiss="alert">&times;</button>'

  if isBlock
    $alert.addClass 'alert-block'
    $alert.append '<h4>' + title + '</h4>'
  else
    $alert.addClass 'alert'
    $alert.append '<strong>' + title + '</strong>'

  $alert.addClass className if className?

  $alert.append html

  @container.html ''
  @container.append $alert


module.exports = AlertManager
