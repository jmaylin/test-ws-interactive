var DrsConstants = require('../constants/DrsConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {
  toggleFavorite: function(taskingId) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.icrActions.TOGGLE_FAVORITE,
      data: taskingId
    });
  },
  loadAcquisitions: function(taskingId, acquisitionStatus) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.icrActions.ACQUISITION_LOAD,
      data: {
        taskingId: taskingId,
        acquisitionStatus: acquisitionStatus
      }
    });
  },
  getOrderDetails: function(orderId, taskingId) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.icrActions.ORDER_LOAD,
      data: {
        orderId: orderId,
        taskingId: taskingId
      }
    });
  }
};
