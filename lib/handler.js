//var osms = require('openvox-sms');

var Handler = function (channel, sms) {
	//var sms = new osms(config);
	//console.log('openvox config', config);

    this.handle = function (msg) {
    	
        var body = msg.content.toString();
        console.log(" [x] Received '%s'", body);
        var secs = body.split('.').length - 1; 

        if (sms.isConnected()){
        	sms.sendSMS({span: 1, number: '89135292926', text: body}, function (err, response) {        		
        		console.log('send', err, response);
        		channel.ack(msg);
        	});
        } else {
        	console.log('not connected to sms gateway');
        }

    };
};

module.exports = Handler;