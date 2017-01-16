var React = require('react');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');

var DismissableControl = require('../utils/DismissableControl');
var UploadButton = require('../utils/UploadButton');
var UiStateStore = require('../../stores/UiStateStore');
var UiStateActions = require('../../actions/UiStateActions');
var CustomLayer = require('../GeoData/CustomLayer');
var CustomLayersService = require('../../services/CustomLayersService');
var ErrorModal = require('../modals/errorModal');
var i18n = require('../../tools/i18n');

var CustomLayersControl = React.createClass({
  displayName: 'CustomLayersControl',
  getInitialState: function() {
    return {
      active: UiStateStore.getCustomLayersDisplayStatus(),
      customLayers: [],
      uploadError: false,
      errorMessage: ''
    };
  },
  componentWillMount: function() {
    UiStateStore.addChangeListener(this.onUiChange);
  },
  componentWillUnmount: function() {
    UiStateStore.removeChangeListener(this.onUiChange);
  },
  render: function() {
    var uploadButton = null;
    var customLayers = null;
    if(this.state.active) {
      uploadButton = (
        <OverlayTrigger placement='left' overlay={<Tooltip>Upload</Tooltip>}>
          <UploadButton onUpload={this.onUpload}/>
        </OverlayTrigger>
      );

      customLayers = this.state.customLayers.map(function(customLayer) {
        return <CustomLayer key={'missions-plans-groups'+ customLayer.filename} onDelete={this.onDelete.bind(this, customLayer.filename)} filename={customLayer.filename} update={customLayer.update} filepath={customLayer.publicPath}/>;
      }, this);
    }
    return (
      <DismissableControl
        className="custom-layers"
        title={i18n.get('custom-layers')}
        active={this.state.active}
        onDismiss={this.hide}
        headerAction={uploadButton}
        onShow={this.refreshCustomLayers}
        >
        {customLayers}
        <ErrorModal show={this.state.uploadError} onHide={this.unsetError}>
          {this.state.errorMessage}
        </ErrorModal>
      </DismissableControl>
    );
  },
  onUiChange: function() {
    this.setState({active: UiStateStore.getCustomLayersDisplayStatus()});
  },
  hide: function() {
    UiStateActions.toggleCustomLayers();
  },
  refreshCustomLayers: function() {
    var that = this;
    CustomLayersService.getList(function(data){
      if(data.success) {
        that.setState({customLayers: data.customLayers});
      }
      else {
        that.setState({error: true});
      }
    }).catch(function(e) {
      console.err(e);
    });
  },
  onDelete: function(filename) {
    var that = this;
    CustomLayersService.delete(filename, function(data){
      if(data.success) {
        that.refreshCustomLayers();
      }
    }).catch(function(e) {
      console.err(e);
    });
  },
  onUpload: function(data) {
    if(data.result.success) {
      this.refreshCustomLayers();
    }
    else {
      this.setState({
        'uploadError': true,
        'errorMessage': data.result.message
      });
    }
  },
  unsetError: function() {
    this.setState({
      uploadError: false,
      errorMessage: ''
    });
  }

});

module.exports = CustomLayersControl;
