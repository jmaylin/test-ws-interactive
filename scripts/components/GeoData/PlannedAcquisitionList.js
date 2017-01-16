var React = require('react');
var PlannedAcquisition = require('./PlannedAcquisition');

var PlannedAcquisitionList = React.createClass({
  displayName: 'PlannedAcquisitionList',
  getInitialState: function() {
    return {
      'visible': false
    };
  },
  toggleGeoData: function() {
    this.setState({visible: !this.state.visible});
  },
  render: function() {
    var planComponents = this.props.acquisitions.map(function(feature, i) {
      return (
        <PlannedAcquisition
          key={this.props.id + 'plan-component-list' + i}
          id={i}
          coordinates={feature.geometry.coordinates[0]}
          informations={feature.properties}
          feature={feature}
          type={this.props.type}
          subtype={this.props.subtype}
          visible={this.state.visible}
          toggleGeoData={this.toggleGeoData}
          aoiAllDisplayed={this.props.aoiAllDisplayed}
          order={this.props.order}
          openedOrbit={this.props.opened}
          openOrbit={this.props.openOrbit}
        />
      );
    }, this);
    return (
      <div className="missions-plans-list-content">
        {planComponents}
      </div>
    );
  }
});

module.exports = PlannedAcquisitionList;
