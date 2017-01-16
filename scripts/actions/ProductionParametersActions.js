var DrsConstants = require('../constants/DrsConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {
  add: function(name, configuration) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.productionParameters.ADD,
      data: {
        name: name,
        configuration: configuration
      }
    });
  },
  delete: function(index) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.productionParameters.DELETE,
      data: index
    });
  }
};
