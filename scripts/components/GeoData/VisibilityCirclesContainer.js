var React = require('react');
var StationCircle = require('./StationCircle');

var VisibilityCirclesContainer = React.createClass({
  displayName: 'VisibilityCirclesContainer',
  getDefaultProps: function() {
    return {
      visible: false
    };
  },
  render: function() {
    var stationCircles = this.props.stations.map(function(station) {
      return <StationCircle key={station.acronym} type={station.missionType} name={station.name} acronym={station.acronym} maskGml={station.maskGml} visible={this.props.visible}  />;
    }, this);
    return (
      <div className='hidden'>
        {stationCircles}
      </div>
    );
  }

});

module.exports = VisibilityCirclesContainer;
