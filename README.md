# openvox-sms-worker

Receive from RabbitMQ task for sending via OpenVox SMS Gateway


Fast start
==========

Use openvox-sms-worker-app http://github.com/antirek/openvox-sms-worker-app


Use
===

Step 1. Create your own app 

Step 2. Install openvox-sms-worker

> npm install openvox-sms-worker

Step 3. Add code to your **app.js**

`````
var config = require('./config');
var OpenvoxSmsWorker = require('openvox-sms-worker');

var server = new OpenvoxSmsWorker(config);
server.start();

`````
Step 4. Check **config.js**

Step 5. Run your app

> node app.js



Configuration
=============

your config.js like this

`````
{
    'openvox-sms': {
        host: '192.168.0.1',
        port: 5038,
        username: 'admin',
        password: 'admin'
    },
    amqp: {
        url: 'amqp://localhost',
        queue: 'task_queue'
    },
    logger: {
        file: {
            filename: '/var/log/openvox-sms-worker.log',
            json: false
        },
        console: {
            colorize: true
        }
    }
}
`````


SMS in queue
============

Message for sending via openvox-sms-worker must have format like this

`````
{
    span: 1,   //span module of gsms gateway, default 1, not required
    source: 'From Alaska server', //define source of message
    targetNumber: '89135292926',  // or '+79135292926', string format
    msgText: 'Some text for sending as SMS to my dear friends!'   // short or long sms text
}

`````
Send message to RabbitMQ queue and worker process it to OpenVox VoxStack GSM gateway.


Bugs?!
======

Please send it me.

