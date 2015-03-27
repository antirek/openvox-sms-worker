var amqp = require('amqplib');
var when = require('when');
var channel, connection;
var q = 'task_queue';

amqp.connect('amqp://localhost')
  .then(function (conn) {
      connection = conn;
      return when(conn.createChannel());
  })
  .then(function (ch) {
      channel = ch;
      return channel.assertQueue(q, {durable: true}); 
  })
  .then(function () {
      var text = process.argv.slice(2).join(' ') || "Hello World!";

      var msg = {
        source: 'Locally',
        targetNumber: '89135292926',
        msgText: text,
        span: 1
      };

      msg = JSON.stringify(msg);

      console.log('msg', msg);

      channel.sendToQueue(q, new Buffer(msg), {deliveryMode: true});
      console.log(" [x] Sent '%s'", msg);
      return channel.close();
  })
  .ensure(function() { connection.close(); })
  .then(null, console.warn);