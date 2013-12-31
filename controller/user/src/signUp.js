/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 31.12.13
 */

'use strict';

require('../../main/src/main.js');

var Core = require('../../core/js/Core.js');
var core = new Core();

$(document).ready(function () {
  var $signUpForm = $('#signUpForm');
  $('.signUp', $signUpForm).click(function() {
    var data = {
      login: $('.login', $signUpForm).val(),
      name: $('.name', $signUpForm).val(),
      password: $('.password', $signUpForm).val(),
      eMail: $('.eMail', $signUpForm).val()
    };
    core.doRequest('/signUp', data, function(response) {
      if (response.error) throw response.error;
      return location.href = '/';
    });
    return false;
  });
});
