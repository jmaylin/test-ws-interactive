/* global account */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var DrsConstants = require('../constants/DrsConstants');
var assign = require('object-assign');
var Query = require('../tools/query');
var TaskingStore = require('./TaskingStore');
var mapOl = require('../mapOl');
var i18n = require('../tools/i18n');

var CHANGE_EVENT = 'change';
var SAVE_EVENT = 'save_error';
var EXPORT_EVENT = 'export_error';
var DOWNLOAD_EVENT = 'download_error';
var EDIT_EVENT = 'save_edit';
var DELETE_EVENT = 'delete_error';
var INITIALIZED_EVENT = 'initialized';
var UNSAVED_SEARCH_START = 'start_search';
var UNSAVED_SEARCH_STOP = 'stop_search';

var _searches = {
  custom: [],
  defaults: [],
  unsaved: {
    success: false,
    message: '',
    taskingIdentifiersList: [],
    taskingIdentifiersParams: {},
    ran: false,
    parameters: {},
    exportParameters: {},
    name: ''
  }
};

var SearchStore = assign({}, EventEmitter.prototype, {

  initialize: function() {
    Query.getJSON('/utils/services.php?ctrl=tasking&function=listCustomerSearchs')
    .then(function(data) {
      data.custom.forEach(function(search) {
        search.parameters.name = search.name;
        SearchStore.updateSearch(search.name, DrsConstants.searchType.CUSTOM, search, false);
      });
      data.defaults.forEach(function(search) {
        search.parameters.name = search.name;
        SearchStore.updateSearch(search.name, DrsConstants.searchType.DEFAULT, search, false);
      });
      SearchStore.emitInitialized();
      SearchStore.emitChange();
    });
  },

  search: function(searchData, callback, errorCallback, page = 1, forceUpdate = false) {
    var queryString = $.param(searchData);
    if(searchData.type === DrsConstants.searchType.UNSAVED) {
      assign(_searches.unsaved.parameters, searchData);
    }
    var force = '';
    if (forceUpdate) {
      force = '&forceupdate='+forceUpdate;
    }
    Query.getJSON('/utils/services.php?ctrl=tasking&function=search&page='+page+'&'+queryString+force)
        .then(callback).catch(errorCallback);
  },

  loadSearch: function(searchName, searchType, page = 1, forceUpdate = false) {
    var search = SearchStore.getSearch(searchName, searchType);
    SearchStore.search(search.parameters, function(data) {
      search.loaded = true;
      search.loading = false;
      search.success = data.success;
      search.message = data.message;
      search.totalResults = data.totalResults;
      search.nbResults = data.nbResults;
      if (page == 1) {
        search.taskingIdentifiersList = data.taskingIdentifiersList;
        search.taskingIdentifiersParams = {};
      }
      for (var i = 0; i < data.taskingIdentifiersList.length; i++) {
        if (page > 1) {
          search.taskingIdentifiersList.push(data.taskingIdentifiersList[i]);
        }
        search.taskingIdentifiersParams[data.taskingIdentifiersList[i]] = {};
        search.taskingIdentifiersParams[data.taskingIdentifiersList[i]].name = data.taskingIdentifiersList[i];
        search.taskingIdentifiersParams[data.taskingIdentifiersList[i]].display = 'block';
      }
      TaskingStore.addItems(data.taskingList);
      SearchStore.updateSearch(searchName, searchType, search, true);
    }, function() {
      search.loaded = true;
      search.loading = false;
      search.success = false;
      search.message = i18n.get('internal-error');
      search.totalResults = data.totalResults;
      search.nbResults = data.nbResults;
      search.taskingIdentifiersList = [];
      search.taskingIdentifiersParams = {};
      SearchStore.updateSearch(searchName, searchType, search, true);
    }, page, forceUpdate);
  },

  storeUnsavedResults: function(data) {
    _searches.unsaved.success = data.success;
    _searches.unsaved.message = data.message;
    _searches.unsaved.totalResults = data.totalResults;
    _searches.unsaved.nbResults = data.nbResults;
    _searches.unsaved.taskingIdentifiersList = data.taskingIdentifiersList;
    _searches.unsaved.taskingIdentifiersParams = {};
    data.taskingIdentifiersList.forEach( function(value) {
      _searches.unsaved.taskingIdentifiersParams[value] = {};
      _searches.unsaved.taskingIdentifiersParams[value].name = value;
      _searches.unsaved.taskingIdentifiersParams[value].display = 'block';
    });
    _searches.unsaved.ran = true;
    TaskingStore.addItems(data.taskingList);
    SearchStore.emitChange(DrsConstants.defaultSearches.CURRENT_TASKING_SEARCH);
    SearchStore.emitStopUnsavedSearch();
  },

  unsavedSearchLoadError: function() {
    _searches.unsaved.success = false;
    _searches.unsaved.message = i18n.get('internal-error');
    _searches.unsaved.taskingIdentifiersList = [];
    _searches.unsaved.taskingIdentifiersParams = {};
    _searches.unsaved.ran = true;
    SearchStore.emitChange(DrsConstants.defaultSearches.CURRENT_TASKING_SEARCH);
    SearchStore.emitStopUnsavedSearch();
  },

  updateSearch: function(searchName, searchType, search, emitChange) {
    var i;
    if(search.parameters.aoi && !search.feature) {
      search.feature = mapOl.aoiToFeatureFromString(search.parameters.aoi);
    }
    if(searchType === DrsConstants.searchType.DEFAULT) {
      if(searchName === DrsConstants.defaultSearches.CURRENT_TASKING_SEARCH) {
        _searches.unsaved = search;
        if(emitChange) {
          SearchStore.emitChange(searchName);
        }
      } else {
        for (i = 0; i < _searches.defaults.length; i++) {
          if(_searches.defaults[i].name === searchName) {
            _searches.defaults[i] = search;
            if(emitChange) {
              SearchStore.emitChange(searchName);
            }
            return;
          }
        }
        // search wasn't found, append it
        _searches.defaults.push(search);
        if(emitChange) {
          SearchStore.emitChange(searchName);
        }
      }
    }
    else {
      for (i = 0; i < _searches.custom.length; i++) {
        if(_searches.custom[i].name === searchName) {
          _searches.custom[i] = search;
          if(emitChange) {
            SearchStore.emitChange(searchName);
          }
          return;
        }
      }
      _searches.custom.push(search);
      if(emitChange) {
        SearchStore.emitChange(searchName);
      }
    }
  },

  /**
   * Get the entire collection of Searches.
   * @return {object}
   */
  getAll: function() {
    return _searches;
  },

  getSearch: function(searchName, searchType) {
    var i;
    if(searchType === DrsConstants.searchType.DEFAULT) {
      if(searchName === DrsConstants.defaultSearches.CURRENT_TASKING_SEARCH) {
        return _searches.unsaved;
      }
      for (i = 0; i < _searches.defaults.length; i++) {
        if(_searches.defaults[i].name === searchName) {
          return _searches.defaults[i];
        }
      }
    }
    else {
      for (i = 0; i < _searches.custom.length; i++) {
        if(_searches.custom[i].name === searchName) {
          return _searches.custom[i];
        }
      }
    }
  },

  getCurrentSearchResults: function() {
    return _searches.unsaved;
  },

  resetUnsavedSearch: function() {
    _searches.unsaved = {
      success: false,
      message: '',
      taskingIdentifiersList: [],
      taskingIdentifiersParams: {},
      parameters: {},
      exportParameters: {},
      ran: false,
      name: '',
      type: DrsConstants.searchType.UNSAVED,
      feature: null
    };
    SearchStore.emitChange(DrsConstants.defaultSearches.CURRENT_TASKING_SEARCH);
  },

  doSaveSearch: function(queryString, callback) {
    Query.getJSON('/utils/services.php?ctrl=tasking&function=saveSearch&'+queryString)
    .then(callback).catch(function(e) {
      console.error(e);
    });
  },

  saveUnsavedSearch: function(formData) {
    var queryString = $.param(_searches.unsaved.parameters) + '&name='+formData.searchName;
    SearchStore.doSaveSearch(queryString, function(data) {
      if(data.success) {
        _searches.unsaved.name = formData.searchName;
        _searches.unsaved.frozen = false;
        _searches.unsaved.loaded = true;
        _searches.unsaved.type = DrsConstants.searchType.CUSTOM;
        _searches.unsaved.export = false;
        _searches.unsaved.exportProcessing = false;
        _searches.unsaved.error = false;
        if(_searches.unsaved.parameters.aoi) {
          _searches.unsaved.feature = mapOl.aoiToFeatureFromString(_searches.unsaved.parameters.aoi);
        }
        var i;
        for (i = 0; i < _searches.custom.length; i++) {
          if(_searches.custom[i].name === formData.searchName) {
            _searches.custom.splice(i, 1);
          }
        }
        _searches.custom.push(_searches.unsaved);
        SearchStore.resetUnsavedSearch();
      }
      SearchStore.emitSave(data);
    });
  },

  updateSavedSearch: function(searchName, searchData) {
    var search = {
      loaded: false,
      name: searchName,
      parameters: searchData,
      taskingIdentifiersList: [],
      taskingIdentifiersParams: {}
    };
    var queryString = $.param(search.parameters) + '&name='+searchName;
    SearchStore.doSaveSearch(queryString, function(data) {
      if(data.success) {
        SearchStore.updateSearch(searchName, DrsConstants.searchType.CUSTOM, search, false);
        SearchStore.loadSearch(searchName, DrsConstants.searchType.CUSTOM);
      }
    });
  },

  searchExists: function(searchName) {
    return SearchStore.getSearchNames().indexOf(searchName) !== -1;
  },

  deleteSearch: function(searchName) {
    Query.getJSON('/utils/services.php?ctrl=tasking&function=deleteSearch&name='+searchName)
    .then(function(data) {
      if(data.success) {
        var i;
        for (i = 0; i < _searches.custom.length; i++) {
          if(_searches.custom[i].name === searchName) {
            _searches.custom.splice(i, 1);
          }
        }
        SearchStore.emitChange(searchName);
      }
    });
  },

  getSearchNames: function() {
    var names = [];
    _searches.custom.forEach(function(search) {
      names.push(search.name);
    });
    return names;
  },

  editSearch: function(searchName) {
    SearchStore.emitEditionStart(SearchStore.getSearch(searchName, 'custom'));
  },

  renameSearch: function(oldName, newName, callback) {
    Query.getJSON('/utils/services.php?ctrl=tasking&function=renameSearch&oldName='+oldName+'&newName='+newName)
    .then(function(data){
      if (data.success) {
        var i;
        for (i = 0; i < _searches.custom.length; i++) {
          if(_searches.custom[i].name === newName) {
            _searches.custom.splice(i, 1);
          }
          else if(_searches.custom[i].name === oldName) {
            _searches.custom[i].name = newName;
          }
        }
        callback();
        SearchStore.emitChange(newName);
      }
    });
  },

  toggleFreeze: function(searchName, searchType, callback) {
    Query.getJSON('/utils/services.php?ctrl=tasking&function=freezeSearch&searchName='+searchName+'&searchType='+searchType)
    .then(function(data){
      if (data.success) {
        var i;
        if(searchType === DrsConstants.searchType.DEFAULT) {
          for (i = 0; i < _searches.defaults.length; i++) {
            if(_searches.defaults[i].name === searchName) {
              _searches.defaults[i].frozen = !_searches.defaults[i].frozen;
            }
          }
        }
        else {
          for (i = 0; i < _searches.custom.length; i++) {
            if(_searches.custom[i].name === searchName) {
              _searches.custom[i].frozen = !_searches.custom[i].frozen;
            }
          }
        }
        callback();
        SearchStore.emitChange(searchName);
      }
    });
  },

  handleFavoriteChange: function(taskingId, isFavorite) {
    var favoriteSearch = SearchStore.getSearch(DrsConstants.defaultSearches.FAVORITE_TASKING_SEARCH, DrsConstants.searchType.DEFAULT);
    if(isFavorite) {
      if (!favoriteSearch.taskingIdentifiersParams[taskingId]) {
        favoriteSearch.taskingIdentifiersList.push(taskingId);
      }
      favoriteSearch.taskingIdentifiersParams[taskingId] = {};
      favoriteSearch.taskingIdentifiersParams[taskingId].name = taskingId;
      favoriteSearch.taskingIdentifiersParams[taskingId].display = 'block';
    }
    else {
      //favoriteSearch.taskingIdentifiersList.splice(favoriteSearch.taskingIdentifiersList.indexOf(taskingId), 1);
      favoriteSearch.taskingIdentifiersParams[taskingId].display = 'none';
    }
    SearchStore.updateSearch(DrsConstants.defaultSearches.FAVORITE_TASKING_SEARCH, DrsConstants.searchType.DEFAULT, favoriteSearch, true);
  },

  exportSearch: function(name, acquisitionStatuses, catalogInfos, callback) {
    Query.getJSON('/utils/services.php?ctrl=tasking&function=exportSearch&name='+name+'&status='+JSON.stringify(acquisitionStatuses)+'&catalog='+catalogInfos+'&mail='+account.eMail)
    .then(function(data){
      if (data.success) {
        callback();
      } else if (data.message) {
        console.error(data.message);
      }
    });
  },

  getSearchFromDatabase: function(name, callback) {
    Query.getJSON('/utils/services.php?ctrl=tasking&function=getSearchFromDatabase&name='+name)
    .then(function(data){
      if (data.success) {
        callback(data.search);
      } else if (data.message) {
        console.error(data.message);
      }
    });
  },

  downloadKml: function(name, callback) {
    /*Query.getJSON('/utils/services.php?ctrl=tasking&function=downloadKml&name='+name)
    .then(function(data){
      console.log(data);
      if (data.success) {
        callback();
      } else if (data.message) {
        console.error(data.message);
      }
    });*/
    if(!window.Blob) {
      window.location = '/utils/services.php?ctrl=tasking&function=downloadKml&name=' + name;
      return;
    }
    Query.get('/utils/services.php?ctrl=tasking&function=downloadKml&name=' + name, true)
    .then(function(xhr) {
      var filename = '';
      var disposition = xhr.getResponseHeader('Content-Disposition');
      if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
      }

      var type = xhr.getResponseHeader('Content-Type');
      var blob = new Blob([xhr.responseText], { type: type });
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
          window.navigator.msSaveBlob(blob, filename);
      } else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);

          if (filename) {
              // use HTML5 a[download] attribute to specify filename
              var a = document.createElement('a');
              // safari doesn't support this yet
              if (typeof a.download === 'undefined') {
                  window.location = downloadUrl;
              } else {
                  a.href = downloadUrl;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
              }
          } else {
              window.location = downloadUrl;
              var error = {
                'success': false,
                'message': 'download-file-doesnt-exist'
              };
              callback(error);
          }

          setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
      }
    });
  },

  emitChange: function(searchName) {
    this.emit(CHANGE_EVENT, searchName);
  },

  emitInitialized: function(search) {
    this.emit(INITIALIZED_EVENT, search);
  },

  emitEditionStart: function(search) {
    this.emit(EDIT_EVENT, search);
  },

  emitSave: function(data) {
    this.emit(SAVE_EVENT, data);
  },

  emitDelete: function() {
    this.emit(DELETE_EVENT);
  },

  emitStartUnsavedSearch: function() {
    this.emit(UNSAVED_SEARCH_START);
  },

  emitStopUnsavedSearch: function() {
    this.emit(UNSAVED_SEARCH_STOP);
  },

  addChangeListener: function(callback, searchName) {
    this.on(CHANGE_EVENT, callback, searchName);
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

  addSaveListener: function(callback) {
    this.on(SAVE_EVENT, callback);
  },

  removeSaveListener: function(callback) {
    this.removeListener(SAVE_EVENT, callback);
  },

  addExportListener: function(callback) {
    this.on(EXPORT_EVENT, callback);
  },

  removeExportListener: function(callback) {
    this.removeListener(EXPORT_EVENT, callback);
  },

  addDownloadListener: function(callback) {
    this.on(DOWNLOAD_EVENT, callback);
  },

  removeDownloadListener: function(callback) {
    this.removeListener(DOWNLOAD_EVENT, callback);
  },

  addSearchEditListener: function(callback) {
    this.on(EDIT_EVENT, callback);
  },

  removeSearchEditListener: function(callback) {
    this.removeListener(EDIT_EVENT, callback);
  },

  addDeleteListener: function(callback) {
    this.on(DELETE_EVENT, callback);
  },

  removeDeleteListener: function(callback) {
    this.removeListener(DELETE_EVENT, callback);
  },

  addUnsavedSearchStartListener: function(callback) {
    this.on(UNSAVED_SEARCH_START, callback);
  },

  removeUnsavedSearchStartListener: function(callback) {
    this.removeListener(UNSAVED_SEARCH_START, callback);
  },

  addUnsavedSearchStopListener: function(callback) {
    this.on(UNSAVED_SEARCH_STOP, callback);
  },

  removeUnsavedSearchStopListener: function(callback) {
    this.removeListener(UNSAVED_SEARCH_STOP, callback);
  }
});


