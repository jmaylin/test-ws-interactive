var Query = require('../tools/query');

var CustomLayersService = {
  getList: function(callback) {
    return Query.getJSON('/utils/services.php?ctrl=customlayers&function=getList')
      .then(callback);
  },
  getKmlUrl: function(filePath) {
    var publicUrl = location.protocol + '//' + location.host;
    return publicUrl + filePath;
  },
  delete: function(filename, callback) {
    return Query.getJSON('/utils/services.php?ctrl=customlayers&function=delete&filename=' + filename)
      .then(callback);
  }
};

module.exports = CustomLayersService;
