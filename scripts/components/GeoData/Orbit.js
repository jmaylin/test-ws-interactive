var React = require('react');
var mapOl = require('../../mapOl');
var CustomScrollbar = require('../../tools/customScrollbar');
var CircleMenu = require('./CircleMenu');
var FeatureStore = require('../../stores/FeatureStore');

var Orbit = React.createClass({
  displayName: 'Orbit',
  componentWillMount: function() {
    FeatureStore.addChangeListener(this.updateListener);
  },
  componentWillUnmount: function() {
    this.removeLineString();
    FeatureStore.removeChangeListener();
  },
  getInitialState: function() {
    return {
      wheelnavLoaded: false,
      hover: false
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.removeLineString();
    if(nextProps.highlight) {
      if(!this._linestring && this.props.coordinates) {
        this._linestring = mapOl.createLineStringFromCoordinates(this.props.coordinates);
      }
      var tmpReturn = mapOl.isOnMap(this._linestring, 'vectorOrbit');
      if(tmpReturn === undefined || tmpReturn === null || !tmpReturn) {
        mapOl.AddFeature(this._linestring, 'vectorOrbit', false, true);
      }
    } else if(nextProps.visible) {
      if(!this._linestring && this.props.coordinates) {
        this._linestring = mapOl.createLineStringFromCoordinates(this.props.coordinates);
      }
      var tmpReturn = mapOl.isOnMap(this._linestring, 'vectorOrbit');
      if(tmpReturn === undefined || tmpReturn === null || !tmpReturn) {
        mapOl.unHighlightFeature(this._linestring, this.props.type,'vectorOrbit');
        mapOl.AddFeature(this._linestring, 'vectorOrbit', false, false);
      }
    }
  },
  removeLineString: function() {
    var tmpReturn = mapOl.isOnMap(this._linestring, 'vectorOrbit');
    if(this._linestring && tmpReturn) {
      mapOl.RemoveFeature(this._linestring, 'vectorOrbit');
    }
  },
  updateListener: function(_feature) {
    if (_feature == this._linestring) {
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
  render: function() {
    return (<CircleMenu {...this.props} removeFeature={this.removeFeature} from='orbit' feature={this._linestring} />);
  }

});

module.exports = Orbit;
