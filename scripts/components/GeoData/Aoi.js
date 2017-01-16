var React = require('react');
var mapOl = require('../../mapOl');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');
var CircleMenu = require('./CircleMenu');
var FeatureStore = require('../../stores/FeatureStore');

var Aoi = React.createClass({
  displayName: 'Aoi',
  getDefaultProps: function() {
    return {
      autoCenter: false
    };
  },
  getInitialState: function() {
    return {
      displayMenu: false,
      hover: false
    };
  },
  componentWillMount: function() {
    FeatureStore.addChangeListener(this.updateListener);
  },
  componentWillUnmount: function() {
    this.removeFeature();
    FeatureStore.removeChangeListener();
  },
  componentWillReceiveProps: function(nextProps) {
    this.removeFeature();
    if(nextProps.highlight) {
      var tmpReturn = mapOl.isOnMap(this.props.feature, 'vectorSource');
      if(tmpReturn === undefined || tmpReturn === null || !tmpReturn) {
        mapOl.AddFeature(this.props.feature, 'vectorSource', this.props.autoCenter, nextProps.highlight);
      }
    } else if(nextProps.visible) {
      var tmpReturn = mapOl.isOnMap(this.props.feature, 'vectorSource');
      if(tmpReturn === undefined || tmpReturn === null || !tmpReturn) {
        mapOl.unHighlightFeature(this.props.feature, this.props.type,'vectorSource');
        mapOl.AddFeature(this.props.feature, 'vectorSource', this.props.autoCenter, false);
      }
    }
  },
  removeFeature: function() {
    var tmpReturn = mapOl.isOnMap(this.props.feature, 'vectorSource');
    if(this.props.feature && tmpReturn) {
      mapOl.removeAoi(this.props.feature);
    }
  },
  updateListener: function(_feature, _hover) {
    if (_feature == this.props.feature) {
      if (_hover) {
        if (!this.state.hover) {
          this.state.hover = true;
          this.props.toggleHighlight();
        }
      } else {
        if (this.state.hover) {
          this.state.hover = false;
          this.props.toggleHighlight();
        }
      }
    }
  },
  setOpacity: function(_opacity) {
    if (this.props.feature && this.props.visible) {
      mapOl.setOpacityToFeature(this.props.feature, 'vectorSource', _opacity)
    }
  },
  getOpacity: function(_opacity) {
    if (this.props.feature) {
      return mapOl.getOpacityOfFeature(this.props.feature, this.props.type);
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

module.exports = Aoi;
