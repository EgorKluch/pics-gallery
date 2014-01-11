/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 29.12.13
 */

'use strict';

var Core = require('../core/Core');

var core = new Core();


core.addRoute('get', '/', 'main/mainController:index');

core.addRoute('post', '/signIn', 'user/userController:signIn');
core.addRoute('get', '/signOut', 'user/userController:signOut');
core.addRoute('get', '/signUp', 'user/userController:signUpPage');
core.addRoute('post', '/signUp', 'user/userController:signUp');

core.addRoute('use', '/signUp', 'main/mainController:notFound');
