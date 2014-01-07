/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 31.12.13
 */

'use strict';

var Core = require('../../core/js/Core.js');

var core = new Core();


$(document).ready(function() {
  var $loginForm = $('#loginForm');

  $('.signIn', $loginForm).click(function() {
    try {
      var data = {
        login: $('.login', $loginForm).val(),
        password: $('.password', $loginForm).val()
      };

      if (!data.login) {
        alert('Для авторизации на сайте введите логин');
        return false;
      }

      if (!data.password) {
        alert('Для авторизации на сайте введите пароль');
        return false;
      }

      core.doRequest('/signIn', data, function(response) {
        if (response.error) throw response.error;
        location.reload();
      });
    }
    catch (e) {
      console.log(e);
    }
    return false;
  });


  $('.signOut', $loginForm).click(function() {
    core.doRequest('/signOut', null, function(response) {
      if (response.error) throw response.error;
      location.reload();
    });

    return false;
  });
});