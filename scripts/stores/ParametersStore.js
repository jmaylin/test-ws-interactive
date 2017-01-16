var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var DrsConstants = require('../constants/DrsConstants');
var assign = require('object-assign');
var Query = require('../tools/query');

var CHANGE_EVENT = 'change';
var INITIALIZED_EVENT = 'initialized';
var SAVE_EVENT = 'save';

var _params = {};

var ParametersStore = assign({}, EventEmitter.prototype, {

  initialize: function() {
    Query.getJSON('/utils/services.php?ctrl=parameters&function=getAllParams')
    .then(function(data) {
      _params = data;
      ParametersStore.emitInitialized(data);
      ParametersStore.emitChange();
    }).catch(function(e) {
      console.error(e);
    });
  },

  getAll: function() {
    return _params;
  },

  paramsExists: function(name, type) {
    return ParametersStore.getParamsNames(type).indexOf(name.toLowerCase()) !== -1;
  },

  getParamsNames: function(type) {
    var names = [];
    if (_params.params[type]) {
      _params.params[type].forEach(function(params) {
        names.push(params.name.toLowerCase());
      });
    }
    return names;
  },

  getPresetIndex: function(name, type) {
    for (var i = 0; i < _params.params[type].length; i++) {
      if(_params.params[type][i].name.toLowerCase() === name.toLowerCase()) {
        return i;
      }
    }
    return null;
  },

  save: function(name, type, params) {
    var queryString = $.param(params);
    var method = 'saveParameters';
    if (type === 'programmation') {
      method = 'saveTaskingParameters';
      var parameters = {
        mission: params.mission,
        organism: params.organism,
        progType: params.progType,
        stereoMode: params.stereoMode,
        minBh: params.minBh,
        maxBh: params.maxBh,
        maxIncidenceAngle: params.maxIncidenceAngle,
        maxCloudCoverage: params.maxCloudCoverage,
        notificationRecipients: params.notificationRecipients,
        dumpingParameters: params.dumpingParameters
      };
      queryString = $.param(parameters);
    }
    Query.getJSON('/utils/services.php?ctrl=parameters&function=' + method + '&name=' + name + '&type=' + type + '&' + queryString)
    .then(function(data) {
      if(data.success) {
        var newParams = {
          name: name,
          parameters: params
        };
        var index = ParametersStore.getPresetIndex(name, type);
        if (index || index === 0) {
          _params.params[type][index] = newParams;
        } else {
          _params.params[type].push(newParams);
        }
        ParametersStore.emitSave(data);
      }
    }).catch(function(e) {
      console.error(e);
    });
  },

  delete: function(name, type) {
    Query.getJSON('/utils/services.php?ctrl=parameters&function=deleteParameters&name=' + name + '&type=' + type)
    .then(function(data) {
      if(data.success) {
        var index = ParametersStore.getPresetIndex(name, type);
        _params.params[type].splice(index, 1);
        ParametersStore.emitChange();
      }
    }).catch(function(e) {
      console.error(e);
    });
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitInitialized: function(params) {
    this.emit(INITIALIZED_EVENT, params);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  addInitializedListener: function(callback) {
    this.on(INITIALIZED_EVENT, callback);
  },

  removeInitializedListener: function(callback) {
    this.removeListener(INITIALIZED_EVENT, callback);
  },

  emitSave: function(data) {
    this.emit(SAVE_EVENT, data);
  },

  addSaveListener: function(callback) {
    this.on(SAVE_EVENT, callback);
  },

  removeSaveListener: function(callback) {
    this.removeListener(SAVE_EVENT, callback);
  }/*,

  addUpdateListener: function(callback) {
    this.on(UPDATE_EVENT, callback);
  },

  removeUpdateListener: function(callback) {
    this.removeListener(UPDATE_EVENT, callback);
  },

  addDeleteListener: function(callback) {
    this.on(DELETE_EVENT, callback);
  },

  removeDeleteListener: function(callback) {
    this.removeListener(DELETE_EVENT, callback);
  }*/
});

ParametersStore.setMaxListeners(0);

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case DrsConstants.parametersActions.FIRST_LOAD :
      ParametersStore.initialize();
      break;
    case DrsConstants.parametersActions.LOAD :
      ParametersStore.getAll();
      break;
    case DrsConstants.parametersActions.SAVE :
      ParametersStore.save(action.data.name, action.data.type, action.data.params);
      break;
    case DrsConstants.parametersActions.DELETE :
      ParametersStore.delete(action.data.name, action.data.type);
      break;
    default:
      // no op
  }
});


module.exports = ParametersStore;
