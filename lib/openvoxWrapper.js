'use strict';

var when = require('when');
var console = require('tracer').colorConsole();

var openvoxWrapper = function (osms) {

    this.connect = function () {
        var defer = when.defer();
        osms.on('connect', function (event) {
            console.log('connect to sms gateway');
            defer.resolve(event);
        });
        return defer.promise;
    };

    this.sendSMS = function (object) {
        var defer = when.defer();
        osms.sendSMS(object, function (err, response) {
            if (err) {
                console.log('err:', err);
                defer.reject(err);
            } else {
                console.log('send good')
                defer.resolve(response);  
            }
        });
        return defer.promise;
    };

    this.close = function () {
        return when.resolve(osms.close());
    };
};

module.exports = openvoxWrapper;