/* global applicationConfiguration */
var React = require('react');
var Flow = require('flow.js');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');

var GeometryUploadService = require('../../services/GeometryUploadService');
var AccountStore = require('../../stores/AccountStore');
var map = require('../../mapOl');
var ErrorModal = require('../modals/errorModal');
var i18n = require('../../tools/i18n');

var ShapeUploader = React.createClass({
  displayName: 'ShapeUploader',
  getInitialState: function() {
    this.flow = new Flow({
      target: applicationConfiguration.parserService.uploadUrl,
      chunkSize: 1024 * 1024,
      testChunks: false
    });
    return {
      uploading: false,
      fileError: false,
      fileFormatError: false
    };
  },
  componentDidMount: function() {
    var that = this;
    if(this.flow.support) {
      this.flow.assignBrowse(React.findDOMNode(this.refs.shapeUploader));
      this.flow.on('fileAdded', function(file) {
        return that.validateFile(file);
      });
      this.flow.on('filesSubmitted', function() {
        that.flow.upload();
        that.setState({'uploading': true});
      });
      this.flow.on('fileSuccess', function(flowFile, message) {
        that.fileUploaded(flowFile, message);
        that.setState({'uploading': false});
      });
      this.flow.on('error', function(message, flowFile) {
        that.flowError(message, flowFile);
        that.setState({'uploading': false, fileError: true});
      });
    }

  },
  componentWillUnmount: function() {
    // remove all events
    this.flow.off();
  },
  validateFile: function(flowFile) {
    this.props.onFileSelected();
    if (flowFile.file.name !== undefined && flowFile.file.name !== '' && typeof flowFile.file.name === 'string') {
      var extension = flowFile.file.name.split('.').pop();
      var valid = applicationConfiguration.parserService.allowedExtensions.indexOf(extension) !== -1;
      if(!valid) {
         this.setState({fileFormatError: true});
      }
      return valid;
    }
    return false;
  },
  fileUploaded: function(flowFile, message) {
    this.flow.removeFile(flowFile);
    var objectMessage = $.parseJSON(message);
    GeometryUploadService.processFile(objectMessage.client_id, (function(_feature) {
      if(_feature) {
        AccountStore.setDrawnShape(_feature);
        var featureAdded = map.addAoiFromKml(_feature, 'drawOverlay', true);
        this.props.onFileProcessed(featureAdded);
      }
      else {
        this.setState({fileError: true});
      }
    }).bind(this));
  },
  getAllowedExtensionsString: function() {
    return applicationConfiguration.parserService.allowedExtensions.join(', ');
  },
  flowError: function() {

  },
  render: function() {
    var buttonClass = 'button-upload';
    var loader = '';
    if(!this.flow.support) {
      buttonClass = 'hidden';
    }
    if(this.state.uploading) {
      buttonClass += ' uploading';
      loader = (<div className="loader"></div>);
    }
    return (
      <span>
      <OverlayTrigger placement='bottom' overlay={<Tooltip>{i18n.get('upload-kml-shp-button')}</Tooltip>}>
        <button ref="shapeUploader" type="button" className={buttonClass}>
          {loader}
        </button>

      </OverlayTrigger>
       <ErrorModal show={this.state.fileError} onHide={this.unsetError}>
          {i18n.get('geoprocessor-error')}
        </ErrorModal>
        <ErrorModal show={this.state.fileFormatError} onHide={this.unsetError}>
          {i18n.get('file-format-error') + ' ' + this.getAllowedExtensionsString()}
        </ErrorModal>
      </span>
    );
  },
  unsetError: function() {
    this.setState({
      fileError: false,
      fileFormatError: false,
      uploading: false
    });
  }

});

module.exports = ShapeUploader;
