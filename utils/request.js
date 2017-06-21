'use strict';
var request = require('request'),
    Settings = require('./../configs/settings.json');

function Request() {
}
var apiRoot = Settings.api.prod;
if (process.env.NODE_ENV === 'development') {
    apiRoot = Settings.api.dev;
}
Request.prototype.api = function (url, method, form) {
    return new Promise(function (resolve, reject) {
        console.log('hit da api');
        if (typeof method == 'undefined') {
            method = 'GET';
        }
        var options = {
            method: method.toUpperCase(),
            url: apiRoot + url,
            json: true
        };
        if (typeof form !== 'undefined') {
            options.form = form;
        }
        console.log('requesting:', options.url);
        request(options, function (error, response, json) {
            if (error) {
                reject(error);
                return;
            }

            if (response.statusCode !== 200) {
                var httpError = new Error('HTTP Code ' + response.statusCode);
                httpError.statusCode = response.statusCode;
                reject(httpError);
                return;
            }

            if (typeof json === 'undefined') {
                var jsonError = new Error('Scapie returned invalid json');
                reject(jsonError);
                return;
            }

            resolve(json);
        });
    });
};

Request.prototype.remoteApi = function(url) {
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            json: true
        }, function (error, response, json) {
            if (error) {
                reject(error);
                return;
            }

            if (response.statusCode !== 200) {
                var httpError = new Error('HTTP Code ' + response.statusCode);
                httpError.statusCode = response.statusCode;
                reject(httpError);
                return;
            }

            if (typeof json === 'undefined') {
                var jsonError = new Error('Scapie returned invalid json');
                reject(jsonError);
                return;
            }
            if (typeof json != 'object') {
                var jsonError = new Error('Scapie returned invalid json');
                reject(jsonError);
                return;
            }

            resolve(json);
        });
    });
};

module.exports = new Request();
