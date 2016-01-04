var Backbone = require('backbonereactnative');
var _ = require('underscore');
var Settings = require('../../Settings');

var Model = Backbone.Model.extend({
  idAttribute: 'tid',
  urlRoot: Settings.REST.root + 'users/getbaketypes'
});

var Collection = Backbone.Collection.extend({
  model: Model,
  url: Settings.REST.root + 'users/getbaketypes',
});

_.extend(Model.prototype, {
  setToken: function (token) {
    Backbone.defaultSyncOptions = { headers: { 'X-CSRF-Token': token} };
  }
});

_.extend(Collection.prototype, {
  search: function (query) {
    var regs = new RegExp(query.toLowerCase()),
      collection;

    
    collection = _(this.filter(function (model) {
      if (query.length > 0 && regs.test(model.get('name').toLowerCase())) {
        return true;
      }
    }));

    var newCollection = new Collection(_(collection).flatten(true));
      return newCollection;
    }
});

module.exports = {
  model: new Model(),
  collection: new Collection()
};