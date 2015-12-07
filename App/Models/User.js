var Backbone = require('backbonereactnative');
var _ = require('underscore');
var Settings = require('../../Settings');

var Model = Backbone.Model.extend({
  urlRoot: Settings.REST.root + 'users/mnguser',
  idAttribute: 'uid',
  setURL: function (endpoint) {
    this.url = Settings.REST.root + 'users/' + endpoint;
  },
});

var Collection = Backbone.Collection.extend({
  model: Model,
  url: Settings.REST.root + 'users',
});

_.extend(Model.prototype, {
  setToken: function (token) {
    Backbone.defaultSyncOptions = { 
      headers: { 
        'X-CSRF-Token': token
      } 
    };
  },
  setSessionData: function (token, credentials) {
    console.log(token, credentials);
    Backbone.defaultSyncOptions = { 
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
        'Authorization': 'Basic ' + credentials
      }
    };
  }
});


module.exports = {
  model: Model,
  collection: Collection
};