SearchStore.setMaxListeners(0);

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case DrsConstants.searchActions.FIRST_LOAD :
      SearchStore.initialize();
      break;
    case DrsConstants.searchActions.NEW :
      SearchStore.emitStartUnsavedSearch();
      SearchStore.search(action.data, SearchStore.storeUnsavedResults, SearchStore.unsavedSearchLoadError, 1, true);
      break;
    case DrsConstants.searchActions.DELETE_UNSAVED :
      SearchStore.resetUnsavedSearch();
      break;
    case DrsConstants.searchActions.SAVE :
      SearchStore.saveUnsavedSearch(action.data);
      break;
    case DrsConstants.searchActions.LOAD :
      SearchStore.loadSearch(action.data.searchName, action.data.searchType);
      break;
    case DrsConstants.searchActions.DELETE :
      SearchStore.deleteSearch(action.data);
      break;
    case DrsConstants.searchActions.EDIT :
      SearchStore.editSearch(action.data);
      break;
    case DrsConstants.searchActions.UPDATE :
      SearchStore.updateSavedSearch(action.data.searchName, action.data.searchData);
      break;
    case DrsConstants.searchActions.RENAME :
      SearchStore.renameSearch(action.data.oldName, action.data.newName, action.data.callback);
      break;
    case DrsConstants.searchActions.FREEZE :
      SearchStore.toggleFreeze(action.data.searchName, action.data.searchType, action.data.callback);
      break;
    case DrsConstants.icrActions.FAVORITE_CHANGE :
      SearchStore.handleFavoriteChange(action.data.taskingId, action.data.isFavorite);
      break;
    default:
      // no op
  }
});

module.exports = SearchStore;
