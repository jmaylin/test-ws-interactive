var assign = require('object-assign');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var DrsConstants = require('../constants/DrsConstants');
var Query = require('../tools/query');

var UPDATE_EVENT = 'update';
var _datastrips = {};

var DatastripStore = assign({}, EventEmitter.prototype, {

  preload: function(datastrips) {
    var identifiers = '';
    datastrips.map(function (datastrip, index) {
      _datastrips[datastrip] = {
        loaded: false,
        loading: true,
        croppedQL: ''
      };
      if (index > 0) {
        identifiers += ',';
      }
      identifiers += datastrip;
    });
    var params = {
      'name': '{'+identifiers+'}'
    };
    Query.postJSON('/utils/services.php?ctrl=acquisition&function=getImageInfosFromAdm', params)
    .then(function(data) {
      if (data.totalResults) {
        data.features.map(function (feature) {
          var identifier = feature.properties['http://adm.i3.com/ont/scene#name'];
          _datastrips[identifier] = feature;
          _datastrips[identifier].loaded = true;
          _datastrips[identifier].loading = false;
          DatastripStore.emitUpdate(identifier);
        });
      }
    });
  },

  cropQL: function(datastrip, acquisition, image, mapObjects, callback) {
    var params = {
      'datastrip': datastrip,
      'acquisition': acquisition,
      'image': image,
      'aoi': mapObjects.croppedAoi,
      'bounds': mapObjects.bounds
    };
    Query.postJSON('/utils/services.php?ctrl=acquisition&function=cropQL', params)
    .then(function(data) {
      callback(data);
    });
  },

  getDatastripInformations: function(datastripId) {
    if(datastripId in _datastrips) {
      return _datastrips[datastripId];
    }
    return {featuresCollection: [], loaded: false};
  },

  getOrderDetails: function(orderId) {
    return Query.getJSON('/utils/services.php?ctrl=acquisition&function=getDrsOrderDetails&orderId='+orderId);
  },

  emitUpdate: function(datastripId) {
    this.emit(UPDATE_EVENT, {datastripId: datastripId});
  },

  /**
   * @param {function} callback
   */
  addUpdateListener: function(callback) {
    this.on(UPDATE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeUpdateListener: function(callback) {
    this.removeListener(UPDATE_EVENT, callback);
  }
});

DatastripStore.setMaxListeners(0);

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case DrsConstants.datastripActions.PRELOAD :
      DatastripStore.preload(action.data);
      break;
    default:
      // no op
  }
});
module.exports = DatastripStore;
