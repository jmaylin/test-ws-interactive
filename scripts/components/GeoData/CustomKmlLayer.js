var React = require('react');
var map = require('../../mapOl');

var CustomLayersService = require('../../services/CustomLayersService');


var CustomKmlLayer = React.createClass({
  displayName: 'CustomKmlLayer',
  componentWillReceiveProps: function(nextProps) {
    if(nextProps.visible) {
      if(!this._kmlLayer) {
        console.log(CustomLayersService.getKmlUrl(this.props.filepath))
        this._kmlLayer = map.KmlLayerToFeature(CustomLayersService.getKmlUrl(this.props.filepath));
      }
      var returnLayerTmp = map.layerIsOnMap(this._kmlLayer);
      if(returnLayerTmp === undefined || returnLayerTmp === null || !returnLayerTmp) {
        map.addLayer(this._kmlLayer);
      }
    } else {
      this.removeKml();
    }
  },
  componentWillUnmount: function() {
    this.removeKml();
  },
  removeKml: function() {
    if(this._kmlLayer) {
      map.removeLayer(this._kmlLayer);
    }
  },
  render: function() {
     return null;
  }

});

module.exports = CustomKmlLayer;
