var React = require('react');
var MissionPlanComponent = require('./MissionPlanComponent');
var i18n = require('../../tools/i18n');
var CustomScrollbar = require('../../tools/customScrollbar');

var MissionPlanComponentList = React.createClass({
  displayName: 'MissionPlanComponentList',
  componentDidUpdate: function() {
    CustomScrollbar.refreshScrollbar();
  },
  render: function() {
    var planComponents = this.props.features.map(function(feature, i) {
      return <MissionPlanComponent key={'plan-component-list' + i} id={i} order={this.props.order} station={this.props.station} satellite={this.props.satellite} feature={feature} type={this.props.type} acqtype={this.props.acqtype} subtype={this.props.subtype} />;
    }, this);
    var noMissionsPlans = this.props.features.length === 0 ?
      (<div className="missions-plans-acquisition"><span className="title">{i18n.get('no-mission-plans-' + this.props.type)}</span></div>)
    :
      null
    ;
    var title = (this.props.type === 'acquisition' || this.props.type === 'orbit') ?
      <h6 className="missions-plans-list--title">{i18n.get('missions-plans-'+this.props.type)}</h6>
    :
      null
    ;
    return (
      <div className="missions-plans-list-content">
        {title}
        {noMissionsPlans}
        {planComponents}
      </div>
    );
  }
});

module.exports = MissionPlanComponentList;
