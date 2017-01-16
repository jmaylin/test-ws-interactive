var DrsConstants = require('../constants/DrsConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {
  preload: function(datastrips) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.datastripActions.PRELOAD,
      data: datastrips
    });
  }
};
