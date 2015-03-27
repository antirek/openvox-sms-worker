'use strict';

var amqp = require('amqplib');
var OpenvoxSMS = require('openvox-sms');
var openvoxWrapper = require('./lib/openvoxWrapper');

var config = require('./config');
var amqpConfig = config['amqp'];
var openvoxConfig = config['openvox-sms'];
var loggerConfig = config['logger'];

var smsSender = new openvoxWrapper(new OpenvoxSMS(openvoxConfig));
var Handler = require('./lib/handler');

var msgFormat = require('./lib/msgFormat');
var validator = new (require('./lib/validator'))(msgFormat);

var Logger = require('./lib/logger');
var logger = new Logger(loggerConfig);

var log = function (message, object) {
   if (logger) {
      logger.info(message, object);
   } else {
      console.log(message, object);
   }
};

var connection, channel;

amqp.connect(amqpConfig.url)
    .then(function (conn) {
        log('connection to amqp opened')
        connection = conn;
        process.once('SIGINT', function() { connection.close(); });
        return connection.createChannel()
    })
    .then(function (ch) {
        channel = ch;
        return channel.assertQueue(amqpConfig.queue, {durable: true});
    })
    .then(function() {
        return channel.prefetch(1); 
    })
    .then(function() {
        var handler = new Handler(channel, validator, smsSender);
        handler.setLogger(logger);

        channel.consume(amqpConfig.queue, handler.handle, {noAck: false});
        log(" [*] Waiting for messages. To exit press CTRL+C");
    })
    .then(null, console.warn);