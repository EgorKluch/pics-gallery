# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict';


require('./controller/main')

$(document).ready ->
  $('[data-action="signOut"]').click ->
    $.ajax({
      dataType: 'json'
      url: '/sign-out'
      type: 'POST'
      success: (response)->
        return console.error response.errorMessage if response.error
        window.location.href = '/'
      error: (response)->
        error = JSON.parse(response.responseText);
        console.error(error.errorMessage);
    })