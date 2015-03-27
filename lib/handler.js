'use strict';

var Handler = function (channel, validator, smsSender) {
    var logger, msgCounter = 0;

    this.setLogger = function (log) {
        logger = log;
    };

    this.handle = function (msg) {
        
        var msgId = msgCounter++;

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
            .then(function (value) {
                log("validated successfully");

                return smsSender.isConnected()
                    .then(function () {
                        log('sms gateway online');

                        return smsSender.sendSMS({
                            span: value.span, 
                            number: value.targetNumber, 
                            text: value.msgText
                        });    
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