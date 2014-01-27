# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict'

window.app = angular.module 'app', ['oi.file']

require('../../main/js/directive/cError')
require('../../main/js/directive/eInput')
require('../../main/js/directive/eTextarea')

require('../../user/js/controller/signIn')
require('./controller/addPicture')
