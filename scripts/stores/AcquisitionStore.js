var assign = require('object-assign');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var DatastripActions = require('../actions/DatastripActions');

var UPDATE_EVENT = 'update';
var _acquisitions = {};

var AcquisitionStore = assign({}, EventEmitter.prototype, {
  addItems: function(data) {
    var newDatastripIds = [];
    data.forEach(function(element){
      if(element.id in _acquisitions) {
        assign(_acquisitions[element.id], element);
        AcquisitionStore.emitUpdate(element.id);
      }
      else {
        _acquisitions[element.id] = element;
        element.catalogStrips.forEach(function(strip) {
          newDatastripIds.push(strip.id);
        });
      }
    });
    if(newDatastripIds.length) {
      DatastripActions.preload(newDatastripIds);
    }
  },

  getAcquisitionInformations: function(acquisitionId) {
    if(acquisitionId in _acquisitions) {
      for(var prop in _acquisitions[acquisitionId].catalogStrips) {
        _acquisitions[acquisitionId].catalogStrips[prop].aoiDisplayed = false;
      }
      return _acquisitions[acquisitionId];
    }

    return null;
  },

  getAcquisitions: function() {
    return _acquisitions;
  },

  toggleDatastripDisplay: function(acquisitionId, datastripId, display = null) {
    if(acquisitionId in _acquisitions) {
      for(var prop in _acquisitions[acquisitionId].catalogStrips) {
        if (_acquisitions[acquisitionId].catalogStrips[prop].id === datastripId) {
          if (display === null) {
            display  = !_acquisitions[acquisitionId].catalogStrips[prop].aoiDisplayed;
          }
          _acquisitions[acquisitionId].catalogStrips[prop].aoiDisplayed = display;
          return _acquisitions[acquisitionId].catalogStrips[prop].aoiDisplayed;
        }
      }
    }

    return null;
  },

  emitUpdate: function(acquisitionId) {
    this.emit(UPDATE_EVENT, {acquisitionId: acquisitionId});
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

AcquisitionStore.setMaxListeners(0);

AppDispatcher.register(function(action) {
  switch(action.actionType) {

    default:
      // no op
  }
});
module.exports = AcquisitionStore;
