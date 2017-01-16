var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var moment = require('moment');

var DrsConstants = require('../constants/DrsConstants');
var AccountStore = require('./AccountStore');
var ProgServer = require('../tools/ProgServer');
var i18n = require('../tools/i18n');
var map = require('../mapOl');

var ATTEMPTS_UPDATED_EVENT = 'attempts';

var generalParameters = {
  mission: null,
  contract: null,
  organism: null,
  market: null,
  dsp: null,
  reference: null,
  program: null,
  comment: null,
  hasError: false,
  missionError: false,
  contractError: false,
  organismError: false,
  marketError: false,
  dspError: false,
  referenceError: false,
  programError: false,
  commentError: false,
  taskingGroup: null,
  contractOptions: [],
  organismOptions: [],
  taskingGroupOptions: [],
  dspOptions: [],
  loading: false
};

var technicalParameters = {
  progType: null,
  progTypeOptions: [],
  progTypeOptionsStatus: {},
  progTypeOptionsParametersStatus: {},
  stereoMode: 'NONE',
  stereoModeOptions: [],
  stereoModeAllOptions: [
    {value: 'NONE', text: i18n.getDictionnary('taskingStereoMethod-NONE')},
    {value: 'STEREO', text: i18n.getDictionnary('taskingStereoMethod-STEREO')},
    {value: 'TRI-STEREO', text: i18n.getDictionnary('taskingStereoMethod-TRI-STEREO')}
  ],
  stereoModeDedicatedOptions: [
    {value: 'NONE', text: i18n.getDictionnary('taskingStereoMethod-NONE')}
  ],
  minBh: 0,
  maxBh: 1,
  maxIncidenceAngle: DrsConstants.taskingParameters.DEFAULT_INCIDENCE_ANGLE,
  maxCloudCoverage: DrsConstants.taskingParameters.DEFAULT_CLOUD_COVERAGE,
  acquisitionPeriod: {
    start: new Date(),
    end: new Date()
  }
};

var currentProductionParameters = {
  prodPriority: null,
  prodProcessingLevel: null,
  prodCompressionImage: null,
  prodImageFormat: null,
  prodLicence: null,
  prodPixelCoding: null,
  prodProductFormat: null,
  prodProjectionCode: null,
  prodElevation: null,
  prodSpectralProcessing: null,
  prodStereoMode: null,
  prodRadiometricAdaptation: false,
  prefix: ''
};

var postProductionParameters = {};

var areaCode = null;
var responsibles = {};
var attempts = [];
var errorMessage = null;
var aoi = null;
var technicalProgResults = null;

