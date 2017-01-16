var Query = require('../tools/query');

var AcquisitionValidationService = {
  setStatus: function(parameters, callback) {

    return Query.postJSON('/utils/services.php?ctrl=acquisition&function=setStatus&', parameters)
      .then(callback);
  }
};

module.exports = AcquisitionValidationService;
