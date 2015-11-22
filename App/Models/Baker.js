var Backbone = require('backbonereactnative');
var _ = require('underscore');
var Settings = require('../../Settings');

var Model = Backbone.Model.extend({
  urlRoot: Settings.REST + 'search/advanced-search?rand=123',
  idAttribute: 'uid'
});

var Collection = Backbone.Collection.extend({
  model: Model,
  url: Settings.REST.root + 'search/advanced-search?rand=123',
});

_.extend(Collection.prototype, {
  getUsersHome: function (collection, context) {
    var theRoles = [];
    _.map(this.models, function (model) {
      var roles = _.pluck(model.get('roles'), 'rid');
      if (roles.indexOf('9') > 0) {
        theRoles.push(model);
      }
    });
    return theRoles;
  },
  getById: function (id) {
    return this.filter(function (model) {
      return model.get('uid') === id;
    });
  },
  getWidthLocation: function() {
    return this.filter(function (model) {
      return model.get('lat');
    });
  },
  sort: function () {
    return this.sortBy(function (model) {
      return [model.get('cake_pic'), model.get('uid')];
    }).reverse().slice(0, 8);
  },
  querySearch: function (query, distance) {
    var singleWord = query ? query.replace(/\%20/g, ' ') : null,
      collection,
      calcDistance;


    calcDistance = function (lat1, lon1, lat2, lon2, unit) {
      var radlat1 = Math.PI * parseFloat(lat1) / 180;
      var radlat2 = Math.PI * parseFloat(lat2) / 180;
      var radlon1 = Math.PI * parseFloat(lon1) / 180;
      var radlon2 = Math.PI * parseFloat(lon2) / 180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;

      if (unit=="K") { 
        dist = dist * 1.609344 
      }
      if (unit=="N") { 
        dist = dist * 0.8684 
      }
      return dist
    };

    collection = _(this.filter(function (model) {
      var haveCakeType = false,
        theDistance,
        regs;


      if (distance && !singleWord) {
        
        theDistance = calcDistance(distance.lat, distance.long, model.get('lat'), model.get('lng'),  'K');

        
        if (theDistance < 20) {
          return true;
        }
      } else if (singleWord) {
        regs = new RegExp(singleWord.toLowerCase());

        if (singleWord.length > 0 && regs.test(model.get('name').toLowerCase())) {
        return true;
        }

        if (model.get('field_plaats_value') && regs.test(model.get('field_plaats_value').toLowerCase())) {
          return true;
        }

        _.each(_.pluck(model.get('terms'), 'name'), function (term) {
          if (regs.test(term.toLowerCase())) {
            haveCakeType = true;  
          }
        });

        if (haveCakeType) {
          return true;
        }

      } else {
        return true;
      }
      
    }));

    /*if (distance) {
      collection = this.filter(function (model) {
        return model.get('lat');
      });
      collection.sort();
    }*/
    var newCollection = new Collection(_(collection).flatten(true));
    return newCollection;

  },
  page: function (pageNumber) { 
    var total = Math.ceil(this.length / 8);
    return pageNumber <= total ?  this.slice(0, ((pageNumber) * 8)) : this;
  }
});

module.exports = {
  model: Model,
  collection: Collection
};