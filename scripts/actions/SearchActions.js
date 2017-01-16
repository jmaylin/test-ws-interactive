var DrsConstants = require('../constants/DrsConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');

module.exports = {
  newUnsavedSearch: function(formData) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.searchActions.NEW,
      data: formData
    });
  },
  saveCurrentSearch: function(formData) {
     AppDispatcher.dispatch({
      actionType: DrsConstants.searchActions.SAVE,
      data: formData
    });
  },
  loadSearch: function(searchName, searchType) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.searchActions.LOAD,
      data: {
        searchName: searchName,
        searchType: searchType
      }
    });
  },
  deleteSearch: function(searchName) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.searchActions.DELETE,
      data: searchName
    });
  },
  editSearch: function(searchName) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.searchActions.EDIT,
      data: searchName
    });
  },
  updateSearch: function(searchName, searchData) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.searchActions.UPDATE,
      data: {
        searchName: searchName,
        searchData: searchData
      }
    });
  },
  rename: function(oldName, newName, callback) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.searchActions.RENAME,
      data: {
        oldName: oldName,
        newName: newName,
        callback: callback
      }
    });
  },
  toggleFreeze: function(searchName, searchType, callback) {
    AppDispatcher.dispatch({
      actionType: DrsConstants.searchActions.FREEZE,
      data: {
        searchName: searchName,
        searchType: searchType,
        callback: callback
      }
    });
  }
};
