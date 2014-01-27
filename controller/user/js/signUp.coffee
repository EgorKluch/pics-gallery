# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict'

window.app = window.angular.module 'app', []

require('../../main/js/directive/cError')
require('../../main/js/directive/eInput')

require('./controller/signIn')
require('./controller/signUp')
