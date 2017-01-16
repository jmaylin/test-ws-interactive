var Query = require('./query');


var ProgServer = {
  getProgResponsibles: function(mission, aoi, callback) {

    var params = {
      'mission': mission,
      'aoi': aoi
    };
    Query.postJSON('/utils/services.php?ctrl=prog&function=getProgResponsibles', params)
      .then(callback);
  },

  getProgCapacity: function(mission, aoi, cloudCover, incidenceAngle, dspProfile, callback) {
    var parameters = '&mission=' + mission + '&aoi=' + aoi + '&cloudCover=' + cloudCover + '&incidenceAngle=' + incidenceAngle + '&dspProfile=' + dspProfile;
    Query.getJSON('/utils/services.php?ctrl=prog&function=getProgCapacity' + parameters )
      .then(callback);
  },

  getTechnicalProg: function(parameters, callback) {
    Query.getJSON('/utils/services.php?ctrl=prog&function=getTechnicalProg&' + $.param(parameters) )
      .then(callback);
  }
};

module.exports = ProgServer;
