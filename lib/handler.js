'use strict';

var Handler = function (channel, validator, sms) {
    
    this.handle = function (msg) {
        
        var message = msg.content.toString();
        console.log(" [x] Received '%s'", message);
        var secs = message.split('.').length - 1; 

        validator.validate(message)
            .then(function (value) {
                if (sms.isConnected()){
                    
                    sms.sendSMS({
                        span: value.span, 
                        number: value.targetNumber, 
                        text: value.msgText
                    }, function (err, response) {
                        console.log('send', err, response);
                        
                    });

                } else {
                    console.log('not connected to sms gateway');
                }
            
                channel.ack(msg);
            })
            .catch(console.log);
    };
};

module.exports = Handler;