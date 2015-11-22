var Backbone = require('backbonereactnative');
var _ = require('underscore');
var Settings = require('../../Settings');

var Model = Backbone.Model.extend({
  urlRoot: Settings.REST.root + 'users',
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
    Backbone.defaultSyncOptions = { headers: { 'X-CSRF-Token': token} };
  }
});

module.exports = {
  model: Model,
  collection: Collection
};