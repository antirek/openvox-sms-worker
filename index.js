'use strict';

var amqp = require('amqplib');
var OpenvoxSMS = require('openvox-sms');
var Joi = require('joi');
var when = require('when')

var config = require('./config');

var openvoxWrapper = require('./lib/openvoxWrapper');
var Logger = require('./lib/logger');
var Handler = require('./lib/handler');


var Server = function (config) {

    var configSchema = require('./lib/configSchema');
    var smsSender, validator, logger;
    var connection, channel;
    
    var log = function (message, object) {
       if (logger) {
          logger.info(message, object);
       } else {
          console.log(message, object);
       }
    };

    var validate = function (file, schema) {
        var defer = when.defer();
        Joi.validate(file, schema, function (err, value){
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(value);
            }
        });
        return defer.promise;
    };

    var init = function () {
        var msgFormat = require('./lib/msgFormat');
        validator = new (require('./lib/validator'))(msgFormat);
        smsSender = new openvoxWrapper(new OpenvoxSMS(config['openvox-sms']));
        logger = new Logger(config['logger']);
        return when.resolve(1);
    };

    this.start = function () {

        validate(config, configSchema)
            .then(function (validatedConfig) {
                return init();
            })
            .then(function () {
                return amqp.connect(config['amqp'].url);
            })
            .then(function (conn) {
                log('connection to amqp opened')
                connection = conn;
                process.once('SIGINT', function() { connection.close(); });
                return connection.createChannel()
            })
            .then(function (ch) {
                channel = ch;
                return channel.assertQueue(config['amqp'].queue, {durable: true});
            })
            .then(function() {
                return channel.prefetch(1); 
            })
            .then(function() {
                var handler = new Handler(channel, validator, smsSender);
                handler.setLogger(logger);

                log("ready for work");
                return channel.consume(config['amqp'].queue, handler.handle, {noAck: false});                
            })
            .then(null, console.warn);
    };
};

var server = new Server(config);
server.start();