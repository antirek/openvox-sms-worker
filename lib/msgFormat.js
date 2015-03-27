'use strict';

var Joi = require('joi');

var msgFormat = Joi.object().keys({
	source: Joi.string().min(1).max(100).required(),
    targetNumber: Joi.string().length(11).required(),
    msgText: Joi.string().min(1).max(500).required(),
    span: Joi.number().min(1).max(64).default(1)
});

module.exports = msgFormat;