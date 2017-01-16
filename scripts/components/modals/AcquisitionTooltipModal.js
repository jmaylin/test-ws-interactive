var React = require('react');
var Modal = require('react-bootstrap/lib/Modal');
var Definition = require('../utils/definition');
var i18n = require('../../tools/i18n');

var AcquisitionTooltipModal = React.createClass({
  displayName: 'AcquisitionTooltipModal',
  getInitialState: function() {
    return null;
  },
  render: function() {
    var modalTitle = this.props.acquisitionId + ' - ' + i18n.get('taskingAcquisitionStatus-' + this.props.civProcSts);
    return (
      <Modal {...this.props} className="modal-tooltip" bsStyle="primary" animation={true} onHide={this.props.onHide}>
        <div className="modal-header">
          <button type="button" className="close" onClick={this.props.onHide} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h2><span className="hightlight">{i18n.get('modal-tooltip-acquisitionId')} : </span>{modalTitle}</h2>
        </div>
        <div className="modal-body">
            {/*<div className="modal-body--dumping">
              <div className="underligne"><h4 className="subtitle">{i18n.get('modal-tooltip-dumping-parameters')}</h4></div>
            </div>*/}
            <div className="modal-body--dumping">
              <div className="underligne"><h4 className="subtitle">{i18n.get('modal-tooltip-stereo-mode')}</h4></div>
              <ul>
                <Definition label={i18n.get('stereoMethod')} value={this.props.stereoMethod} />
              </ul>
            </div>
            <div className="modal-body--dumping">
              <div className="underligne"><h4 className="subtitle">{i18n.get('modal-tooltip-detailled-informations')}</h4></div>
              <ul>
                <Definition label={i18n.get('missionType')} value={this.props.missionType} />
                <Definition label={i18n.get('missionIndex')} value={this.props.missionIndex} />
              </ul>
            </div>
        </div>
        <div className="modal-footer">

        </div>
      </Modal>
    );
  }
});

module.exports = AcquisitionTooltipModal;
