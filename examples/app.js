'use strict';

var config = require('./config');
var OpenvoxSmsWorker = require('../index');

var server = new OpenvoxSmsWorker(config);
server.start();