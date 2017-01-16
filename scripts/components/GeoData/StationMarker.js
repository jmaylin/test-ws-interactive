var React = require('react');
var InfoWindowContent = require('./InfoWindowContent');
var map = require('../../mapOl');
var ol = require('openlayers');


var StationMarker = React.createClass({
  displayName: 'StationMarker',
  componentWillReceiveProps: function(nextProps) {
    if(!this._marker) {
      var coordinates = nextProps.coordinates;
      var currentLatLng = map.geomPoint(coordinates.latitude, coordinates.longitude);
      var stationLabel = nextProps.type.replace('Astroterra', 'Spot 6/7');
      this._marker = map.Marker(currentLatLng, stationLabel, nextProps.name);

    }

    if(nextProps.visible && !map.isOnMap(this._marker, 'vectorSource')) {
      var contentObject = <InfoWindowContent informations={{
        Station: nextProps.name,
        Acronym: nextProps.acronym,
        Mission: stationLabel
      }}/>;
      map.addMarker(this._marker, false, contentObject);
    } else if(!nextProps.visible && map.isOnMap(this._marker, 'vectorSource')) {
      map.removeMarker(this._marker);
    }
  },
  render: function() {
    return null;
  }

});

module.exports = StationMarker;
