# @author: EgorKluch (EgorKluch@gmail.com)
# @date: 25.01.14

'use strict';

window.app = angular.module 'app', ['oi.file']

require('./directive/error')
require('../../user/js/controller/signIn')
