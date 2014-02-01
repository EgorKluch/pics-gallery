# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict';

window.app = window.angular.module 'app', []

require('./directive/cError')
require('./directive/eInput')

require('./controller/main')
require('../../user/js/controller/signIn')
