# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict'

window.app = window.angular.module 'app', []

require('../../main/js/core')
require('../../main/js/directive/bootstrapForm')
require('../../main/js/directive/eInput')

require('../../main/js/controller/main')
require('./controller/signUp')
