var React = require('react');
var Popover = require('react-bootstrap/lib/Popover');
var i18n = require('../../tools/i18n');
var TaskingStore = require('../../stores/TaskingStore');
var Definition = require('../utils/definition');
var StereoModeInfos = require('./stereoModeInfos');

function getTaskingInformations(taskingId) {
  return TaskingStore.getTaskingInformations(taskingId);
}

var taskingInfosPopover = React.createClass({
  displayName: 'taskingInfosPopover',
  getInitialState: function() {
    return getTaskingInformations(this.props.icr);
  },
  componentDidMount: function() {
    this.props.onShow();
  },
  componentWillUnmount: function() {
    this.props.onHide();
  },
  render: function() {
    var popooverTitle = i18n.get('taskingId') +' : '+ this.props.icr + ' - ' + i18n.get('taskingStatus-' + this.state.process_sts);
    var stationInfos = this.state.stationList.station.map(function (stationTuple) {
       return (
         <div key={stationTuple.receivingStationAcronym + '-' + stationTuple.processingStationAcronym}className="station-couple">
            <span className="station-label">{i18n.get('receiving-station')} : </span>
            <span className="station-acronym">{stationTuple.receivingStationAcronym}</span>
            &nbsp; - &nbsp;
            <span className="station-label">{i18n.get('processing-station')} : </span>
            <span className="station-acronym">{stationTuple.processingStationAcronym}</span>
         </div>
       );
    });
    return (
        <Popover {...this.props} animation={false} className="taskingInfosPopover" bsStyle="primary" title={popooverTitle} >
          <div className="stations-info">
            <h4>{i18n.get('dumping-parameters')}</h4>
            {stationInfos}
          </div>
          <StereoModeInfos stereoMode={this.state.stereoMode} />
          <div className="tasking-info">
            <h4>{i18n.get('tasking-detailled-informations')}</h4>
            <ul>
              <Definition label={i18n.get('mission-type')} value={this.state.missionType} />
              <Definition label={i18n.get('taskingInfos-comment')} value={this.state.comment} />
              <Definition label={i18n.get('taskingInfos-acceptThreshold')} value={this.state.acceptThreshold} />
              <Definition label={i18n.get('taskingInfos-actSect')} value={this.state.actSect} />
              <Definition label={i18n.get('taskingInfos-countryCode')} value={this.state.countryCode} />
              <Definition label={i18n.get('taskingInfos-customerIcrSpecId')} value={this.state.customerIcrSpecId} />
              <Definition label={i18n.get('taskingInfos-latRangeMax')} value={this.state.latRangeMax} />
              <Definition label={i18n.get('taskingInfos-longRangeMax')} value={this.state.longRangeMax} />
              <Definition label={i18n.get('taskingInfos-latRangeMin')} value={this.state.latRangeMin} />
              <Definition label={i18n.get('taskingInfos-longRangeMin')} value={this.state.longRangeMin} />

              <Definition label={i18n.get('taskingInfos-maxIncid')} value={this.state.maxIncid} />
              <Definition label={i18n.get('taskingInfos-maxViewing')} value={this.state.maxViewing} />
              <Definition label={i18n.get('taskingInfos-purpose')} value={this.state.purpose} />
              <Definition label={i18n.get('taskingInfos-sect')} value={this.state.sect} />
              <Definition label={i18n.get('taskingInfos-serviceProg')} value={this.state.serviceProg} />
              <Definition label={i18n.get('taskingInfos-stationUsageType')} value={this.state.stationUsageType} />
              <Definition label={i18n.get('taskingInfos-stereoMeth')} value={this.state.stereoMeth} />
              <Definition label={i18n.get('taskingInfos-submitingDate')} value={this.state.submitingDate} date dateFormat='YYYY-MM-DD H:m:s' />
              <Definition label={i18n.get('taskingInfos-validPerioStart')} value={this.state.validPerioStart} date dateFormat='YYYY-MM-DD' />
              <Definition label={i18n.get('taskingInfos-validPerioEnd')} value={this.state.validPerioEnd} date dateFormat='YYYY-MM-DD' />
            </ul>
          </div>
        </Popover>
      );
  }
});

module.exports = taskingInfosPopover;
