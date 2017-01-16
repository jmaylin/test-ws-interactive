/* global applicationConfiguration */
var Query = require('../tools/query');

var GeometryUploadService = {
  processFile: function(fileId, callback) {
    Query.postJSON(applicationConfiguration.parserService.processorUrl, {files: fileId})
    .then(function(data) {
      callback(data);
    })
    .catch(function(data) {
      console.log(data);
      callback(null);
    });
  }
};

module.exports = GeometryUploadService;
