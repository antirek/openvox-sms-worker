'use strict';

var console = require('tracer').colorConsole();

var Handler = function (channel, validator, smsSender) {
    var logger, msgCounter = 1;

    var getMessageId = function () {
        var length = 7;
        //magic from https://gist.github.com/aemkei/1180489#file-index-js
        var q = function (a, b) {
            return([1e15]+a).slice(-b)
        };
        return q(msgCounter++, length);
    };

    this.handle = function (msg) {
        
        var msgId = getMessageId();

        var log = function (text, object) {
            if (logger) {
                logger.info(msgId, text, object);
            } else {
                console.log(msgId, text, object);
            } 
        };
    
        var message = msg.content.toString();   
        log("received", message);

        validator.validate(message)
            .then(function (validatedMessage) {
                log("validated successfully", validatedMessage);

                return smsSender.isConnected()
                    .then(function () {
                        var sms = {
                            span: validatedMessage.span, 
                            number: validatedMessage.targetNumber, 
                            text: validatedMessage.msgText
                        };

                        log('sms for send', sms);

                        return smsSender.sendSMS(sms);    
                    });             
            })
            .then(function (response) {
                log('send good', response);
            })
            .catch(function (error) {
                log('error', error);
            })
            .done(function(){
                channel.ack(msg);
            });
    };
};

module.exports = Handler;