/* global account */
/* global markets */
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var DrsConstants = require('../constants/DrsConstants');
var union = require('lodash.union');
var _drawnShape = null;
var _coordinates = null;

var CHANGE_EVENT = 'change';
var SHAPE_EVENT = 'shape';
var COORDINATES_EVENT = 'coordinates';

var AccountStore = assign({}, EventEmitter.prototype, {
  getAvailableMissionTypes: function() {
    return account.missionList.map(function(mission) {
      return mission.type;
    });
  },

  setDrawnShape: function(shape) {
    _drawnShape = shape;
    AccountStore.emitChange();
  },

  getDrawnShape: function() {
    return _drawnShape;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  showEditableShapeButton: function() {
    AccountStore.emitShape();
  },

  emitShape: function() {
    this.emit(SHAPE_EVENT);
  },

  updateCoordinates: function(compute) {
    _coordinates = compute;
    AccountStore.emitCoordinates();
  },

  emitCoordinates: function() {
    this.emit(COORDINATES_EVENT, _coordinates);
  },

  accountIsValid: function() {
    return account.missionList.length !== 0 && account.customerId !== '';
  },

  getUserEmail: function() {
    return account.eMail;
  },

  getOrderId: function() {
    return account.orderId;
  },

  userCanSubmitTasking: function() {
    return account.canSubmitTasking;
  },

  userCanSubmitProduction: function() {
    return account.canSubmitProduction;
  },

  priorityRushAvailable: function() {
    return account.priorityRushAvailable;
  },

  getContractOptions: function() {
    var contractOptions = {};
    account.missionList.forEach(function(mission) {

      var hasDrs = false;
      contractOptions[mission.type] = [];
      var vrsStations = mission.stations.filter(function(station){
        return station.parameters.usage === DrsConstants.stationUsage.USAGE_VRS_GAP_FILLING || station.parameters.usage === DrsConstants.stationUsage.USAGE_VRS_PROJECT;
      });

      mission.stations.filter(function(station){
        return station.parameters.usage !== null;
      }).forEach(function(station){
        if(station.parameters.usage === DrsConstants.stationUsage.USAGE_DRS || station.parameters.usage === DrsConstants.stationUsage.USAGE_DRS4VRS) {
          hasDrs = true;
        }
      });

      if(hasDrs) {
        contractOptions[mission.type].push({value: 'DRS', text: 'DRS'});
      }
      vrsStations.map(function(station){
        contractOptions[mission.type].push({value: station.acronym, text: station.acronym + '-VRS'});
      });
    });
    return contractOptions;
  },

  getDrsOfMission: function(missionType, onlyDrs4Vrs = false) {
    var drsStations;
    account.missionList.forEach(function(mission){
      if(missionType === mission.type) {
        drsStations = mission.stations.filter(function(station){
          if (onlyDrs4Vrs) {
            return station.parameters.usage === DrsConstants.stationUsage.USAGE_DRS4VRS;
          } else {
            return station.typeWebservice === DrsConstants.stationType.TYPE_RECEIVING && (station.parameters.usage === DrsConstants.stationUsage.USAGE_DRS || station.parameters.usage === DrsConstants.stationUsage.USAGE_DRS4VRS);
          }
        });
      }
    });
    return drsStations;
  },

  getVrsOfMission: function(missionType) {
    var vrsStations;
    account.missionList.forEach(function(mission){
      if(missionType === mission.type) {
        vrsStations = mission.stations.filter(function(station){
          return station.parameters.usage === DrsConstants.stationUsage.USAGE_VRS_GAP_FILLING || station.parameters.usage === DrsConstants.stationUsage.USAGE_VRS_PROJECT;
        });
      }
    });
    return vrsStations;
  },

  getDrsMinDSP: function(missionType) {
    var minDsp = null;
    var drsStations = AccountStore.getDrsOfMission(missionType);
    var allDsp = drsStations.map(function(station){
      return station.parameters.dsp;
    });

    if(allDsp.indexOf('DSP1') !== -1) {
      minDsp = 'DSP1';
    }
    else if(allDsp.indexOf('DSP2') !== -1) {
      minDsp = 'DSP2';
    }
    else {
      minDsp = 'DSP3';
    }
    return minDsp;
  },

  getDspProfile: function(acronym, missionType) {
    var dsp = null;
    var vrsStations = AccountStore.getVrsOfMission(missionType);

    for (var i = 0; i < vrsStations.length; i++) {
      if(vrsStations[i].acronym === acronym) {
        dsp = vrsStations[i].parameters.dsp;
      }
    }
    return dsp;
  },

  getOrganismsOptions: function() {
    var organismsOptions = {};
    account.missionList.forEach(function(mission) {
      organismsOptions[mission.type] = {
        default: mission.organisms.default,
        options: []
      };
      organismsOptions[mission.type].options = mission.organisms.list.map(function(organism) {
        return {value: organism, text: organism};
      });
    });
    return organismsOptions;
  },

  getTaskingGroupOptions: function() {
    var taskingGroupOptions = {};
    account.missionList.forEach(function(mission) {
      taskingGroupOptions[mission.type] = {
        default: mission.taskingGroups.default,
        options: []
      };
      taskingGroupOptions[mission.type].options = mission.taskingGroups.list.map(function(taskingGroup) {
        return {value: taskingGroup, text: taskingGroup};
      });
    });
    return taskingGroupOptions;
  },

  getMarketOptions: function() {
    return markets;
  },

  getDrsProgTypesOptions: function(missionType) {
    var progTypes = [];
    var drsStations = AccountStore.getDrsOfMission(missionType);
    for (var i = 0; i < drsStations.length; i++) {
      progTypes = union(progTypes, drsStations[i].parameters.availableProgTypes);
    }
    return progTypes;
  },

  getVrsProgTypesOptions: function(acronym, missionType) {
    var progTypes = [];
    var vrsStations = AccountStore.getVrsOfMission(missionType);

    for (var i = 0; i < vrsStations.length; i++) {
      if(vrsStations[i].acronym === acronym) {
        progTypes = vrsStations[i].parameters.availableProgTypes;
      }
    }
    return progTypes;
  },

  allDrsHaveProgType: function(missionType, progType) {
    var drsStations = AccountStore.getDrsOfMission(missionType, account.accessToDrs4Vrs);
    for (var i = 0; i < drsStations.length; i++) {
      if(drsStations[i].parameters.availableProgTypes.indexOf(progType) === -1) {
        return false;
      }
    }
    return true;
  },

  allDrsHaveEqualParameters: function(missionType, progType) {
    var drsStations = AccountStore.getDrsOfMission(missionType, account.accessToDrs4Vrs);
    var classParameter = null;
    var useWeatherForecastParameter = null;
    var weatherRejectionThresholdParameter = null;
    var weightParameter = null;
    for (var i = 0; i < drsStations.length; i++) {
      if(i === 0) {
        classParameter = drsStations[i].parameters.progTypesParameters[progType].class;
        useWeatherForecastParameter = drsStations[i].parameters.progTypesParameters[progType].useWeatherForecast;
        weatherRejectionThresholdParameter = drsStations[i].parameters.progTypesParameters[progType].weatherRejectionThreshold;
        weightParameter = drsStations[i].parameters.progTypesParameters[progType].weight;
      }
      else {
        if(classParameter !== drsStations[i].parameters.progTypesParameters[progType].class ||
          useWeatherForecastParameter !== drsStations[i].parameters.progTypesParameters[progType].useWeatherForecast ||
          weatherRejectionThresholdParameter !== drsStations[i].parameters.progTypesParameters[progType].weatherRejectionThreshold ||
          weightParameter !== drsStations[i].parameters.progTypesParameters[progType].weight) {
          return false;
        }
      }
    }
    return true;
  },

  getDrsParameters: function(missionType, progType) {
    var drsStations = AccountStore.getDrsOfMission(missionType);
    if(drsStations.length) {
      return drsStations[0].parameters.progTypesParameters[progType];
    }
    return {
      'class': null,
      'useWeatherForecast': null,
      'weatherRejectionThreshold': null,
      'weight': null
    };
  },

  getVrsParameters: function(acronym, missionType, progType) {
     var vrsStations = AccountStore.getVrsOfMission(missionType);

    for (var i = 0; i < vrsStations.length; i++) {
      if(vrsStations[i].acronym === acronym) {
        return vrsStations[i].parameters.progTypesParameters[progType];
      }
    }
    return {
      'class': null,
      'useWeatherForecast': null,
      'weatherRejectionThreshold': null,
      'weight': null
    };
  },

  getReceivingStationsforMission: function(missionType) {
    return AccountStore.getStationsByMissionAndType(missionType, DrsConstants.stationType.TYPE_RECEIVING);
  },

  getProcessingStationsforMission: function(missionType) {
    return AccountStore.getStationsByMissionAndType(missionType, DrsConstants.stationType.TYPE_PROCESSING);
  },

  getStationsByMissionAndType: function(missionName, stationType) {
    var stations = [];
    account.missionList.forEach(function(mission){
      if(missionName === mission.type) {
        stations = mission.stations.filter(function(station){
          return station.typeWebservice === stationType;
        });
      }
    });
    return stations;
  },

  getAllReceivingStations: function() {
    var stations = [];
    account.missionList.forEach(function(mission){
      mission.stations.forEach(function(station){
        if (station.typeWebservice === DrsConstants.stationType.TYPE_RECEIVING) {
          stations.push(station);
        }
      });
    });
    return stations;
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

  addShapeListener: function(callback) {
    this.on(SHAPE_EVENT, callback);
  },

  removeShapeListener: function() {
    this.removeListener(SHAPE_EVENT);
  },

  addCoordinatesListener: function(callback) {
    this.on(COORDINATES_EVENT, callback);
  },

  removeCoordinatesListener: function() {
    this.removeListener(COORDINATES_EVENT);
  }
});

module.exports = AccountStore;
