var assign = require('object-assign');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var DrsConstants = require('../constants/DrsConstants');
var Query = require('../tools/query');
var AcquisitionStore = require('./AcquisitionStore');
//var OrderStore = require('./OrderStore');

var UPDATE_EVENT = 'update';
var _taskings = {};
var _acquisitions = {};
var _currentOrder = {
  prop: 'date',
  order: 'desc'
};

var TaskingStore = assign({}, EventEmitter.prototype, {
  addItems: function(data) {
    data.forEach(function(element){
      if(element.id in _taskings) {
        assign(_taskings[element.id], element);
        TaskingStore.emitUpdate(element.id, 'update');
      }
      else {
        _taskings[element.id] = element;
        _acquisitions[element.id] = {};
      }
    });
  },

  getTaskingInformations: function(taskingId) {
    if(taskingId in _taskings) {
      if (_acquisitions[taskingId].length) {
        _acquisitions[taskingId].sort(TaskingStore.comparator(_currentOrder.prop, _currentOrder.order));
        if (_currentOrder.prop === 'clearSkyRate') {
          _acquisitions[taskingId].reverse();
        }
        _taskings[taskingId].acquisitionIdentifiersList = [];
        _acquisitions[taskingId].forEach(function(acquisition) {
          _taskings[taskingId].acquisitionIdentifiersList.push(acquisition.id);
        });
      }
      return _taskings[taskingId];
    }
    return null;
  },

  updateAcquisitions: function(taskingId, orderDate, orderCloud) {
    if(taskingId in _taskings) {
      if (orderDate) {
        TaskingStore.setCurrentOrder('date', orderDate);
        _acquisitions[taskingId].sort(TaskingStore.comparator('date', orderDate));
      }
      if (orderCloud) {
        TaskingStore.setCurrentOrder('clearSkyRate', orderCloud);
        _acquisitions[taskingId].sort(TaskingStore.comparator('clearSkyRate', orderCloud));
        _acquisitions[taskingId].reverse();
      }
      _taskings[taskingId].acquisitionIdentifiersList = [];
      _acquisitions[taskingId].forEach(function(acquisition) {
        _taskings[taskingId].acquisitionIdentifiersList.push(acquisition.id);
      });
      return _taskings[taskingId];
    }
    return null;
  },

  comparator: function(_prop, _order) {
    return function(a, b) {
      if (_prop === 'clearSkyRate') {
        switch (_order) {
          case 'asc': return a.catalogStrips[0][_prop] - b.catalogStrips[0][_prop];
          case 'desc': return b.catalogStrips[0][_prop] - a.catalogStrips[0][_prop];
          default: return a.catalogStrips[0][_prop] - b.catalogStrips[0][_prop];
        }
      }
      if (a.catalogStrips[0][_prop] > b.catalogStrips[0][_prop]) {
        switch (_order) {
          case 'asc': return 1;
          case 'desc': return -1;
          default: return 0;
        }
      }
      if (a.catalogStrips[0][_prop] < b.catalogStrips[0][_prop]) {
        switch (_order) {
          case 'asc': return -1;
          case 'desc': return 1;
          default: return 0;
        }
      }
      return 0;
    };
  },

  setCurrentOrder: function(_prop, _order) {
    _currentOrder = {
      prop: _prop,
      order: _order
    };
  },

  toggleShowAoi: function(taskingId, display = null) {
    if (display === null) {
      display  = !_taskings[taskingId].showAoi;
    }
    _taskings[taskingId].showAoi = display;
    TaskingStore.emitUpdate(taskingId, 'update');
  },

  setShowAoi: function(taskingId, showAoi) {
    _taskings[taskingId].showAoi = showAoi;
    TaskingStore.emitUpdate(taskingId, 'update');
  },

  getShowAoi: function(taskingId) {
    return _taskings[taskingId].showAoi;
  },

  toggleFavorite: function(taskingId) {
    Query.getJSON('/utils/services.php?ctrl=tasking&function=toggleFavorite&taskingId='+taskingId)
    .then(function(data) {
      if(data.success) {
        _taskings[taskingId].favorite = !_taskings[taskingId].favorite;
        //_taskings[taskingId].showAoi = !_taskings[taskingId].showAoi;
        //_taskings[taskingId].showAoi = false;
        TaskingStore.emitUpdate(taskingId, 'update');
        AppDispatcher.dispatch({
          actionType: DrsConstants.icrActions.FAVORITE_CHANGE,
          data: {
            taskingId: taskingId,
            isFavorite: _taskings[taskingId].favorite
          }
        });
      }
    });
  },

  loadAcquisitions: function(taskingId, acquisitionStatus, page = 1, forceUpdate = false) {
    var queryString = '&taskingId=' + taskingId + '&' + $.param(acquisitionStatus);
    var force = '';
    if (forceUpdate) {
      force = '&forceupdate='+forceUpdate;
    }
    Query.getJSON('/utils/services.php?ctrl=acquisition&function=searchAcquisitions&page='+page+'&'+queryString+force)
    .then(function(data) {
      _taskings[taskingId].acquisitionIdentifiersList = data.acquisitionIdentifiersList;
      _taskings[taskingId].totalResults = data.totalResults;
      _taskings[taskingId].nbResults = data.nbResults;
      if (page == 1) {
        _acquisitions[taskingId] = data.acquisitionList;
      } else if (page > 1) {
        for (var i = 0; i < data.acquisitionList.length; i++) {
          _acquisitions[taskingId].push(data.acquisitionList[i]);
        }
      }
      AcquisitionStore.addItems(data.acquisitionList);
      TaskingStore.emitUpdate(taskingId, 'acquisitionLoaded');
    }).catch(function(e) {
      console.log(e);
    });
  },

  getOrderDetails: function(orderId, taskingId) {
    var queryString = '&orderId=' + orderId + '&taskingId=' + taskingId;
    Query.getJSON('/utils/services.php?ctrl=tasking&function=getOrderDetailsForTasking'+queryString)
    .then(function(data) {
      _taskings[taskingId].acquisitionIdentifiersList = data.acquisitionIdentifiersList;
      _acquisitions[taskingId] = data.acquisitionList;
      AcquisitionStore.addItems(data.acquisitionList);
      TaskingStore.emitUpdate(taskingId, 'acquisitionLoaded');
    }).catch(function(e) {
      console.log(e);
    });
  },

  emitUpdate: function(taskingId, eventType) {
    this.emit(UPDATE_EVENT, {taskingId: taskingId, eventType: eventType});
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

TaskingStore.setMaxListeners(0);

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case DrsConstants.icrActions.TOGGLE_FAVORITE :
      TaskingStore.toggleFavorite(action.data);
      break;
    case DrsConstants.icrActions.ACQUISITION_LOAD :
      TaskingStore.loadAcquisitions(action.data.taskingId, action.data.acquisitionStatus);
      break;
    default:
      // no op
  }
});
module.exports = TaskingStore;
