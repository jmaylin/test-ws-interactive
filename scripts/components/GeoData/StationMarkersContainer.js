var React = require('react');
var StationMarker = require('./StationMarker');

var StationMarkersContainer = React.createClass({
  displayName: 'StationMarkersContainer',
  getDefaultProps: function() {
    return {
      visible: false
    };
  },
  render: function() {
    var stationMarkers = this.props.stations.map(function(station) {
      return <StationMarker key={station.acronym} coordinates={station.coordinates} type={station.missionType} name={station.name} acronym={station.acronym} visible={this.props.visible} />;
    }, this);
    return (
      <div className='hidden'>
        {stationMarkers}
      </div>
    );
  }

});

module.exports = StationMarkersContainer;
