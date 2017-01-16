var DrsConstants = require('../constants/DrsConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {
  loadParams: function(paramsName, paramsType) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.parametersActions.LOAD,
      data: {
        paramsName: paramsName,
        paramsType: paramsType
      }
    });
  },
  save: function(name, type, params) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.parametersActions.SAVE,
      data: {
        name: name,
        type: type,
        params: params
      }
    });
  },
  delete: function(name, type) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.parametersActions.DELETE,
      name: name,
      type: type
    });
  }
};
