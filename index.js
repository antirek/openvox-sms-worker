
var config = require('./config');
var amqp = require('amqplib');

var amqpConfig = config['amqp'];
var openvoxConfig = config['openvox-sms'];
var Handler = require('./lib/handler');


var OpenvoxSMS = require('openvox-sms');
var sms = new OpenvoxSMS({host: '192.168.243.125'});


amqp.connect(amqpConfig.url)
  .then(function (connection) {
  
    process.once('SIGINT', function() { connection.close(); });

    return connection.createChannel()
      .then(function (channel) {
          var ok = channel.assertQueue(amqpConfig.queue, {durable: true});

          return ok.then(function() { 
                channel.prefetch(1); 
            })
            .then(function() {

              var handler = new Handler(channel, sms, openvoxConfig);
              //console.log(handler);

              channel.consume(amqpConfig.queue, handler.handle, {noAck: false});
              
              console.log(" [*] Waiting for messages. To exit press CTRL+C");
            });

      });

}).then(null, console.warn);