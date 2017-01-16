var React = require('react');
var mapOl = require('../../mapOl');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');
var CircleMenu = require('./CircleMenu');
var FeatureStore = require('../../stores/FeatureStore');

var Quicklook = React.createClass({
  displayName: 'Quicklook',
  getInitialState: function() {
    return {
      hover: false
    };
  },
  componentWillMount: function() {
    FeatureStore.addQLChangeListener(this.updateListener);
  },
  componentWillUnmount: function() {
    this.removeFeature();
    FeatureStore.removeQLChangeListener();
  },
  componentWillReceiveProps: function(nextProps) {
    this.removeFeature();
    if(nextProps.visible) {
      var tmpReturn = mapOl.layerIsOnMap(this.props.feature, 'vectorSource');
      if(tmpReturn === undefined || tmpReturn === null || !tmpReturn) {
        mapOl.addLayer(this.props.feature);
      }
    }
  },
  removeFeature: function() {
    if(this.props.feature) {
      var tmpReturn = mapOl.layerIsOnMap(this.props.feature, 'vectorSource');
      if(tmpReturn) {
        mapOl.removeLayer(this.props.feature);
      }
    }
  },
  updateListener: function(_feature, _hover) {
    if (_feature == this.props.feature) {
      if (_hover) {
        if (!this.state.hover) {
          this.state.hover = true;
        }
      } else {
        if (this.state.hover) {
          this.state.hover = false;
        }
      }
    }
  },
  render: function() {
     var retour = null;
     if (this.props.type !== 'search') {
      retour = (<CircleMenu {...this.props} removeFeature={this.removeFeature} from={this.props.from} />);
     }

     return retour;
  }

});

module.exports = Quicklook;
