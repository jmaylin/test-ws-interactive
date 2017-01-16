var assign = require('object-assign');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SearchStore = require('./SearchStore');
var AccountStore = require('./AccountStore');
var Query = require('../tools/query');

var UPDATE_EVENT = 'update';

var _allowedSourceIds = {};
var _allowedSourceIdsForProduction = {};
var loading = false;

var OrderStore = assign({}, EventEmitter.prototype, {
  refreshOrder: function() {
    if(!loading) {
      loading = true;
      var queryString = '&orderId=' + AccountStore.getOrderId();
      Query.getJSON('/utils/services.php?ctrl=tasking&function=getSourceIdsAllowedForProduction'+queryString)
      .then(function(data) {
        if(data.success) {
          _allowedSourceIds = data.sourceIds;
        }
        else {
          _allowedSourceIds = {};
        }

        loading = false;
      }).catch(function(e) {
        console.error(e);
      });
    }
  },

  setSourceIdsAllowedForProduction: function(orderId) {
    if(!loading) {
      loading = true;
      Query.getJSON('/utils/services.php?ctrl=tasking&function=getSourceIdsAllowedForProduction&orderId='+orderId)
      .then(function(data) {
        if(data.success) {
          _allowedSourceIdsForProduction = data.sourceIds;
        } else {
          _allowedSourceIdsForProduction = {};
        }
      }).catch(function(e) {
        console.error(e);
      });
    }
  },

  catalogStripsAreValid: function(sourceIds) {
    for (var i = 0; i < sourceIds.length; i++) {
      if(!_allowedSourceIdsForProduction.hasOwnProperty(sourceIds[i])) {
        return false;
      }
    }
    return true;
  },

  getStripStatus: function(sourceId) {
    return _allowedSourceIdsForProduction[sourceId];
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

OrderStore.setMaxListeners(0);

AppDispatcher.register(function(action) {
  switch(action.actionType) {

    default:
      // no op
  }
});

SearchStore.addChangeListener(OrderStore.refreshOrder);
module.exports = OrderStore;
