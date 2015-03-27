'use strict';

var Joi = require('joi');

var ConfigSchema = Joi.object().keys({
    'openvox-sms': Joi.object().keys({
        host: Joi.string().default('localhost').required(),
        port: Joi.number().integer().min(1).max(65535).required(),
        username: Joi.string().default('admin').required(),
        password: Joi.string().default('admin').required()
    }).required(),
    amqp: Joi.object().keys({
        url: Joi.string().required(),
        queue: Joi.string().required()
    }),
    logger: Joi.object().keys({
        console: Joi.object().keys({
            colorize: Joi.boolean().default(true)
        }),
        syslog: Joi.object().keys({
            host: Joi.string().required()
        }),
        file: Joi.object().keys({
            filename: Joi.string().required(),
            json: Joi.boolean().default(false)
        }),
    })
});

module.exports = ConfigSchema;