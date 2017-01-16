var React = require('react');
var DismissableControl = require('../utils/DismissableControl');
var UiStateStore = require('../../stores/UiStateStore');
var UiStateActions = require('../../actions/UiStateActions');
var MissionsPlansGroup = require('../GeoData/MissionsPlansGroup');
var MissionPlanService = require('../../services/MissionPlanService');
var i18n = require('../../tools/i18n');

var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');

var MissionsPlansControl = React.createClass({
  displayName: 'MissionsPlansControl',
  getInitialState: function() {
    return {
      active: UiStateStore.getMissionsPlansDisplayStatus(),
      error: false,
      refresh: false,
      missionsPlans: [],
      missionsPlansByStation: [],
      missionsPlansBySatellite: [],
      stationSelected: 'default',
      satelliteSelected: 'default',
      loading: true
    };
  },
  componentWillMount: function() {
    UiStateStore.addChangeListener(this.onUiChange);
  },
  componentWillUnmount: function() {
    UiStateStore.removeChangeListener(this.onUiChange);
  },
  hideAll: function() {
    UiStateActions.hideAll();
  },
  render: function() {
    var missionsPlansGroups = '';
    if(this.state.active) {
      missionsPlansGroups = Object.keys(this.state.missionsPlans).map(function(missionType, i) {
        return (
          <MissionsPlansGroup
            stationSelected={this.state.stationSelected}
            satelliteSelected={this.state.satelliteSelected}
            key={'missions-plans-groups'+ i}
            group={missionType}
            plans={this.state.missionsPlans[missionType]}
          />
        );
      }, this);
    }
    if(this.state.error) {
      missionsPlansGroups = <span>{i18n.get('no-mission-plans')}</span>;
    }
    var titleSecondLine = (
      <div className="missions-plans--button">
        <OverlayTrigger placement='left' overlay={<Tooltip>{i18n.get('mission-plans-hide-all')}</Tooltip>}>
          <button onClick={this.hideAll} className='hide-all'>{i18n.get('mission-plans-hide-all')}</button>
        </OverlayTrigger>
      </div>
    );
    return (
      <DismissableControl
        stations={this.state.missionsPlansByStation}
        stationSelected={this.state.stationSelected}
        onChangeStation={this.onChangeStation}
        satellites={this.state.missionsPlansBySatellite}
        satelliteSelected={this.state.satelliteSelected}
        onChangeSatellite={this.onChangeSatellite}
        headerAction={titleSecondLine}
        className="missions-plans"
        title={i18n.get('mission-plans')}
        active={this.state.active}
        onShow={this.refreshMissionPlans}
        onDismiss={this.hide}
        loading={this.state.loading}
      >
        {missionsPlansGroups}
      </DismissableControl>
    );
  },
  onChangeSatellite: function(_event) {
    this.setState({satelliteSelected: _event.target.value});
  },
  onChangeStation: function(_event) {
    this.setState({stationSelected: _event.target.value});
  },
  onUiChange: function() {
    this.setState({active: UiStateStore.getMissionsPlansDisplayStatus()});
  },
  hide: function() {
    UiStateActions.toggleMissionsPlans();
  },
  refreshMissionPlans: function() {
    var that = this;
    MissionPlanService.getList(function(data){
      if(data.success) {
        var missionsPlans = {};
        var missionsPlansByStation = {};
        var missionsPlansBySatellite = {};
        data.missionsPlans.forEach(function(missionPlan) {
          if(missionsPlans[missionPlan.mission] === undefined) {
            missionsPlans[missionPlan.mission] = [];
          }
          missionsPlans[missionPlan.mission].push(missionPlan);

          if(missionsPlansByStation[missionPlan.station] === undefined) {
            missionsPlansByStation[missionPlan.station] = [];
          }
          missionsPlansByStation[missionPlan.station] = missionPlan.station;

          if(missionsPlansBySatellite[missionPlan.satellite] === undefined) {
            missionsPlansBySatellite[missionPlan.satellite] = [];
          }
          missionsPlansBySatellite[missionPlan.satellite] = missionPlan.satellite;
        });
        that.setState({
          missionsPlans: missionsPlans,
          missionsPlansByStation: missionsPlansByStation,
          missionsPlansBySatellite: missionsPlansBySatellite,
          error: false,
          refresh: true,
          loading: false
        });

      }
      else {
        that.setState({
          error: true,
          loading: false
        });
      }
    }).catch(function(e) {
      console.err(e);
    });
  }

});

module.exports = MissionsPlansControl;