var SubmitTaskingStore = assign({}, EventEmitter.prototype, {
  getGeneralParameters: function() {
    return generalParameters;
  },
  saveGeneralParameters: function(parameters, callback) {
    var coordinates = map.getCoordinates(AccountStore.getDrawnShape());

    aoi = "";
    for (var i = 0; i < coordinates.length-1; i++) {
      aoi += " " + coordinates[i][1] + " " + coordinates[i][0];
    }

    generalParameters = parameters;

    ProgServer.getProgResponsibles(generalParameters.mission, aoi, function(data){
      if(data.success) {
        areaCode = data.areaCode;
        responsibles = data.responsibles;
      }
      generalParameters.loading = false;
      callback(data);
    });
  },

  getTechnicalParameters: function() {
    if(technicalParameters.progTypeOptions.length === 0) {
      SubmitTaskingStore.initProgTypeOptions();
    }
    return technicalParameters;
  },

  saveTechnicalParameters(parameters, callback) {
    technicalParameters = parameters;
    var progServerParameters = {
      progType: technicalParameters.progType,
      mission: generalParameters.mission,
      aoi: aoi,
      maxCloudCoverage: technicalParameters.maxCloudCoverage,
      maxIncidenceAngle: technicalParameters.maxIncidenceAngle,
      acquisitionPeriod: SubmitTaskingStore.convertAcquisitionPeriod(technicalParameters.acquisitionPeriod),
      stereoMode: technicalParameters.stereoMode
    };
    ProgServer.getTechnicalProg(progServerParameters, function(data) {
      technicalParameters.loading = false;
      if(data.success) {
        technicalProgResults = data.result;
      }
      callback(data);
    });
  },

  getTechnicalProgResults: function() {
    return technicalProgResults;
  },

  getSelectedProgType: function() {
    return technicalParameters.progType;
  },

  convertAcquisitionPeriod: function(acquisitionPeriod) {
    // convert dates to timestamps
    var converted = {
      start: moment(acquisitionPeriod.start).format('X'),
      end: moment(acquisitionPeriod.end).format('X')
    };
    return converted;
  },

  getAreaCode: function() {
    return areaCode;
  },

  getResponsibles: function() {
    return responsibles;
  },

  getSelectedMission: function() {
    return generalParameters.mission;
  },

  getSelectedContract: function() {
    return generalParameters.contract;
  },


  initProgTypeOptions: function() {
    var progTypes = [];
    // get Selected contract at the previous step
    if(generalParameters.contract === 'DRS') {
      progTypes = AccountStore.getDrsProgTypesOptions(generalParameters.mission);
      progTypes.forEach(function(progType){
        technicalParameters.progTypeOptions.push({value: progType, text: i18n.get('taskingType-' + progType.toUpperCase())});
        technicalParameters.progTypeOptionsStatus[progType] = AccountStore.allDrsHaveProgType(generalParameters.mission, progType);
        technicalParameters.progTypeOptionsParametersStatus[progType] = AccountStore.allDrsHaveEqualParameters(generalParameters.mission, progType);
      });
    }
    else {
      progTypes = AccountStore.getVrsProgTypesOptions(generalParameters.contract, generalParameters.mission);
      progTypes.forEach(function(progType){
        technicalParameters.progTypeOptions.push({value: progType, text: i18n.get('taskingType-' + progType.toUpperCase())});
        technicalParameters.progTypeOptionsStatus[progType] = true;
        technicalParameters.progTypeOptionsParametersStatus[progType] = true;
      });
    }
  },

  getProgCapacity: function(incidenceAngle) {
    var coordinates = map.getCoordinates(AccountStore.getDrawnShape());

    aoi = "";
    for (var i = 0; i < coordinates.length-1; i++) {
      aoi += " " + coordinates[i][1] + " " + coordinates[i][0];
    }
    var mission = generalParameters.mission;
    var cloudCover = null;
    var dspProfile = generalParameters.dsp;
    SubmitTaskingStore.setAttempts([]);
    SubmitTaskingStore.setProgCapacityError(null);

    ProgServer.getProgCapacity(mission, aoi, cloudCover, incidenceAngle, dspProfile, function(data) {
      if(!data.success) {
        SubmitTaskingStore.setAttempts([]);
        SubmitTaskingStore.setProgCapacityError(data.message);
        SubmitTaskingStore.emitChangeAttempts();
      }
      else {
        SubmitTaskingStore.setAttempts(data.attempts);
      }
      SubmitTaskingStore.emitChangeAttempts();
    });
  },

  setAttempts: function(newAttempts) {
    attempts = newAttempts;
  },

  setProgCapacityError: function(newErrorMessage) {
    errorMessage = newErrorMessage;
  },

  getAttempts: function() {
    return attempts;
  },

  getProgCapacityError: function() {
    return errorMessage;
  },

  emitChangeAttempts: function() {
    this.emit(ATTEMPTS_UPDATED_EVENT);
  },

  addChangeAttemptsListener: function(callback) {
    this.on(ATTEMPTS_UPDATED_EVENT, callback);
  },

  removeChangeAttemptsListener: function(callback) {
    this.removeListener(ATTEMPTS_UPDATED_EVENT, callback);
  },

  saveProductionParameters: function(prodParameters) {
    currentProductionParameters = {
      prodPriority: prodParameters.prodPriority,
      prodProcessingLevel: prodParameters.prodProcessingLevel,
      prodCompressionImage: prodParameters.prodCompressionImage,
      prodImageFormat: prodParameters.prodImageFormat,
      prodLicence: prodParameters.prodLicence,
      prodPixelCoding: prodParameters.prodPixelCoding,
      prodProductFormat: prodParameters.prodProductFormat,
      prodProjectionCode: prodParameters.prodProjectionCode,
      prodElevation: prodParameters.prodElevation,
      prodSpectralProcessing: prodParameters.prodSpectralProcessing,
      prodStereoMode: prodParameters.prodStereoMode,
      prodRadiometricAdaptation: prodParameters.prodRadiometricAdaptation,
      prefix: prodParameters.prefix
    };
  },

  getProductionParameters: function() {
    return currentProductionParameters;
  },

  savePostProductionParameters: function(itemId, prodParameters) {
    postProductionParameters[itemId] = {
      prodPriority: prodParameters.prodPriority,
      prodProcessingLevel: prodParameters.prodProcessingLevel,
      prodCompressionImage: prodParameters.prodCompressionImage,
      prodImageFormat: prodParameters.prodImageFormat,
      prodLicence: prodParameters.prodLicence,
      prodPixelCoding: prodParameters.prodPixelCoding,
      prodProductFormat: prodParameters.prodProductFormat,
      prodProjectionCode: prodParameters.prodProjectionCode,
      prodElevation: prodParameters.prodElevation,
      prodSpectralProcessing: prodParameters.prodSpectralProcessing,
      prodStereoMode: prodParameters.prodStereoMode,
      prodRadiometricAdaptation: prodParameters.prodRadiometricAdaptation,
      prefix: prodParameters.prefix
    };
  },

  getPostProductionParameters: function(itemId) {
    return postProductionParameters[itemId];
  }
});

SubmitTaskingStore.setMaxListeners(0);

module.exports = SubmitTaskingStore;
