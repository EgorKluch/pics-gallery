/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 31.12.13
 */

'use strict';

require('../../main/src/main.js');

var $ = require('jquery-browserify');

var Core = require('../../../core/js/Core.js');

var core = new Core();


$(document).ready(function () {
  var $signUpForm = $('#signUpForm');
  $('.signUp', $signUpForm).click(function() {
    var data = {
      login: $('.login', $signUpForm).val(),
      name: $('.name', $signUpForm).val(),
      password: $('.password', $signUpForm).val(),
      email: $('.email', $signUpForm).val()
    };

    if (data.password !== $('.passwordRepeat', $signUpForm).val()) {
      alert('Пароли не совпадают!');
      return false;
    }

    if (!data.login) {
      alert('Введите логин');
      return false;
    }

    if (!data.name) {
      alert('Введите имя');
      return false;
    }

    if (!data.password) {
      alert('Введите пароль');
      return false;
    }

    if (!data.email) {
      alert('Введите почту');
      return false;
    }

    core.doRequest('/signUp', data, function(response) {
      if (!response.result) return console.error(response.errorMessage);
      alert('Регистрация прошла успешно');
      return location.href = '/';
    });
    return false;
  });
});
