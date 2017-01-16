var React = require('react');
var MissionPlan = require('./MissionPlan');

var MissionsPlansGroup = React.createClass({
  displayName: 'MissionsPlansGroup',
  componentDidUpdate: function(nextProps) {
    if (nextProps.stationSelected !== this.props.stationSelected || nextProps.satelliteSelected !== this.props.satelliteSelected) {
      this.forceUpdate();
    }
  },
  render: function() {
    var plans = this.props.plans.map(function(plan, i) {
      if (
        (this.props.stationSelected === 'default' || this.props.stationSelected === plan.station)
        &&
        (this.props.satelliteSelected === 'default' || this.props.satelliteSelected === plan.satellite)
      ) {
        return <MissionPlan {...plan} key={'missions-plans-' + i} group={this.props.group.toLowerCase()} />;
      }
    }, this);
    return (
      <div className="missions-plans--toggle">
        {/*<span className={"missions-plans--toggle-titre "+ this.props.group.toLowerCase()}>{this.props.group}</span>*/}
        {plans}
      </div>
    );
  }

});

module.exports = MissionsPlansGroup;
