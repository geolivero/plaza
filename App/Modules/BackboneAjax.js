'use strict';

var Backbone = require('backbone'),
  _ = Backbone._;

Backbone._nativeSync = Backbone.sync;
// Create our default options object
Backbone.defaultSyncOptions = {};

var defaults = function(obj, source) {
  for (var prop in source) {
    if (obj[prop] === undefined) obj[prop] = source[prop];
  }
  return obj;
}

var stringifyGETParams = function(url, data) {
  var query = '';
  for (var key in data) {
    if (data[key] == null) continue;
    query += '&'
      + encodeURIComponent(key) + '='
      + encodeURIComponent(data[key]);
  }
  if (query) url += (~url.indexOf('?') ? '&' : '?') + query.substring(1);
  return url;
}

var status = function(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw new Error(response.statusText);
}

var json = function(response) {
  return response.json()
}

Backbone.ajax = function(options) {
  if (options.type === 'GET' && typeof options.data === 'object') {
    options.url = stringifyGETParams(options.url, options.data);
  }
  var data = typeof options.data === 'string' ? options.data : JSON.stringify(options.data);
  var cleanedData = data.replace(/\n/g, '');
  var headers = {
    method: options.type,
    headers: defaults(options.headers || {}, {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    body: cleanedData
  };
  console.log(headers);

  return fetch(options.url, defaults(options, headers))
  .then(status)
  .then(json)
  .then(options.success)
  .catch(options.error);
};

/*

fetch('http://cakesplaza/users/mnguser', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-Token': token
  },
  body: data
})
.then((response) => response.json())
.then((responseText) => {
  console.log(responseText);
})
.catch((error) => {
  console.log(error);
});

 */



Backbone.sync = function( method, model, options) {
  Backbone._nativeSync( method, model, _.extend( {}, Backbone.defaultSyncOptions, options ) );
};

module.exports = Backbone;