'use strict';

var amqp = require('amqplib');
var OpenvoxSMS = require('openvox-sms');

var config = require('./config');
var amqpConfig = config['amqp'];
var openvoxConfig = config['openvox-sms'];

var sms = new OpenvoxSMS(openvoxConfig);
var Handler = require('./lib/handler');

var msgFormat = require('./lib/msgFormat');
var validator = new (require('./lib/validator'))(msgFormat);

var connection, channel;

amqp.connect(amqpConfig.url)
    .then(function (conn) {
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
        var handler = new Handler(channel, validator, sms);
        channel.consume(amqpConfig.queue, handler.handle, {noAck: false});
        console.log(" [*] Waiting for messages. To exit press CTRL+C");
    })
    .then(null, console.warn);