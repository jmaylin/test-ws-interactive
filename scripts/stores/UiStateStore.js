var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var DrsConstants = require('../constants/DrsConstants');
var assign = require('object-assign');

var _uiState = {
  visibilityCircles: false,
  stationsPositions: false,
  missionsPlans: false,
  customLayers: false
};

var CHANGE_EVENT = 'change';
var HIDE_EVENT = 'hide';

EventEmitter.prototype.setMaxListeners(1000);

var UiStateStore = assign({}, EventEmitter.prototype, {
  getDisplayStatus: function() {
    return _uiState;
  },

  getMissionsPlansDisplayStatus: function() {
    return _uiState.missionsPlans;
  },

  getCustomLayersDisplayStatus: function() {
    return _uiState.customLayers;
  },

  toggleUiComponent(component) {
    _uiState[component] = !_uiState[component];
    UiStateStore.emitChange();
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  hideAll() {
    UiStateStore.hideChange();
  },
  hideChange: function() {
    this.emit(HIDE_EVENT);
  },
  addHideListener: function(callback) {
    this.on(HIDE_EVENT, callback);
  },
  removeHideListener: function(callback) {
    this.removeListener(HIDE_EVENT, callback);
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case DrsConstants.uiActions.TOGGLE_VISIBILITY_CIRCLES :
    UiStateStore.toggleUiComponent('visibilityCircles');
      break;
    case DrsConstants.uiActions.TOGGLE_STATIONS_POSITION :
    UiStateStore.toggleUiComponent('stationsPositions');
      break;
    case DrsConstants.uiActions.TOGGLE_MISSIONS_PLANS :
    UiStateStore.toggleUiComponent('missionsPlans');
      break;
    case DrsConstants.uiActions.TOGGLE_CUSTOM_LAYERS :
    UiStateStore.toggleUiComponent('customLayers');
      break;
    case DrsConstants.uiActions.HIDE_ALL :
    UiStateStore.hideAll();
      break;
    default:
      // no op
  }
});

module.exports = UiStateStore;
