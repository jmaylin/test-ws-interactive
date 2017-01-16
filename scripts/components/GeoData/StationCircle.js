var React = require('react');
var map = require('../../mapOl');
var InfoWindowContent = require('./InfoWindowContent');

var StationCircle = React.createClass({
  displayName: 'StationCircle',
  componentWillReceiveProps: function(nextProps) {
    if(!this._polygon) {
      var stationLabel = nextProps.type.replace('Astroterra', 'Spot 6/7');
      this._polygon = map.createFeatureFromGmlString(nextProps.maskGml, stationLabel.toLowerCase(), nextProps.name);
      var infos = {
        Station: nextProps.name,
        Acronym: nextProps.acronym,
        Mission: stationLabel
      };

      var contentObject = <InfoWindowContent informations={infos}/>;

      map.InfoWindow(nextProps.name, contentObject);
    }
    if(nextProps.visible && !map.isOnMap(this._polygon, 'stationCircleLayer')) {
      map.AddFeature(this._polygon, 'stationCircleLayer', false, false);
    } else if(!nextProps.visible && map.isOnMap(this._polygon, 'stationCircleLayer')) {
      map.RemoveFeature(this._polygon, 'stationCircleLayer', false, false);
    }
  },
  render: function() {
    return null;
  }
});

module.exports = StationCircle;
