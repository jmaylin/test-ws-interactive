var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Definition = require('../utils/definition');
var i18n = require('../../tools/i18n');
var TaskingStore = require('../../stores/TaskingStore');
var StereoModeInfos = require('../popovers/stereoModeInfos');

function getTaskingInformations(taskingId) {
  return TaskingStore.getTaskingInformations(taskingId);
}

var TaskingTooltipModal = React.createClass({
  displayName: 'TaskingTooltipModal',
  getInitialState: function() {
    return getTaskingInformations(this.props.icr);
  },
  render: function() {
    var modalTitle = this.props.icr + ' - ' + i18n.get('taskingStatus-' + this.state.process_sts);
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
    var missionRespId = (this.state.missionRespId) ? <Definition label={i18n.get('taskingInfos-missionRespId')} value={this.state.missionRespId} /> : '';
    return (
      <Modal {...this.props} className="modal-tooltip" bsStyle="primary" animation={true} onHide={this.props.onHide}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.props.onHide} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h2><span className="hightlight">{i18n.get('modal-tooltip-taskingId')} : </span>{modalTitle}</h2>
        </div>
        <div className="modal-body">
            <div className="modal-body--dumping">
              <div className="underligne"><h4 className="subtitle">{i18n.get('modal-tooltip-dumping-parameters')}</h4></div>
              {stationInfos}
            </div>
            <div className="modal-body--dumping">
              <div className="underligne"><h4 className="subtitle">{i18n.get('modal-tooltip-stereo-mode')}</h4></div>
              <StereoModeInfos stereoMode={this.state.stereoMode} />
            </div>
            <div className="modal-body--dumping">
              <div className="underligne"><h4 className="subtitle">{i18n.get('modal-tooltip-detailled-informations')}</h4></div>
              <ul>
                <Definition label={i18n.get('mission-type')} value={this.state.missionType} />
                <Definition label={i18n.get('taskingInfos-orderId')} value={this.state.orderId} />
                <Definition label={i18n.get('taskingInfos-comment')} value={this.state.comment} />
                <Definition label={i18n.get('taskingInfos-acceptThreshold')} value={this.state.acceptThreshold} />
                <Definition label={i18n.get('taskingInfos-actSect')} value={this.state.actSect} />
                <Definition label={i18n.get('taskingInfos-countryCode')} value={this.state.countryCode} />
                <Definition label={i18n.get('taskingInfos-customerIcrSpecId')} value={this.state.customerIcrSpecId} />
                {missionRespId}
              </ul>
              <ul>
                <Definition label={i18n.get('taskingInfos-latRangeMax')} value={this.state.latRangeMax} />
                <Definition label={i18n.get('taskingInfos-longRangeMax')} value={this.state.longRangeMax} />
              </ul>
              <ul>
                <Definition label={i18n.get('taskingInfos-latRangeMin')} value={this.state.latRangeMin} />
                <Definition label={i18n.get('taskingInfos-longRangeMin')} value={this.state.longRangeMin} />
              </ul>
              <ul>
                <Definition label={i18n.get('taskingInfos-maxIncid')} value={this.state.maxIncid} />
                <Definition label={i18n.get('taskingInfos-maxViewing')} value={this.state.maxViewing} />
              </ul>
              <ul>
                <Definition label={i18n.get('taskingInfos-purpose')} value={this.state.purpose} />
                <Definition label={i18n.get('taskingInfos-sect')} value={this.state.sect} />
                <Definition label={i18n.get('taskingInfos-serviceProg')} value={this.state.serviceProg} />
                <Definition label={i18n.get('taskingInfos-stationUsageType')} value={this.state.stationUsageType} />
                <Definition label={i18n.get('taskingInfos-stereoMeth')} value={this.state.stereoMeth} />
                <Definition label={i18n.get('taskingInfos-submitingDate')} value={this.state.submitingDate} date dateFormat='YYYY-MM-DD H:m:s' />
              </ul>
              <ul>
                <Definition label={i18n.get('taskingInfos-validPerioStart')} value={this.state.validPerioStart} date dateFormat='YYYY-MM-DD' />
                <Definition label={i18n.get('taskingInfos-validPerioEnd')} value={this.state.validPerioEnd} date dateFormat='YYYY-MM-DD' />
              </ul>
            </div>
        </div>
        <div className="modal-footer">

        </div>
      </Modal>
    );
  }
});

module.exports = TaskingTooltipModal;
