#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 02.02.14

window.core = {
  getParentElementBySelector: (element, selector)->
    element = $(element)
    element = element.parent()
    while true
      if element.length is 0
        return console.error('Element not found!')
      return element if element.is selector

  getFormInputsInContainer: (eContainer)->
    eContainer = $(eContainer)
    result = []
    $('input', eContainer).each (element)->
      result.push element
    $('textarea', eContainer).each (element)->
      result.push element
    return result
};
