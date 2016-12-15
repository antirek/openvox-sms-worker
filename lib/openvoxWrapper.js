'use strict';

var when = require('when');

var openvoxWrapper = function (osms) {

    this.connect = function () {
        var defer = when.defer();
        osms.on('connect', function (event) {
            defer.resolve(event);
        });
        return defer.promise;
    };

    this.isConnected = function () {
        var defer = when.defer();
        if (osms.isConnected()) {
            defer.resolve('Connected');
        } else {
            defer.reject(new Error('openvox is not connected'));
        }
        return defer.promise;
    };

    this.keepConnected = function () {
        return when.resolve(osms.keepConnected());
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
        return when.resolve(osms.close());
    };
};

module.exports = openvoxWrapper;