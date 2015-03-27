'use strict';

var when = require('when');
var Joi = require('joi');

var Validator = function (schema) {

	this.validate = function (object) {
		
		var defer = when.defer();
		
		Joi.validate(object, schema, function (err, value) {
			if (err) {
				defer.reject(err);
			} else {
				defer.resolve(value);
			}
		});

		return defer.promise;
	};
};

module.exports = Validator;