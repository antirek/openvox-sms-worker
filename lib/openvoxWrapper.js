'use strict';

var when = require('when');
var console = require('tracer').colorConsole();
var OpenvoxSMS = require('openvox-sms');

var openvoxWrapper = function (config) {
    var osms = null;

    this.connect = function () {
        osms = new OpenvoxSMS(config);

        var defer = when.defer();
        osms.on('connect', function (event) {
            defer.resolve(event);
        });
        return defer.promise;
    };    

    this.sendSMS = function (object) {
        var defer = when.defer();
        osms.sendSMS(object, function (err, response) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(response);  
            }
        });
        return defer.promise;
    };

    this.close = function () {        
        osms = null;
        return when.resolve();
    };
};

module.exports = openvoxWrapper;