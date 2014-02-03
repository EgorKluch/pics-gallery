#   @author: EgorKluch (EgorKluch@gmail.com)
#   @date: 02.02.14

window.core = {
  getParentElementBySelector: (element, selector)->
    while true
      element = element.parent()
      if element.length is 0
        return null
      return element if element.is selector
}
