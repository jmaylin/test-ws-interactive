//var moment = require('moment');
var assign = require('object-assign');
var Query = require('../tools/query');
var SubmitTaskingStore = require('../stores/SubmitTaskingStore');
var AccountStore = require('../stores/AccountStore');
var AcquisitionStore = require('../stores/AcquisitionStore');


var TaskingService = {
  submitTasking: function(mode, callback) {
    var generalParameters = SubmitTaskingStore.getGeneralParameters();
    var technicalParameters = SubmitTaskingStore.getTechnicalParameters();
    var technicalProgResults = SubmitTaskingStore.getTechnicalProgResults();
    var productionParameters = {};
    if(mode !== 'DRS') {
      productionParameters = SubmitTaskingStore.getProductionParameters();
    }

    var parameters = TaskingService.computeSubmitTaskingParameters(generalParameters, technicalParameters, technicalProgResults, productionParameters);
    var queryString = $.param(parameters);
    Query.getJSON('/utils/services.php?ctrl=tasking&function=submitTasking&' + queryString )
      .then(callback);
  },

  submitProduction: function(itemId, orderId, taskingId, callback) {
    var productionParameters = SubmitTaskingStore.getPostProductionParameters(itemId);
    var acquisition = AcquisitionStore.getAcquisitionInformations(itemId);

    var acquisitionParameters = {
      itemId: itemId,
      orderId: orderId,
      taskingId: taskingId,
      catalogStripList: []
    };

    acquisitionParameters.catalogStripList = acquisition.catalogStrips.map(function (catalogStrip) {
      return catalogStrip.id;
    });

    assign(acquisitionParameters, productionParameters);

    var queryString = $.param(acquisitionParameters);

    Query.getJSON('/utils/services.php?ctrl=tasking&function=submitProduction&' + queryString )
      .then(callback);
  },

  computeSubmitTaskingParameters: function(generalParameters, technicalParameters, technicalProgResults, productionParameters) {
    var parameters = {};

    /**
     * Parameters from step 1
     */
    parameters.comment = generalParameters.comment;
    parameters.contract = generalParameters.contract;
    parameters.dsp = generalParameters.dsp;
    parameters.market = generalParameters.market;
    parameters.mission = generalParameters.mission;
    parameters.organism = generalParameters.organism;
    parameters.program = generalParameters.program;
    parameters.reference = generalParameters.reference;
    parameters.taskingGroup = generalParameters.taskingGroup;
    parameters.areaCode = SubmitTaskingStore.getAreaCode();

    /**
     * Parameters from step 2
     */
    parameters.acquisitionPeriod = SubmitTaskingStore.convertAcquisitionPeriod(technicalParameters.acquisitionPeriod);
    parameters.dumpingParameters = technicalParameters.dumpingParameters;
    parameters.maxBh = technicalParameters.maxBh;
    parameters.minBh = technicalParameters.minBh;
    parameters.maxCloudCoverage = technicalParameters.maxCloudCoverage;
    parameters.maxIncidenceAngle = technicalParameters.maxIncidenceAngle;
    parameters.notificationRecipients = technicalParameters.notificationRecipients;
    parameters.progType = technicalParameters.progType;
    parameters.stereoMode = technicalParameters.stereoMode;

    /**
     * Station / contract parameters depending on both step 1 & 2
     */
    parameters.stationParameters = {};
    if(parameters.contract === 'DRS') {
      parameters.stationParameters = AccountStore.getDrsParameters(parameters.mission, parameters.progType);
    }
    else {
      parameters.stationParameters = AccountStore.getVrsParameters(parameters.contract, parameters.mission, parameters.progType);
    }

    /**
     * Parameters from getTechnicalProg called at the end of step 2
     */
    assign(parameters, technicalProgResults);

    /**
     * parameters from Step 3 for VRS
     */
    assign(parameters, productionParameters);

    return parameters;
  }
};

module.exports = TaskingService;
