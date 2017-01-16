/**
 * UiStateActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var DrsConstants = require('../constants/DrsConstants');

var UiStateActions = {

  toggleVisibilityCircles: function() {
    AppDispatcher.dispatch({
      actionType: DrsConstants.uiActions.TOGGLE_VISIBILITY_CIRCLES
    });
  },

  toggleStationsPositions: function() {
    AppDispatcher.dispatch({
      actionType: DrsConstants.uiActions.TOGGLE_STATIONS_POSITION
    });
  },

  toggleMissionsPlans: function() {
    AppDispatcher.dispatch({
      actionType: DrsConstants.uiActions.TOGGLE_MISSIONS_PLANS
    });
  },

  toggleCustomLayers: function() {
    AppDispatcher.dispatch({
      actionType: DrsConstants.uiActions.TOGGLE_CUSTOM_LAYERS
    });
  },

  hideAll: function() {
    AppDispatcher.dispatch({
      actionType: DrsConstants.uiActions.HIDE_ALL
    });
  }
};

module.exports = UiStateActions;
